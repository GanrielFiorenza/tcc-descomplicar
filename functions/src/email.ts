import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';
import * as cors from 'cors';

const corsHandler = cors({ origin: true });

// Configuração do transporter do nodemailer
// IMPORTANTE: Estas credenciais devem ser movidas para variáveis de ambiente
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.password
  }
});

export const enviarEmail = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
      }

      const { assunto, destinatarios, corpo, corpoHtml } = req.body;

      if (!assunto || !destinatarios || (!corpo && !corpoHtml)) {
        res.status(400).send('Missing required fields');
        return;
      }

      const email = {
        from: '"Sistema de Notificações" <noreply@seudominio.com>',
        to: destinatarios,
        subject: assunto,
        text: corpo,
        html: corpoHtml
      };

      const info = await transporter.sendMail(email);
      console.log('Mensagem enviada:', info.messageId);
      res.status(200).send({ success: true, messageId: info.messageId });
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      res.status(500).send({ error: 'Failed to send email' });
    }
  });
});

// Função agendada para verificar notificações diariamente
export const checkDailyNotifications = functions.pubsub
  .schedule('0 8 * * *') // Executa todos os dias às 8h
  .timeZone('America/Sao_Paulo')
  .onRun(async (context) => {
    // Implementar a lógica de verificação de notificações aqui
    console.log('Verificando notificações diárias...');
    return null;
  });