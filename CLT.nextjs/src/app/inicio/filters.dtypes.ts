interface Tcc {
  id: number;
  titulo: string;
  tags: string[];
  orientador: string;
  orientado: string;
  assunto: string;
  ano: number;
  curso: string;
}

export interface ProjetoFinal {
  id: number;
  titulo: string;
  aluno_nome: string;
  curso_nome: string;
  orientador_nome: string;
  data_registro: string;
  status: string;
}

const moreTccs: Tcc[] = [
  {
    id: 6,
    titulo: "Desenvolvimento de um Chatbot para Atendimento ao Cliente Utilizando NLP",
    tags: ["NLP", "Chatbot", "Python"],
    orientador: "Prof. Roberto Martins",
    orientado: "Juliana Costa",
    assunto: "Criação de um chatbot com processamento de linguagem natural para melhorar o atendimento ao cliente em plataformas online.",
    ano: 2023,
    curso: "Engenharia de Software"
  },
  {
    id: 7,
    titulo: "Análise e Visualização de Dados de Trânsito com Big Data",
    tags: ["Big Data", "Visualização de Dados", "Java"],
    orientador: "Dr. Mariana Oliveira",
    orientado: "Carlos Silva",
    assunto: "Desenvolvimento de um sistema de análise e visualização de grandes volumes de dados relacionados ao tráfego urbano.",
    ano: 2024,
    curso: "Engenharia de Computação"
  },
  {
    id: 8,
    titulo: "Implementação de um Sistema de Gestão para Estabelecimentos Comerciais",
    tags: ["JavaScript", "Node.js", "Banco de Dados"],
    orientador: "Dr. Henrique Almeida",
    orientado: "Beatriz Fernandes",
    assunto: "Criação de um sistema de gestão para pequenos e médios comércios, utilizando Node.js para o backend e JavaScript para o frontend.",
    ano: 2022,
    curso: "Sistemas de Informação"
  },
  {
    id: 9,
    titulo: "Aplicação de Redes Neurais para Previsão de Demanda de Produtos",
    tags: ["Machine Learning", "Redes Neurais", "Python"],
    orientador: "Prof. Gabriel Santos",
    orientado: "Laura Pereira",
    assunto: "Uso de redes neurais para prever a demanda de produtos em e-commerce, visando otimizar o gerenciamento de estoque.",
    ano: 2023,
    curso: "Ciência da Computação"
  },
  {
    id: 10,
    titulo: "Desenvolvimento de um Sistema de Automação Residencial com IoT",
    tags: ["IoT", "Automação", "C++"],
    orientador: "Prof. Ana Beatriz",
    orientado: "Pedro Lima",
    assunto: "Criação de um sistema de automação residencial utilizando dispositivos IoT para controle de iluminação, temperatura e segurança.",
    ano: 2024,
    curso: "Engenharia de Computação"
  },
  {
    id: 11,
    titulo: "Sistema de Recomendação de Filmes com Algoritmos de Filtragem Colaborativa",
    tags: ["Filtragem Colaborativa", "Machine Learning", "Java"],
    orientador: "Dr. Luís Costa",
    orientado: "Fernanda Souza",
    assunto: "Desenvolvimento de um sistema de recomendação de filmes utilizando algoritmos de filtragem colaborativa para proporcionar recomendações personalizadas.",
    ano: 2021,
    curso: "Engenharia de Software"
  },
  {
    id: 12,
    titulo: "Criação de uma Plataforma de Ensino a Distância com React e Firebase",
    tags: ["React", "Firebase", "Educação"],
    orientador: "Prof. Júlio Mendes",
    orientado: "Camila Oliveira",
    assunto: "Desenvolvimento de uma plataforma de ensino a distância utilizando React para a interface e Firebase para o backend e gerenciamento de dados.",
    ano: 2024,
    curso: "Arquitetura"
  },
  {
    id: 13,
    titulo: "Análise de Sentimentos em Dados de Redes Sociais com Técnicas de Machine Learning",
    tags: ["Análise de Sentimentos", "Machine Learning", "Python"],
    orientador: "Prof. Mariana Silva",
    orientado: "Roberto Lima",
    assunto: "Implementação de técnicas de machine learning para análise de sentimentos em postagens e comentários de redes sociais.",
    ano: 2022,
    curso: "Ciência da Computação"
  },
  {
    id: 14,
    titulo: "Desenvolvimento de um Sistema de Monitoramento de Saúde com Wearables",
    tags: ["Wearables", "Monitoramento de Saúde", "IoT"],
    orientador: "Dr. Claudia Martins",
    orientado: "Thiago Santos",
    assunto: "Criação de um sistema de monitoramento de saúde utilizando dispositivos vestíveis para coletar e analisar dados de saúde em tempo real.",
    ano: 2023,
    curso: "Engenharia de Produção"
  },
  {
    id: 15,
    titulo: "Aplicação de Técnicas de Realidade Aumentada em Jogos Educacionais",
    tags: ["Realidade Aumentada", "Jogos Educacionais", "Unity"],
    orientador: "Prof. Felipe Rodrigues",
    orientado: "Isabela Carvalho",
    assunto: "Desenvolvimento de jogos educacionais utilizando técnicas de realidade aumentada para melhorar a experiência de aprendizado.",
    ano: 2023,
    curso: "Engenharia de Computação"
  },
  {
    id: 16,
    titulo: "Criação de um Portal de Notícias com Integração de API de Dados",
    tags: ["API", "Desenvolvimento Web", "React"],
    orientador: "Dr. André Lima",
    orientado: "Juliana Gomes",
    assunto: "Desenvolvimento de um portal de notícias com integração a APIs externas para fornecer conteúdos atualizados e personalizados.",
    ano: 2024,
    curso: "Sistemas de Informação"
  },
];

const tags = [
  "feature",
  "bug",
  "enhancement",
  "documentation",
  "design",
  "question",
  "maintenance",
  "NLP",
  "Chatbot",
  "Python",
  "Big Data",
  "Visualização de Dados",
  "Java",
  "JavaScript",
  "Node.js",
  "Banco de Dados",
  "Machine Learning",
  "Redes Neurais",
  "C++",
  "IoT",
  "Automação",
  "Filtragem Colaborativa",
  "Educação",
  "React",
  "Firebase",
  "Análise de Sentimentos",
  "Wearables",
  "Monitoramento de Saúde",
  "Realidade Aumentada",
  "Jogos Educacionais",
  "Unity",
  "API",
  "Desenvolvimento Web"
];

const cursos = [
  "Sistemas de Informação",
  "Arquitetura",
  "Engenharia de Software",
  "Ciência da Computação",
  "Engenharia de Computação",
  "Engenharia de Produção",
  "Engenharia Mecânica",
  "Engenharia Civil",
  "Engenharia Elétrica",
  "Engenharia Química",
  "Engenharia de Alimentos",
  "Engenharia Ambiental",
];

export {
  moreTccs,
  tags,
  cursos,
};
