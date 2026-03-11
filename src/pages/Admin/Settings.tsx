import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

export const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    description: '',
    heroText: '',
    heroImage: '',
    aboutText: '',
    experience: '',
    specialties: '',
    tools: '',
    whatsapp: '',
    email: '',
    instagram: '',
    logoUrl: '',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'global');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData(prev => ({ ...prev, ...docSnap.data() }));
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setDoc(doc(db, 'settings', 'global'), formData);
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Configurações do Site</h1>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Informações Básicas */}
        <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold border-b border-white/10 pb-4 mb-4">Informações Básicas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Nome Profissional</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Cargo / Especialidade</label>
              <input type="text" name="role" value={formData.role} onChange={handleChange} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-emerald-500 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-400 mb-1">URL da Logo</label>
              <input type="url" name="logoUrl" value={formData.logoUrl} onChange={handleChange} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-emerald-500 outline-none" />
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold border-b border-white/10 pb-4 mb-4">Página Inicial (Hero)</h2>
          
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Frase de Impacto</label>
            <input type="text" name="heroText" value={formData.heroText} onChange={handleChange} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-emerald-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Breve Descrição</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-emerald-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">URL da Foto Principal (Hero)</label>
            <input type="url" name="heroImage" value={formData.heroImage} onChange={handleChange} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-emerald-500 outline-none" />
          </div>
        </div>

        {/* Sobre Mim */}
        <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold border-b border-white/10 pb-4 mb-4">Sobre Mim</h2>
          
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Texto Sobre Mim</label>
            <textarea name="aboutText" value={formData.aboutText} onChange={handleChange} rows={5} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-emerald-500 outline-none" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Experiência (Anos ou Descrição)</label>
              <input type="text" name="experience" value={formData.experience} onChange={handleChange} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Ferramentas (separadas por vírgula)</label>
              <input type="text" name="tools" value={formData.tools} onChange={handleChange} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-emerald-500 outline-none" />
            </div>
          </div>
        </div>

        {/* Contato e Redes Sociais */}
        <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold border-b border-white/10 pb-4 mb-4">Contato e Redes Sociais</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">WhatsApp (Apenas números + DDI)</label>
              <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleChange} placeholder="Ex: 5511999999999" className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-emerald-500 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-400 mb-1">Instagram (URL completa)</label>
              <input type="url" name="instagram" value={formData.instagram} onChange={handleChange} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-emerald-500 outline-none" />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
