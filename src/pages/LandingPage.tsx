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

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardContent className="space-y-4">
              <Car className="h-12 w-12 text-blue-800" />
              <h3 className="text-xl font-semibold">Gestão Simplificada</h3>
              <p className="text-gray-600">
                Mantenha todas as informações do seu veículo organizadas em um só lugar, de forma simples e intuitiva.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardContent className="space-y-4">
              <Wrench className="h-12 w-12 text-blue-800" />
              <h3 className="text-xl font-semibold">Manutenção em Dia</h3>
              <p className="text-gray-600">
                Receba lembretes de manutenção preventiva e mantenha seu veículo sempre em perfeitas condições.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardContent className="space-y-4">
              <DollarSign className="h-12 w-12 text-blue-800" />
              <h3 className="text-xl font-semibold">Controle de Gastos</h3>
              <p className="text-gray-600">
                Acompanhe todos os gastos do seu veículo e identifique onde você pode economizar.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardContent className="space-y-4">
              <FileText className="h-12 w-12 text-blue-800" />
              <h3 className="text-xl font-semibold">Histórico Completo</h3>
              <p className="text-gray-600">
                Mantenha um registro detalhado de todas as manutenções e despesas do seu veículo.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardContent className="space-y-4">
              <Shield className="h-12 w-12 text-blue-800" />
              <h3 className="text-xl font-semibold">Tranquilidade</h3>
              <p className="text-gray-600">
                Tenha a certeza de que seu veículo está sempre em dia com manutenções e documentações necessárias.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
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