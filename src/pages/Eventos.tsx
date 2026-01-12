import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle, 
  Hourglass, 
  AlertCircle, 
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge'; // Adicione este componente se existir
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface Evento {
  id: string;
  titulo: string;
  descricao: string;
  data_evento: string;
  local?: string;
  imagemUrl?: string;
  categoria?: string;
}

type FiltroEvento = 'todos' | 'proximo' | 'passado';

const Eventos: React.FC = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [filtro, setFiltro] = useState<FiltroEvento>('todos');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarEventos = async () => {
      try {
        setLoading(true);
        const eventosSnapshot = await getDocs(collection(db, 'eventos'));
        const dadosEventos = eventosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Evento[];
        
        setEventos(dadosEventos);
      } catch (err) {
        setError('Erro ao carregar eventos. Tente novamente mais tarde.');
        console.error('Erro ao carregar eventos:', err);
      } finally {
        setLoading(false);
      }
    };

    carregarEventos();
  }, []);

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    const opcoesData: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    };
    const opcoesHora: Intl.DateTimeFormatOptions = { 
      hour: '2-digit', 
      minute: '2-digit' 
    };

    return {
      dia: data.getDate().toString().padStart(2, '0'),
      mes: data.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase(),
      ano: data.getFullYear(),
      dataCompleta: data.toLocaleDateString('pt-BR', opcoesData),
      hora: data.toLocaleTimeString('pt-BR', opcoesHora),
      diaSemana: data.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase(),
    };
  };

  const eventosFiltrados = useMemo(() => {
    const agora = new Date();
    
    return eventos
      .filter(evento => {
        const dataEvento = new Date(evento.data_evento);
        
        switch (filtro) {
          case 'proximo':
            return dataEvento >= agora;
          case 'passado':
            return dataEvento < agora;
          default:
            return true;
        }
      })
      .sort((a, b) => {
        const dataA = new Date(a.data_evento);
        const dataB = new Date(b.data_evento);
        const agora = new Date();
        
        const aIsFuturo = dataA >= agora;
        const bIsFuturo = dataB >= agora;
        
        if (aIsFuturo === bIsFuturo) {
          return aIsFuturo 
            ? dataA.getTime() - dataB.getTime()
            : dataB.getTime() - dataA.getTime();
        }
        
        return aIsFuturo ? -1 : 1;
      });
  }, [eventos, filtro]);

  const getStatusEvento = (dataEvento: Date) => {
    const agora = new Date();
    return dataEvento >= agora ? 'futuro' : 'passado';
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <Card key={index} className="p-5">
          <div className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </Card>
      ))}
    </div>
  );

  const renderErro = () => (
    <div className="text-center py-12 space-y-4">
      <AlertCircle className="h-12 w-12 mx-auto text-red-500" />
      <div>
        <p className="text-red-600 font-medium text-lg mb-2">Ops! Algo deu errado</p>
        <p className="text-gray-600 mb-6">{error}</p>
      </div>
      <Button 
        onClick={() => window.location.reload()}
        className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
      >
        Tentar Novamente
      </Button>
    </div>
  );

  const renderEventoVazio = () => (
    <div className="text-center py-12 space-y-4">
      <Calendar className="h-12 w-12 mx-auto text-gray-300" />
      <div>
        <p className="text-gray-600 font-medium text-lg mb-2">Nenhum evento encontrado</p>
        <p className="text-gray-500">
          {filtro === 'proximo' 
            ? 'Não há eventos futuros programados no momento.'
            : filtro === 'passado'
            ? 'Não há eventos anteriores registrados.'
            : 'Nenhum evento cadastrado ainda.'
          }
        </p>
      </div>
      {filtro !== 'todos' && (
        <Button 
          onClick={() => setFiltro('todos')}
          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
        >
          Ver Todos os Eventos
        </Button>
      )}
    </div>
  );

  const renderEvento = (evento: Evento) => {
    const { dia, mes, ano, dataCompleta, hora, diaSemana } = formatarData(evento.data_evento);
    const dataEvento = new Date(evento.data_evento);
    const status = getStatusEvento(dataEvento);
    const isFuturo = status === 'futuro';
    const isExpanded = expandedId === evento.id;
    const hasDetails = evento.imagemUrl || evento.local || evento.descricao.length > 100;

    return (
      <Card key={evento.id} className="overflow-hidden hover:shadow-md transition-all duration-200">
        {/* Cabeçalho Compacto */}
        <div 
          className="p-5 cursor-pointer"
          onClick={() => hasDetails && toggleExpand(evento.id)}
        >
          <div className="flex items-start justify-between gap-3">
            {/* Data */}
            <div className={`min-w-[80px] text-center p-3 rounded-lg ${
              isFuturo 
                ? 'bg-gradient-to-br from-orange-50 to-amber-50' 
                : 'bg-gradient-to-br from-green-50 to-emerald-50'
            }`}>
              <div className="text-xl font-bold text-gray-900">{dia}</div>
              <div className="text-xs font-semibold text-gray-600 uppercase">{mes}</div>
              <div className="text-xs text-gray-500 mt-1">{ano}</div>
            </div>

            {/* Informações Principais */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-gray-900 text-lg truncate pr-2">
                  {evento.titulo}
                </h3>
                <Badge className={
                  isFuturo 
                    ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' 
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }>
                  {isFuturo ? 'EM BREVE' : 'REALIZADO'}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{diaSemana}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{hora}</span>
                </div>
              </div>
              
              <p className="text-gray-700 line-clamp-2 text-sm mb-3">
                {evento.descricao}
              </p>
              
              {evento.local && (
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{evento.local}</span>
                </div>
              )}
            </div>

            {/* Chevron para expandir */}
            {hasDetails && (
              <div className="flex items-center ml-2">
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Conteúdo Expandido */}
        {isExpanded && hasDetails && (
          <div className="px-5 pb-5 border-t pt-4 space-y-4">
            {/* Descrição Completa */}
            <div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {evento.descricao}
              </p>
            </div>

            {/* Detalhes Adicionais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {evento.local && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Local</span>
                  </div>
                  <p className="text-gray-600">{evento.local}</p>
                </div>
              )}
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Data Completa</span>
                </div>
                <p className="text-gray-600">{dataCompleta} às {hora}</p>
              </div>
            </div>

            {/* Imagem do Evento */}
            {evento.imagemUrl && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-3">
                  <ImageIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Imagem do Evento</span>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <img
                    src={evento.imagemUrl}
                    alt={`Imagem do evento: ${evento.titulo}`}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Evento+Sem+Imagem';
                      e.currentTarget.className = 'w-full h-48 object-cover opacity-30';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Rodapé do Card */}
        <div className="px-5 py-3 border-t bg-gray-50">
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-500">
              ID: {evento.id.slice(0, 8)}...
            </div>
            {hasDetails && (
              <button
                onClick={() => toggleExpand(evento.id)}
                className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
              >
                {isExpanded ? 'Ver menos' : 'Ver detalhes'}
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          {/* Cabeçalho */}
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Calendário de Eventos
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Acompanhe as datas importantes, atividades acadêmicas e eventos especiais
            </p>
          </div>

          {/* Controles e Filtros */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Eventos {filtro === 'proximo' ? 'Futuros' : filtro === 'passado' ? 'Anteriores' : ''}
              </h2>
              {eventosFiltrados.length > 0 && !loading && !error && (
                <p className="text-gray-600 text-sm mt-1">
                  {filtro === 'todos' 
                    ? `${eventosFiltrados.length} eventos no total`
                    : `${eventosFiltrados.length} ${filtro === 'proximo' ? 'futuro(s)' : 'realizado(s)'}`
                  }
                </p>
              )}
            </div>
            
            <div className="w-full md:w-64">
              <Select value={filtro} onValueChange={(value: FiltroEvento) => setFiltro(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filtrar eventos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os eventos</SelectItem>
                  <SelectItem value="proximo">Próximos eventos</SelectItem>
                  <SelectItem value="passado">Eventos anteriores</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Grid de Eventos */}
          <div className="mb-12">
            {loading ? (
              renderSkeleton()
            ) : error ? (
              renderErro()
            ) : eventosFiltrados.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {eventosFiltrados.map(renderEvento)}
              </div>
            ) : (
              renderEventoVazio()
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Eventos;