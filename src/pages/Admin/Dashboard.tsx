import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { FolderKanban, MessageSquare, Star, Database } from 'lucide-react';
import { toast } from 'sonner';

export const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    projects: 0,
    testimonials: 0,
    messages: 0,
  });

  const fetchStats = async () => {
    try {
      const [projectsSnap, testimonialsSnap, messagesSnap] = await Promise.all([
        getDocs(collection(db, 'projects')),
        getDocs(collection(db, 'testimonials')),
        getDocs(collection(db, 'messages')),
      ]);

      setStats({
        projects: projectsSnap.size,
        testimonials: testimonialsSnap.size,
        messages: messagesSnap.size,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSeedData = async () => {
    setLoading(true);
    try {
      // Seed Settings
      await setDoc(doc(db, 'settings', 'global'), {
        name: 'Glimz!',
        role: 'Designer Independente',
        heroText: 'Transformando ideias em experiências digitais inesquecíveis.',
        description: 'Especialista em criar interfaces modernas, intuitivas e focadas na conversão.',
        experience: '5',
        aboutText: 'Sou um designer apaixonado por criar experiências digitais...',
        tools: 'Figma, Adobe XD, Photoshop, React',
        whatsapp: '5511999999999',
        email: 'contato@glimz.com.br',
        instagram: 'https://instagram.com/glimz',
        heroImages: [
          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2670&auto=format&fit=crop'
        ]
      });

      toast.success('Dados iniciais criados com sucesso!');
      fetchStats();
    } catch (error) {
      console.error("Error seeding data:", error);
      toast.error('Erro ao criar dados iniciais.');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { name: 'Total de Projetos', value: stats.projects, icon: FolderKanban, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { name: 'Depoimentos', value: stats.testimonials, icon: Star, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { name: 'Mensagens', value: stats.messages, icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-zinc-900 border border-white/10 p-6 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm font-medium">{stat.name}</p>
                  <p className="text-4xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                  <Icon className="w-8 h-8" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
