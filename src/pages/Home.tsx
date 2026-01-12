import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Images, 
  GraduationCap, 
  Calendar, 
  Phone
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface HomeContent {
  title: string;
  body: string;
  heroImage: string;
}

const Home: React.FC = () => {
  const [homeContent, setHomeContent] = useState<HomeContent>({
    title: 'CIEP Bagé - Tradição em Educação',
    body: 'Mais de 40 anos formando cidadãos através de uma educação transformadora',
    heroImage: '/src/assets/background-ciep.png'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeContent = async () => {
      try {
        const homeDoc = await getDoc(doc(db, 'home', 'content'));
        if (homeDoc.exists()) {
          const data = homeDoc.data() as HomeContent;
          setHomeContent(data);
        }
      } catch (error) {
        console.error('Erro ao carregar conteúdo da home:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHomeContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* HERO SECTION com imagem dinâmica */}
      <section className="py-2">
        <div className="p-2 relative">
          <div 
            className="min-h-[520px] flex flex-col items-center justify-center text-center gap-8 p-16 rounded bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(rgba(40, 20, 10, 0.4), rgba(20, 10, 0, 0.7)), url('${homeContent.heroImage}')`
            }}
          >
            <div className="max-w-[900px] text-white">
              <h1 className="text-5xl md:text-6xl font-black italic mb-5 leading-tight drop-shadow-lg">
                {homeContent.title}
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-[800px] mx-auto drop-shadow">
                {homeContent.body}
              </p>
              
              <div className="flex gap-4 justify-center flex-wrap">
                <Link to="/formandos">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white px-7 py-3 text-base font-bold">
                    <GraduationCap className="mr-2 h-5 w-5" />
                    Conheça Nossos Formandos
                  </Button>
                </Link>
                <Link to="/eventos">
                  <Button 
                    variant="outline" 
                    className="border-2 border-white bg-white/10 backdrop-blur-sm text-white px-7 py-3 text-base font-bold hover:bg-white/20"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Próximos Eventos
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PILARES ACADÊMICOS */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nossos Pilares Acadêmicos
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Construído sobre uma base de rigor intelectual e compromisso com a
              educação transformadora.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Link to="/galeria">
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-yellow-200">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="bg-blue-100 p-4 rounded-full mb-4">
                    <Images className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Galeria</h3>
                  <p className="text-gray-600">
                    Explore momentos marcantes da nossa trajetória educacional
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/formandos">
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-yellow-200">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="bg-green-100 p-4 rounded-full mb-4">
                    <GraduationCap className="h-12 w-12 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Formandos</h3>
                  <p className="text-gray-600">
                    Conheça nossos ex-alunos e suas conquistas profissionais
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/eventos">
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-yellow-200">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="bg-purple-100 p-4 rounded-full mb-4">
                    <Calendar className="h-12 w-12 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Eventos</h3>
                  <p className="text-gray-600">
                    Participe dos nossos próximos eventos e atividades
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/contatos">
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-yellow-200">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="bg-orange-100 p-4 rounded-full mb-4">
                    <Phone className="h-12 w-12 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Contatos</h3>
                  <p className="text-gray-600">
                    Entre em contato conosco para mais informações
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* SEÇÃO DE DESTAQUES */}
      <section className="py-16 bg-gray-50 mt-16 rounded-lg">
        <div className="max-w-5xl mx-auto px-4">
          <Separator className="mb-12" />
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Destaques & Conquistas
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6 bg-white border border-yellow-200">
              <div className="text-4xl font-black text-orange-500 mb-2">40+</div>
              <div className="text-lg font-semibold text-gray-900">Anos de Tradição</div>
              <p className="text-sm text-gray-600 mt-2">Educação de qualidade desde 1983</p>
            </Card>

            <Card className="text-center p-6 bg-white border border-yellow-200">
              <div className="text-4xl font-black text-orange-500 mb-2">5000+</div>
              <div className="text-lg font-semibold text-gray-900">Alunos Formados</div>
              <p className="text-sm text-gray-600 mt-2">Profissionais no mercado de trabalho</p>
            </Card>

            <Card className="text-center p-6 bg-white border border-yellow-200">
              <div className="text-4xl font-black text-orange-500 mb-2">95%</div>
              <div className="text-lg font-semibold text-gray-900">Taxa de Aprovação</div>
              <p className="text-sm text-gray-600 mt-2">Nos principais vestibulares</p>
            </Card>

            <Card className="text-center p-6 bg-white border border-yellow-200">
              <div className="text-4xl font-black text-orange-500 mb-2">100+</div>
              <div className="text-lg font-semibold text-gray-900">Projetos Realizados</div>
              <p className="text-sm text-gray-600 mt-2">Iniciativas comunitárias e acadêmicas</p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;