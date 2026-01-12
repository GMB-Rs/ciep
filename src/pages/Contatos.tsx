import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  GraduationCap,
  Phone,
  MapPin,
  PhoneCall,
  Clock,
  ExternalLink,
  Mail,
  Globe
} from 'lucide-react';

const Contatos: React.FC = () => {
  return (
    <div className="min-h-screen">
      <main>
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Seção de Contato */}
            <div className="max-w-4xl mx-auto">
              <Card className="shadow-lg">
                <CardContent className="p-8">
                  <div className="text-center mb-10">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                      Entre em Contato
                    </h2>
                    <p className="text-lg text-gray-600">
                      Estamos à disposição para atender sua comunidade escolar
                    </p>
                  </div>

                  {/* Informações de Contato */}
                  <div className="space-y-8 mb-10">
                    {/* Endereço */}
                    <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <MapPin className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          Endereço
                        </h3>
                        <p className="text-gray-700 text-lg">
                          Av. José do Patrocínio, Estr. do Pérez - São Judas, Bagé - RS
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                          CEP: 96400-000
                        </p>
                      </div>
                    </div>

                    {/* Telefone */}
                    <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg">
                      <div className="bg-green-100 p-3 rounded-full">
                        <PhoneCall className="h-8 w-8 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          Telefone
                        </h3>
                        <a 
                          href="tel:+555332426492" 
                          className="text-blue-600 hover:text-blue-800 text-lg font-medium transition-colors block mb-1"
                        >
                          (53) 3242-6492
                        </a>
                        <p className="text-gray-600 text-sm">
                          Clique para ligar • Horário: 8h às 17h
                        </p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg">
                      <div className="bg-purple-100 p-3 rounded-full">
                        <Mail className="h-8 w-8 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          Email
                        </h3>
                        <a 
                          href="mailto:ciepbage@escola.com" 
                          className="text-blue-600 hover:text-blue-800 text-lg font-medium transition-colors block"
                        >
                          ciepbage@escola.com
                        </a>
                        <p className="text-gray-600 text-sm mt-1">
                          Para informações gerais
                        </p>
                      </div>
                    </div>

                    {/* Horário de Funcionamento */}
                    <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg">
                      <div className="bg-orange-100 p-3 rounded-full">
                        <Clock className="h-8 w-8 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          Horário de Atendimento
                        </h3>
                        <p className="text-gray-700 text-lg">
                          Segunda a Sexta: 8h às 17h
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                          Tempo estimado de chegada do centro: 28 min
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mapa */}
                  <div className="mb-8">
                    <div className="rounded-xl overflow-hidden shadow-md">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3511.628702825614!2d-54.1145!3d-31.3298!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x952e8b8da893ab3d%3A0x4a7e50c6d04b2e63!2sCIEP!5e0!3m2!1spt-BR!2sbr!4v0000000000000"
                        width="100%"
                        height="400"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        title="Localização do CIEP Bagé"
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Botões de Ação */}
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Button 
                      asChild
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-bold"
                      size="lg"
                    >
                      <a 
                        href="https://www.google.com/maps?q=CIEP+Bagé" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2"
                      >
                        <ExternalLink className="h-5 w-5" />
                        Abrir no Google Maps
                      </a>
                    </Button>
                    
                    <Button 
                      asChild
                      variant="outline"
                      className="border-orange-500 text-orange-500 hover:bg-orange-50 px-8 py-6 text-lg font-bold"
                      size="lg"
                    >
                      <a 
                        href="tel:+555332426492"
                        className="inline-flex items-center gap-2"
                      >
                        <PhoneCall className="h-5 w-5" />
                        Ligar Agora
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Informações Adicionais */}
            <div className="max-w-4xl mx-auto mt-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Outras Formas de Contato
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                  <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Phone className="h-8 w-8 text-purple-600" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">Secretaria</h4>
                  <p className="text-gray-600 mb-4">Atendimento administrativo</p>
                  <p className="text-blue-600 font-medium">(53) 3242-6492</p>
                </Card>

                <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                  <div className="bg-yellow-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <GraduationCap className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">Coordenação</h4>
                  <p className="text-gray-600 mb-4">Direção e coordenação pedagógica</p>
                  <p className="text-blue-600 font-medium">Mesmo telefone</p>
                </Card>

                <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                  <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Globe className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">Visitas</h4>
                  <p className="text-gray-600 mb-4">Agendamento prévio necessário</p>
                  <p className="text-blue-600 font-medium">Entre em contato</p>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Contatos;