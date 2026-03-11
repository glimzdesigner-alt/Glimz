import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, MessageSquare, Settings as SettingsIcon, LogOut, Star, Menu, X, Home, Users } from 'lucide-react';
import { logOut } from '../../firebase';

export const AdminLayout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Projetos', path: '/admin/projects', icon: FolderKanban },
    { name: 'Depoimentos', path: '/admin/testimonials', icon: Star },
    { name: 'Leads', path: '/admin/leads', icon: Users },
    { name: 'Configurações', path: '/admin/settings', icon: SettingsIcon },
  ];

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-zinc-950 text-zinc-50">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-zinc-900 border-b border-white/10 sticky top-0 z-40">
        <h2 className="text-xl font-bold tracking-tight">Admin Panel</h2>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-zinc-400 hover:text-white"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Admin Panel</h2>
          <button className="md:hidden text-zinc-400 hover:text-white" onClick={closeMenu}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={closeMenu}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-emerald-500/10 text-emerald-400' 
                    : 'text-zinc-400 hover:text-zinc-50 hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-emerald-400/10 transition-colors"
          >
            <Home className="w-5 h-5" />
            Voltar ao Site
          </Link>
          <button
            onClick={logOut}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto w-full">
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
