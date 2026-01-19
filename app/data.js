// app/data.js

// --- INGREDIENTES (LOJA) ---
export const ingredientes = [
  // Básicos (Common)
  { id: 'water', icon: '💧', name: 'Água', rarity: 'common' },
  { id: 'flour', icon: '🌾', name: 'Farinha', rarity: 'common' },
  { id: 'sugar', icon: '🍬', name: 'Açúcar', rarity: 'common' },
  { id: 'egg', icon: '🥚', name: 'Ovo', rarity: 'common' },
  { id: 'bread', icon: '🍞', name: 'Pão', rarity: 'common' },
  { id: 'potato', icon: '🥔', name: 'Batata', rarity: 'common' },
  { id: 'tomato', icon: '🍅', name: 'Tomate', rarity: 'common' },
  
  // Refinados (Rare)
  { id: 'cheese', icon: '🧀', name: 'Queijo', rarity: 'rare' },
  { id: 'meat', icon: '🥩', name: 'Carne', rarity: 'rare' },
  { id: 'milk', icon: '🥛', name: 'Leite', rarity: 'rare' },
  { id: 'chocolate', icon: '🍫', name: 'Chocolate', rarity: 'rare' },
  { id: 'coffee', icon: '☕', name: 'Café', rarity: 'rare' },
  
  // Especiais (Epic/Legendary)
  { id: 'chicken', icon: '🍗', name: 'Frango', rarity: 'epic' },
  { id: 'magic_spice', icon: '✨', name: 'Tempero Mágico', rarity: 'legendary' },
];

// --- LIVRO DE RECEITAS (30 ITENS) ---
export const receitas = [
  // --- NÍVEL 1: CAFÉ DA MANHÃ & LANCHES (XP BAIXO) ---
  { 
    name: 'Pão com Manteiga (Fake)', 
    ingredients: ['bread'], 
    xp: 10, 
    time: '1 min',
    desc: 'Às vezes, a simplicidade é tudo.',
    steps: ['Pegue o pão.', 'Passe o que tiver na geladeira.', 'Coma.']
  },
  { 
    name: 'Ovo Cozido', 
    ingredients: ['egg', 'water'], 
    xp: 20, 
    time: '10 min',
    desc: 'Uma fonte sólida de proteína.',
    steps: ['Ferva a água.', 'Coloque o ovo com cuidado.', 'Cozinhe por 7 a 10 minutos.']
  },
  { 
    name: 'Misto Quente', 
    ingredients: ['bread', 'cheese'], 
    xp: 50, 
    time: '10 min',
    desc: 'O clássico inabalável das padarias.',
    steps: ['Aqueça a frigideira.', 'Monte o sanduíche com queijo.', 'Doure dos dois lados até o queijo derreter.']
  },
  { 
    name: 'Queijo Quente', 
    ingredients: ['bread', 'cheese', 'tomato'], 
    xp: 60, 
    time: '10 min',
    desc: 'Um upgrade suculento no misto tradicional.',
    steps: ['Monte o sanduíche com queijo e rodelas de tomate.', 'Tempere com orégano (se tiver).', 'Toste até ficar crocante.']
  },
  { 
    name: 'Omelete Simples', 
    ingredients: ['egg', 'milk'], 
    xp: 40, 
    time: '5 min',
    desc: 'Mais fofo graças ao leite.',
    steps: ['Bata os ovos com um pouco de leite.', 'Tempere.', 'Despeje na frigideira e dobre ao meio.']
  },
  { 
    name: 'Omelete Recheado', 
    ingredients: ['egg', 'cheese', 'tomato'], 
    xp: 80, 
    time: '8 min',
    desc: 'Uma refeição completa em um único prato.',
    steps: ['Faça a base do omelete.', 'Adicione queijo e tomate picado antes de dobrar.']
  },
  { 
    name: 'Café com Leite', 
    ingredients: ['coffee', 'milk'], 
    xp: 30, 
    time: '3 min',
    desc: 'O combustível oficial dos desenvolvedores.',
    steps: ['Passe o café bem forte.', 'Misture com leite quente.', 'Adicione açúcar se sua vida estiver amarga.']
  },
  { 
    name: 'Rabanada', 
    ingredients: ['bread', 'egg', 'milk', 'sugar'], 
    xp: 120, 
    time: '20 min',
    desc: 'Sabor de Natal fora de época.',
    steps: ['Corte o pão em fatias.', 'Mergulhe no leite, depois no ovo.', 'Frite e passe no açúcar.']
  },

  // --- NÍVEL 2: REFEIÇÕES (XP MÉDIO) ---
  { 
    name: 'Bife Acebolado (Sem Cebola)', 
    ingredients: ['meat'], 
    xp: 100, 
    time: '15 min',
    desc: 'Apenas a carne, no ponto certo.',
    steps: ['Aqueça bem a frigideira.', 'Sele a carne dos dois lados.', 'Deixe descansar antes de cortar.']
  },
  { 
    name: 'X-Burguer', 
    ingredients: ['bread', 'meat', 'cheese'], 
    xp: 150, 
    time: '20 min',
    desc: 'O rei do fast-food caseiro.',
    steps: ['Modele a carne.', 'Grelhe o hambúrguer.', 'Derreta o queijo por cima e monte no pão.']
  },
  { 
    name: 'Purê de Batata', 
    ingredients: ['potato', 'milk', 'cheese'], 
    xp: 130, 
    time: '25 min',
    desc: 'Cremoso, reconfortante e cheio de queijo.',
    steps: ['Cozinhe as batatas até desmanchar.', 'Amasse bem.', 'Misture leite e queijo em fogo baixo até ficar liso.']
  },
  { 
    name: 'Batata Rosti', 
    ingredients: ['potato', 'cheese'], 
    xp: 140, 
    time: '30 min',
    desc: 'Crocante por fora, macia por dentro.',
    steps: ['Rale a batata crua.', 'Esprema para tirar a água.', 'Frite em formato de disco com queijo no meio.']
  },
  { 
    name: 'Nhoque da Fortuna', 
    ingredients: ['potato', 'flour', 'egg'], 
    xp: 180, 
    time: '1h',
    desc: 'Diz a lenda que traz dinheiro.',
    steps: ['Misture batata cozida, ovo e farinha.', 'Faça rolinhos e corte.', 'Cozinhe em água fervente até subirem.']
  },
  { 
    name: 'Frango Grelhado Fit', 
    ingredients: ['chicken'], 
    xp: 110, 
    time: '15 min',
    desc: 'Para quem está no "projeto verão".',
    steps: ['Tempere o filé de frango.', 'Grelhe em frigideira bem quente para não ressecar.']
  },
  { 
    name: 'Parmegiana de Frango', 
    ingredients: ['chicken', 'tomato', 'cheese', 'flour'], 
    xp: 300, 
    time: '45 min',
    desc: 'Um clássico de domingo.',
    steps: ['Empane o frango na farinha.', 'Frite.', 'Cubra com molho de tomate e queijo.', 'Gratine no forno.']
  },
  { 
    name: 'Almôndegas ao Sugo', 
    ingredients: ['meat', 'egg', 'tomato'], 
    xp: 200, 
    time: '40 min',
    desc: 'Perfeitas com macarrão ou no pão.',
    steps: ['Misture carne e ovo.', 'Faça bolinhas.', 'Cozinhe direto no molho de tomate fervente.']
  },

  // --- NÍVEL 3: MASSAS E PIZZAS (XP ALTO) ---
  { 
    name: 'Massa Fresca', 
    ingredients: ['flour', 'egg'], 
    xp: 220, 
    time: '1h',
    desc: 'A base da culinária italiana.',
    steps: ['Faça um vulcão de farinha.', 'Quebre os ovos no meio.', 'Sove até ficar lisa e corte no formato desejado.']
  },
  { 
    name: 'Pizza Margherita', 
    ingredients: ['flour', 'water', 'tomato', 'cheese'], 
    xp: 250, 
    time: '1h 30min',
    desc: 'A rainha das pizzas.',
    steps: ['Faça a massa e deixe fermentar.', 'Abra o disco.', 'Cubra com molho e queijo.', 'Forno máximo!']
  },
  { 
    name: 'Pizza de Frango com Catupiry', 
    ingredients: ['flour', 'water', 'chicken', 'cheese'], 
    xp: 280, 
    time: '1h 40min',
    desc: 'A preferida dos brasileiros.',
    steps: ['Massa de pizza base.', 'Recheie com frango desfiado e queijo cremoso.']
  },

  // --- NÍVEL 4: DOCES E SOBREMESAS (XP ÉPICO) ---
  { 
    name: 'Bolo de Caneca', 
    ingredients: ['egg', 'flour', 'sugar', 'chocolate'], 
    xp: 90, 
    time: '3 min',
    desc: 'Salvação da madrugada.',
    steps: ['Misture tudo na caneca.', 'Micro-ondas por 3 minutos.', 'Cuidado, está quente!']
  },
  { 
    name: 'Brigadeiro de Colher', 
    ingredients: ['milk', 'sugar', 'chocolate'], 
    xp: 150, 
    time: '15 min',
    desc: 'Patrimônio nacional (versão leite caseiro).',
    steps: ['Reduza o leite com açúcar até virar leite condensado (ou use pronto).', 'Adicione chocolate.', 'Mexa até desgrudar do fundo.']
  },
  { 
    name: 'Mousse de Chocolate', 
    ingredients: ['chocolate', 'egg', 'sugar'], 
    xp: 200, 
    time: '4h (geladeira)',
    desc: 'Aerado, leve e perigoso.',
    steps: ['Separe claras e gemas.', 'Bata as claras em neve.', 'Derreta o chocolate.', 'Misture tudo delicadamente.']
  },
  { 
    name: 'Panqueca Doce', 
    ingredients: ['flour', 'milk', 'egg', 'sugar'], 
    xp: 120, 
    time: '15 min',
    desc: 'Estilo americano, fofinha.',
    steps: ['Misture os ingredientes secos e líquidos.', 'Frite discos pequenos em frigideira untada.']
  },
  { 
    name: 'Bolo de Chocolate Real', 
    ingredients: ['flour', 'sugar', 'egg', 'chocolate', 'milk'], 
    xp: 350, 
    time: '1h',
    desc: 'Para aniversários ou dias tristes.',
    steps: ['Bata a massa.', 'Asse em forno médio.', 'Faça uma calda com chocolate e leite.']
  },

  // --- NÍVEL 5: LENDÁRIOS (XP MÁXIMO - REQUER TEMPERO MÁGICO) ---
  { 
    name: 'Strogonoff Sagrado', 
    ingredients: ['meat', 'tomato', 'milk', 'magic_spice'], 
    xp: 1000, 
    time: '40 min',
    desc: 'O prato supremo com o toque secreto.',
    steps: ['Doure a carne.', 'Faça o molho rosé.', 'Adicione o Tempero Mágico no final para brilhar.']
  },
  { 
    name: 'Frango Lendário', 
    ingredients: ['chicken', 'potato', 'magic_spice'], 
    xp: 900, 
    time: '1h 20min',
    desc: 'Assado que restaura 100% de HP.',
    steps: ['Tempere o frango inteiro com a especiaria mágica.', 'Asse com batatas ao redor até dourar.']
  },
  { 
    name: 'Elixir da Vida (Sopa)', 
    ingredients: ['water', 'potato', 'chicken', 'magic_spice'], 
    xp: 850, 
    time: '50 min',
    desc: 'Cura resfriado e coração partido.',
    steps: ['Cozinhe o frango com batatas.', 'Adicione o tempero mágico.', 'Sirva bem quente.']
  },
  { 
    name: 'Bolo Mágico', 
    ingredients: ['flour', 'sugar', 'egg', 'milk', 'magic_spice'], 
    xp: 2000, 
    time: '???',
    desc: 'Uma receita que muda de sabor a cada mordida.',
    steps: ['Faça um bolo simples.', 'Adicione o pó mágico na massa.', 'Ao assar, ele cria camadas de texturas diferentes.']
  }
];
