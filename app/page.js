'use client';

import { useState, useEffect } from 'react';
import { Sparkles, ChefHat, Trash2, Clock, BookOpen, X, Trophy, Share2, Sun, Moon, RotateCw, Search, Book } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ingredientes, receitas } from './data';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [pantry] = useState(ingredientes);
  const [craftResult, setCraftResult] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [xp, setXp] = useState(0);
  const [unlockedRecipes, setUnlockedRecipes] = useState([]);
  
  // Estados Visuais
  const [isNight, setIsNight] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [isAutoFilled, setIsAutoFilled] = useState(false);
  
  // Estados de Sinergia
  const [compatibleIngredients, setCompatibleIngredients] = useState([]);
  const [hintMessage, setHintMessage] = useState('');

  // --- AUDIO SYSTEM ---
  const playSound = (type) => {
    const sounds = {
      pop: '/sounds/pop.mp3',
      craft: '/sounds/craft.mp3',
      trash: '/sounds/trash.mp3',
      fail: '/sounds/trash.mp3',
      page: '/sounds/pop.mp3',
    };
    const audio = new Audio(sounds[type]);
    audio.volume = 0.5;
    audio.play().catch(() => {});
  };

  // --- STARTUP ---
  useEffect(() => {
    const hour = new Date().getHours();
    setIsNight(hour < 6 || hour >= 18);

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

  // --- ENGINE DE SINERGIA ---
  useEffect(() => {
    if (inventory.length === 0) {
      setCompatibleIngredients([]);
      setHintMessage('');
      return;
    }

    const invIds = inventory.map(i => i.id);
    const possibleRecipes = receitas.filter(recipe => 
      invIds.every(id => recipe.ingredients.includes(id))
    );

    if (possibleRecipes.length === 0) {
      setHintMessage('O cheiro não está nada bom...');
    } else {
      const isSweet = inventory.some(i => ['sugar', 'chocolate', 'milk'].includes(i.id));
      const isBakery = inventory.some(i => ['flour', 'egg'].includes(i.id));
      const isSalty = inventory.some(i => ['meat', 'cheese', 'tomato', 'potato'].includes(i.id));

      if (isSweet) setHintMessage('Cheiro doce no ar...');
      else if (isBakery) setHintMessage('Cheiro de massa fresca...');
      else if (isSalty) setHintMessage('Cheiro de comida caseira...');
      else setHintMessage('Misturando sabores...');
    }

    const nextIngredients = new Set();
    possibleRecipes.forEach(recipe => {
      recipe.ingredients.forEach(ing => {
        if (!invIds.includes(ing)) nextIngredients.add(ing);
      });
    });
    setCompatibleIngredients(Array.from(nextIngredients));

  }, [inventory]);

  const handleAutoFill = (recipe) => {
    playSound('page');
    const ingredientsToFill = recipe.ingredients.map(id => 
        pantry.find(item => item.id === id)
    ).filter(Boolean);

    setInventory(ingredientsToFill);
    setIsAutoFilled(true);
    setIsBookOpen(false);
    setCraftResult(recipe); 
  };

  // --- DRAG AND DROP ---
  const handleDragStart = (e, item, source) => {
    e.dataTransfer.setData('item', JSON.stringify(item));
    e.dataTransfer.setData('source', source);
  };

  const handleDropOnInventory = (e) => {
    e.preventDefault();
    const itemData = JSON.parse(e.dataTransfer.getData('item'));
    if (inventory.some(i => i.id === itemData.id)) return;

    playSound('pop');
    setIsAutoFilled(false);
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

  const checkRecipes = (currentInventory) => {
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

  const handleAction = () => {
    if (craftResult) {
        playSound('craft');
        const xpGain = isAutoFilled ? Math.floor(craftResult.xp / 2) : craftResult.xp;
        setXp(prev => prev + xpGain);
        if (!unlockedRecipes.includes(craftResult.name)) {
            setUnlockedRecipes(prev => [...prev, craftResult.name]);
        }
        setSelectedRecipe({ ...craftResult, earnedXp: xpGain });
    } else {
        setIsShaking(true);
        playSound('fail');
        setTimeout(() => {
            setIsShaking(false);
            setInventory([{ id: `trash-${Date.now()}`, icon: '🤢', name: 'Gororoba', rarity: 'common' }]);
            setCraftResult(null);
        }, 500);
    }
  };

  const handleShare = () => {
    const text = `🍳 Fiz ${selectedRecipe.name} no Inventory Cook! \nNível: ${Math.floor(xp / 100) + 1} \nXP Total: ${xp}`;
    navigator.clipboard.writeText(text);
    alert('Copiado!');
  };

  // --- PALETA DE CORES (VIBE: FOGO & PEDRA vs FARINHA & MANJERICÃO) ---
  const theme = isNight ? {
    // MODO ESCURO: Stone + Amber (Taverna)
    bg: 'bg-[#0c0a09]', // Stone 950 customizado
    text: 'text-stone-200',
    card: 'bg-[#1c1917]/80', // Stone 900
    accent: 'text-amber-500', // Dourado
    border: 'border-stone-700/50',
    itemBg: 'bg-[#292524]', // Stone 800
    pantryBg: 'bg-[#1c1917]', // Stone 900
    gradient: 'from-amber-600 to-orange-600', // Fogo
    hintBg: 'bg-stone-800 text-amber-200 border-stone-700'
  } : {
    // MODO CLARO: Orange-50 + Orange-600 (Confeitaria)
    bg: 'bg-orange-50',
    text: 'text-orange-950',
    card: 'bg-white/80',
    accent: 'text-orange-600',
    border: 'border-orange-200',
    itemBg: 'bg-white',
    pantryBg: 'bg-white',
    gradient: 'from-orange-400 to-yellow-400',
    hintBg: 'bg-white text-orange-600 border-orange-200'
  };

  return (
    <main className={`min-h-screen ${theme.bg} ${theme.text} transition-colors duration-1000 font-sans selection:bg-orange-500 selection:text-white py-12 px-4 relative overflow-x-hidden`}>
      
      {/* Luz Ambiente (Glow no Topo) */}
      <div className={`fixed top-0 left-0 w-full h-1 bg-gradient-to-r ${theme.gradient} shadow-[0_0_60px_rgba(245,158,11,0.4)] z-50`}></div>
      
      {/* Controles */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button 
            onClick={() => setIsBookOpen(true)}
            className={`p-2 rounded-full backdrop-blur-md transition-all border ${theme.border} ${isNight ? 'bg-stone-800/50 hover:bg-stone-700 text-amber-400' : 'bg-white/50 hover:bg-white text-orange-500'}`}
            title="Abrir Livro de Receitas"
        >
            <Book size={20} />
        </button>
        <button 
            onClick={() => setIsNight(!isNight)}
            className={`p-2 rounded-full backdrop-blur-md transition-all border ${theme.border} ${isNight ? 'bg-stone-800/50 hover:bg-stone-700' : 'bg-white/50 hover:bg-white'}`}
        >
            {isNight ? <Moon size={20} className="text-stone-400" /> : <Sun size={20} className="text-orange-500" />}
        </button>
      </div>

      <div className="max-w-2xl mx-auto flex flex-col gap-12">

        {/* HEADER */}
        <section className="text-center space-y-6">
          <div className="inline-block relative">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight flex items-center justify-center gap-3 drop-shadow-xl">
              <ChefHat size={48} className={`${theme.accent} animate-bounce-slow`} /> 
              Inventory Cook
            </h1>
            <span className={`absolute -top-2 -right-6 text-[10px] font-bold px-2 py-0.5 rounded-full rotate-12 ${isNight ? 'bg-amber-500 text-black' : 'bg-orange-500 text-white'}`}>
              BETA
            </span>
          </div>
          
          <div className={`${theme.card} backdrop-blur-md p-4 rounded-2xl border ${theme.border} shadow-xl max-w-md mx-auto transition-colors duration-500`}>
            <div className="flex justify-between items-end mb-2 px-2">
              <div className="flex flex-col text-left">
                <span className={`text-xs uppercase tracking-wider font-bold opacity-60`}>Nível de Chef</span>
                <span className="text-xl font-bold flex items-center gap-2">
                  <Trophy size={18} className={isNight ? 'text-amber-500' : 'text-yellow-600'} /> 
                  {Math.floor(xp / 100) + 1}
                </span>
              </div>
              <div className="text-right">
                <span className={`text-2xl font-black ${theme.accent}`}>{xp}</span>
                <span className="text-[10px] block -mt-1 font-bold opacity-60">XP TOTAL</span>
              </div>
            </div>
            <div className={`w-full h-4 rounded-full overflow-hidden border ${theme.border} relative ${isNight ? 'bg-stone-950' : 'bg-orange-100'}`}>
              <motion.div 
                className={`h-full bg-gradient-to-r ${theme.gradient} relative`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((xp % 1000) / 10, 100)}%` }}
                transition={{ type: "spring", stiffness: 50 }}
              >
                <div className="absolute top-0 right-0 h-full w-full bg-white/20 animate-[shimmer_2s_infinite]"></div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CALDEIRÃO */}
        <section className="relative z-10">
          <AnimatePresence>
            {hintMessage && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="absolute -top-14 left-0 right-0 flex justify-center pointer-events-none"
              >
                <div className={`${theme.hintBg} px-6 py-2 rounded-full text-sm font-bold shadow-lg border flex items-center gap-2`}>
                  <Search size={14} /> {hintMessage}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div 
            className={`
              relative w-full min-h-[240px] rounded-[2rem] border-4 border-dashed transition-all duration-500 
              flex flex-wrap content-center justify-center gap-6 p-8
              ${inventory.length > 0 ? `border-current ${theme.accent} ${isNight ? 'bg-stone-900/50' : 'bg-orange-100/50'} shadow-2xl` : `border-current opacity-30 ${isNight ? 'text-stone-700 bg-stone-900/20' : 'text-orange-200 bg-orange-50'}`}
            `}
            onDrop={handleDropOnInventory}
            onDragOver={allowDrop}
          >
            <AnimatePresence>
              {inventory.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                >
                  <ChefHat size={64} className="mb-2" />
                  <span className="text-sm font-bold uppercase tracking-widest">Arraste ou use o Livro</span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode='popLayout'>
              {inventory.map((item) => (
                <motion.div 
                  key={`${item.id}`}
                  layoutId={item.id}
                  animate={isShaking ? { x: [-5, 5, -5, 5, 0], rotate: [0, -10, 10, -5, 5, 0] } : { scale: 1, rotate: Math.random() * 10 - 5 }}
                  transition={isShaking ? { duration: 0.4 } : { type: "spring" }}
                  initial={{ scale: 0, rotate: Math.random() * 360 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.2, rotate: 0, zIndex: 20 }}
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, item, 'inventory')}
                  className={`w-20 h-20 ${theme.itemBg} backdrop-blur-md rounded-2xl flex items-center justify-center text-4xl shadow-xl border ${theme.border} cursor-grab active:cursor-grabbing`}
                >
                  {item.icon}
                </motion.div>
              ))}
            </AnimatePresence>

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
                      px-8 py-4 rounded-full font-black flex items-center gap-3 border-4 transition-all text-white
                      ${craftResult 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-400 shadow-[0_10px_30px_rgba(34,197,94,0.4)]' 
                        : 'bg-gradient-to-r from-orange-500 to-red-600 border-orange-400 shadow-[0_10px_30px_rgba(234,88,12,0.4)]'
                      }
                    `}
                  >
                    {craftResult ? (
                        <> 
                          <Sparkles size={24} className="animate-spin-slow" /> 
                          {isAutoFilled ? `CRAFTAR (+${Math.floor(craftResult.xp/2)} XP)` : 'CRAFTAR!'} 
                        </>
                    ) : (
                        <> <RotateCw size={24} className={isShaking ? "animate-spin" : ""} /> MISTURAR </>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex justify-center mt-12 min-h-[40px]">
            {inventory.length > 0 && (
              <motion.button 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={() => { playSound('trash'); setInventory([]); setCraftResult(null); setIsAutoFilled(false); }}
                className="text-xs font-bold hover:text-red-500 flex items-center gap-2 transition-colors px-6 py-2 rounded-full border border-current opacity-50 hover:opacity-100"
              >
                <Trash2 size={14} /> JOGAR FORA
              </motion.button>
            )}
          </div>
        </section>

        {/* DESPENSA */}
        <section className={`${theme.pantryBg} rounded-[2.5rem] p-8 border ${theme.border} shadow-2xl relative transition-colors duration-500`}>
          <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full border shadow-lg flex items-center gap-2 ${isNight ? 'bg-stone-800 border-stone-700 text-stone-300' : 'bg-white border-orange-200 text-orange-800'}`}>
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-xs font-bold uppercase tracking-widest">Despensa</span>
          </div>

          <div 
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-4"
            onDrop={handleDropOnPantry}
            onDragOver={allowDrop}
          >
            {pantry.map((item) => {
              const isCompatible = inventory.length === 0 || compatibleIngredients.includes(item.id);
              const isDimmed = !isCompatible && inventory.length > 0;

              return (
                <motion.div
                  key={item.id}
                  draggable
                  layoutId={`store-${item.id}`}
                  animate={isCompatible && inventory.length > 0 ? { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 2 } } : {}}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onDragStart={(e) => handleDragStart(e, item, 'pantry')}
                  className={`
                    aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 cursor-grab active:cursor-grabbing
                    border-2 transition-all duration-500 group
                    ${isDimmed ? 'opacity-20 grayscale scale-95 blur-[1px]' : 'opacity-100'}
                    ${isCompatible && inventory.length > 0 ? 'ring-2 ring-green-400 shadow-[0_0_15px_rgba(74,222,128,0.3)]' : ''}
                    ${isNight 
                      ? 'bg-stone-800 border-stone-700 hover:border-amber-500 hover:bg-stone-700' 
                      : 'bg-white border-orange-100 hover:border-orange-400 hover:bg-orange-50'
                    }
                    ${item.rarity === 'legendary' ? 'border-amber-500/50 shadow-amber-500/20' : ''}
                  `}
                >
                  <span className="text-3xl sm:text-4xl drop-shadow-md filter grayscale-[0.1] group-hover:grayscale-0 transition-all duration-300">
                    {item.icon}
                  </span>
                  <span className={`text-[10px] sm:text-xs font-bold uppercase text-center tracking-tight leading-none ${isNight ? 'text-stone-500 group-hover:text-stone-300' : 'text-orange-900/40 group-hover:text-orange-800'}`}>
                    {item.name}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </section>
      </div>

      {/* MODAL DO LIVRO */}
      <AnimatePresence>
        {isBookOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-md"
            onClick={() => setIsBookOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 50, opacity: 0 }}
              className={`w-full max-w-lg rounded-3xl p-6 relative shadow-2xl max-h-[80vh] flex flex-col ${isNight ? 'bg-stone-900 border border-stone-700' : 'bg-orange-50 border border-orange-200'}`}
              onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className={`text-2xl font-black ${isNight ? 'text-stone-200' : 'text-orange-900'}`}>Grimório</h2>
                    <button onClick={() => setIsBookOpen(false)} className="p-2 rounded-full hover:bg-black/10"><X size={20} /></button>
                </div>

                <div className="overflow-y-auto pr-2 space-y-3 custom-scrollbar flex-1">
                    {receitas.map((recipe, idx) => (
                        <motion.div 
                            key={idx}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleAutoFill(recipe)}
                            className={`p-4 rounded-xl cursor-pointer flex justify-between items-center transition-all ${
                                isNight 
                                ? 'bg-stone-800 hover:bg-stone-700 border border-stone-700' 
                                : 'bg-white hover:bg-orange-100 border border-orange-100'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xl">📜</span>
                                <div>
                                    <h3 className={`font-bold ${isNight ? 'text-stone-200' : 'text-orange-900'}`}>{recipe.name}</h3>
                                    <p className={`text-xs opacity-60`}>{recipe.ingredients.length} Ingredientes • {recipe.time}</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold px-2 py-1 rounded bg-black/10 opacity-60">
                                {Math.floor(recipe.xp / 2)} XP
                            </span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL DE SUCESSO */}
      <AnimatePresence>
        {selectedRecipe && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-md"
            onClick={() => setSelectedRecipe(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 50, opacity: 0 }}
              className={`w-full max-w-lg rounded-3xl p-6 md:p-8 relative shadow-2xl overflow-hidden border ${isNight ? 'bg-stone-900 border-stone-700' : 'bg-white border-orange-100'}`}
              onClick={e => e.stopPropagation()}
            >
               <div className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-b ${theme.gradient} opacity-20 pointer-events-none`}></div>
                <button onClick={() => setSelectedRecipe(null)} className="absolute top-4 right-4 p-2 rounded-full bg-black/10 hover:bg-black/20 transition-colors z-20"><X size={20} /></button>

                <div className="text-center mb-8 relative z-10 pt-4">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center gap-2 bg-green-500 text-black text-xs font-black px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider shadow-lg shadow-green-500/30">
                    <Sparkles size={14} /> Recipe Unlocked
                  </motion.div>
                  <h2 className={`text-3xl md:text-4xl font-black mb-2 ${isNight ? 'text-white' : 'text-orange-950'}`}>{selectedRecipe.name}</h2>
                  <p className="opacity-60 text-sm font-medium">"{selectedRecipe.desc}"</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className={`rounded-2xl p-4 flex flex-col items-center justify-center border ${isNight ? 'bg-stone-800 border-stone-700' : 'bg-orange-50 border-orange-200'}`}>
                    <span className="text-amber-500 font-black text-2xl">+{selectedRecipe.earnedXp}</span>
                    <span className="text-[10px] uppercase tracking-widest font-bold opacity-50">XP Ganho</span>
                  </div>
                  <div className={`rounded-2xl p-4 flex flex-col items-center justify-center border ${isNight ? 'bg-stone-800 border-stone-700' : 'bg-orange-50 border-orange-200'}`}>
                    <span className="text-blue-500 font-black text-2xl">{selectedRecipe.time}</span>
                    <span className="text-[10px] uppercase tracking-widest font-bold opacity-50">Tempo</span>
                  </div>
                </div>

                <div className={`rounded-2xl p-6 mb-8 border ${isNight ? 'bg-stone-950/50 border-stone-800' : 'bg-slate-50 border-slate-100'}`}>
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-4 opacity-50">
                    <BookOpen size={16} /> Modo de Preparo
                  </h3>
                  <ul className="space-y-3">
                    {selectedRecipe.steps.map((step, idx) => (
                      <li key={idx} className="flex gap-4 text-sm leading-relaxed opacity-80">
                        <span className="w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full text-[10px] font-bold bg-black/10">{idx + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3">
                  <button onClick={handleShare} className="flex-1 font-bold py-3 md:py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm bg-black/5 hover:bg-black/10">
                    <Share2 size={18} /> Compartilhar
                  </button>
                  <button onClick={() => setSelectedRecipe(null)} className={`flex-[2] text-white font-bold py-3 md:py-4 rounded-xl transition-colors shadow-lg text-sm bg-gradient-to-r ${theme.gradient}`}>Continuar</button>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
