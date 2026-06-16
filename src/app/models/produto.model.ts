export interface Produto {
  id?: number | string; // O ID é opcional porque no cadastro o banco ainda vai gerar
  nome: string;
  marca: string;
  preco: number;
  categoria: 'feminino' | 'masculino'; // Trava o tipo pra só aceitar essas duas opções
  tipo: 'perfume' | 'creme'; // Mesma coisa aqui, limita o que pode ser cadastrado
  img: string;
}

// Junta o produto que o cara escolheu com a quantidade dele no carrinho
export interface ItemCarrinho {
  id?: number | string;
  produto: Produto;
  quantidade: number;
}

// Estrutura padrão pra salvar os dados do usuário no sistema
export interface Usuario {
  id?: number | string;
  nome: string;
  email: string;
  senha: string;
}
