'use client';

import { useState, useEffect } from 'react';
import { Sparkles, ChefHat, Trash2, Clock, BookOpen, X, Trophy, Share2, Sun, Moon, RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ingredientes, receitas } from './data';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [pantry] = useState(ingredientes);
  const [craftResult, setCraftResult] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [xp, setXp] = useState(0);
  const [unlockedRecipes, setUnlockedRecipes] = useState([]);
  
  // Novos Estados
  const [isNight, setIsNight] = useState(true);
  const [isShaking, setIsShaking] = useState(false); // Para animação de erro

  // --- AUDIO SYSTEM ---
  const playSound = (type) => {
    const sounds = {
      pop: '/sounds/pop.mp3',
      craft: '/sounds/craft.mp3',
      trash: '/sounds/trash.mp3',
      fail: '/sounds/trash.mp3', // Reutilizando som ou adicione um fail.mp3
    };
    const audio = new Audio(sounds[type]);
    audio.volume = 0.5;
    audio.play().catch(() => {});
  };

  // --- CLIMA DINÂMICO (Time Check) ---
  useEffect(() => {
    const hour = new Date().getHours();
    // Considera noite se for antes das 6h ou depois das 18h
    setIsNight(hour < 6 || hour >= 18);
  }, []);

  // --- PERSISTÊNCIA ---
  useEffect(() => {
    const savedData = localStorage.getItem('rpg-cook-save');
    if (savedData) {
      const { xp: savedXp, unlocked: savedUnlocked } = JSON.parse(savedData);
      setXp(savedXp || 0);
      setUnlockedRecipes(savedUnlocked || []);
    }
  }, []);

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
    if (inventory.some(i => i.id === itemData.id)) return;

    playSound('pop');
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
        playSound('pop');
        const newInventory = [...inventory];
        newInventory.splice(indexToRemove, 1);
        setInventory(newInventory);
        checkRecipes(newInventory);
      }
    }
  };

  const allowDrop = (e) => e.preventDefault();

  // --- LÓGICA DE JOGO ---
  const checkRecipes = (currentInventory) => {
    // Se tiver gororoba, não checa receita
    if (currentInventory.some(i => i.id.startsWith('trash'))) {
        setCraftResult(null);
        return;
    }

    const invIds = currentInventory.map(i => i.id);
    const found = receitas.find(recipe => {
      const hasAllIngredients = recipe.ingredients.every(ing => invIds.includes(ing));
      const isExactMatch = recipe.ingredients.length === invIds.length;
      return hasAllIngredients && isExactMatch;
    });
    setCraftResult(found || null);
  };

  // Função Principal: Misturar ou Craftar
  const handleAction = () => {
    if (craftResult) {
        // SUCESSO: Craftar
        playSound('craft');
        setXp(prev => prev + craftResult.xp);
        if (!unlockedRecipes.includes(craftResult.name)) {
            setUnlockedRecipes(prev => [...prev, craftResult.name]);
        }
        setSelectedRecipe(craftResult);
    } else {
        // FALHA: Virar Gororoba
        setIsShaking(true); // Começa a tremer
        playSound('fail');
        
        // Aguarda animação terminar (500ms)
        setTimeout(() => {
            setIsShaking(false);
            setInventory([{ 
                id: `trash-${Date.now()}`, 
                icon: '🤢', 
                name: 'Gororoba', 
                rarity: 'common' 
            }]);
            setCraftResult(null);
        }, 500);
    }
  };

  const handleShare = () => {
    const text = `🍳 Acabei de craftar ${selectedRecipe.name} no Inventory Cook! \nNível de Chef: ${Math.floor(xp / 100) + 1} \nXP Total: ${xp}`;
    navigator.clipboard.writeText(text);
    alert('Copiado para a área de transferência!');
  };

  // --- PALETA DE CORES DINÂMICA ---
  const theme = isNight ? {
    bg: 'bg-rpg-bg',
    card: 'bg-slate-800/50',
    accent: 'text-rpg-accent',
    border: 'border-slate-700/50',
    itemBg: 'bg-slate-700/90',
    pantryBg: 'bg-slate-900',
    gradient: 'from-rpg-accent to-blue-500'
  } : {
    bg: 'bg-orange-50', // Dia: Fundo claro quente
    card: 'bg-white/60',
    accent: 'text-orange-600',
    border: 'border-orange-200',
    itemBg: 'bg-white',
    pantryBg: 'bg-white',
    gradient: 'from-orange-400 to-yellow-300'
  };

  return (
    <main className={`min-h-screen ${theme.bg} transition-colors duration-1000 text-slate-800 dark:text-white selection:bg-rpg-accent selection:text-white py-12 px-4 relative overflow-x-hidden`}>
      
      {/* Background Decoration */}
      <div className={`fixed top-0 left-0 w-full h-1 bg-gradient-to-r ${theme.gradient} shadow-[0_0_40px_rgba(139,92,246,0.6)] z-50`}></div>
      
      {/* Botão de Toggle Manual (Debug/Diversão) */}
      <button 
        onClick={() => setIsNight(!isNight)}
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-slate-800/20 backdrop-blur-md hover:bg-slate-800/40 transition-all border border-slate-500/20"
      >
        {isNight ? <Moon size={20} className="text-purple-300" /> : <Sun size={20} className="text-orange-500" />}
      </button>

      {/* CONTAINER CENTRALIZADO */}
      <div className="max-w-2xl mx-auto flex flex-col gap-12">

        {/* --- BLOCO 1: HEADER & STATS --- */}
        <section className="text-center space-y-6">
          <div className="inline-block relative">
            <h1 className={`text-4xl md:text-5xl font-black tracking-tight flex items-center justify-center gap-3 drop-shadow-xl ${isNight ? 'text-white' : 'text-slate-800'}`}>
              <ChefHat size={48} className={`${theme.accent} animate-bounce-slow`} /> 
              Inventory Cook
            </h1>
            <span className="absolute -top-2 -right-6 bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full rotate-12">
              BETA
            </span>
          </div>
          
          <div className={`${theme.card} backdrop-blur-md p-4 rounded-2xl border ${theme.border} shadow-lg max-w-md mx-auto transition-colors duration-500`}>
            <div className="flex justify-between items-end mb-2 px-2">
              <div className="flex flex-col text-left">
                <span className={`text-xs uppercase tracking-wider font-semibold ${isNight ? 'text-slate-400' : 'text-slate-500'}`}>Nível de Chef</span>
                <span className={`text-xl font-bold flex items-center gap-2 ${isNight ? 'text-white' : 'text-slate-800'}`}>
                  <Trophy size={18} className="text-yellow-500" /> 
                  {Math.floor(xp / 100) + 1}
                </span>
              </div>
              <div className="text-right">
                <span className={`text-2xl font-black ${theme.accent}`}>{xp}</span>
                <span className={`text-[10px] block -mt-1 font-bold ${isNight ? 'text-slate-500' : 'text-slate-400'}`}>XP TOTAL</span>
              </div>
            </div>
            
            {/* Barra de XP */}
            <div className={`w-full h-4 rounded-full overflow-hidden border ${theme.border} relative ${isNight ? 'bg-slate-900' : 'bg-slate-200'}`}>
              <motion.div 
                className={`h-full bg-gradient-to-r ${theme.gradient} relative`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((xp % 1000) / 10, 100)}%` }}
                transition={{ type: "spring", stiffness: 50 }}
              >
                <div className="absolute top-0 right-0 h-full w-full bg-white/10 animate-[shimmer_2s_infinite]"></div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- BLOCO 2: O CALDEIRÃO --- */}
        <section className="relative z-10">
          <div className="text-center mb-4">
             <h2 className={`text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 ${isNight ? 'text-slate-400' : 'text-slate-500'}`}>
               <Sparkles size={14} /> Área de Preparo
             </h2>
          </div>

          <div 
            className={`
              relative w-full min-h-[220px] rounded-3xl border-4 border-dashed transition-all duration-500 
              flex flex-wrap content-center justify-center gap-6 p-8
              ${inventory.length > 0 ? `border-current ${isNight ? 'text-purple-500 bg-slate-800/60' : 'text-orange-400 bg-orange-100/50'} shadow-lg` : `border-slate-500/30 ${isNight ? 'bg-slate-900/40' : 'bg-slate-200/40'}`}
            `}
            onDrop={handleDropOnInventory}
            onDragOver={allowDrop}
          >
            {/* Placeholder */}
            <AnimatePresence>
              {inventory.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-30"
                >
                  <ChefHat size={60} className={isNight ? 'text-slate-500' : 'text-slate-400'} />
                  <span className={`text-sm font-medium mt-2 ${isNight ? 'text-slate-500' : 'text-slate-500'}`}>Arraste os ingredientes aqui</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Itens no Caldeirão */}
            <AnimatePresence mode='popLayout'>
              {inventory.map((item) => (
                <motion.div 
                  key={`${item.id}`}
                  layoutId={item.id}
                  // Animação de Shake se estiver errado
                  animate={isShaking ? { x: [-5, 5, -5, 5, 0], rotate: [0, -10, 10, -5, 5, 0] } : { scale: 1, rotate: Math.random() * 10 - 5 }}
                  transition={isShaking ? { duration: 0.4 } : { type: "spring" }}
                  
                  initial={{ scale: 0, rotate: Math.random() * 360 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.2, rotate: 0, zIndex: 20 }}
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, item, 'inventory')}
                  className={`w-20 h-20 ${theme.itemBg} backdrop-blur-md rounded-2xl flex items-center justify-center text-4xl shadow-xl border border-slate-500/20 cursor-grab active:cursor-grabbing`}
                >
                  {item.icon}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* BOTÃO DE AÇÃO (MISTURAR OU CRAFTAR) */}
            <AnimatePresence>
              {inventory.length > 0 && (
                <motion.div className="absolute -bottom-6 left-0 right-0 flex justify-center z-30">
                  <motion.button 
                    initial={{ scale: 0, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0, y: 20 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAction}
                    className={`
                      px-8 py-4 rounded-full font-black flex items-center gap-3 border-4 transition-all
                      ${craftResult 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-white/20 shadow-[0_10px_30px_rgba(34,197,94,0.4)]' 
                        : 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-white/20 shadow-[0_10px_30px_rgba(249,115,22,0.4)]'
                      }
                    `}
                  >
                    {craftResult ? (
                        <>
                            <Sparkles size={24} className="animate-spin-slow" /> 
                            CRAFTAR!
                        </>
                    ) : (
                        <>
                            <RotateCw size={24} className={isShaking ? "animate-spin" : ""} /> 
                            MISTURAR
                        </>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Botão Limpar */}
          <div className="flex justify-center mt-10 min-h-[40px]">
            {inventory.length > 0 && (
              <motion.button 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={() => { playSound('trash'); setInventory([]); setCraftResult(null); }}
                className="text-xs text-red-400 hover:text-red-500 flex items-center gap-2 transition-colors px-4 py-2 rounded-full border border-red-500/20 hover:bg-red-500/10"
              >
                <Trash2 size={14} /> Esvaziar Caldeirão
              </motion.button>
            )}
          </div>
        </section>

        {/* --- BLOCO 3: A GELADEIRA (GRID) --- */}
        <section className={`${theme.pantryBg} rounded-[2.5rem] p-8 border ${theme.border} shadow-2xl relative transition-colors duration-500`}>
          {/* Label da Geladeira */}
          <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full border shadow-lg flex items-center gap-2 ${isNight ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-orange-100 text-slate-600'}`}>
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-xs font-bold uppercase tracking-widest">Despensa</span>
          </div>

          <div 
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-4"
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
                  aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 cursor-grab active:cursor-grabbing
                  border-2 transition-all group
                  ${isNight 
                    ? 'bg-slate-800 border-slate-700/50 hover:bg-slate-700 hover:border-slate-500' 
                    : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-orange-300'
                  }
                  ${item.rarity === 'rare' ? 'border-purple-500/30 bg-purple-900/10' : ''}
                  ${item.rarity === 'legendary' ? 'border-yellow-500/30 bg-yellow-900/10' : ''}
                `}
              >
                <span className="text-3xl sm:text-4xl drop-shadow-md filter grayscale-[0.2] group-hover:grayscale-0 transition-all duration-300">
                  {item.icon}
                </span>
                <span className={`text-[10px] sm:text-xs font-bold uppercase text-center tracking-tight leading-none ${
                   isNight 
                   ? (item.rarity === 'legendary' ? 'text-yellow-500' : item.rarity === 'rare' ? 'text-purple-400' : 'text-slate-500 group-hover:text-slate-300')
                   : (item.rarity === 'legendary' ? 'text-yellow-600' : item.rarity === 'rare' ? 'text-purple-600' : 'text-slate-400 group-hover:text-slate-600')
                }`}>
                  {item.name}
                </span>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* --- MODAL (MANTIDO) --- */}
      <AnimatePresence>
        {selectedRecipe && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-md"
            onClick={() => setSelectedRecipe(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50, opacity: 0 }} 
              animate={{ scale: 1, y: 0, opacity: 1 }} 
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl p-6 md:p-8 relative shadow-2xl overflow-hidden" 
              onClick={e => e.stopPropagation()}
            >
               <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-green-500/10 to-transparent pointer-events-none"></div>

                <button 
                  onClick={() => setSelectedRecipe(null)}
                  className="absolute top-4 right-4 p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors z-20"
                >
                  <X size={20} />
                </button>

                <div className="text-center mb-8 relative z-10 pt-4">
                  <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} 
                    className="inline-flex items-center gap-2 bg-green-500 text-black text-xs font-black px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider"
                  >
                    <Sparkles size={14} /> Recipe Unlocked
                  </motion.div>
                  <h2 className="text-3xl md:text-4xl font-black text-white mb-2">{selectedRecipe.name}</h2>
                  <p className="text-slate-400 text-sm font-medium">"{selectedRecipe.desc}"</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center border border-slate-700">
                    <span className="text-yellow-500 font-black text-2xl">+{selectedRecipe.xp}</span>
                    <span className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">XP Ganho</span>
                  </div>
                  <div className="bg-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center border border-slate-700">
                    <span className="text-blue-400 font-black text-2xl">{selectedRecipe.time}</span>
                    <span className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Tempo</span>
                  </div>
                </div>

                <div className="bg-slate-950/50 rounded-2xl p-6 mb-8 border border-slate-800">
                  <h3 className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
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
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 md:py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Share2 size={18} /> Compartilhar
                  </button>
                  <button 
                    onClick={() => setSelectedRecipe(null)}
                    className="flex-[2] bg-rpg-accent hover:bg-violet-500 text-white font-bold py-3 md:py-4 rounded-xl transition-colors shadow-lg shadow-purple-900/20 text-sm"
                  >
                    Continuar
                  </button>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
