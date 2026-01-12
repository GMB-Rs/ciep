import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Images,
  PlayCircle,
  Hourglass,
  AlertCircle,
  Search,
  Filter,
  Grid3x3,
  List,
  Download,
  Share2,
  Eye,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Play
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface GaleriaItem {
  id: string;
  url: string;
  legenda: string;
  tipo: 'foto' | 'video';
  categoria?: string;
  data?: string;
  visualizacoes?: number;
}

type ViewMode = 'grid' | 'list';
type FilterType = 'todos' | 'foto' | 'video';

const Galeria: React.FC = () => {
  const [itens, setItens] = useState<GaleriaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterType>('todos');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedItem, setSelectedItem] = useState<GaleriaItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const carregarGaleria = async () => {
      try {
        setLoading(true);
        const galeriaSnapshot = await getDocs(collection(db, 'galeria'));
        const dados = galeriaSnapshot.docs.map(doc => ({
          id: doc.id,
          url: doc.data().url,
          legenda: doc.data().legenda || '',
          tipo: doc.data().tipo,
          categoria: doc.data().categoria || 'geral',
          data: doc.data().data || new Date().toISOString(),
          visualizacoes: doc.data().visualizacoes || 0,
        })) as GaleriaItem[];
        
        setItens(dados);
      } catch (err) {
        setError('Erro ao carregar a galeria. Tente novamente mais tarde.');
        console.error('Erro ao carregar galeria:', err);
      } finally {
        setLoading(false);
      }
    };

    carregarGaleria();
  }, []);

  const getYouTubeId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const formatarData = (dataString?: string) => {
    if (!dataString) return 'Data não informada';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const itensFiltrados = useMemo(() => {
    return itens.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.legenda.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.categoria?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filter === 'todos' || item.tipo === filter;
      
      return matchesSearch && matchesFilter;
    });
  }, [itens, searchTerm, filter]);

  const categorias = useMemo(() => {
    const cats = Array.from(new Set(itens.map(item => item.categoria).filter(Boolean)));
    return ['todos', ...cats] as string[];
  }, [itens]);

  const abrirLightbox = (item: GaleriaItem, index: number) => {
    setSelectedItem(item);
    setCurrentIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const fecharLightbox = () => {
    setSelectedItem(null);
    document.body.style.overflow = 'auto';
  };

  const navegarLightbox = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % itensFiltrados.length
      : (currentIndex - 1 + itensFiltrados.length) % itensFiltrados.length;
    
    setCurrentIndex(newIndex);
    setSelectedItem(itensFiltrados[newIndex]);
  };

  const handleShare = async (item: GaleriaItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.legenda || 'Galeria CIEP',
          text: `Confira este ${item.tipo === 'foto' ? 'foto' : 'vídeo'} da galeria do CIEP`,
          url: item.url,
        });
      } catch (err) {
        console.log('Erro ao compartilhar:', err);
      }
    } else {
      navigator.clipboard.writeText(item.url);
      alert('Link copiado para a área de transferência!');
    }
  };

  const renderSkeleton = () => (
    <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'space-y-4'} gap-6`}>
      {[...Array(8)].map((_, index) => (
        viewMode === 'grid' ? (
          <Card key={index} className="overflow-hidden animate-pulse">
            <div className="aspect-square bg-gray-200" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </Card>
        ) : (
          <Card key={index} className="animate-pulse">
            <div className="flex items-center gap-4 p-4">
              <div className="w-24 h-24 bg-gray-200 rounded" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          </Card>
        )
      ))}
    </div>
  );

  const renderItemGrid = (item: GaleriaItem, index: number) => (
    <Card 
      key={item.id}
      className="group overflow-hidden hover:shadow-xl transition-all duration-300 border hover:border-orange-300 cursor-pointer"
      onClick={() => abrirLightbox(item, index)}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {item.tipo === 'foto' ? (
          <img 
            src={item.url} 
            alt={item.legenda}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/400x400?text=Imagem+Não+Carregada';
            }}
          />
        ) : (
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-purple-900/80" />
            <PlayCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-12 w-12 text-white" />
            <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">
              Vídeo
            </Badge>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                {item.categoria}
              </Badge>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span className="text-sm">{item.visualizacoes || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-1 mb-2">
          {item.legenda || 'Sem título'}
        </h3>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            <span>{formatarData(item.data)}</span>
          </div>
          <Badge variant={item.tipo === 'foto' ? 'secondary' : 'default'}>
            {item.tipo === 'foto' ? 'Foto' : 'Vídeo'}
          </Badge>
        </div>
      </div>
    </Card>
  );

  const renderItemList = (item: GaleriaItem, index: number) => (
    <Card 
      key={item.id}
      className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => abrirLightbox(item, index)}
    >
      <div className="flex items-center gap-4 p-4">
        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
          {item.tipo === 'foto' ? (
            <img 
              src={item.url} 
              alt={item.legenda}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/400x400?text=Imagem+Não+Carregada';
              }}
            />
          ) : (
            <div className="relative w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
              <Play className="h-8 w-8 text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 truncate">
              {item.legenda || 'Sem título'}
            </h3>
            <Badge variant={item.tipo === 'foto' ? 'secondary' : 'default'}>
              {item.tipo === 'foto' ? 'Foto' : 'Vídeo'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatarData(item.data)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{item.visualizacoes || 0} visualizações</span>
            </div>
          </div>
          
          {item.categoria && (
            <Badge variant="outline" className="mt-2">
              {item.categoria}
            </Badge>
          )}
        </div>
        
        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
      </div>
    </Card>
  );

  const renderLightbox = () => {
    if (!selectedItem) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
        <div className="relative w-full h-full max-w-7xl mx-auto p-4">
          {/* Botão Fechar */}
          <Button
            onClick={fecharLightbox}
            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Navegação */}
          {itensFiltrados.length > 1 && (
            <>
              <Button
                onClick={() => navegarLightbox('prev')}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                onClick={() => navegarLightbox('next')}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {/* Contador */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-black/50 rounded-full text-white text-sm">
            {currentIndex + 1} / {itensFiltrados.length}
          </div>

          {/* Conteúdo */}
          <div className="w-full h-full flex items-center justify-center">
            {selectedItem.tipo === 'foto' ? (
              <div className="max-w-full max-h-[85vh]">
                <img
                  src={selectedItem.url}
                  alt={selectedItem.legenda}
                  className="max-w-full max-h-[85vh] object-contain rounded-lg"
                />
              </div>
            ) : (
              <div className="w-full max-w-4xl">
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  {getYouTubeId(selectedItem.url) ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${getYouTubeId(selectedItem.url)}?autoplay=1`}
                      title={selectedItem.legenda}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={selectedItem.url}
                      controls
                      className="w-full h-full"
                      autoPlay
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Informações */}
          <div className="absolute bottom-4 left-0 right-0 px-4">
            <div className="max-w-4xl mx-auto bg-black/50 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-2">
                    {selectedItem.legenda || 'Sem título'}
                  </h3>
                  <div className="flex items-center gap-4 text-white/80 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatarData(selectedItem.data)}</span>
                    </div>
                    <Badge variant="outline" className="bg-transparent text-white border-white/30">
                      {selectedItem.categoria}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{selectedItem.visualizacoes || 0} visualizações</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-white border-white/30 hover:bg-white/10"
                    onClick={() => handleShare(selectedItem)}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartilhar
                  </Button>
                  {selectedItem.tipo === 'foto' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-white border-white/30 hover:bg-white/10"
                      asChild
                    >
                      <a href={selectedItem.url} download target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Baixar
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          {/* Cabeçalho */}
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl mb-4">
              <Images className="h-8 w-8 text-orange-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Galeria de Momentos
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Reviva os melhores momentos da nossa comunidade acadêmica através de fotos e vídeos
            </p>
          </div>

          {/* Controles */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Busca */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Buscar por legenda ou categoria..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                {searchTerm && (
                  <Button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                )}
              </div>

              {/* Filtros e Visualização */}
              <div className="flex items-center gap-3">
                {/* Filtro por Tipo */}
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-gray-500" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as FilterType)}
                    className="px-3 py-2 border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="todos">Todos os tipos</option>
                    <option value="foto">Apenas fotos</option>
                    <option value="video">Apenas vídeos</option>
                  </select>
                </div>

                {/* Toggle Visualização */}
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <Button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <Grid3x3 className="h-5 w-5" />
                  </Button>
                  <div className="w-px h-6 bg-gray-200" />
                  <Button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <List className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Categorias */}
            <div className="flex flex-wrap gap-2">
              {categorias.slice(0, 8).map(categoria => (
                <Badge
                  key={categoria}
                  variant="outline"
                  className={`cursor-pointer hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 transition-colors ${
                    searchTerm === categoria ? 'bg-orange-50 text-orange-600 border-orange-300' : ''
                  }`}
                  onClick={() => setSearchTerm(categoria === 'todos' ? '' : categoria)}
                >
                  {categoria === 'todos' ? 'Todas categorias' : categoria}
                </Badge>
              ))}
            </div>
          </div>

          {/* Conteúdo */}
          <div className="mb-12">
            {loading ? (
              renderSkeleton()
            ) : error ? (
              <div className="text-center py-12 space-y-4">
                <AlertCircle className="h-12 w-12 mx-auto text-red-500" />
                <div>
                  <p className="text-red-600 font-medium text-lg mb-2">Erro ao carregar</p>
                  <p className="text-gray-600 mb-6">{error}</p>
                </div>
                <Button 
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                >
                  Tentar Novamente
                </Button>
              </div>
            ) : itensFiltrados.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {filter === 'foto' ? 'Fotografias' : filter === 'video' ? 'Vídeos' : 'Galeria'} 
                    <span className="text-gray-500 ml-2">({itensFiltrados.length} itens)</span>
                  </h2>
                  
                  <div className="text-sm text-gray-500">
                    Visualizando em {viewMode === 'grid' ? 'grade' : 'lista'}
                  </div>
                </div>

                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
                }>
                  {itensFiltrados.map((item, index) => 
                    viewMode === 'grid' ? renderItemGrid(item, index) : renderItemList(item, index)
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-12 space-y-4">
                <Images className="h-12 w-12 mx-auto text-gray-300" />
                <div>
                  <p className="text-gray-600 font-medium text-lg mb-2">Nenhum item encontrado</p>
                  <p className="text-gray-500">
                    {searchTerm 
                      ? `Nenhum resultado para "${searchTerm}"`
                      : filter !== 'todos'
                      ? `Nenhum ${filter === 'foto' ? 'foto' : 'vídeo'} disponível`
                      : 'A galeria está vazia no momento.'
                    }
                  </p>
                </div>
                {(searchTerm || filter !== 'todos') && (
                  <Button 
                    onClick={() => {
                      setSearchTerm('');
                      setFilter('todos');
                    }}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  >
                    Limpar filtros
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Lightbox */}
      {selectedItem && renderLightbox()}
    </div>
  );
};

export default Galeria;