import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Home,
  Camera,
  Calendar,
  GraduationCap,
  LogOut,
  Save,
  Plus,
  Trash2,
  ArrowLeft,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon,
  Eye,
  ExternalLink,
  Upload,
  User,
  Clock,
  MapPin,
  BookOpen
} from 'lucide-react';
import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  setDoc,
  Timestamp 
} from 'firebase/firestore';

// Tipos
interface HomeContent {
  title: string;
  body: string;
  heroImage: string;
}

interface GaleriaItem {
  id: string;
  url: string;
  legenda: string;
  tipo: 'foto' | 'video';
  createdAt: Timestamp;
}

interface Evento {
  id: string;
  titulo: string;
  descricao: string;
  data_evento: string;
  local?: string;
  imagemUrl?: string;
  createdAt: Timestamp;
}

interface Formando {
  id: string;
  nome: string;
  ano: number;
  curso?: string;
  profissao?: string;
  universidade?: string;
  fotoUrl?: string;
  createdAt: Timestamp;
}

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [saving, setSaving] = useState(false);
  
  // Estados de login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');
  
  // Estados dos dados
  const [homeContent, setHomeContent] = useState<HomeContent>({
    title: 'CIEP Bagé - Tradição em Educação',
    body: 'Mais de 40 anos formando cidadãos através de uma educação transformadora',
    heroImage: '/src/assets/background-ciep.png'
  });
  
  const [galeria, setGaleria] = useState<GaleriaItem[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [formandos, setFormandos] = useState<Formando[]>([]);
  
  // Estados para forms
  const [galeriaUrl, setGaleriaUrl] = useState('');
  const [galeriaLegenda, setGaleriaLegenda] = useState('');
  
  const [eventoTitulo, setEventoTitulo] = useState('');
  const [eventoDescricao, setEventoDescricao] = useState('');
  const [eventoData, setEventoData] = useState('');
  const [eventoLocal, setEventoLocal] = useState('');
  const [eventoImagemUrl, setEventoImagemUrl] = useState('');
  
  const [formandoNome, setFormandoNome] = useState('');
  const [formandoAno, setFormandoAno] = useState('2024');
  const [formandoCurso, setFormandoCurso] = useState('');
  const [formandoProfissao, setFormandoProfissao] = useState('');
  const [formandoUniversidade, setFormandoUniversidade] = useState('');
  const [formandoFotoUrl, setFormandoFotoUrl] = useState('');

  // Verificar estado de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        loadData();
      }
    });

    return () => unsubscribe();
  }, []);

  // Carregar dados do Firestore
  const loadData = async () => {
    try {
      // Carregar conteúdo da home
      const homeDoc = await getDocs(collection(db, 'home'));
      if (!homeDoc.empty) {
        const homeData = homeDoc.docs[0].data() as HomeContent;
        setHomeContent(homeData);
      }

      // Carregar galeria
      const galeriaSnapshot = await getDocs(collection(db, 'galeria'));
      const galeriaData = galeriaSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GaleriaItem[];
      setGaleria(galeriaData.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis()));

      // Carregar eventos
      const eventosSnapshot = await getDocs(collection(db, 'eventos'));
      const eventosData = eventosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Evento[];
      setEventos(eventosData.sort((a, b) => new Date(b.data_evento).getTime() - new Date(a.data_evento).getTime()));

      // Carregar formandos
      const formandosSnapshot = await getDocs(collection(db, 'formandos'));
      const formandosData = formandosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Formando[];
      setFormandos(formandosData.sort((a, b) => b.ano - a.ano));

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  // Login com Firebase
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    setLoginSuccess('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoginSuccess('Login realizado com sucesso!');
      setEmail('');
      setPassword('');
    } catch (error: any) {
      console.error('Erro no login:', error);
      
      switch (error.code) {
        case 'auth/invalid-email':
          setLoginError('Email inválido');
          break;
        case 'auth/user-disabled':
          setLoginError('Esta conta foi desativada');
          break;
        case 'auth/user-not-found':
          setLoginError('Usuário não encontrado');
          break;
        case 'auth/wrong-password':
          setLoginError('Senha incorreta');
          break;
        case 'auth/too-many-requests':
          setLoginError('Muitas tentativas. Tente novamente mais tarde');
          break;
        default:
          setLoginError('Erro ao fazer login. Tente novamente');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // ========== FUNÇÕES DE SALVAR ==========

  // Salvar conteúdo da Home
  const saveHomeContent = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'home', 'content'), homeContent);
      alert('✅ Conteúdo da Home salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar home:', error);
      alert('❌ Erro ao salvar conteúdo da Home');
    } finally {
      setSaving(false);
    }
  };

  // Adicionar item à Galeria
  const addGaleriaItem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!galeriaUrl) {
      alert('❌ Por favor, insira uma URL');
      return;
    }
    
    try {
      const newItem: Omit<GaleriaItem, 'id'> = {
        url: galeriaUrl,
        legenda: galeriaLegenda || 'Sem legenda',
        tipo: galeriaUrl.includes('youtube') || galeriaUrl.includes('youtu.be') ? 'video' : 'foto',
        createdAt: Timestamp.now()
      };
      
      const docRef = await addDoc(collection(db, 'galeria'), newItem);
      
      setGaleria([{ id: docRef.id, ...newItem }, ...galeria]);
      setGaleriaUrl('');
      setGaleriaLegenda('');
      alert('✅ Item adicionado à galeria com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      alert('❌ Erro ao adicionar item à galeria');
    }
  };

  // Remover item da Galeria
  const removeGaleriaItem = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este item?')) return;
    
    try {
      await deleteDoc(doc(db, 'galeria', id));
      setGaleria(galeria.filter(item => item.id !== id));
      alert('✅ Item removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover item:', error);
      alert('❌ Erro ao remover item');
    }
  };

  // Adicionar Evento
  const addEvento = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventoTitulo || !eventoDescricao || !eventoData) {
      alert('❌ Preencha os campos obrigatórios: Título, Descrição e Data');
      return;
    }
    
    try {
      const newEvento: Omit<Evento, 'id'> = {
        titulo: eventoTitulo,
        descricao: eventoDescricao,
        data_evento: eventoData,
        local: eventoLocal || undefined,
        imagemUrl: eventoImagemUrl || undefined,
        createdAt: Timestamp.now()
      };
      
      const docRef = await addDoc(collection(db, 'eventos'), newEvento);
      
      setEventos([{ id: docRef.id, ...newEvento }, ...eventos]);
      setEventoTitulo('');
      setEventoDescricao('');
      setEventoData('');
      setEventoLocal('');
      setEventoImagemUrl('');
      alert('✅ Evento adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar evento:', error);
      alert('❌ Erro ao adicionar evento');
    }
  };

  // Remover Evento
  const removeEvento = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este evento?')) return;
    
    try {
      await deleteDoc(doc(db, 'eventos', id));
      setEventos(eventos.filter(evento => evento.id !== id));
      alert('✅ Evento removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover evento:', error);
      alert('❌ Erro ao remover evento');
    }
  };

  // Adicionar Formando
  const addFormando = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formandoNome || !formandoAno) {
      alert('❌ Preencha os campos obrigatórios: Nome e Ano');
      return;
    }
    
    try {
      const newFormando: Omit<Formando, 'id'> = {
        nome: formandoNome,
        ano: parseInt(formandoAno),
        curso: formandoCurso || undefined,
        profissao: formandoProfissao || undefined,
        universidade: formandoUniversidade || undefined,
        fotoUrl: formandoFotoUrl || undefined,
        createdAt: Timestamp.now()
      };
      
      const docRef = await addDoc(collection(db, 'formandos'), newFormando);
      
      setFormandos([{ id: docRef.id, ...newFormando }, ...formandos]);
      setFormandoNome('');
      setFormandoAno('2024');
      setFormandoCurso('');
      setFormandoProfissao('');
      setFormandoUniversidade('');
      setFormandoFotoUrl('');
      alert('✅ Formando adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar formando:', error);
      alert('❌ Erro ao adicionar formando');
    }
  };

  // Remover Formando
  const removeFormando = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este formando?')) return;
    
    try {
      await deleteDoc(doc(db, 'formandos', id));
      setFormandos(formandos.filter(formando => formando.id !== id));
      alert('✅ Formando removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover formando:', error);
      alert('❌ Erro ao remover formando');
    }
  };

  // Visualizar imagem
  const previewImage = (url: string) => {
    if (!url) {
      alert('❌ Nenhuma URL para visualizar');
      return;
    }
    window.open(url, '_blank');
  };

  // Formatar data
  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return 'Data não disponível';
    return new Date(timestamp.toMillis()).toLocaleDateString('pt-BR');
  };

  // Tela de Login (se não estiver autenticado)
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
              <p className="text-gray-600 mt-2">Faça login para continuar</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@ciepbage.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loginLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Senha
                  </div>
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loginLoading}
                />
              </div>

              {loginError && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {loginError}
                </div>
              )}

              {loginSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-md text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  {loginSuccess}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-orange-500 hover:bg-orange-600"
                disabled={loginLoading}
              >
                {loginLoading ? 'Entrando...' : 'Entrar'}
              </Button>

              <div className="text-center text-sm text-gray-600">
                <p>Use as credenciais fornecidas pelo administrador</p>
              </div>
            </form>

            <div className="mt-6 text-center">
              <Link to="/" className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                Voltar para o site
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Painel Administrativo (usuário autenticado)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className='flex items-center gap-3'>
                <h1 className="text-xl font-bold text-gray-900">CIEP Bagé</h1>
                <div>
                    <p className="text-sm text-gray-600">Painel Administrativo</p>
                    <p className="text-xs text-gray-500">
                      Logado como: {user.email}
                    </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="outline" className="border-orange-500 text-orange-500">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Ver Site
                </Button>
              </Link>
              <Button 
                onClick={handleLogout} 
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 space-y-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Navegação</h3>
                <div className="space-y-2">
                  <Button
                    variant={activeTab === 'home' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('home')}
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Página Inicial
                  </Button>
                  <Button
                    variant={activeTab === 'galeria' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('galeria')}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Galeria
                  </Button>
                  <Button
                    variant={activeTab === 'eventos' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('eventos')}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Eventos
                  </Button>
                  <Button
                    variant={activeTab === 'formandos' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('formandos')}
                  >
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Formandos
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Status do Sistema</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Itens na galeria:</span>
                    <span className="font-medium">{galeria.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Eventos ativos:</span>
                    <span className="font-medium">{eventos.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Formandos:</span>
                    <span className="font-medium">{formandos.length}</span>
                  </div>
                  <div className="flex justify-between mt-4 pt-4 border-t">
                    <span className="text-gray-600">Usuário:</span>
                    <span className="font-medium text-blue-600">
                      {user.email?.split('@')[0]}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Dicas de Uso</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-center gap-1">✅ Use URLs de imagens (JPG, PNG)</p>
                  <p className="flex items-center gap-1">✅ Para vídeos, use links do YouTube</p>
                  <p className="flex items-center gap-1">✅ Teste sempre as URLs antes de salvar</p>
                  <p className="flex items-center gap-1">✅ Salve as alterações após cada modificação</p>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Conteúdo Principal */}
          <main className="flex-1">
            {/* SEÇÃO: HOME */}
            {activeTab === 'home' && (
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Conteúdo da Página Inicial</h2>
                    <p className="text-gray-600 mb-6">Edite o conteúdo principal da homepage</p>

                    <form onSubmit={(e) => { e.preventDefault(); saveHomeContent(); }} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="home-title">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Título Principal *
                          </div>
                        </Label>
                        <Input
                          id="home-title"
                          value={homeContent.title}
                          onChange={(e) => setHomeContent({...homeContent, title: e.target.value})}
                          placeholder="Ex: CIEP: Tradição em Educação desde 1985"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="home-body">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Texto de Apresentação *
                          </div>
                        </Label>
                        <Textarea
                          id="home-body"
                          value={homeContent.body}
                          onChange={(e) => setHomeContent({...homeContent, body: e.target.value})}
                          placeholder="Descrição da instituição..."
                          rows={4}
                          required
                        />
                      </div>

                      {/* IMAGEM DO HERO */}
                      <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="h-5 w-5 text-blue-600" />
                          <Label className="text-lg font-semibold">Imagem de Fundo do Hero</Label>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="hero-image">URL da Imagem de Fundo *</Label>
                          <div className="flex gap-2">
                            <Input
                              id="hero-image"
                              value={homeContent.heroImage}
                              onChange={(e) => setHomeContent({...homeContent, heroImage: e.target.value})}
                              placeholder="https://exemplo.com/imagem-hero.jpg"
                              className="flex-1"
                              required
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => previewImage(homeContent.heroImage)}
                              disabled={!homeContent.heroImage}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-500">
                            Recomendado: Imagem grande (min. 1920x1080) para fundo. Use serviços como Imgur, Cloudinary ou hospedagem própria.
                          </p>
                        </div>

                        {/* Pré-visualização */}
                        {homeContent.heroImage && (
                          <div className="mt-4">
                            <p className="text-sm font-medium mb-2">Pré-visualização:</p>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden max-w-md">
                              <img
                                src={homeContent.heroImage}
                                alt="Pré-visualização do Hero"
                                className="w-full h-48 object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Imagem+não+encontrada';
                                  e.currentTarget.className = 'w-full h-48 object-contain bg-gray-100 p-4';
                                }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              A imagem aparecerá com um gradiente escuro por cima no site
                            </p>
                          </div>
                        )}
                      </div>

                      <Separator />

                      <Button 
                        type="submit" 
                        className="bg-green-600 hover:bg-green-700 w-full"
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <Clock className="mr-2 h-4 w-4 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Salvar Alterações da Home
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* SEÇÃO: GALERIA */}
            {activeTab === 'galeria' && (
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Gerenciar Galeria</h2>
                    <p className="text-gray-600 mb-6">Adicione fotos e vídeos à galeria da escola</p>

                    <form onSubmit={addGaleriaItem} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="galeria-url">
                            <div className="flex items-center gap-2">
                              <ImageIcon className="h-4 w-4" />
                              URL da Imagem/Vídeo *
                            </div>
                          </Label>
                          <Input
                            id="galeria-url"
                            type="url"
                            value={galeriaUrl}
                            onChange={(e) => setGaleriaUrl(e.target.value)}
                            placeholder="https://exemplo.com/imagem.jpg ou https://youtube.com/watch?v=..."
                            required
                          />
                          <p className="text-xs text-gray-500">
                            Para vídeos: Cole link do YouTube. Para fotos: URL direta da imagem.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="galeria-legenda">
                            <div className="flex items-center gap-2">
                              <Camera className="h-4 w-4" />
                              Legenda
                            </div>
                          </Label>
                          <Input
                            id="galeria-legenda"
                            value={galeriaLegenda}
                            onChange={(e) => setGaleriaLegenda(e.target.value)}
                            placeholder="Descrição da imagem/vídeo..."
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                          <Plus className="mr-2 h-4 w-4" />
                          Adicionar à Galeria
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => previewImage(galeriaUrl)}
                          disabled={!galeriaUrl}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Pré-visualizar
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900">
                        Itens na Galeria ({galeria.length})
                      </h3>
                      <div className="text-sm text-gray-500">
                        {galeria.length > 0 && `Mais recente: ${formatDate(galeria[0]?.createdAt)}`}
                      </div>
                    </div>
                    
                    {galeria.length === 0 ? (
                      <div className="text-center py-12">
                        <Camera className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-500 text-lg">Nenhum item na galeria</p>
                        <p className="text-gray-400 text-sm mt-2">Adicione sua primeira foto ou vídeo acima</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {galeria.map((item) => (
                          <div key={item.id} className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  item.tipo === 'foto' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {item.tipo === 'foto' ? '📷 FOTO' : '🎬 VÍDEO'}
                                </span>
                                <div>
                                  <h4 className="font-medium text-gray-900">{item.legenda || 'Sem legenda'}</h4>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Adicionado em: {formatDate(item.createdAt)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => previewImage(item.url)}
                                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                  title="Visualizar"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeGaleriaItem(item.id)}
                                  className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                  title="Remover"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 truncate bg-gray-100 p-2 rounded">
                              {item.url}
                            </p>
                            {item.tipo === 'foto' && (
                              <div className="mt-3 border rounded overflow-hidden max-w-xs">
                                <img
                                  src={item.url}
                                  alt={item.legenda}
                                  className="w-full h-40 object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = 'https://via.placeholder.com/300x150?text=Imagem+não+carregada';
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* SEÇÃO: EVENTOS */}
            {activeTab === 'eventos' && (
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Gerenciar Eventos</h2>
                    <p className="text-gray-600 mb-6">Cadastre eventos e datas importantes</p>

                    <form onSubmit={addEvento} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="evento-titulo">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Título do Evento *
                            </div>
                          </Label>
                          <Input
                            id="evento-titulo"
                            value={eventoTitulo}
                            onChange={(e) => setEventoTitulo(e.target.value)}
                            placeholder="Ex: Festa Junina 2025"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="evento-data">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Data do Evento *
                            </div>
                          </Label>
                          <Input
                            id="evento-data"
                            type="date"
                            value={eventoData}
                            onChange={(e) => setEventoData(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="evento-descricao">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Descrição *
                          </div>
                        </Label>
                        <Textarea
                          id="evento-descricao"
                          value={eventoDescricao}
                          onChange={(e) => setEventoDescricao(e.target.value)}
                          placeholder="Detalhes do evento..."
                          rows={3}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="evento-local">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              Local
                            </div>
                          </Label>
                          <Input
                            id="evento-local"
                            value={eventoLocal}
                            onChange={(e) => setEventoLocal(e.target.value)}
                            placeholder="Ex: Ginásio da escola"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="evento-imagem">
                            <div className="flex items-center gap-2">
                              <ImageIcon className="h-4 w-4" />
                              URL da Imagem (opcional)
                            </div>
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id="evento-imagem"
                              type="url"
                              value={eventoImagemUrl}
                              onChange={(e) => setEventoImagemUrl(e.target.value)}
                              placeholder="https://exemplo.com/imagem-evento.jpg"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => previewImage(eventoImagemUrl)}
                              disabled={!eventoImagemUrl}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button type="submit" className="bg-orange-500 hover:bg-orange-600 w-full">
                          <Plus className="mr-2 h-4 w-4" />
                          Adicionar Evento
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900">
                        Eventos Cadastrados ({eventos.length})
                      </h3>
                      <div className="text-sm text-gray-500">
                        {eventos.length > 0 && `Próximo: ${new Date(eventos[0]?.data_evento).toLocaleDateString('pt-BR')}`}
                      </div>
                    </div>
                    
                    {eventos.length === 0 ? (
                      <div className="text-center py-12">
                        <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-500 text-lg">Nenhum evento cadastrado</p>
                        <p className="text-gray-400 text-sm mt-2">Adicione seu primeiro evento acima</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {eventos.map((evento) => {
                          const dataEvento = new Date(evento.data_evento);
                          const isFuturo = dataEvento >= new Date();
                          
                          return (
                            <div key={evento.id} className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <div className="flex items-center gap-3">
                                    <h4 className="font-bold text-lg">{evento.titulo}</h4>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      isFuturo ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                                    }`}>
                                      {isFuturo ? 'PRÓXIMO' : 'REALIZADO'}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {dataEvento.toLocaleDateString('pt-BR')}
                                    </span>
                                    {evento.local && (
                                      <span className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {evento.local}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeEvento(evento.id)}
                                  className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              <p className="text-gray-700 mb-4">{evento.descricao}</p>
                              
                              {evento.imagemUrl && (
                                <div className="mt-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    <ImageIcon className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm font-medium">Imagem do Evento:</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => previewImage(evento.imagemUrl!)}
                                      className="text-blue-600 hover:text-blue-800"
                                    >
                                      <ExternalLink className="h-3 w-3 mr-1" />
                                      Ver
                                    </Button>
                                  </div>
                                  <div className="border rounded overflow-hidden max-w-sm">
                                    <img
                                      src={evento.imagemUrl}
                                      alt={evento.titulo}
                                      className="w-full h-40 object-cover"
                                      onError={(e) => {
                                        e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Imagem+não+carregada';
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                              
                              <div className="mt-3 text-xs text-gray-500">
                                Criado em: {formatDate(evento.createdAt)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* SEÇÃO: FORMANDOS */}
            {activeTab === 'formandos' && (
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Gerenciar Formandos</h2>
                    <p className="text-gray-600 mb-6">Registre os alunos formados com suas informações</p>

                    <form onSubmit={addFormando} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="formando-nome">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              Nome do Formando *
                            </div>
                          </Label>
                          <Input
                            id="formando-nome"
                            value={formandoNome}
                            onChange={(e) => setFormandoNome(e.target.value)}
                            placeholder="Nome completo"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="formando-ano">
                            <div className="flex items-center gap-2">
                              <GraduationCap className="h-4 w-4" />
                              Ano de Formatura *
                            </div>
                          </Label>
                          <Input
                            id="formando-ano"
                            type="number"
                            value={formandoAno}
                            onChange={(e) => setFormandoAno(e.target.value)}
                            placeholder="2025"
                            min="1980"
                            max="2100"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="formando-curso">Curso</Label>
                          <Input
                            id="formando-curso"
                            value={formandoCurso}
                            onChange={(e) => setFormandoCurso(e.target.value)}
                            placeholder="Ex: Ciências da Computação"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="formando-profissao">Profissão</Label>
                          <Input
                            id="formando-profissao"
                            value={formandoProfissao}
                            onChange={(e) => setFormandoProfissao(e.target.value)}
                            placeholder="Ex: Engenheiro de Software"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="formando-universidade">Universidade</Label>
                          <Input
                            id="formando-universidade"
                            value={formandoUniversidade}
                            onChange={(e) => setFormandoUniversidade(e.target.value)}
                            placeholder="Ex: UFRGS"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="formando-foto">
                            <div className="flex items-center gap-2">
                              <ImageIcon className="h-4 w-4" />
                              URL da Foto (opcional)
                            </div>
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id="formando-foto"
                              type="url"
                              value={formandoFotoUrl}
                              onChange={(e) => setFormandoFotoUrl(e.target.value)}
                              placeholder="https://exemplo.com/foto-formando.jpg"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => previewImage(formandoFotoUrl)}
                              disabled={!formandoFotoUrl}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500">
                            Use foto quadrada (1:1) para melhor visualização
                          </p>
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button type="submit" className="bg-orange-500 hover:bg-orange-600 w-full">
                          <Plus className="mr-2 h-4 w-4" />
                          Adicionar Formando
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900">
                        Formandos Cadastrados ({formandos.length})
                      </h3>
                      <div className="text-sm text-gray-500">
                        {formandos.length > 0 && `Mais recente: ${formandos[0]?.ano}`}
                      </div>
                    </div>
                    
                    {formandos.length === 0 ? (
                      <div className="text-center py-12">
                        <GraduationCap className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-500 text-lg">Nenhum formando cadastrado</p>
                        <p className="text-gray-400 text-sm mt-2">Adicione seu primeiro formando acima</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {formandos.map((formando) => (
                          <div key={formando.id} className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div className="flex gap-4">
                              {/* Foto do Formando */}
                              <div className="flex-shrink-0">
                                {formando.fotoUrl ? (
                                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-orange-200">
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
                                  <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
                                    <User className="h-10 w-10 text-orange-500" />
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h4 className="font-bold text-lg">{formando.nome}</h4>
                                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                      <span className="flex items-center gap-1">
                                        <GraduationCap className="h-3 w-3" />
                                        Turma de {formando.ano}
                                      </span>
                                      {formando.curso && <span>• {formando.curso}</span>}
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    {formando.fotoUrl && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => previewImage(formando.fotoUrl!)}
                                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                        title="Ver foto"
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeFormando(formando.id)}
                                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                      title="Remover"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                
                                <div className="space-y-1 text-sm text-gray-700">
                                  {formando.profissao && (
                                    <p><span className="font-medium">Profissão:</span> {formando.profissao}</p>
                                  )}
                                  {formando.universidade && (
                                    <p><span className="font-medium">Universidade:</span> {formando.universidade}</p>
                                  )}
                                </div>
                                
                                <div className="mt-3 text-xs text-gray-500">
                                  Adicionado em: {formatDate(formando.createdAt)}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Admin;