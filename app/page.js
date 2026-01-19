'use client';

import { useState } from 'react';
import { Sparkles, ChefHat, Trash2, Clock, BookOpen, X, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // Importando a mágica da animação
import { ingredientes, receitas } from './data';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [pantry] = useState(ingredientes);
  const [craftResult, setCraftResult] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [xp, setXp] = useState(0); // Estado para o XP Acumulado

  // --- DRAG AND DROP ---
  const handleDragStart = (e, item, source) => {
    e.dataTransfer.setData('item', JSON.stringify(item));
    e.dataTransfer.setData('source', source);
  };

  const handleDropOnInventory = (e) => {
    e.preventDefault();
    const itemData = JSON.parse(e.dataTransfer.getData('item'));
    const source = e.dataTransfer.getData('source');

    if (source === 'inventory') return;
    if (inventory.length >= 4) return;
    if (inventory.some(i => i.id === itemData.id)) return;

    const newInventory = [...inventory, itemData];
    setInventory(newInventory);
    checkRecipes(newInventory);
  };

  const handleDropOnPantry = (e) => {
    e.preventDefault();
    const source = e.dataTransfer.getData('source');
    
    if (source === 'inventory') {
      const itemData = JSON.parse(e.dataTransfer.getData('item'));
      const indexToRemove = inventory.findIndex(i => i.id === itemData.id);
      if (indexToRemove > -1) {
        const newInventory = [...inventory];
        newInventory.splice(indexToRemove, 1);
        setInventory(newInventory);
        checkRecipes(newInventory);
      }
    }
  };

  const allowDrop = (e) => e.preventDefault();

  // --- LÓGICA ---
  const checkRecipes = (currentInventory) => {
    const invIds = currentInventory.map(i => i.id);
    const found = receitas.find(recipe => {
      const hasAllIngredients = recipe.ingredients.every(ing => invIds.includes(ing));
      const isExactMatch = recipe.ingredients.length === invIds.length;
      return hasAllIngredients && isExactMatch;
    });
    setCraftResult(found || null);
  };

  // Função para "Consumir" a receita e ganhar XP
  const handleCraftComplete = () => {
    if (craftResult) {
      setXp(prev => prev + craftResult.xp);
      setSelectedRecipe(craftResult);
      // Opcional: Limpar inventário após craftar
      // setInventory([]); 
      // setCraftResult(null);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-rpg-bg text-white font-mono relative overflow-hidden">
      
      {/* BACKGROUND DECORATION (Vibe Coding) */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rpg-accent to-blue-500 opacity-50"></div>

      {/* HEADER & XP BAR */}
      <header className="mb-8 text-center w-full max-w-md">
        <div className="flex justify-between items-end mb-4 px-2">
            <h1 className="text-2xl font-bold flex items-center gap-2">
            <ChefHat className="text-rpg-accent" /> Inventory Cook
            </h1>
            <div className="text-xs text-slate-400 flex items-center gap-1">
                <Trophy size={14} className="text-yellow-500"/> Lvl {Math.floor(xp / 100) + 1}
            </div>
        </div>
        
        {/* Barra de XP */}
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-2 border border-slate-700">
            <motion.div 
                className="h-full bg-gradient-to-r from-rpg-accent to-purple-400"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((xp % 1000) / 10, 100)}%` }}
                transition={{ type: "spring", stiffness: 50 }}
            />
        </div>
        <p className="text-slate-500 text-xs text-right">{xp} XP Total</p>
      </header>

      {/* ÁREA DE CRAFTING (INVENTÁRIO) */}
      <div 
        className={`
          relative w-full max-w-md h-40 rounded-xl border-4 border-dashed transition-all duration-300 flex items-center justify-center gap-4 p-4 mb-4
          ${inventory.length > 0 ? 'border-rpg-accent bg-slate-800/30' : 'border-slate-700 bg-slate-900/50'}
        `}
        onDrop={handleDropOnInventory}
        onDragOver={allowDrop}
      >
        {/* SLOTS VAZIOS (Visual RPG) */}
        <div className="absolute inset-0 flex items-center justify-center gap-4 pointer-events-none opacity-30">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="w-16 h-16 rounded-lg bg-black/40 shadow-inner border border-white/5"></div>
            ))}
        </div>

        {inventory.length === 0 && (
          <span className="text-slate-600 text-sm absolute pointer-events-none animate-pulse">
            Arraste ingredientes aqui...
          </span>
        )}

        {/* ITENS COM FRAMER MOTION */}
        <AnimatePresence>
            {inventory.map((item, index) => (
            <motion.div 
                key={`${item.id}-${index}`}
                layoutId={item.id} // Animação mágica de posição
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.1, cursor: 'grab' }}
                whileTap={{ scale: 0.95 }}
                draggable
                onDragStart={(e) => handleDragStart(e, item, 'inventory')}
                className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center text-3xl shadow-lg border-2 border-slate-500 relative z-10"
            >
                {item.icon}
            </motion.div>
            ))}
        </AnimatePresence>

        {/* BOTÃO DE RESULTADO */}
        <AnimatePresence>
            {craftResult && (
            <motion.button 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                onClick={handleCraftComplete} // Agora ganha XP ao clicar!
                className="absolute -top-6 bg-green-500 text-black px-6 py-2 rounded-full font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.6)] hover:bg-green-400 z-20"
            >
                <Sparkles size={16} /> CRAFTAR: {craftResult.name}
            </motion.button>
            )}
        </AnimatePresence>
      </div>

      {/* BOTÃO LIMPAR */}
      {inventory.length > 0 && (
        <button 
          onClick={() => { setInventory([]); setCraftResult(null); }}
          className="mb-8 text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors opacity-70 hover:opacity-100"
        >
          <Trash2 size={14} /> Limpar Caldeirão
        </button>
      )}

      {/* LOJA (DESPENSA) */}
      <div className="w-full max-w-md border-t border-slate-700/50 pt-6 relative">
        <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-rpg-bg px-2 text-slate-500 text-xs uppercase tracking-widest font-bold">
          Despensa
        </span>
        
        <div 
          className="grid grid-cols-4 gap-3"
          onDrop={handleDropOnPantry}
          onDragOver={allowDrop}
        >
          {pantry.map((item) => (
            <motion.div
              key={item.id}
              draggable
              layoutId={`store-${item.id}`}
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(30, 41, 59, 1)' }}
              whileTap={{ scale: 0.95 }}
              onDragStart={(e) => handleDragStart(e, item, 'pantry')}
              className={`
                aspect-square rounded-xl flex flex-col items-center justify-center gap-1 cursor-grab active:cursor-grabbing
                bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm transition-colors
                ${item.rarity === 'rare' ? 'border-purple-500/30 bg-purple-500/5' : ''}
                ${item.rarity === 'legendary' ? 'border-yellow-500/50 bg-yellow-500/5' : ''}
              `}
            >
              <span className="text-2xl drop-shadow-md filter">{item.icon}</span>
              <span className={`text-[10px] font-bold uppercase text-center ${
                item.rarity === 'legendary' ? 'text-yellow-400' : 
                item.rarity === 'rare' ? 'text-purple-400' : 'text-slate-500'
              }`}>
                {item.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {selectedRecipe && (
            <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-md"
            onClick={() => setSelectedRecipe(null)}
            >
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl p-6 relative shadow-2xl" 
                onClick={e => e.stopPropagation()}
            >
                <button 
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
                >
                <X size={24} />
                </button>

                <div className="text-center mb-6">
                <span className="inline-block bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full mb-2 uppercase tracking-wider">
                    Sucesso!
                </span>
                <h2 className="text-3xl font-bold text-white mb-1">{selectedRecipe.name}</h2>
                <p className="text-slate-400 text-sm italic">"{selectedRecipe.desc}"</p>
                </div>

                <div className="flex justify-center gap-6 mb-8 border-y border-slate-800 py-4">
                <div className="flex items-center gap-2 text-yellow-400">
                    <Sparkles size={18} />
                    <span className="font-bold">+{selectedRecipe.xp} XP Ganho</span>
                </div>
                <div className="flex items-center gap-2 text-blue-400">
                    <Clock size={18} />
                    <span className="font-bold">{selectedRecipe.time}</span>
                </div>
                </div>

                <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                    <BookOpen size={20} className="text-rpg-accent" /> Preparo
                </h3>
                <ul className="space-y-3">
                    {selectedRecipe.steps.map((step, idx) => (
                    <li key={idx} className="flex gap-3 text-slate-300 text-sm">
                        <span className="bg-slate-800 w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full text-xs font-bold text-slate-500">
                        {idx + 1}
                        </span>
                        {step}
                    </li>
                    ))}
                </ul>
                </div>

                <button 
                onClick={() => setSelectedRecipe(null)}
                className="w-full mt-8 bg-rpg-accent hover:bg-violet-500 text-white font-bold py-3 rounded-xl transition-colors"
                >
                Continuar Cozinhando
                </button>
            </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
