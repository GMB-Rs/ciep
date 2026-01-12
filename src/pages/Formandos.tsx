import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  School,
  Hourglass,
  AlertCircle,
  User
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface Formando {
  id: string;
  nome: string;
  ano: number;
  curso?: string;
  profissao?: string;
  universidade?: string;
  fotoUrl?: string;
}

const Formandos: React.FC = () => {
  const [formandos, setFormandos] = useState<Formando[]>([]);
  const [anos, setAnos] = useState<number[]>([]);
  const [anoSelecionado, setAnoSelecionado] = useState<string>('todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFormandos = async () => {
      try {
        setLoading(true);
        const formandosSnapshot = await getDocs(collection(db, 'formandos'));
        const data = formandosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Formando[];
        
        setFormandos(data);
        
        // Extrair anos únicos
        const anosUnicos = [...new Set(data.map((f: Formando) => f.ano))]
          .sort((a: number, b: number) => b - a);
        
        setAnos(anosUnicos);
      } catch (err) {
        setError('Erro ao carregar formandos. Tente novamente mais tarde.');
        console.error('Erro ao carregar formandos:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFormandos();
  }, []);

  // Filtrar formandos por ano
  const formandosFiltrados = anoSelecionado === 'todos'
    ? formandos
    : formandos.filter(f => f.ano.toString() === anoSelecionado);

  return (
    <div className="min-h-screen">
      <main>
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Header da Seção */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Nossos Formandos
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Celebrando a excelência acadêmica e as conquistas dos nossos alunos que se destacaram ao longo dos anos.
              </p>
            </div>

            {/* Filtro por Ano */}
            <div className="mb-12 p-6 bg-gray-50 rounded-lg">
              <div className="max-w-md mx-auto">
                <label htmlFor="ano-filter" className="block text-sm font-medium text-gray-700 mb-2">
                  Filtrar por ano:
                </label>
                <Select value={anoSelecionado} onValueChange={setAnoSelecionado}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todos os anos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os anos</SelectItem>
                    {anos.map((ano) => (
                      <SelectItem key={ano} value={ano.toString()}>
                        {ano}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Grid de Formandos */}
            {loading ? (
              <div className="text-center py-16">
                <Hourglass className="h-16 w-16 mx-auto mb-4 text-gray-400 animate-spin" />
                <p className="text-gray-600">Carregando formandos...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
                <p className="text-red-600 mb-4">{error}</p>
                <Button 
                  onClick={() => window.location.reload()}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Tentar Novamente
                </Button>
              </div>
            ) : formandosFiltrados.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {formandosFiltrados.map((formando) => (
                  <Card 
                    key={formando.id} 
                    className="hover:shadow-lg transition-shadow duration-300 border border-yellow-200"
                  >
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      {/* Foto do Formando */}
                      <div className="mb-4">
                        {formando.fotoUrl ? (
                          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-orange-100">
                            <img
                              src={formando.fotoUrl}
                              alt={formando.nome}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/100x100?text=Sem+foto';
                              }}
                            />
                          </div>
                        ) : (
                          <div className="bg-orange-100 p-4 rounded-full mb-4">
                            <User className="h-16 w-16 text-orange-600" />
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {formando.nome}
                      </h3>
                      <p className="text-orange-500 font-semibold mb-3">
                        Turma de {formando.ano}
                      </p>
                      
                      <div className="space-y-1 text-sm text-gray-700 w-full">
                        {formando.curso && (
                          <p className="truncate"><span className="font-medium">Curso:</span> {formando.curso}</p>
                        )}
                        {formando.profissao && (
                          <p className="truncate"><span className="font-medium">Profissão:</span> {formando.profissao}</p>
                        )}
                        {formando.universidade && (
                          <p className="truncate text-gray-600">
                            {formando.universidade}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <School className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Nenhum formando encontrado para este filtro.</p>
                {anoSelecionado !== 'todos' && (
                  <Button 
                    onClick={() => setAnoSelecionado('todos')}
                    className="mt-4 bg-orange-500 hover:bg-orange-600"
                  >
                    Ver Todos os Formandos
                  </Button>
                )}
              </div>
            )}

            {/* Contador */}
            {formandosFiltrados.length > 0 && !loading && !error && (
              <div className="mt-12 text-center">
                <p className="text-gray-600">
                  {anoSelecionado === 'todos'
                    ? `${formandos.length} formandos no total`
                    : `${formandosFiltrados.length} formando(s) da turma de ${anoSelecionado}`
                  }
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Formandos;