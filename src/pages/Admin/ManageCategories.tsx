import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { Plus, Trash2, Pencil, Check, X, Tag } from 'lucide-react';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export const ManageCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'categories'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedCategories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      setCategories(fetchedCategories);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      await addDoc(collection(db, 'categories'), {
        name: newName.trim(),
        slug: newName.trim().toLowerCase().replace(/\s+/g, '-'),
        createdAt: serverTimestamp()
      });
      setNewName('');
      toast.success('Categoria adicionada!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao adicionar categoria');
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editValue.trim()) return;

    try {
      await updateDoc(doc(db, 'categories', id), {
        name: editValue.trim(),
        slug: editValue.trim().toLowerCase().replace(/\s+/g, '-')
      });
      setEditingId(null);
      toast.success('Categoria atualizada!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao atualizar categoria');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta categoria? Projetos vinculados a ela podem precisar de atualização manual.')) return;

    try {
      await deleteDoc(doc(db, 'categories', id));
      toast.success('Categoria excluída!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao excluir categoria');
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-emerald-500/10 rounded-2xl">
          <Tag className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Categorias</h1>
          <p className="text-zinc-500">Gerencie as categorias dos seus projetos</p>
        </div>
      </div>

      <form onSubmit={handleCreate} className="flex gap-3 mb-12">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nova categoria (ex: Landing Page)"
          className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        />
        <button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Adicionar
        </button>
      </form>

      {loading ? (
        <div className="text-center py-12 text-zinc-500">Carregando...</div>
      ) : (
        <div className="grid gap-3">
          {categories.map((cat) => (
            <motion.div
              layout
              key={cat.id}
              className="bg-zinc-900/50 border border-white/5 rounded-2xl px-6 py-4 flex items-center justify-between group hover:bg-zinc-900 transition-colors"
            >
              {editingId === cat.id ? (
                <div className="flex items-center gap-3 flex-1">
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1 bg-zinc-800 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleUpdate(cat.id)}
                      className="p-2 text-emerald-400 hover:bg-emerald-400/10 rounded-lg"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setEditingId(null)}
                      className="p-2 text-zinc-400 hover:bg-zinc-400/10 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <span className="text-lg font-medium text-white">{cat.name}</span>
                    <span className="ml-3 text-xs text-zinc-600 font-mono">slug: {cat.slug}</span>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => { setEditingId(cat.id); setEditValue(cat.name); }}
                      className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(cat.id)}
                      className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          ))}

          {categories.length === 0 && (
            <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-dashed border-white/10">
              <Tag className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
              <p className="text-zinc-500">Nenhuma categoria cadastrada.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
