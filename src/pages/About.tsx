import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Star, CheckCircle2, Code2, PenTool, LayoutTemplate } from 'lucide-react';

import { Lightbox } from '../components/Lightbox';

export const About = () => {
  const [settings, setSettings] = useState<any>(null);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsSnap, testimonialsSnap] = await Promise.all([
          getDoc(doc(db, 'settings', 'global')),
          getDocs(collection(db, 'testimonials'))
        ]);
        
        if (settingsSnap.exists()) {
          setSettings(settingsSnap.data());
        }
        
        const testData = testimonialsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        setTestimonials(testData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const aboutText = settings?.aboutText || 'Sou um designer apaixonado por criar experiências digitais que conectam marcas a pessoas. Com foco em usabilidade e estética, busco sempre a melhor solução para cada desafio.';
  const experience = settings?.experience || '5+ anos de experiência em design digital e direção de arte.';
  const toolsString = settings?.tools || 'Figma, Adobe XD, Photoshop, Illustrator, Webflow, React';
  const tools = toolsString.split(',').map((t: string) => t.trim());

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 space-y-24"
    >
      {/* About Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
            Muito prazer, sou <span className="text-emerald-400">{settings?.name || 'Designer'}</span>.
          </h1>
          <div className="text-lg text-zinc-400 space-y-6 leading-relaxed">
            {aboutText.split('\n').map((paragraph: string, i: number) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
          
          <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl flex items-start gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Experiência</h3>
              <p className="text-zinc-400">{experience}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="aspect-square rounded-3xl bg-zinc-900 border border-white/10 p-8 flex flex-col items-center justify-center text-center hover:bg-zinc-800 transition-colors">
              <PenTool className="w-12 h-12 text-emerald-400 mb-4" />
              <h3 className="font-bold text-lg mb-2">UI/UX Design</h3>
              <p className="text-sm text-zinc-500">Interfaces focadas no usuário</p>
            </div>
            <div className="aspect-[4/5] rounded-3xl bg-zinc-900 border border-white/10 p-8 flex flex-col items-center justify-center text-center hover:bg-zinc-800 transition-colors">
              <LayoutTemplate className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="font-bold text-lg mb-2">Web Design</h3>
              <p className="text-sm text-zinc-500">Sites modernos e responsivos</p>
            </div>
          </div>
          <div className="space-y-4 pt-12">
            <div className="aspect-[4/5] rounded-3xl bg-zinc-900 border border-white/10 p-8 flex flex-col items-center justify-center text-center hover:bg-zinc-800 transition-colors">
              <Code2 className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="font-bold text-lg mb-2">Prototipagem</h3>
              <p className="text-sm text-zinc-500">Interações de alta fidelidade</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Section */}
      <div className="border-t border-white/10 pt-24 text-center">
        <h2 className="text-3xl font-bold tracking-tighter mb-12">Ferramentas que domino</h2>
        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {tools.map((tool: string, index: number) => (
            <div 
              key={index}
              className="px-6 py-3 bg-zinc-900 border border-white/10 rounded-full text-zinc-300 font-medium hover:bg-white hover:text-black transition-colors cursor-default"
            >
              {tool}
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <div className="border-t border-white/10 pt-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tighter mb-4">O que dizem sobre mim</h2>
            <p className="text-zinc-400">Depoimentos de clientes que confiaram no meu trabalho.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-zinc-900 border border-white/10 p-8 rounded-3xl hover:bg-zinc-800 transition-colors">
                <div className="flex text-amber-400 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'fill-current' : 'text-zinc-700'}`} />
                  ))}
                </div>
                <p className="text-lg text-zinc-300 italic mb-8">"{testimonial.comment}"</p>
                <div className="flex items-center gap-4">
                  {testimonial.clientPhoto ? (
                    <img 
                      src={testimonial.clientPhoto} 
                      alt={testimonial.clientName} 
                      className="w-12 h-12 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity" 
                      referrerPolicy="no-referrer" 
                      onClick={() => setSelectedImage(testimonial.clientPhoto)}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-xl font-bold text-zinc-500">
                      {testimonial.clientName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-white">{testimonial.clientName}</h4>
                    <p className="text-sm text-zinc-500">Cliente</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Lightbox imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
    </motion.div>
  );
};
