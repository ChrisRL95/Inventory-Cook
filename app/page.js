'use client';

import { useState } from 'react';
import { Sparkles, ChefHat, Trash2, Clock, BookOpen, X } from 'lucide-react';
// Aqui importamos nosso "Banco de Dados" separado
import { ingredientes, receitas } from './data';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  // Carrega os ingredientes do arquivo data.js
  const [pantry] = useState(ingredientes);
  const [craftResult, setCraftResult] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // --- LÓGICA DE DRAG AND DROP ---
  const handleDragStart = (e, item, source) => {
    e.dataTransfer.setData('item', JSON.stringify(item));
    e.dataTransfer.setData('source', source);
  };

  const handleDropOnInventory = (e) => {
    e.preventDefault();
    const itemData = JSON.parse(e.dataTransfer.getData('item'));
    const source = e.dataTransfer.getData('source');

    // Impede duplicatas no inventário, mas permite mover da loja para inventário
    if (source === 'inventory') return;
    if (inventory.length >= 4) return;

    // Verifica se o item já está no inventário (evita duplicar o mesmo ID)
    const alreadyExists = inventory.some(i => i.id === itemData.id);
    if (alreadyExists) return;

    const newInventory = [...inventory, itemData];
    setInventory(newInventory);
    checkRecipes(newInventory);
  };

  const handleDropOnPantry = (e) => {
    e.preventDefault();
    const source = e.dataTransfer.getData('source');
    
    // Se soltar na loja vindo do inventário, remove o item
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

  // --- SISTEMA DE CRAFTING ---
  const checkRecipes = (currentInventory) => {
    const invIds = currentInventory.map(i => i.id);
    
    // Procura no arquivo data.js se existe match
    const found = receitas.find(recipe => {
      const hasAllIngredients = recipe.ingredients.every(ing => invIds.includes(ing));
      const isExactMatch = recipe.ingredients.length === invIds.length;
      return hasAllIngredients && isExactMatch;
    });

    setCraftResult(found || null);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-rpg-bg text-white font-mono relative">
      
      {/* AVISO MOBILE */}
      <div className="md:hidden bg-yellow-500/20 text-yellow-200 p-4 rounded-lg mb-6 text-center text-sm border border-yellow-500/50">
        ⚠️ <strong>Modo Mobile Detectado</strong><br/>
        O sistema de crafting requer mouse e teclado.<br/>
        Abra no PC para a experiência completa!
      </div>

      {/* HEADER */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold flex items-center justify-center gap-2">
          <ChefHat className="text-rpg-accent" /> Inventory Cook
        </h1>
        <p className="text-slate-400 text-sm mt-2">Arraste ingredientes para descobrir receitas</p>
      </header>

      {/* ÁREA DE CRAFTING (INVENTÁRIO) */}
      <div 
        className={`
          relative w-full max-w-md h-48 rounded-xl border-4 border-dashed transition-all duration-300 flex items-center justify-center gap-4 p-4
          ${inventory.length > 0 ? 'border-rpg-accent bg-slate-800/50' : 'border-slate-600 bg-slate-900'}
        `}
        onDrop={handleDropOnInventory}
        onDragOver={allowDrop}
      >
        {inventory.length === 0 && (
          <span className="text-slate-500 absolute pointer-events-none">Espaços Vazios [ 0 / 4 ]</span>
        )}

        {inventory.map((item, index) => (
          <div 
            key={`${item.id}-${index}`}
            draggable
            onDragStart={(e) => handleDragStart(e, item, 'inventory')}
            className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center text-3xl cursor-grab active:cursor-grabbing hover:scale-110 transition-transform shadow-lg border-2 border-slate-500 relative z-10"
          >
            {item.icon}
          </div>
        ))}

        {/* BOTÃO DE RESULTADO (CRAFTADO) */}
        {craftResult && (
          <button 
            onClick={() => setSelectedRecipe(craftResult)}
            className="absolute -top-6 left-1/2 -translate-x-1/2 bg-green-500 text-black px-6 py-2 rounded-full font-bold animate-bounce flex items-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.6)] hover:bg-green-400 transition-colors z-20 cursor-pointer whitespace-nowrap"
          >
            <Sparkles size={16} /> CRAFTADO: {craftResult.name} (Ver Receita)
          </button>
        )}
      </div>

      {/* BOTÃO LIMPAR */}
      {inventory.length > 0 && (
        <button 
          onClick={() => {
            setInventory([]);
            setCraftResult(null);
          }}
          className="mt-4 mb-8 text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
        >
          <Trash2 size={14} /> Limpar Caldeirão
        </button>
      )}

      {/* ÁREA DE SELEÇÃO (LOJA) */}
      <div className="w-full max-w-md border-t border-slate-700 pt-8 relative">
        <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-rpg-bg px-2 text-slate-500 text-xs uppercase tracking-widest">
          Despensa
        </span>
        
        <div 
          className="grid grid-cols-4 gap-3"
          onDrop={handleDropOnPantry}
          onDragOver={allowDrop}
        >
          {pantry.map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, item, 'pantry')}
              className={`
                aspect-square rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer 
                hover:bg-slate-800 transition-colors border border-slate-800
                ${item.rarity === 'rare' ? 'border-purple-500/30' : ''}
                ${item.rarity === 'legendary' ? 'border-yellow-500/50 shadow-lg shadow-yellow-500/10' : ''}
              `}
            >
              <span className="text-2xl drop-shadow-md">{item.icon}</span>
              <span className={`text-[10px] font-bold uppercase text-center ${
                item.rarity === 'legendary' ? 'text-yellow-400' : 
                item.rarity === 'rare' ? 'text-purple-400' : 'text-slate-500'
              }`}>
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* --- MODAL DE DETALHES DA RECEITA --- */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={() => setSelectedRecipe(null)}>
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl p-6 relative shadow-2xl" onClick={e => e.stopPropagation()}>
            
            {/* Botão Fechar */}
            <button 
              onClick={() => setSelectedRecipe(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={24} />
            </button>

            {/* Cabeçalho do Modal */}
            <div className="text-center mb-6">
              <span className="inline-block bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full mb-2 uppercase tracking-wider">
                Receita Desbloqueada
              </span>
              <h2 className="text-3xl font-bold text-white mb-1">{selectedRecipe.name}</h2>
              <p className="text-slate-400 text-sm italic">"{selectedRecipe.desc}"</p>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-6 mb-8 border-y border-slate-800 py-4">
              <div className="flex items-center gap-2 text-yellow-400">
                <Sparkles size={18} />
                <span className="font-bold">{selectedRecipe.xp} XP</span>
              </div>
              <div className="flex items-center gap-2 text-blue-400">
                <Clock size={18} />
                <span className="font-bold">{selectedRecipe.time}</span>
              </div>
            </div>

            {/* Passo a Passo */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                <BookOpen size={20} className="text-rpg-accent" /> Modo de Preparo
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

            {/* Botão de Ação */}
            <button 
              onClick={() => setSelectedRecipe(null)}
              className="w-full mt-8 bg-rpg-accent hover:bg-violet-500 text-white font-bold py-3 rounded-xl transition-colors"
            >
              Equipar na Cozinha (Fechar)
            </button>

          </div>
        </div>
      )}

    </main>
  );
}
