import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface LightboxProps {
  imageUrl: string | null;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ imageUrl, onClose }) => {
  return (
    <AnimatePresence>
      {imageUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <button 
            className="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors"
            onClick={onClose}
          >
            <X className="w-8 h-8" />
          </button>
          <img 
            src={imageUrl} 
            alt="Preview" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            referrerPolicy="no-referrer"
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
