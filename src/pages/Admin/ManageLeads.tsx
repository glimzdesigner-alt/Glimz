import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Trash2, MessageCircle, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export const ManageLeads = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leadsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLeads(leadsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching leads:", error);
      toast.error("Erro ao carregar leads.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este lead?')) {
      try {
        await deleteDoc(doc(db, 'leads', id));
        toast.success('Lead excluído com sucesso!');
      } catch (error) {
        toast.error('Erro ao excluir lead.');
        console.error(error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Leads Capturados</h1>
        <div className="bg-zinc-900 px-4 py-2 rounded-lg border border-white/10">
          <span className="text-zinc-400">Total: </span>
          <span className="text-white font-bold">{leads.length}</span>
        </div>
      </div>

      <div className="grid gap-4">
        {leads.length === 0 ? (
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 text-center text-zinc-400">
            Nenhum lead capturado ainda.
          </div>
        ) : (
          leads.map((lead) => (
            <div key={lead.id} className="bg-zinc-900 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-white">{lead.name}</h3>
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-sm rounded-full font-medium">
                    {lead.service}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-zinc-400">
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {lead.whatsapp}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {lead.createdAt ? `${lead.createdAt.toDate().toLocaleDateString('pt-BR')} às ${lead.createdAt.toDate().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}` : 'Agora mesmo'}
                  </span>
                </div>

                <p className="text-zinc-300 mt-2 bg-zinc-950 p-3 rounded-lg border border-white/5">
                  {lead.description}
                </p>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <a
                  href={`https://wa.me/${lead.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
                <button
                  onClick={() => handleDelete(lead.id)}
                  className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
