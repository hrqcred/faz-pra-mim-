export interface Servico {
  id: string;
  titulo: string;
  descricao: string;
  preco: number;
  prazoEntrega: string;
  vendedor: {
    nome: string;
    nivel: "Novato" | "Ativo" | "Profissional" | "Expert" | "Elite";
    nota: number;
    vendas: number;
    avatar: string;
  };
  tags: string[];
  categoria: string;
  destaque?: boolean;
}

export const servicos: Servico[] = [
  {
    id: "1",
    titulo: "Eu vou gravar seu vídeo comercial com entrega expressa",
    descricao:
      "Vídeo profissional gravado com smartphone de última geração, áudio limpo e fala natural. Ideal para anúncios e redes sociais.",
    preco: 40,
    prazoEntrega: "24h",
    vendedor: {
      nome: "Igor L.",
      nivel: "Elite",
      nota: 4.95,
      vendas: 3426,
      avatar: "IL",
    },
    tags: ["Entrega rápida", "UGC", "Comercial"],
    categoria: "Vídeo Comercial",
    destaque: true,
  },
  {
    id: "2",
    titulo: "Eu vou gravar o vídeo mais natural sobre seu produto",
    descricao:
      "Depoimento natural e espontâneo sobre seu produto ou serviço. Gravação com qualidade profissional e entrega rápida.",
    preco: 50,
    prazoEntrega: "2 dias",
    vendedor: {
      nome: "Jonathan A.",
      nivel: "Elite",
      nota: 5.0,
      vendas: 2452,
      avatar: "JA",
    },
    tags: ["Depoimento", "Natural", "Produto"],
    categoria: "Depoimento",
    destaque: true,
  },
  {
    id: "3",
    titulo: "Eu vou dar voz e imagem impactantes pro seu negócio em 3h",
    descricao:
      "Vídeo com presença forte, dicção clara e cenário profissional. Entrega ultra-rápida em até 3 horas.",
    preco: 80,
    prazoEntrega: "3h",
    vendedor: {
      nome: "Monique F.",
      nivel: "Elite",
      nota: 5.0,
      vendas: 2970,
      avatar: "MF",
    },
    tags: ["Entrega 3h", "Impactante", "Cenário profissional"],
    categoria: "Vídeo Comercial",
    destaque: true,
  },
  {
    id: "4",
    titulo: "Eu vou fazer locução profissional para seu projeto",
    descricao:
      "Narração e locução com voz profissional. Áudio masterizado, pronto para usar em anúncios, vídeos e podcasts.",
    preco: 50,
    prazoEntrega: "24h",
    vendedor: {
      nome: "Ricardo S.",
      nivel: "Elite",
      nota: 5.0,
      vendas: 2302,
      avatar: "RS",
    },
    tags: ["Locução", "Narração", "Áudio profissional"],
    categoria: "Narração",
  },
  {
    id: "5",
    titulo: "Eu vou fazer um comercial sobre o seu produto/serviço",
    descricao:
      "Comercial criativo com roteiro personalizado. Vídeo persuasivo que converte visualizações em vendas.",
    preco: 50,
    prazoEntrega: "2 dias",
    vendedor: {
      nome: "Brunna L.",
      nivel: "Elite",
      nota: 4.95,
      vendas: 3192,
      avatar: "BL",
    },
    tags: ["Comercial", "Roteiro", "Persuasivo"],
    categoria: "Vídeo Comercial",
    destaque: true,
  },
  {
    id: "6",
    titulo: "Eu vou gravar o melhor vídeo em até 24h",
    descricao:
      "Gravação com iPhone 15 Pro Max, áudio limpo e fala natural. Edição e cortes inclusos. A melhor da plataforma!",
    preco: 50,
    prazoEntrega: "24h",
    vendedor: {
      nome: "Elaine R.",
      nivel: "Expert",
      nota: 5.0,
      vendas: 798,
      avatar: "ER",
    },
    tags: ["iPhone 15", "Edição inclusa", "24h"],
    categoria: "Vídeo Comercial",
  },
  {
    id: "7",
    titulo: "Eu vou fazer a melhor propaganda/depoimento UGC em 24h",
    descricao:
      "Conteúdo UGC autêntico para sua marca. Propaganda ou depoimento com linguagem natural e envolvente.",
    preco: 60,
    prazoEntrega: "2 dias",
    vendedor: {
      nome: "Fernanda G.",
      nivel: "Expert",
      nota: 5.0,
      vendas: 837,
      avatar: "FG",
    },
    tags: ["UGC", "Propaganda", "Depoimento"],
    categoria: "UGC",
  },
  {
    id: "8",
    titulo: "Eu vou transformar seu texto em narração incrível",
    descricao:
      "Locução profissional com voz grave ou aguda, para qualquer tipo de projeto. Entrega ágil e masterização inclusa.",
    preco: 40,
    prazoEntrega: "24h",
    vendedor: {
      nome: "Anderson D.",
      nivel: "Elite",
      nota: 4.95,
      vendas: 1832,
      avatar: "AD",
    },
    tags: ["Narração", "Locução", "Masterização"],
    categoria: "Narração",
  },
  {
    id: "9",
    titulo: "Eu vou fazer vídeo/VSL/UGC com qualidade premium",
    descricao:
      "Vídeos de alta qualidade para VSL, UGC ou comerciais. Cenário profissional, iluminação e áudio impecáveis.",
    preco: 100,
    prazoEntrega: "2 dias",
    vendedor: {
      nome: "Patricia M.",
      nivel: "Expert",
      nota: 4.95,
      vendas: 360,
      avatar: "PM",
    },
    tags: ["VSL", "UGC", "Premium", "Cenário profissional"],
    categoria: "VSL",
  },
  {
    id: "10",
    titulo: "Eu vou fazer a melhor propaganda do seu produto",
    descricao:
      "Propaganda envolvente com linguagem persuasiva. Ideal para anúncios em redes sociais e Google Ads.",
    preco: 40,
    prazoEntrega: "24h",
    vendedor: {
      nome: "João P.",
      nivel: "Expert",
      nota: 4.95,
      vendas: 536,
      avatar: "JP",
    },
    tags: ["Propaganda", "Anúncios", "Redes sociais"],
    categoria: "Vídeo Comercial",
  },
  {
    id: "11",
    titulo: "Eu vou fazer o comercial do seu produto em até 24h",
    descricao:
      "Comercial rápido e profissional. Entrega em até 24 horas com qualidade de imagem e áudio superiores.",
    preco: 40,
    prazoEntrega: "24h",
    vendedor: {
      nome: "Mônica V.",
      nivel: "Elite",
      nota: 4.95,
      vendas: 771,
      avatar: "MV",
    },
    tags: ["Comercial", "24h", "Rápido"],
    categoria: "Vídeo Comercial",
  },
  {
    id: "12",
    titulo: "Eu vou fazer propaganda UGC para sua marca",
    descricao:
      "Conteúdo UGC autêntico e persuasivo. Ideal para marcas que querem depoimentos reais com aparência natural.",
    preco: 40,
    prazoEntrega: "3 dias",
    vendedor: {
      nome: "Elen S.",
      nivel: "Expert",
      nota: 5.0,
      vendas: 188,
      avatar: "ES",
    },
    tags: ["UGC", "Marca", "Autêntico"],
    categoria: "UGC",
  },
  {
    id: "13",
    titulo: "Eu vou gravar vídeo do seu produto/serviço em até 6h",
    descricao:
      "Entrega ultra-rápida em 6 horas. Vídeo com qualidade profissional e fala natural sobre qualquer produto.",
    preco: 50,
    prazoEntrega: "6h",
    vendedor: {
      nome: "Amanda F.",
      nivel: "Elite",
      nota: 4.95,
      vendas: 2293,
      avatar: "AF",
    },
    tags: ["Entrega 6h", "Rápido", "Produto"],
    categoria: "Vídeo Comercial",
  },
  {
    id: "14",
    titulo: "Eu vou gravar a melhor propaganda para o seu negócio",
    descricao:
      "Propaganda completa com roteiro, gravação e edição. Perfeito para pequenos e médios negócios.",
    preco: 40,
    prazoEntrega: "24h",
    vendedor: {
      nome: "Gabriela B.",
      nivel: "Expert",
      nota: 4.95,
      vendas: 362,
      avatar: "GB",
    },
    tags: ["Propaganda", "Negócio", "Edição inclusa"],
    categoria: "Vídeo Comercial",
  },
  {
    id: "15",
    titulo: "Eu vou criar um vídeo com edição profissional inclusa",
    descricao:
      "Vídeo gravado e editado profissionalmente. Cortes, legendas e trilha sonora inclusos no pacote.",
    preco: 100,
    prazoEntrega: "2 dias",
    vendedor: {
      nome: "Leticia C.",
      nivel: "Expert",
      nota: 5.0,
      vendas: 534,
      avatar: "LC",
    },
    tags: ["Edição", "Legendas", "Trilha sonora"],
    categoria: "Vídeo Editado",
  },
  {
    id: "16",
    titulo: "Eu vou fazer propaganda para Serviço/Produto/VSL",
    descricao:
      "Depoimentos e propagandas incríveis para seu produto. Linguagem natural e alta conversão.",
    preco: 40,
    prazoEntrega: "2 dias",
    vendedor: {
      nome: "Diego D.",
      nivel: "Elite",
      nota: 4.95,
      vendas: 1008,
      avatar: "DD",
    },
    tags: ["VSL", "Produto", "Alta conversão"],
    categoria: "VSL",
  },
  {
    id: "17",
    titulo: "Eu vou gravar vídeo comercial rápido e natural",
    descricao:
      "Comercial com linguagem do dia a dia, sem parecer forçado. Ideal para depoimentos e provas sociais.",
    preco: 40,
    prazoEntrega: "2 dias",
    vendedor: {
      nome: "Wiliam B.",
      nivel: "Elite",
      nota: 4.95,
      vendas: 1198,
      avatar: "WB",
    },
    tags: ["Natural", "Prova social", "Depoimento"],
    categoria: "Depoimento",
  },
  {
    id: "18",
    titulo: "Eu vou fazer comercial do seu produto em 24h",
    descricao:
      "Vídeo comercial com qualidade profissional e entrega garantida em 24 horas. Ideal para quem tem pressa.",
    preco: 80,
    prazoEntrega: "24h",
    vendedor: {
      nome: "Luciana C.",
      nivel: "Expert",
      nota: 4.95,
      vendas: 495,
      avatar: "LC2",
    },
    tags: ["Comercial", "24h", "Profissional"],
    categoria: "Vídeo Comercial",
  },
  {
    id: "19",
    titulo: "Eu vou gravar super vídeo comercial em menos de 24h",
    descricao:
      "Vídeo com presença de câmera, dicção clara e cenário clean. Entrega em menos de 24 horas.",
    preco: 60,
    prazoEntrega: "24h",
    vendedor: {
      nome: "Joan F.",
      nivel: "Expert",
      nota: 4.95,
      vendas: 264,
      avatar: "JF",
    },
    tags: ["Comercial", "24h", "Dicção"],
    categoria: "Vídeo Comercial",
  },
  {
    id: "20",
    titulo: "Eu vou fazer seu vídeo com cenário de placa solar em 3h",
    descricao:
      "Vídeo com cenário real de energia solar. Perfeito para empresas do segmento de energia e sustentabilidade.",
    preco: 120,
    prazoEntrega: "3h",
    vendedor: {
      nome: "Monique F.",
      nivel: "Elite",
      nota: 5.0,
      vendas: 2970,
      avatar: "MF2",
    },
    tags: ["Placa solar", "Cenário real", "Energia", "Entrega 3h"],
    categoria: "Vídeo com Cenário",
  },
];

export const categorias = [
  "Todos",
  "Vídeo Comercial",
  "Depoimento",
  "UGC",
  "VSL",
  "Narração",
  "Vídeo Editado",
  "Vídeo com Cenário",
];

export const tagsPopulares = [
  "Entrega rápida",
  "UGC",
  "Comercial",
  "Depoimento",
  "VSL",
  "Natural",
  "24h",
  "Edição inclusa",
  "Cenário profissional",
  "Narração",
];
