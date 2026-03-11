import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { FolderKanban, MessageSquare, Star } from 'lucide-react';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    testimonials: 0,
    messages: 0,
  });

  useEffect(() => {
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

    fetchStats();
  }, []);

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
