import React from 'react';
import { Navbar } from './Navbar';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <footer className="bg-zinc-950 border-t border-white/10 py-8 text-center text-zinc-500 text-sm">
        <p>© {new Date().getFullYear()} Design Portfolio. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};
