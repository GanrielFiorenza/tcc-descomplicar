'use strict';
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const cors = require('cors')({
  origin: ['https://seu-dominio.com'], // Liste aqui os domínios permitidos
  methods: ['POST'] // Permite apenas requisições POST
});

// Cria o transporter do nodemailer usando variáveis de ambiente
const createTransporter = () => {
  const email = functions.config().gmail.email;
  const password = functions.config().gmail.password;
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: email,
      pass: password
    }
  });
};

exports.enviarEmail = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      // Verifica se é uma requisição POST
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      const { assunto, destinatarios, corpo, corpoHtml } = req.body;

      // Validação básica
      if (!assunto || !destinatarios || (!corpo && !corpoHtml)) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const transporter = createTransporter();
      const email = {
        from: functions.config().gmail.email,
        to: destinatarios,
        subject: assunto,
        text: corpo,
        html: corpoHtml
      };

      const info = await transporter.sendMail(email);
      
      return res.status(200).json({
        success: true,
        messageId: info.messageId
      });

    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({
        error: 'Failed to send email',
        details: error.message
      });
    }
  });
});

// Função para enviar emails automaticamente quando uma notificação está próxima
exports.checkNotifications = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  const admin = require('firebase-admin');
  if (!admin.apps.length) {
    admin.initializeApp();
  }
  
  const db = admin.firestore();
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  try {
    const notificationsRef = db.collection('notifications');
    const snapshot = await notificationsRef.where('status', '==', 'open').get();
    
    const transporter = createTransporter();
    
    for (const doc of snapshot.docs) {
      const notification = doc.data();
      const notificationDate = new Date(notification.date);
      
      // Verifica se a data da notificação é amanhã
      if (notificationDate.toDateString() === tomorrow.toDateString()) {
        const userDoc = await db.collection('users').doc(notification.userId).get();
        const userData = userDoc.data();
        
        if (userData && userData.email) {
          const email = {
            from: functions.config().gmail.email,
            to: userData.email,
            subject: 'Lembrete de Notificação',
            html: `
              <h2>Lembrete de Notificação</h2>
              <p>Você tem uma notificação agendada para amanhã:</p>
              <p><strong>${notification.description}</strong></p>
              <p>Data: ${notification.date}</p>
            `
          };
          
          await transporter.sendMail(email);
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error checking notifications:', error);
    return null;
  }
});