import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, MessageCircle, PenTool, MonitorSmartphone, FileText, Share2, Utensils, Plus, Star } from 'lucide-react';
import { doc, getDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';

import { Lightbox } from '../components/Lightbox';

export const Home = () => {
  const [settings, setSettings] = useState<any>(null);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Settings
        const docSnap = await getDoc(doc(db, 'settings', 'global'));
        if (docSnap.exists()) {
          setSettings(docSnap.data());
        }

        // Fetch Testimonials
        const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'), limit(6));
        const querySnapshot = await getDocs(q);
        const fetchedTestimonials = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTestimonials(fetchedTestimonials);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const defaultImage = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop';
  const heroImages = settings?.heroImages?.length > 0 
    ? settings.heroImages 
    : (settings?.heroImage ? [settings.heroImage] : [defaultImage]);

  useEffect(() => {
    if (heroImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
      }, 5000); // Change image every 5 seconds
      return () => clearInterval(interval);
    }
  }, [heroImages.length]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const name = settings?.name || 'Glimz!';
  const role = settings?.role || 'Designer Independente';
  const heroText = settings?.heroText || 'Transformando ideias em experiências digitais inesquecíveis.';
  const description = settings?.description || 'Especialista em criar interfaces modernas, intuitivas e focadas na conversão para marcas que desejam se destacar no mercado digital.';

  const services = [
    { icon: PenTool, title: 'IDENTIDADE DE MARCA & LOGOS' },
    { icon: MonitorSmartphone, title: 'CRIAÇÃO DE SITES & APPS (WEB/ANDROID)' },
    { icon: FileText, title: 'FLYERS & MATERIAIS IMPRESSOS' },
    { icon: Share2, title: 'POSTS PARA MÍDIAS SOCIAIS' },
    { icon: Utensils, title: 'CARDÁPIOS & MENUS' },
    { icon: Plus, title: 'E MUITO MAIS...' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 space-y-32"
    >
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Disponível para novos projetos
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight mb-4">
              {heroText}
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 max-w-xl">
              {description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link 
              to="/portfolio"
              className="inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-zinc-200 transition-colors group"
            >
              Ver Portfólio
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-zinc-900 border border-white/10 text-white px-8 py-4 rounded-full font-semibold hover:bg-zinc-800 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Entrar em Contato
            </Link>
          </div>

          <div className="pt-8 border-t border-white/10 flex items-center gap-6">
            <div>
              <p className="text-3xl font-bold text-white">+{settings?.experience || '5'}</p>
              <p className="text-sm text-zinc-500">Anos de Experiência</p>
            </div>
            <div className="w-px h-12 bg-white/10"></div>
            <div>
              <p className="text-3xl font-bold text-white">100+</p>
              <p className="text-sm text-zinc-500">Projetos Entregues</p>
            </div>
          </div>
        </motion.div>

        {/* Image Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative"
        >
          <div className="aspect-[4/5] md:aspect-square rounded-[2rem] overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
            
            <AnimatePresence mode="wait">
              <motion.img 
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                src={heroImages[currentImageIndex]} 
                alt={name} 
                className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                referrerPolicy="no-referrer"
                onClick={() => setSelectedImage(heroImages[currentImageIndex])}
              />
            </AnimatePresence>

            <div className="absolute bottom-8 left-8 z-20">
              <p className="text-2xl font-bold text-white">{name}</p>
              <p className="text-emerald-400 font-medium">{role}</p>
            </div>

            {/* Carousel Indicators */}
            {heroImages.length > 1 && (
              <div className="absolute bottom-8 right-8 z-20 flex gap-2">
                {heroImages.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-6 bg-emerald-500' : 'w-2 bg-white/30'}`}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
        </motion.div>

      </div>

      {/* Services Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="pt-12 border-t border-white/10"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">O QUE EU FAÇO:</h2>
          <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-zinc-900/50 border border-white/5 p-8 rounded-2xl hover:bg-zinc-900 transition-colors group"
              >
                <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                  <Icon className="w-7 h-7 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white">{service.title}</h3>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="pt-12 border-t border-white/10"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">O QUE DIZEM SOBRE MIM:</h2>
            <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-zinc-900/50 border border-white/5 p-8 rounded-2xl hover:bg-zinc-900 transition-colors flex flex-col"
              >
                <div className="flex items-center gap-4 mb-6">
                  {testimonial.clientPhoto ? (
                    <img 
                      src={testimonial.clientPhoto} 
                      alt={testimonial.clientName} 
                      className="w-14 h-14 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity" 
                      referrerPolicy="no-referrer" 
                      onClick={() => setSelectedImage(testimonial.clientPhoto)}
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xl">
                      {testimonial.clientName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-white">{testimonial.clientName}</h3>
                    <div className="flex gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-600'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-zinc-400 italic flex-1">"{testimonial.comment}"</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <Lightbox imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
    </motion.div>
  );
};
