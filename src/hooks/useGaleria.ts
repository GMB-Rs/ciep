import { useState, useEffect } from 'react';

interface GaleriaItem {
  id: number;
  url: string;
  legenda: string;
  tipo: 'foto' | 'video';
}

export const useGaleria = () => {
  const [fotos, setFotos] = useState<GaleriaItem[]>([]);
  const [videos, setVideos] = useState<GaleriaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGaleria = async () => {
      try {
        setLoading(true);
        // Simulação de dados da API
        const mockData: GaleriaItem[] = [
          { id: 1, url: '/foto1.jpg', legenda: 'Formatura 2023', tipo: 'foto' },
          { id: 2, url: '/foto2.jpg', legenda: 'Feira de Ciências', tipo: 'foto' },
          { id: 3, url: 'https://www.youtube.com/watch?v=abc123', legenda: 'Cerimônia de Premiação', tipo: 'video' },
          // Adicione mais itens conforme necessário
        ];

        const fotosData = mockData.filter(item => item.tipo === 'foto');
        const videosData = mockData.filter(item => item.tipo === 'video');

        setFotos(fotosData);
        setVideos(videosData);
      } catch (err) {
        setError('Erro ao carregar a galeria');
      } finally {
        setLoading(false);
      }
    };

    fetchGaleria();
  }, []);

  return { fotos, videos, loading, error };
};