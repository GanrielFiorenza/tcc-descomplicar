import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { Car, Wrench, DollarSign, FileText, Shield, CheckCircle2, Bell, Coins, ClipboardList, Clock, LogIn, UserPlus } from 'lucide-react';
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
}) => {
  const getIcon = (detail: string) => {
    if (detail.includes("Interface") || detail.includes("Cadastre")) return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    if (detail.includes("lembretes") || detail.includes("Notificações")) return <Bell className="h-5 w-5 text-yellow-500" />;
    if (detail.includes("gastos") || detail.includes("economia")) return <Coins className="h-5 w-5 text-blue-500" />;
    if (detail.includes("Registro") || detail.includes("Histórico")) return <ClipboardList className="h-5 w-5 text-purple-500" />;
    if (detail.includes("vencimentos") || detail.includes("renovação")) return <Clock className="h-5 w-5 text-red-500" />;
    return <CheckCircle2 className="h-5 w-5 text-green-500" />;
  };

  return (
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
      <DialogContent className="sm:max-w-[600px] p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-3">
            {title === "Gestão Simplificada" && <Car className="h-8 w-8" />}
            {title === "Manutenção em Dia" && <Wrench className="h-8 w-8" />}
            {title === "Controle de Gastos" && <DollarSign className="h-8 w-8" />}
            {title === "Histórico Completo" && <FileText className="h-8 w-8" />}
            {title === "Tranquilidade" && <Shield className="h-8 w-8" />}
            {title}
          </DialogTitle>
          <DialogDescription className="pt-4 space-y-4">
            {details.map((detail, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                {getIcon(detail)}
                <p className="text-base text-gray-700">{detail}</p>
              </div>
            ))}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

const features = [
  {
    title: "Gestão Simplificada",
    description: "Mantenha todas as informações do seu veículo organizadas em um só lugar, de forma simples e intuitiva.",
    details: [
      "Interface intuitiva e fácil de usar, pensada para proprietários de veículos.",
      "Cadastre seus veículos com todas as informações importantes em um só lugar.",
      "Acesse rapidamente dados veiculares, histórico de manutenções e gastos.",
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
      {/* Header Section */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-900 flex items-center">
            <Car className="h-6 w-6 mr-2 text-blue-800" />
            DescompliCar
          </h1>
          
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-blue-900 mb-6">
            descompliCar
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Simplifique o gerenciamento do seu veículo e mantenha tudo sob controle
          </p>
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
            className="bg-blue-800 hover:bg-blue-900 flex items-center gap-2"
            onClick={() => navigate('/create-account')}
          >
            <UserPlus className="h-4 w-4" />
            Criar Conta Gratuita
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
