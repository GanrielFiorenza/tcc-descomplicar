import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { Car, Wrench, DollarSign, FileText, Shield } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-blue-900 mb-6">
            descompliCar
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Simplifique o gerenciamento da sua frota e economize tempo e dinheiro
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

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardContent className="space-y-4">
              <Car className="h-12 w-12 text-blue-800" />
              <h3 className="text-xl font-semibold">Gestão de Frota</h3>
              <p className="text-gray-600">
                Mantenha o controle total sobre seus veículos com nossa plataforma intuitiva de gestão de frota.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardContent className="space-y-4">
              <Wrench className="h-12 w-12 text-blue-800" />
              <h3 className="text-xl font-semibold">Manutenção Preventiva</h3>
              <p className="text-gray-600">
                Agende e acompanhe manutenções preventivas para evitar problemas futuros e reduzir custos.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardContent className="space-y-4">
              <DollarSign className="h-12 w-12 text-blue-800" />
              <h3 className="text-xl font-semibold">Controle de Gastos</h3>
              <p className="text-gray-600">
                Monitore todos os custos relacionados à sua frota e identifique oportunidades de economia.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardContent className="space-y-4">
              <FileText className="h-12 w-12 text-blue-800" />
              <h3 className="text-xl font-semibold">Relatórios Detalhados</h3>
              <p className="text-gray-600">
                Gere relatórios personalizados para análise completa do desempenho da sua frota.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardContent className="space-y-4">
              <Shield className="h-12 w-12 text-blue-800" />
              <h3 className="text-xl font-semibold">Segurança e Conformidade</h3>
              <p className="text-gray-600">
                Mantenha sua frota em conformidade com todas as regulamentações e requisitos de segurança.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-blue-900 mb-6">
            Comece a otimizar sua gestão de frota hoje mesmo
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