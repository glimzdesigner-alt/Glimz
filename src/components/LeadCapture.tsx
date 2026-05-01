import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { collection, addDoc, serverTimestamp, getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'sonner';

export const LeadCapture = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShownExitIntent, setHasShownExitIntent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adminPhone, setAdminPhone] = useState('5511999999999'); // Default fallback
  
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    service: '',
    description: ''
  });

  useEffect(() => {
    // Fetch admin whatsapp from settings
    const fetchSettings = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'global'));
        if (docSnap.exists() && docSnap.data().whatsapp) {
          setAdminPhone(docSnap.data().whatsapp);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    // Exit intent logic
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShownExitIntent && !isOpen) {
        setIsOpen(true);
        setHasShownExitIntent(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasShownExitIntent, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Save to Firestore
      await addDoc(collection(db, 'leads'), {
        ...formData,
        createdAt: serverTimestamp()
      });

      // 2. Show success message
      toast.success('Solicitação enviada com sucesso!');
      setIsOpen(false);
      setFormData({ name: '', whatsapp: '', service: '', description: '' });

      // 3. Open WhatsApp
      const text = `Olá! Meu nome é ${formData.name}. Gostaria de solicitar um orçamento para ${formData.service}.\n\nDetalhes: ${formData.description}`;
      const encodedText = encodeURIComponent(text);
      const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodedText}`;
      window.open(whatsappUrl, '_blank');

    } catch (error) {
      console.error('Error saving lead:', error);
      toast.error('Erro ao enviar solicitação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-emerald-500 text-white p-4 rounded-full shadow-lg shadow-emerald-500/20 flex items-center justify-center group"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-medium group-hover:ml-2 group-hover:pr-2">
          Solicitar Orçamento
        </span>
      </motion.button>

      {/* Popup Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-zinc-900 border border-white/10 p-6 rounded-2xl shadow-2xl z-50 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Solicitar Orçamento</h3>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <p className="text-zinc-400 mb-6 text-sm">
                Preencha os dados abaixo e entrarei em contato via WhatsApp o mais rápido possível!
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Nome Completo</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors"
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">WhatsApp</label>
                  <input 
                    type="tel" 
                    name="whatsapp"
                    required
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors"
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Tipo de Serviço</label>
                  <select 
                    name="service"
                    required
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors appearance-none"
                  >
                    <option value="" disabled>Selecione um serviço...</option>
                    <option value="Identidade Visual">Identidade Visual & Logos</option>
                    <option value="Criação de Sites">Criação de Sites & Apps</option>
                    <option value="Materiais Impressos">Flyers & Materiais Impressos</option>
                    <option value="Social Media">Posts para Mídias Sociais</option>
                    <option value="Cardápios">Cardápios & Menus</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Descrição do Projeto</label>
                  <textarea 
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors resize-none"
                    placeholder="Conte-me um pouco sobre o que você precisa..."
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mt-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Enviar e Abrir WhatsApp
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
