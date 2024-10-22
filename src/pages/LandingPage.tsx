import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { Car, Wrench, DollarSign, FileText, Shield } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const FeatureDialog = ({ title, description, details }: { 
  title: string; 
  description: string;
  details: string[];
}) => (
  <Dialog>
    <DialogTrigger asChild>
      <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="space-y-4">
          {title === "Gestão Simplificada" && <Car className="h-12 w-12 text-blue-800" />}
          {title === "Manutenção em Dia" && <Wrench className="h-12 w-12 text-blue-800" />}
          {title === "Controle de Gastos" && <DollarSign className="h-12 w-12 text-blue-800" />}
          {title === "Histórico Completo" && <FileText className="h-12 w-12 text-blue-800" />}
          {title === "Tranquilidade" && <Shield className="h-12 w-12 text-blue-800" />}
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </CardContent>
      </Card>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription className="pt-4">
          {details.map((detail, index) => (
            <p key={index} className="mb-2">{detail}</p>
          ))}
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
);

const features = [
  {
    title: "Gestão Simplificada",
    description: "Mantenha todas as informações do seu veículo organizadas em um só lugar, de forma simples e intuitiva.",
    details: [
      "Interface intuitiva e fácil de usar, pensada para proprietários de veículos.",
      "Cadastre seus veículos com todas as informações importantes em um só lugar.",
      "Acesse rapidamente documentos, histórico de manutenções e gastos.",
      "Organize todas as informações importantes do seu veículo de forma prática."
    ]
  },
  {
    title: "Manutenção em Dia",
    description: "Receba lembretes de manutenção preventiva e mantenha seu veículo sempre em perfeitas condições.",
    details: [
      "Sistema inteligente de lembretes baseado na quilometragem e tempo.",
      "Notificações personalizadas para revisões, trocas de óleo e outros serviços.",
      "Acompanhamento do histórico completo de manutenções.",
      "Prevenção de problemas futuros através da manutenção preventiva."
    ]
  },
  {
    title: "Controle de Gastos",
    description: "Acompanhe todos os gastos do seu veículo e identifique onde você pode economizar.",
    details: [
      "Registre e categorize todos os gastos relacionados ao seu veículo.",
      "Visualize relatórios detalhados de consumo de combustível.",
      "Análise de custos por período e categoria.",
      "Identifique oportunidades de economia com base nos dados registrados."
    ]
  },
  {
    title: "Histórico Completo",
    description: "Mantenha um registro detalhado de todas as manutenções e despesas do seu veículo.",
    details: [
      "Registro completo de todas as manutenções realizadas.",
      "Histórico detalhado de gastos e serviços.",
      "Documentação organizada e de fácil acesso.",
      "Valorize seu veículo com um histórico completo e organizado."
    ]
  },
  {
    title: "Tranquilidade",
    description: "Tenha a certeza de que seu veículo está sempre em dia com manutenções e documentações necessárias.",
    details: [
      "Acompanhamento de vencimentos de documentos importantes.",
      "Lembretes automáticos para renovação de documentos.",
      "Gestão simplificada de seguros e licenciamentos.",
      "Paz de espírito sabendo que está tudo em dia."
    ]
  }
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-blue-900 mb-6">
            descompliCar
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Simplifique o gerenciamento do seu veículo e mantenha tudo sob controle
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              className="bg-blue-800 hover:bg-blue-900"
              onClick={() => navigate('/login')}
            >
              Fazer Login
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/create-account')}
            >
              Criar Conta
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <FeatureDialog key={index} {...feature} />
          ))}
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-blue-900 mb-6">
            Comece a cuidar melhor do seu veículo hoje mesmo
          </h2>
          <Button 
            className="bg-blue-800 hover:bg-blue-900"
            onClick={() => navigate('/create-account')}
          >
            Criar Conta Gratuita
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;