import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Galeria from './pages/Galeria';
import Formandos from './pages/Formandos';
import Eventos from './pages/Eventos';
import Contatos from './pages/Contatos';
import Admin from './pages/Admin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route element={<Layout><Outlet /></Layout>}>
          <Route path="/" element={<Home />} />
          <Route path="/galeria" element={<Galeria />} />
          <Route path="/formandos" element={<Formandos />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/contatos" element={<Contatos />} />
        </Route>
        
        {/* Rota do Admin - SEM Layout */}
        <Route path="/admin" element={<Admin />} />
        
        {/* Rota de fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;