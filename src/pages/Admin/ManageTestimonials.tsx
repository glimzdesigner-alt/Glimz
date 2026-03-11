import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { Plus, Edit2, Trash2, X, Star } from 'lucide-react';
import { toast } from 'sonner';

interface Testimonial {
  id: string;
  clientName: string;
  clientPhoto: string;
  rating: number;
  comment: string;
}

export const ManageTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhoto: '',
    rating: 5,
    comment: '',
  });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'testimonials'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
      setTestimonials(data);
    });
    return () => unsub();
  }, []);

  const handleOpenModal = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingId(testimonial.id);
      setFormData({
        clientName: testimonial.clientName,
        clientPhoto: testimonial.clientPhoto || '',
        rating: testimonial.rating,
        comment: testimonial.comment,
      });
    } else {
      setEditingId(null);
      setFormData({ clientName: '', clientPhoto: '', rating: 5, comment: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'testimonials', editingId), formData);
        toast.success('Depoimento atualizado com sucesso!');
      } else {
        await addDoc(collection(db, 'testimonials'), {
          ...formData,
          createdAt: serverTimestamp(),
        });
        toast.success('Depoimento criado com sucesso!');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Erro ao salvar depoimento.');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este depoimento?')) {
      try {
        await deleteDoc(doc(db, 'testimonials', id));
        toast.success('Depoimento excluído.');
      } catch (error) {
        toast.error('Erro ao excluir.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Depoimentos</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Depoimento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-zinc-900 border border-white/10 p-6 rounded-2xl relative group">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button onClick={() => handleOpenModal(testimonial)} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full text-white">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(testimonial.id)} className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-full">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              {testimonial.clientPhoto ? (
                <img src={testimonial.clientPhoto} alt={testimonial.clientName} className="w-12 h-12 rounded-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-xl font-bold text-zinc-500">
                  {testimonial.clientName.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="font-bold">{testimonial.clientName}</h3>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'fill-current' : 'text-zinc-700'}`} />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-zinc-400 italic">"{testimonial.comment}"</p>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{editingId ? 'Editar Depoimento' : 'Novo Depoimento'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Nome do Cliente</label>
                <input
                  type="text"
                  required
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">URL da Foto (Opcional)</label>
                <input
                  type="url"
                  value={formData.clientPhoto}
                  onChange={(e) => setFormData({ ...formData, clientPhoto: e.target.value })}
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Avaliação (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  required
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Comentário</label>
                <textarea
                  rows={4}
                  required
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-zinc-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
