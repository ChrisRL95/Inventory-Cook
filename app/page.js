'use client'; // Necessário para usar Drag and Drop no Next.js

import { useState } from 'react';
import { Sparkles, ChefHat, Trash2 } from 'lucide-react';

// --- BANCO DE DADOS (ITEMS & RECEITAS) ---
const INGREDIENTS_DB = [
  { id: 'tomato', icon: '🍅', name: 'Tomate', rarity: 'common' },
  { id: 'cheese', icon: '🧀', name: 'Queijo', rarity: 'common' },
  { id: 'bread', icon: '🍞', name: 'Pão', rarity: 'common' },
  { id: 'egg', icon: '🥚', name: 'Ovo', rarity: 'common' },
  { id: 'meat', icon: '🥩', name: 'Carne', rarity: 'rare' },
  { id: 'mushroom', icon: '🍄', name: 'Cogumelo', rarity: 'rare' },
];

const RECIPES_DB = [
  { name: 'Misto Quente', ingredients: ['bread', 'cheese'], xp: 50 },
  { name: 'Omelete de Queijo', ingredients: ['egg', 'cheese'], xp: 80 },
  { name: 'X-Burguer', ingredients: ['bread', 'meat', 'cheese'], xp: 150 },
  { name: 'Pizza de Cogumelo', ingredients: ['bread', 'cheese', 'mushroom', 'tomato'], xp: 500 },
];

export default function Home() {
  const [inventory, setInventory] = useState([]); // Itens equipados (max 4)
  const [pantry] = useState(INGREDIENTS_DB); // Itens disponíveis
  const [craftResult, setCraftResult] = useState(null);

  // --- LÓGICA DE DRAG AND DROP ---
  
  const handleDragStart = (e, item, source) => {
    // Salva os dados do item sendo arrastado
    e.dataTransfer.setData('item', JSON.stringify(item));
    e.dataTransfer.setData('source', source);
  };

  const handleDropOnInventory = (e) => {
    e.preventDefault();
    const itemData = JSON.parse(e.dataTransfer.getData('item'));
    const source = e.dataTransfer.getData('source');

    // Se já estiver no inventário, não faz nada (por enquanto)
    if (source === 'inventory') return;

    // Se inventário cheio (Max 4 slots)
    if (inventory.length >= 4) return;

    // Adiciona ao inventário e verifica receitas
    const newInventory = [...inventory, itemData];
    setInventory(newInventory);
    checkRecipes(newInventory);
  };

  const handleDropOnPantry = (e) => {
    e.preventDefault();
    const source = e.dataTransfer.getData('source');
    
    // Se veio do inventário, remove (desequipa)
    if (source === 'inventory') {
      const itemData = JSON.parse(e.dataTransfer.getData('item'));
      // Remove apenas a primeira instância desse item
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
    
    // Procura uma receita que tenha TODOS os ingredientes necessários
    // E que o inventário tenha APENAS os ingredientes necessários (match exato)
    const found = RECIPES_DB.find(recipe => {
      const hasAllIngredients = recipe.ingredients.every(ing => invIds.includes(ing));
      const isExactMatch = recipe.ingredients.length === invIds.length;
      return hasAllIngredients && isExactMatch;
    });

    if (found) {
      setCraftResult(found);
      // Aqui você poderia tocar um som de "Level Up"
    } else {
      setCraftResult(null);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-rpg-bg text-white font-mono">
      
      {/* HEADER */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold flex items-center justify-center gap-2">
          <ChefHat className="text-rpg-accent" /> Inventory Cook
        </h1>
        <p className="text-slate-400 text-sm mt-2">Arraste os ingredientes para o caldeirão</p>
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

        {/* Renderiza os itens no inventário */}
        {inventory.map((item, index) => (
          <div 
            key={`${item.id}-${index}`}
            draggable
            onDragStart={(e) => handleDragStart(e, item, 'inventory')}
            className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center text-3xl cursor-grab active:cursor-grabbing hover:scale-110 transition-transform shadow-lg border-2 border-slate-500"
          >
            {item.icon}
          </div>
        ))}

        {/* RESULTADO DO CRAFT (FEEDBACK VISUAL) */}
        {craftResult && (
          <div className="absolute -top-16 bg-green-500 text-black px-6 py-2 rounded-full font-bold animate-bounce flex items-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.6)]">
            <Sparkles size={16} /> CRAFTED: {craftResult.name} (+{craftResult.xp} XP)
          </div>
        )}
      </div>

      {/* DIVISOR */}
      <div className="my-8 w-full max-w-md border-t border-slate-700 relative">
        <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-rpg-bg px-2 text-slate-500 text-xs">
          LOJA (DESPENSA)
        </span>
      </div>

      {/* ÁREA DE SELEÇÃO (LOJA) */}
      <div 
        className="grid grid-cols-3 gap-4 w-full max-w-md p-4 bg-slate-800 rounded-xl"
        onDrop={handleDropOnPantry}
        onDragOver={allowDrop}
      >
        {pantry.map((item) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, item, 'pantry')}
            className={`
              h-24 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer 
              hover:bg-slate-700 transition-colors border border-slate-700
              ${item.rarity === 'rare' ? 'border-purple-500/30' : ''}
            `}
          >
            <span className="text-4xl drop-shadow-md">{item.icon}</span>
            <span className={`text-xs font-bold uppercase ${item.rarity === 'rare' ? 'text-purple-400' : 'text-slate-400'}`}>
              {item.name}
            </span>
          </div>
        ))}
      </div>

      <footer className="mt-12 text-slate-600 text-xs">
        <p>Solte um item aqui fora para removê-lo (ou arraste de volta pra loja).</p>
      </footer>

    </main>
  );
}