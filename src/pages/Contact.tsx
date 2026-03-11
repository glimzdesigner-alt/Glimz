import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Mail, MessageCircle, Instagram, Send } from 'lucide-react';
import { toast } from 'sonner';

export const Contact = () => {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'global'));
        if (docSnap.exists()) {
          setSettings(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      toast.success('Mensagem enviada com sucesso! Entrarei em contato em breve.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error('Erro ao enviar mensagem. Tente novamente.');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const whatsapp = settings?.whatsapp || '';
  const email = settings?.email || '';
  const instagram = settings?.instagram || '';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Contact Info */}
        <div className="space-y-12">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">Vamos conversar?</h1>
            <p className="text-xl text-zinc-400 max-w-md">
              Tem um projeto em mente ou quer apenas dizer um olá? Fique à vontade para entrar em contato.
            </p>
          </div>

          <div className="space-y-6">
            {whatsapp && (
              <a 
                href={`https://wa.me/${whatsapp}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-6 p-6 bg-zinc-900 border border-white/10 rounded-3xl hover:bg-zinc-800 transition-colors group"
              >
                <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">WhatsApp</h3>
                  <p className="text-zinc-400">Me mande uma mensagem</p>
                </div>
              </a>
            )}

            {email && (
              <a 
                href={`mailto:${email}`} 
                className="flex items-center gap-6 p-6 bg-zinc-900 border border-white/10 rounded-3xl hover:bg-zinc-800 transition-colors group"
              >
                <div className="p-4 bg-blue-500/10 text-blue-400 rounded-2xl group-hover:scale-110 transition-transform">
                  <Mail className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">E-mail</h3>
                  <p className="text-zinc-400">{email}</p>
                </div>
              </a>
            )}

            {instagram && (
              <a 
                href={instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-6 p-6 bg-zinc-900 border border-white/10 rounded-3xl hover:bg-zinc-800 transition-colors group"
              >
                <div className="p-4 bg-pink-500/10 text-pink-400 rounded-2xl group-hover:scale-110 transition-transform">
                  <Instagram className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Instagram</h3>
                  <p className="text-zinc-400">Acompanhe meu dia a dia</p>
                </div>
              </a>
            )}
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-zinc-900 border border-white/10 p-8 md:p-12 rounded-[2.5rem]">
          <h2 className="text-3xl font-bold tracking-tighter mb-8">Envie uma mensagem</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Seu Nome</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="Como devo te chamar?"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Seu E-mail</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Sua Mensagem</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                placeholder="Conte-me sobre o seu projeto..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  Enviar Mensagem
                  <Send className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </motion.div>
  );
};
