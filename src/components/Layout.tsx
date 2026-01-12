import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home as HomeIcon,
  Camera,
  Calendar,
  GraduationCap,
  Phone,
  LogIn,
  X
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navigationItems = [
    { to: "/", icon: HomeIcon, label: "Início" },
    { to: "/galeria", icon: Camera, label: "Galeria" },
    { to: "/eventos", icon: Calendar, label: "Eventos" },
    { to: "/formandos", icon: GraduationCap, label: "Formandos" },
    { to: "/contatos", icon: Phone, label: "Contatos" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER INSTITUCIONAL */}
      <header className="sticky top-0 z-50 bg-white border-b border-yellow-400 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            {/* Logo e Identidade - AGORA VISÍVEL EM TODOS OS DISPOSITIVOS */}
            <div className="flex items-center gap-3 px-2">
  <Link
    to="/"
    className="flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-3 no-underline sm:text-left"
  >
    {/* TEXTO "CIEP" VISÍVEL SEMPRE */}
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
        CIEP
      </h1>

      <p className="text-sm sm:text-lg text-gray-600 font-medium leading-tight">
        Centro Integrado de Educação Pública
      </p>
    </div>
  </Link>
</div>


            {/* Navegação Desktop */}
            <nav className="hidden md:flex items-center gap-2">
              <ul className="flex items-center gap-9">
                {navigationItems.map((item) => (
                  <li key={item.to}>
                    <Link 
                      to={item.to} 
                      className="flex items-center text-sm font-medium text-gray-900 hover:text-orange-500 transition-colors uppercase tracking-wide"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Botão Admin Desktop */}
              <Link to="/admin" className="ml-8">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 text-sm font-semibold uppercase tracking-wide">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login Admin
                </Button>
              </Link>
            </nav>

            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
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
              )}
            </Button>
          </div>

          {/* Menu Mobile */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200 py-4">
              <ul className="flex flex-col space-y-4">
                {navigationItems.map((item) => (
                  <li key={item.to}>
                    <Link 
                      to={item.to} 
                      className="flex items-center px-4 py-3 text-gray-900 hover:text-orange-500 hover:bg-gray-50 transition-colors uppercase tracking-wide font-medium"
                      onClick={closeMobileMenu}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.label}
                    </Link>
                  </li>
                ))}
                
                {/* Separador e Botão Admin Mobile */}
                <li className="border-t border-gray-200 pt-4 mt-2">
                  <Link 
                    to="/admin" 
                    className="flex items-center justify-center px-4 py-3 mx-4 bg-orange-500 text-white hover:bg-orange-600 transition-colors rounded-md font-semibold uppercase tracking-wide"
                    onClick={closeMobileMenu}
                  >
                    <LogIn className="mr-2 h-5 w-5" />
                    Login Admin
                  </Link>
                </li>
              </ul>
            </div>
          )}
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
              <p className="text-gray-300 text-sm">Centro Integrado de Educação Pública</p>
            </div>

            {/* Links Footer */}
            <nav className="flex flex-wrap justify-center gap-6 mb-8">
              <Link 
                to="/" 
                className="text-sm font-medium text-gray-300 hover:text-orange-400 transition-colors"
                onClick={closeMobileMenu}
              >
                Inicio
              </Link>
              <Link 
                to="/contatos" 
                className="text-sm font-medium text-gray-300 hover:text-orange-400 transition-colors"
                onClick={closeMobileMenu}
              >
                Contatos
              </Link>
              <Link 
                to="/galeria" 
                className="text-sm font-medium text-gray-300 hover:text-orange-400 transition-colors"
                onClick={closeMobileMenu}
              >
                Galeria
              </Link>
              <Link 
                to="/eventos" 
                className="text-sm font-medium text-gray-300 hover:text-orange-400 transition-colors"
                onClick={closeMobileMenu}
              >
                Eventos
              </Link>
              <Link 
                to="/formandos" 
                className="text-sm font-medium text-gray-300 hover:text-orange-400 transition-colors"
                onClick={closeMobileMenu}
              >
                Formandos
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