// app/data.js

export const ingredientes = [
  // Básicos
  { id: 'water', icon: '💧', name: 'Água', rarity: 'common' },
  { id: 'flour', icon: '🌾', name: 'Farinha', rarity: 'common' },
  { id: 'sugar', icon: '🍬', name: 'Açúcar', rarity: 'common' },
  { id: 'egg', icon: '🥚', name: 'Ovo', rarity: 'common' },
  { id: 'bread', icon: '🍞', name: 'Pão', rarity: 'common' },
  { id: 'potato', icon: '🥔', name: 'Batata', rarity: 'common' },
  { id: 'tomato', icon: '🍅', name: 'Tomate', rarity: 'common' },
  // Refinados
  { id: 'cheese', icon: '🧀', name: 'Queijo', rarity: 'rare' },
  { id: 'meat', icon: '🥩', name: 'Carne', rarity: 'rare' },
  { id: 'milk', icon: '🥛', name: 'Leite', rarity: 'rare' },
  { id: 'chocolate', icon: '🍫', name: 'Chocolate', rarity: 'rare' },
  { id: 'coffee', icon: '☕', name: 'Café', rarity: 'rare' },
  // Especiais
  { id: 'chicken', icon: '🍗', name: 'Frango', rarity: 'epic' },
  { id: 'magic_spice', icon: '✨', name: 'Tempero Mágico', rarity: 'legendary' },
];

export const receitas = [
  // --- CATEGORIA: CAFE (Matinais) ---
  { 
    name: 'Pão com Manteiga (Fake)', 
    category: 'cafe',
    ingredients: ['bread'], 
    xp: 10, time: '1 min',
    desc: 'Às vezes, a simplicidade é tudo.',
    steps: ['Pegue o pão.', 'Passe o que tiver na geladeira.', 'Coma.']
  },
  { 
    name: 'Ovo Cozido', 
    category: 'cafe',
    ingredients: ['egg', 'water'], 
    xp: 20, time: '10 min',
    desc: 'Uma fonte sólida de proteína.',
    steps: ['Ferva a água.', 'Coloque o ovo com cuidado.', 'Cozinhe por 7 a 10 minutos.']
  },
  { 
    name: 'Misto Quente', 
    category: 'cafe',
    ingredients: ['bread', 'cheese'], 
    xp: 50, time: '10 min',
    desc: 'O clássico inabalável das padarias.',
    steps: ['Aqueça a frigideira.', 'Monte o sanduíche com queijo.', 'Doure dos dois lados.']
  },
  { 
    name: 'Queijo Quente', 
    category: 'cafe',
    ingredients: ['bread', 'cheese', 'tomato'], 
    xp: 60, time: '10 min',
    desc: 'Um upgrade suculento no misto tradicional.',
    steps: ['Monte o sanduíche com queijo e tomate.', 'Toste até ficar crocante.']
  },
  { 
    name: 'Omelete Simples', 
    category: 'cafe',
    ingredients: ['egg', 'milk'], 
    xp: 40, time: '5 min',
    desc: 'Mais fofo graças ao leite.',
    steps: ['Bata os ovos com leite.', 'Despeje na frigideira e dobre ao meio.']
  },
  { 
    name: 'Omelete Recheado', 
    category: 'cafe',
    ingredients: ['egg', 'cheese', 'tomato'], 
    xp: 80, time: '8 min',
    desc: 'Uma refeição completa em um único prato.',
    steps: ['Faça a base do omelete.', 'Adicione queijo e tomate picado antes de dobrar.']
  },
  { 
    name: 'Café com Leite', 
    category: 'cafe',
    ingredients: ['coffee', 'milk'], 
    xp: 30, time: '3 min',
    desc: 'O combustível oficial dos desenvolvedores.',
    steps: ['Passe o café bem forte.', 'Misture com leite quente.']
  },
  { 
    name: 'Rabanada', 
    category: 'cafe',
    ingredients: ['bread', 'egg', 'milk', 'sugar'], 
    xp: 120, time: '20 min',
    desc: 'Sabor de Natal fora de época.',
    steps: ['Mergulhe o pão no leite e ovo.', 'Frite e passe no açúcar.']
  },
  { 
    name: 'Panqueca Doce', 
    category: 'cafe',
    ingredients: ['flour', 'milk', 'egg', 'sugar'], 
    xp: 120, time: '15 min',
    desc: 'Estilo americano, fofinha.',
    steps: ['Misture tudo.', 'Frite discos pequenos em frigideira untada.']
  },

  // --- CATEGORIA: REFEICAO (Almoço/Jantar) ---
  { 
    name: 'Bife Acebolado (Sem Cebola)', 
    category: 'refeicao',
    ingredients: ['meat'], 
    xp: 100, time: '15 min',
    desc: 'Apenas a carne, no ponto certo.',
    steps: ['Aqueça a frigideira.', 'Sele a carne dos dois lados.']
  },
  { 
    name: 'X-Burguer', 
    category: 'refeicao',
    ingredients: ['bread', 'meat', 'cheese'], 
    xp: 150, time: '20 min',
    desc: 'O rei do fast-food caseiro.',
    steps: ['Grelhe o hambúrguer.', 'Derreta o queijo por cima.', 'Monte no pão.']
  },
  { 
    name: 'Purê de Batata', 
    category: 'refeicao',
    ingredients: ['potato', 'milk', 'cheese'], 
    xp: 130, time: '25 min',
    desc: 'Cremoso e reconfortante.',
    steps: ['Cozinhe as batatas.', 'Amasse e misture leite e queijo no fogo baixo.']
  },
  { 
    name: 'Batata Rosti', 
    category: 'refeicao',
    ingredients: ['potato', 'cheese'], 
    xp: 140, time: '30 min',
    desc: 'Crocante por fora, macia por dentro.',
    steps: ['Rale a batata crua.', 'Frite em formato de disco com queijo no meio.']
  },
  { 
    name: 'Nhoque da Fortuna', 
    category: 'refeicao',
    ingredients: ['potato', 'flour', 'egg'], 
    xp: 180, time: '1h',
    desc: 'Diz a lenda que traz dinheiro.',
    steps: ['Faça a massa com batata e farinha.', 'Corte rolinhos.', 'Cozinhe em água fervente.']
  },
  { 
    name: 'Frango Grelhado Fit', 
    category: 'refeicao',
    ingredients: ['chicken'], 
    xp: 110, time: '15 min',
    desc: 'Para quem está no "projeto verão".',
    steps: ['Tempere o frango.', 'Grelhe em frigideira quente.']
  },
  { 
    name: 'Parmegiana de Frango', 
    category: 'refeicao',
    ingredients: ['chicken', 'tomato', 'cheese', 'flour'], 
    xp: 300, time: '45 min',
    desc: 'Um clássico de domingo.',
    steps: ['Empane e frite o frango.', 'Cubra com molho e queijo.', 'Gratine.']
  },
  { 
    name: 'Almôndegas ao Sugo', 
    category: 'refeicao',
    ingredients: ['meat', 'egg', 'tomato'], 
    xp: 200, time: '40 min',
    desc: 'Perfeitas com macarrão ou no pão.',
    steps: ['Faça bolinhas de carne.', 'Cozinhe no molho de tomate.']
  },
  { 
    name: 'Massa Fresca', 
    category: 'refeicao',
    ingredients: ['flour', 'egg'], 
    xp: 220, time: '1h',
    desc: 'A base da culinária italiana.',
    steps: ['Misture farinha e ovos.', 'Sove e corte.']
  },
  { 
    name: 'Pizza Margherita', 
    category: 'refeicao',
    ingredients: ['flour', 'water', 'tomato', 'cheese'], 
    xp: 250, time: '1h 30min',
    desc: 'A rainha das pizzas.',
    steps: ['Faça a massa.', 'Cubra com molho e queijo.', 'Forno máximo!']
  },
  { 
    name: 'Pizza de Frango c/ Catupiry', 
    category: 'refeicao',
    ingredients: ['flour', 'water', 'chicken', 'cheese'], 
    xp: 280, time: '1h 40min',
    desc: 'A preferida dos brasileiros.',
    steps: ['Massa base.', 'Recheie com frango e queijo cremoso.']
  },

  // --- CATEGORIA: DOCES (Sobremesas) ---
  { 
    name: 'Bolo de Caneca', 
    category: 'doce',
    ingredients: ['egg', 'flour', 'sugar', 'chocolate'], 
    xp: 90, time: '3 min',
    desc: 'Salvação da madrugada.',
    steps: ['Misture tudo na caneca.', 'Micro-ondas por 3 minutos.']
  },
  { 
    name: 'Brigadeiro de Colher', 
    category: 'doce',
    ingredients: ['milk', 'sugar', 'chocolate'], 
    xp: 150, time: '15 min',
    desc: 'Patrimônio nacional.',
    steps: ['Cozinhe leite e açúcar até reduzir.', 'Adicione chocolate e mexa.']
  },
  { 
    name: 'Mousse de Chocolate', 
    category: 'doce',
    ingredients: ['chocolate', 'egg', 'sugar'], 
    xp: 200, time: '4h (geladeira)',
    desc: 'Aerado, leve e perigoso.',
    steps: ['Bata claras em neve.', 'Derreta chocolate.', 'Misture tudo delicadamente.']
  },
  { 
    name: 'Bolo de Chocolate Real', 
    category: 'doce',
    ingredients: ['flour', 'sugar', 'egg', 'chocolate', 'milk'], 
    xp: 350, time: '1h',
    desc: 'Para aniversários ou dias tristes.',
    steps: ['Bata a massa.', 'Asse em forno médio.']
  },

  // --- CATEGORIA: LENDARIO (Especiais) ---
  { 
    name: 'Strogonoff Sagrado', 
    category: 'legendario',
    ingredients: ['meat', 'tomato', 'milk', 'magic_spice'], 
    xp: 1000, time: '40 min',
    desc: 'O prato supremo com o toque secreto.',
    steps: ['Doure a carne.', 'Faça o molho.', 'Finalize com magia.']
  },
  { 
    name: 'Frango Lendário', 
    category: 'legendario',
    ingredients: ['chicken', 'potato', 'magic_spice'], 
    xp: 900, time: '1h 20min',
    desc: 'Assado que restaura 100% de HP.',
    steps: ['Tempere com a especiaria mágica.', 'Asse com batatas.']
  },
  { 
    name: 'Elixir da Vida (Sopa)', 
    category: 'legendario',
    ingredients: ['water', 'potato', 'chicken', 'magic_spice'], 
    xp: 850, time: '50 min',
    desc: 'Cura resfriado e coração partido.',
    steps: ['Cozinhe tudo junto.', 'Sirva bem quente.']
  },
  { 
    name: 'Bolo Mágico', 
    category: 'legendario',
    ingredients: ['flour', 'sugar', 'egg', 'milk', 'magic_spice'], 
    xp: 2000, time: '???',
    desc: 'Uma receita que muda de sabor a cada mordida.',
    steps: ['Faça a massa.', 'Adicione o pó mágico.', 'Asse e veja a magia.']
  }
];
