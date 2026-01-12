export interface HomeContent {
  title: string;
  body: string;
  heroImage?: string;
}

export interface GaleriaItem {
  id: string;
  url: string;
  legenda: string;
  tipo: 'foto' | 'video';
  categoria?: 'eventos' | 'formaturas' | 'escola' | 'atividades';
}

export interface Evento {
  id: string;
  titulo: string;
  descricao: string;
  data_evento: string;
  local?: string;
  imagemUrl?: string;
}

export interface Formando {
  id: string;
  nome: string;
  ano: number;
  curso?: string;
  profissao?: string;
  universidade?: string;
  fotoUrl?: string;
}