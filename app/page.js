'use client';

import { useState, useEffect } from 'react';
import { Sparkles, ChefHat, Trash2, Clock, BookOpen, X, Trophy, Share2, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ingredientes, receitas } from './data';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [pantry] = useState(ingredientes);
  const [craftResult, setCraftResult] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  
  // Persistência: XP e Receitas Desbloqueadas
  const [xp, setXp] = useState(0);
  const [unlockedRecipes, setUnlockedRecipes] = useState([]);

  // --- AUDIO SYSTEM ---
  // Dica: Crie uma pasta 'public/sounds' e coloque arquivos mp3 lá
  const playSound = (type) => {
    const sounds = {
      pop: '/sounds/pop.mp3',      // Som ao soltar item
      craft: '/sounds/craft.mp3',  // Som de sucesso/level up
      trash: '/sounds/trash.mp3',  // Som de limpar
    };
    
    // Verifica se o áudio existe antes de tocar (evita erro no console se você não tiver os arquivos ainda)
    const audio = new Audio(sounds[type]);
    audio.volume = 0.5;
    audio.play().catch(() => {}); // Ignora erro se o arquivo não existir
  };

  // --- PERSISTÊNCIA (LOAD) ---
  useEffect(() => {
    const savedData = localStorage.getItem('rpg-cook-save');
    if (savedData) {
      const { xp: savedXp, unlocked: savedUnlocked } = JSON.parse(savedData);
      setXp(savedXp || 0);
      setUnlockedRecipes(savedUnlocked || []);
    }
  }, []);

  // --- PERSISTÊNCIA (SAVE) ---
  useEffect(() => {
    localStorage.setItem('rpg-cook-save', JSON.stringify({ xp, unlocked: unlockedRecipes }));
  }, [xp, unlockedRecipes]);


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
    // REMOVIDO: Limite de 4 itens (Agora é infinito!)
    // if (inventory.length >= 4) return;
    
    // Evita duplicatas exatas de ID para não quebrar as keys do React
    if (inventory.some(i => i.id === itemData.id)) return;

    playSound('pop'); // Toca som
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

  // --- LÓGICA DE CRAFTING ---
  const checkRecipes = (currentInventory) => {
    const invIds = currentInventory.map(i => i.id);
    const found = receitas.find(recipe => {
      const hasAllIngredients = recipe.ingredients.every(ing => invIds.includes(ing));
      const isExactMatch = recipe.ingredients.length === invIds.length;
      return hasAllIngredients && isExactMatch;
    });
    setCraftResult(found || null);
  };

  const handleCraftComplete = () => {
    if (craftResult) {
      playSound('craft');
      setXp(prev => prev + craftResult.xp);
      
      // Salva receita desbloqueada se for nova
      if (!unlockedRecipes.includes(craftResult.name)) {
        setUnlockedRecipes(prev => [...prev, craftResult.name]);
      }

      setSelectedRecipe(craftResult);
    }
  };

  // --- SOCIAL SHARE ---
  const handleShare = () => {
    const text = `🍳 Acabei de craftar ${selectedRecipe.name} no Inventory Cook! \nNível de Chef: ${Math.floor(xp / 100) + 1} \nXP Total: ${xp}\n\nJogue agora: [Seu Link Vercel Aqui]`;
    navigator.clipboard.writeText(text);
    alert('Stats copiados para a área de transferência! Cole no Twitter/WhatsApp.');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-rpg-bg text-white font-mono relative overflow-hidden selection:bg-rpg-accent selection:text-white">
      
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rpg-accent to-blue-500 opacity-50 shadow-[0_0_20px_rgba(139,92,246,0.5)]"></div>

      {/* HEADER & XP BAR */}
      <header className="mb-6 text-center w-full max-w-md z-10">
        <div className="flex justify-between items-end mb-4 px-2">
            <h1 className="text-2xl font-bold flex items-center gap-2 drop-shadow-lg">
            <ChefHat className="text-rpg-accent" /> Inventory Cook
            </h1>
            <div className="text-xs text-slate-400 flex flex-col items-end">
                <span className="flex items-center gap-1 text-yellow-500 font-bold"><Trophy size={14}/> Lvl {Math.floor(xp / 100) + 1}</span>
                <span className="text-[10px] opacity-60">Receitas: {unlockedRecipes.length}/{receitas.length}</span>
            </div>
        </div>
        
        {/* Barra de XP */}
        <div className="w-full h-3 bg-slate-900/80 rounded-full overflow-hidden mb-2 border border-slate-700/50 backdrop-blur-sm relative">
            <motion.div 
                className="h-full bg-gradient-to-r from-rpg-accent to-purple-400 relative"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((xp % 1000) / 10, 100)}%` }}
                transition={{ type: "spring", stiffness: 50 }}
            >
               <div className="absolute top-0 right-0 h-full w-2 bg-white/30 animate-pulse"></div>
            </motion.div>
        </div>
        <p className="text-slate-500 text-[10px] text-right font-bold tracking-wider">{xp} XP TOTAL</p>
      </header>

      {/* CALDEIRÃO MÁGICO (INVENTÁRIO) */}
      <div 
        className={`
          relative w-full max-w-md min-h-[160px] rounded-2xl border-4 border-dashed transition-all duration-500 flex flex-wrap content-center justify-center gap-4 p-6 mb-4
          ${inventory.length > 0 ? 'border-rpg-accent bg-slate-800/40 shadow-[inset_0_0_40px_rgba(139,92,246,0.1)]' : 'border-slate-700 bg-slate-900/50'}
        `}
        onDrop={handleDropOnInventory}
        onDragOver={allowDrop}
      >
        {/* Placeholder Visual */}
        {inventory.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
             <ChefHat size={80} className="text-slate-500" />
          </div>
        )}

        {inventory.length === 0 && (
          <span className="text-slate-500 text-sm absolute bottom-4 pointer-events-none animate-bounce">
            Arraste ingredientes para o caldeirão...
          </span>
        )}

        {/* ITENS NO CALDEIRÃO (Com rotação aleatória para efeito "pilha") */}
        <AnimatePresence mode='popLayout'>
            {inventory.map((item, index) => (
            <motion.div 
                key={`${item.id}`}
                layoutId={item.id}
                initial={{ scale: 0, rotate: Math.random() * 180 }} // Entra girando
                animate={{ scale: 1, rotate: Math.random() * 20 - 10 }} // Fica levemente torto (natural)
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.2, rotate: 0, zIndex: 10 }} // Fica reto ao passar o mouse
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} // Leve física de drag
                onDragStart={(e) => handleDragStart(e, item, 'inventory')}
                className="w-16 h-16 bg-slate-700/90 backdrop-blur-md rounded-xl flex items-center justify-center text-3xl shadow-xl border border-slate-500/50 cursor-grab active:cursor-grabbing relative"
            >
                {item.icon}
            </motion.div>
            ))}
        </AnimatePresence>

        {/* BOTÃO DE CRAFT (Aparece flutuando) */}
        <AnimatePresence>
            {craftResult && (
            <motion.button 
                initial={{ scale: 0, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0, y: 20 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCraftComplete}
                className="absolute -bottom-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-full font-black flex items-center gap-2 shadow-[0_0_30px_rgba(34,197,94,0.5)] z-30 border-2 border-white/20"
            >
                <Sparkles size={20} className="animate-spin-slow" /> 
                CRAFTAR {craftResult.name.toUpperCase()}
            </motion.button>
            )}
        </AnimatePresence>
      </div>

      {/* BOTÃO LIMPAR */}
      {inventory.length > 0 && (
        <button 
          onClick={() => { playSound('trash'); setInventory([]); setCraftResult(null); }}
          className="mb-8 text-xs text-red-400 hover:text-red-300 flex items-center gap-2 transition-colors opacity-60 hover:opacity-100 bg-red-900/20 px-4 py-2 rounded-full"
        >
          <Trash2 size={14} /> Esvaziar Panela
        </button>
      )}

      {/* LOJA (DESPENSA) */}
      <div className="w-full max-w-md border-t border-slate-700/50 pt-6 relative">
        <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-rpg-bg px-4 text-slate-500 text-xs uppercase tracking-[0.2em] font-bold">
          Despensa
        </span>
        
        <div 
          className="grid grid-cols-4 gap-3 pb-12"
          onDrop={handleDropOnPantry}
          onDragOver={allowDrop}
        >
          {pantry.map((item) => (
            <motion.div
              key={item.id}
              draggable
              layoutId={`store-${item.id}`}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onDragStart={(e) => handleDragStart(e, item, 'pantry')}
              className={`
                aspect-square rounded-xl flex flex-col items-center justify-center gap-1 cursor-grab active:cursor-grabbing
                bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm transition-all
                hover:bg-slate-700/60 hover:border-slate-500
                ${item.rarity === 'rare' ? 'border-purple-500/20 bg-purple-500/5' : ''}
                ${item.rarity === 'legendary' ? 'border-yellow-500/30 bg-yellow-500/5 shadow-[0_0_15px_rgba(234,179,8,0.1)]' : ''}
              `}
            >
              <span className="text-3xl drop-shadow-md filter grayscale-[0.2] hover:grayscale-0 transition-all">{item.icon}</span>
              <span className={`text-[9px] font-bold uppercase text-center tracking-wide ${
                item.rarity === 'legendary' ? 'text-yellow-500' : 
                item.rarity === 'rare' ? 'text-purple-400' : 'text-slate-500'
              }`}>
                {item.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* MODAL DE SUCESSO */}
      <AnimatePresence>
        {selectedRecipe && (
            <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-md"
            onClick={() => setSelectedRecipe(null)}
            >
            <motion.div 
                initial={{ scale: 0.5, y: 100, opacity: 0 }} 
                animate={{ scale: 1, y: 0, opacity: 1 }} 
                exit={{ scale: 0.8, y: 50, opacity: 0 }}
                className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl p-8 relative shadow-2xl overflow-hidden" 
                onClick={e => e.stopPropagation()}
            >
                {/* Efeito de brilho de fundo */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-green-500/20 to-transparent pointer-events-none"></div>

                <button 
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-4 right-4 p-2 bg-slate-800/50 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                <X size={20} />
                </button>

                <div className="text-center mb-8 relative z-10">
                <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
                    className="inline-flex items-center gap-2 bg-green-500 text-black text-xs font-black px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                >
                    <Sparkles size={14} /> Recipe Unlocked
                </motion.div>
                <h2 className="text-4xl font-black text-white mb-2">{selectedRecipe.name}</h2>
                <p className="text-slate-400 text-sm font-medium">"{selectedRecipe.desc}"</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-slate-800/50 rounded-2xl p-4 flex flex-col items-center justify-center border border-slate-700/50">
                        <span className="text-yellow-500 font-black text-2xl">+{selectedRecipe.xp}</span>
                        <span className="text-slate-500 text-[10px] uppercase tracking-widest">XP Ganho</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-2xl p-4 flex flex-col items-center justify-center border border-slate-700/50">
                        <span className="text-blue-400 font-black text-2xl">{selectedRecipe.time}</span>
                        <span className="text-slate-500 text-[10px] uppercase tracking-widest">Tempo</span>
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-300 uppercase tracking-wider">
                    <BookOpen size={16} className="text-rpg-accent" /> Modo de Preparo
                </h3>
                <ul className="space-y-3">
                    {selectedRecipe.steps.map((step, idx) => (
                    <li key={idx} className="flex gap-4 text-slate-300 text-sm leading-relaxed">
                        <span className="bg-slate-800 w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full text-[10px] font-bold text-slate-500 border border-slate-700">
                        {idx + 1}
                        </span>
                        {step}
                    </li>
                    ))}
                </ul>
                </div>

                <div className="flex gap-3">
                    <button 
                    onClick={handleShare}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                    <Share2 size={18} /> Compartilhar
                    </button>
                    <button 
                    onClick={() => setSelectedRecipe(null)}
                    className="flex-[2] bg-rpg-accent hover:bg-violet-500 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-purple-900/20"
                    >
                    Continuar Cozinhando
                    </button>
                </div>

            </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
