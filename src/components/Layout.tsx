import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home as HomeIcon,
  Camera,
  Calendar,
  GraduationCap,
  Phone,
  LogIn
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER INSTITUCIONAL */}
      <header className="sticky top-0 z-50 bg-white border-b border-yellow-400 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            {/* Logo e Identidade */}
            <div className="flex items-center gap-3">
              <img
                src="/src/assets/logo.png"
                alt="CIEP Bagé Logo"
                className="h-16 w-auto"
              />
            </div>

            {/* Navegação */}
            <nav className="hidden md:flex items-center gap-2">
              <ul className="flex items-center gap-9">
                <li>
                  <Link 
                    to="/" 
                    className="text-sm font-medium text-gray-900 hover:text-orange-500 transition-colors uppercase tracking-wide"
                  >
                    <HomeIcon className="inline mr-2 h-4 w-4" />
                    Início
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/galeria" 
                    className="text-sm font-medium text-gray-900 hover:text-orange-500 transition-colors uppercase tracking-wide"
                  >
                    <Camera className="inline mr-2 h-4 w-4" />
                    Galeria
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/eventos" 
                    className="text-sm font-medium text-gray-900 hover:text-orange-500 transition-colors uppercase tracking-wide"
                  >
                    <Calendar className="inline mr-2 h-4 w-4" />
                    Eventos
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/formandos" 
                    className="text-sm font-medium text-gray-900 hover:text-orange-500 transition-colors uppercase tracking-wide"
                  >
                    <GraduationCap className="inline mr-2 h-4 w-4" />
                    Formandos
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/contatos" 
                    className="text-sm font-medium text-gray-900 hover:text-orange-500 transition-colors uppercase tracking-wide"
                  >
                    <Phone className="inline mr-2 h-4 w-4" />
                    Contatos
                  </Link>
                </li>
              </ul>

              {/* Botão Admin */}
              <Link to="/admin" className="ml-8">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 text-sm font-semibold uppercase tracking-wide">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login Admin
                </Button>
              </Link>
            </nav>

            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </Button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1">{children}</main>

      {/* FOOTER ACADÊMICO */}
      <footer className="bg-blue-900 border-t border-yellow-400/30 mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center text-center">
            {/* Logo Footer */}
            <div className="mb-8 text-white">
              <h2 className="text-xl font-bold mb-2 tracking-wider">
                E.E.E.M. Dr. Luiz Maria Ferraz - CIEP
              </h2>
            </div>

            {/* Links Footer */}
            <nav className="flex flex-wrap justify-center gap-6 mb-8">
              <Link 
                to="/" 
                className="text-sm font-medium text-gray-300 hover:text-orange-400 transition-colors"
              >
                Inicio
              </Link>
              <Link 
                to="/contatos" 
                className="text-sm font-medium text-gray-300 hover:text-orange-400 transition-colors"
              >
                Contatos
              </Link>
              <Link 
                to="/galeria" 
                className="text-sm font-medium text-gray-300 hover:text-orange-400 transition-colors"
              >
                Galeria
              </Link>
            </nav>

            {/* Copyright */}
            <div className="text-sm text-gray-400 max-w-2xl">
              <p className="mb-2">
                © 2025 CIEP - Centro Integrado de Educação Pública de Bagé. Todos
                os direitos reservados.
              </p>
              <p>
                Desenvolvido por Gabriel Barbosa, Gabriel Blanco, Othávio Spencer
                e Victor Dutra nos laboratórios do IFSUL - Campus Bagé.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;