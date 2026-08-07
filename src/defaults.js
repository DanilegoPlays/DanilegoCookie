import Vovo1 from './arte/Vovo1.png';
import Vovo2 from './arte/Vovo2.png';
import Vovo3 from './arte/Vovo3.png';
import Fazenda from './arte/Fazenda.png';
import Fazenda_d from './arte/Fazenda_d.png';
import Fabrica from './arte/Fabrica.png';
import Fabrica_d from './arte/Fabrica_d.png';
import Karaj from './arte/Karaj.png';
import Karaj_d from './arte/Karaj_d.png'
import Mina from './arte/Minas.png';
import Mina_d from './arte/Minas_d.png';
import PC from './arte/PC.png';
import Cursor from './arte/Cursor.png';
import Bancos from './arte/Bancos.png';
import Bancos_d from './arte/Bancos_d.png';
import Torre from './arte/Torre.png';
import Lab from './arte/Lab.png';
import { velocityPerSecond } from 'framer-motion';

// Estruturas padrão para construções e melhorias
export const DEFAULT_CONSTRUCOES = [
    {nome: "Vovó", preço: 15, cps: 1111110.5, quantidade: 0, quantidadeGratis: 0, descricao: "Uma vovó para assar cookies fresquinhos do forno", icone: Vovo1, icone_pequeno: Vovo3},
    {nome: "Fazenda", preço: 100, cps: 1.5, quantidade: 0, descricao: "As Fazendas plantam e colhem Pés de Cookie", icone: Fazenda, icone_pequeno: Fazenda},
    {nome: "Mina", preço: 1000, cps: 8, quantidade: 0, descricao: "As Minas mineram Cookie Mineral direto da terra!", icone: Mina, icone_pequeno: Mina},
    {nome: "Fábrica", preço: 11000, cps: 45, quantidade: 0, descricao: "As Fábricas produzem cookies em larga escala", icone: Fabrica, icone_pequeno: Fabrica},
    {nome: "Computador", preço: 120_000, cps: 300, quantidade: 0, descricao: "O Computador produz cookies a partir do código do próprio jogo!", icone: PC, icone_pequeno: PC},
    {nome: "Banco", preço: 1_500_000, cps: 1600, quantidade: 0, descricao: "Os Bancos produzem cookies a partir de empréstimos", icone: Bancos, icone_pequeno: Bancos},
    {nome: "Templo de Karaj", preço: 77_777_000, cps: 7777, quantidade: 0, descricao: "Os Templos louvam os Deuses dos Cookies, que entregam cookies diretamente a você!", icone: Karaj, icone_pequeno: Karaj},
    {nome: "Laboratório", preço: 400_000_000, cps: 50_000, quantidade: 0, descricao: "Os laboratórios criam Cookies usando CIÊNCIA!", icone: Lab, icone_pequeno: Lab},
    {nome: "Torre", preço: 5_100_000_000, cps: 300_000, quantidade: 0, descricao: "As torres criam Cookies usanso magia!", icone: Torre, icone_pequeno: Torre}
    //{nome: "Cassino da Sorte", preço: 77_777_777_777, cps: 1_777_777, quantidade: 0, descricao: "Pessoas apostam seus cookies no Cassino da Sorte, e você ganha uma parte! A Casa sempre vence!", icone: PC, icone_pequeno: PC},
    //{nome: "Portal", preço: 1_000_000_000_000, cps: 10_000_000, quantidade: 0, descricao: "Trazem Cookies de outra dimensão... com certeza nada de ruim pode vir disso...", icone: PC, icone_pequeno: PC}
  ];
export const DEFAULT_MELHORIAS = [
    // Click
    {nome: "Double Click", preço: 100, efeito:'duplicarClick', id: 'click1', comprado: false, descricao: "Clicar 2 vezes é melhor que uma! \n Clique 2 vezes mais eficiente!"},
    {nome: "Click Aquecido", preço: 500, efeito:'duplicarClick', id: 'click2', comprado: false, descricao: "Seu clique é aquecido para assar cookies mais rápido! \n Clique 2 vezes mais eficiente!"},
    {nome: "Click Incrível", preço: 10000, efeito:'duplicarClick', id: 'click3', comprado: false, descricao: "Você clica com mais vontade! \n Clique 2 vezes mais eficiente!"},

    {nome: "Super Mouse", preço: 30000, efeito:'clickCPS', id: 'clickcps1', comprado: false, descricao: "Seu Mouse ganha super poderes! \n O Clique ganha 2% do seu CPS"},
    {nome: "Mouse de Cobre", preço: 3_000_000, efeito:'clickCPS', id: 'clickcps2', comprado: false, descricao: "Seu Mouse é encapado com uma camada de cobre \n O Clique ganha 2% do seu CPS"},
    {nome: "Mouse de Aço", preço: 300_000_000, efeito:'clickCPS', id: 'clickcps3', comprado: false, descricao: "Seu Mouse é encapado com uma camada de aço puro. \n O Clique ganha 2% do seu CPS"},
    {nome: "Mouse de Ouro", preço: 30_000_000_000, efeito:'clickCPS', id: 'clickcps4', comprado: false, descricao: "Seu Mouse é encapado com uma camada de ouro. \n O Clique ganha 2% do seu CPS"},
    {nome: "Mouse de Vibrânio", preço: 3_000_000_000_000, efeito:'clickCPS', id: 'clickcps5', comprado: false, descricao: "Seu Mouse é enriquecido com Vibrânio diretamente de Wakanda. \n O Clique ganha 2% do seu CPS"},
    // Vovó
    {nome: "Treinamento da Vovó", preço: 100, efeito:'duplicarVovo', id: 'vovo1', comprado: false, descricao: "Vovós 2 vezes mais eficientes!", spriteX: 0, spriteY: 2},
    {nome: "Fornos de Cookie", preço: 500, efeito:'duplicarVovo', id: 'vovo2', comprado: false, descricao: "Vovós 2 vezes mais eficientes!", spriteX: 2, spriteY: 2},
    {nome: "Dentaduras Novas", preço: 10000, efeito:'duplicarVovo', id: 'vovo3', comprado: false, descricao: "Vovós 2 vezes mais eficientes!", spriteX: 3, spriteY: 2},
    {nome: "Vovós Extra Velhas", preço: 100_000, efeito:'duplicarVovo', id: 'vovo4', comprado: false, descricao: "Vovós 2 vezes mais eficientes!", spriteX: 4, spriteY: 2},
    {nome: "Vovós Unidas", preço: 10_000_000, efeito:'duplicarVovo', id: 'vovo5', comprado: false, descricao: "Vovós 2 vezes mais eficientes!", spriteX: 5, spriteY: 2},
    {nome: "Vovós... Vovós?", preço: 100_000_000, efeito:'duplicarVovo', id: 'vovo6', comprado: false, descricao: "Vovós 2 vezes mais eficientes!"},
    // Fazenda
    {nome: "Enxada de Pedra", preço: 1000, efeito:'duplicarFazenda', id: 'fazenda1', comprado: false, descricao: "Fazendas 2 vezes mais eficientes!", spriteX: 0, spriteY: 3},
    {nome: "Fertilizante", preço: 5000, efeito:'duplicarFazenda', id: 'fazenda2', comprado: false, descricao: "Fazendas 2 vezes mais eficientes!", spriteX: 1, spriteY: 3},
    {nome: "Enxada de Ferro", preço: 50_000, efeito:'duplicarFazenda', id: 'fazenda3', comprado: false, descricao: "Fazendas 2 vezes mais eficientes!", spriteX: 2, spriteY: 3},
    {nome: "Mais Hectares", preço: 5_000_000, efeito:'duplicarFazenda', id: 'fazenda4', comprado: false, descricao: "Fazendas 2 vezes mais eficientes!", spriteX: 3, spriteY: 3},
    {nome: "Novos Tratores", preço: 500_000_000, efeito:'duplicarFazenda', id: 'fazenda5', comprado: false, descricao: "Fazendas 2 vezes mais eficientes!", spriteX: 4, spriteY: 3},
    {nome: "Aspersores de Irídio", preço: 50_000_000_000, efeito:'duplicarFazenda', id: 'fazenda6', comprado: false, descricao: "Fazendas 2 vezes mais eficientes!"},
    // Minas
    {nome: "Picareta de Madeira", preço: 11_000, efeito:'duplicarMinas', id: 'mina1', comprado: false, descricao: "Minas 2 vezes mais eficientes!", spriteX: 0, spriteY: 4},
    {nome: "Picareta de Pedra", preço: 55_000, efeito:'duplicarMinas', id: 'mina2', comprado: false, descricao: "Minas 2 vezes mais eficientes!", spriteX: 1, spriteY: 4},
    {nome: "Picareta de Ouro", preço: 555_000, efeito:'duplicarMinas', id: 'mina3', comprado: false, descricao: "Minas 2 vezes mais eficientes!", spriteX: 2, spriteY: 4},
    {nome: "Picareta de Ferro", preço: 55_000_000, efeito:'duplicarMinas', id: 'mina4', comprado: false, descricao: "Minas 2 vezes mais eficientes!", spriteX: 3, spriteY: 4},
    {nome: "Picareta de Diamante", preço: 5_500_000_000, efeito:'duplicarMinas', id: 'mina5', comprado: false, descricao: "Minas 2 vezes mais eficientes!", spriteX: 4, spriteY: 4},
    {nome: "Picareta de Diamante", preço: 550_000_000_000, efeito:'duplicarMinas', id: 'mina6', comprado: false, descricao: "Minas 2 vezes mais eficientes!"},
    // Fábrica
    {nome: "Engrenagens Melhores", preço: 120_000, efeito:'duplicarFabrica', id: 'fabrica1', comprado: false, descricao: "Fábricas 2 vezes mais eficientes!", spriteX: 0, spriteY: 5},
    {nome: "Energia Sustentável", preço: 600_000, efeito:'duplicarFabrica', id: 'fabrica2', comprado: false, descricao: "Fábricas 2 vezes mais eficientes!", spriteX: 1, spriteY: 5},
    {nome: "Trabalhadores Rápidos", preço: 6_000_000, efeito:'duplicarFabrica', id: 'fabrica3', comprado: false, descricao: "Fábricas 2 vezes mais eficientes!", spriteX: 2, spriteY: 5},
    {nome: "Super Fábrica", preço: 600_000_000, efeito:'duplicarFabrica', id: 'fabrica4', comprado: false, descricao: "Fábricas 2 vezes mais eficientes!", spriteX: 3, spriteY: 5},
    {nome: "Automação", preço: 60_000_000_000, efeito:'duplicarFabrica', id: 'fabrica5', comprado: false, descricao: "Fábricas 2 vezes mais eficientes!", spriteX: 4, spriteY: 5},
    {nome: "Automação", preço: 6_000_000_000_000, efeito:'duplicarFabrica', id: 'fabrica6', comprado: false, descricao: "Fábricas 2 vezes mais eficientes!"},
    // Computador
    {nome: "Refrigeração", preço: 1_300_000, efeito:'duplicarPC', id: 'PC1', comprado: false, descricao: "Computadores 2 vezes mais eficientes!"},
    {nome: "Atualização de Software", preço: 6_500_000, efeito:'duplicarPC', id: 'PC2', comprado: false, descricao: "Computadores 2 vezes mais eficientes!"},
    {nome: "Novo Processador", preço: 65_000_000, efeito:'duplicarPC', id: 'PC3', comprado: false, descricao: "Computadores 2 vezes mais eficientes!"},
    {nome: "Memória SSD", preço: 6_500_000_000, efeito:'duplicarPC', id: 'PC4', comprado: false, descricao: "Tá caro demais essa memória RAM! Computadores 2 vezes mais eficientes!"},
    {nome: "Formatação", preço: 650_000_000_000, efeito:'duplicarPC', id: 'PC5', comprado: false, descricao: "Computadores 2 vezes mais eficientes!"},
    {nome: "Mais Memória RAM", preço: 65_000_000_000_000, efeito:'duplicarPC', id: 'PC6', comprado: false, descricao: "Computadores 2 vezes mais eficientes!"},
    // Banco
    {nome: "Cartão Sem Anuidade", preço: 14_000_000, efeito:'duplicarBanco', id: 'banco1', comprado: false, descricao: "Bancos 2 vezes mais eficientes!", spriteX: 0, spriteY: 7},
    {nome: "Cofres de Cookie", preço: 70_000_000, efeito:'duplicarBanco', id: 'banco2', comprado: false, descricao: "Bancos 2 vezes mais eficientes!", spriteX: 1, spriteY: 7},
    {nome: "Juros Compostos", preço: 700_000_000, efeito:'duplicarBanco', id: 'banco3', comprado: false, descricao: "Bancos 2 vezes mais eficientes!", spriteX: 2, spriteY: 7},
    {nome: "Super Banco", preço: 70_000_000_000, efeito:'duplicarBanco', id: 'banco4', comprado: false, descricao: "Bancos 2 vezes mais eficientes!", spriteX: 3, spriteY: 7},
    {nome: "Corretores Corredores", preço: 7_000_000_000_000, efeito:'duplicarBanco', id: 'banco5', comprado: false, descricao: "Bancos 2 vezes mais eficientes!", spriteX: 4, spriteY: 7},
    {nome: "Corretores Corredores", preço: 700_000_000_000_000, efeito:'duplicarBanco', id: 'banco5', comprado: false, descricao: "Bancos 2 vezes mais eficientes!", spriteX: 4, spriteY: 7},
    // Karaj
    {nome: "Torres mais Pontudas", preço: 177_777_777, efeito:'duplicarTemplo', id: 'karaj1', comprado: false, descricao: "Templos 2 vezes mais eficientes!"},
    {nome: "Festival do Sol", preço: 777_777_777, efeito:'duplicarTemplo', id: 'karaj2', comprado: false, descricao: "Templos 2 vezes mais eficientes!"},
    {nome: "Conexão Espiritual", preço: 7_777_777_777, efeito:'duplicarTemplo', id: 'karaj3', comprado: false, descricao: "Templos 2 vezes mais eficientes!"},
    {nome: "Louvor com Fervor", preço: 777_777_777_777, efeito:'duplicarTemplo', id: 'karaj4', comprado: false, descricao: "Templos 2 vezes mais eficientes!"},
    {nome: "Santo Padeiro", preço: 77_777_777_777_777, efeito:'duplicarTemplo', id: 'karaj5', comprado: false, descricao: "Templos 2 vezes mais eficientes!"},
    {nome: "Café Salgado", preço: 7_777_777_777_777_777, efeito:'duplicarTemplo', id: 'karaj6', comprado: false, descricao: "Templos 2 vezes mais eficientes!"},
    // Laboratórios
    {nome: "Nova fórmula", preço: 3_300_000_000, efeito:'duplicarLab', id: 'lab1', comprado: false, descricao: "Laboratórios 2 vezes mais eficientes!", spriteX: 0, spriteY: 9},
    {nome: "Ciência Maluca", preço: 15_000_000_000, efeito:'duplicarLab', id: 'lab2', comprado: false, descricao: "Laboratórios 2 vezes mais eficientes!", spriteX: 1, spriteY: 9},
    {nome: "Experimentos", preço: 150_000_000_000, efeito:'duplicarLab', id: 'lab3', comprado: false, descricao: "Laboratórios 2 vezes mais eficientes!", spriteX: 2, spriteY: 9},
    // Torre

    // Cookies Normais
    {nome: "Cookie Sem Recheio", preço: 1_111_111, efeito:'1porcento', id: 'cookie1', comprado: false, descricao: "Todos começam em algum lugar... +1% de CPS"},
    {nome: "Cookie Biscoito Maria", preço: 5_555_555, efeito:'1porcento', id: 'cookie2', comprado: false, descricao: "Tradicional! +1% de CPS"},
    {nome: "Cookie com Uva Passa", preço: 11_111_111, efeito:'1porcento', id: 'cookie3', comprado: false, descricao: "Tem gente que gosta. +1% de CPS"},
    {nome: "Cookie com Chocolate", preço: 55_555_555, efeito:'5porcento', id: 'cookie4', comprado: false, descricao: "O clássico! +5% de CPS!"},
    {nome: "Cookie com Caramelo", preço: 111_111_111, efeito:'3porcento', id: 'cookie5', comprado: false, descricao: "Doce! +3% de CPS"},
    {nome: "Cookie com Castanha de Caju", preço: 111_111_111, efeito:'3porcento', id: 'cookie6', comprado: false, descricao: "Contêm proteína. +3% de CPS"},
    {nome: "Cookie com Chocolate Branco", preço: 111_111_111, efeito:'3porcento', id: 'cookie7', comprado: false, descricao: "É bom diferenciar. +3% de CPS"},
    {nome: "Cookie de Aveia", preço: 111_111_111, efeito:'3porcento', id: 'cookie8', comprado: false, descricao: "Saudável! +3% de CPS"},
    {nome: "Cookie com Chocolate Meio Amargo", preço: 111_111_111, efeito:'3porcento', id: 'cookie9', comprado: false, descricao: "80% cacau! +3% de CPS"},
    {nome: "Cookie com nozes", preço: 111_111_111, efeito:'3porcento', id: 'cookie10', comprado: false, descricao: "Crocante! +3% de CPS"},
    {nome: "Cookie Recheado", preço: 1_111_111_111, efeito:'5porcento', id: 'cookie11', comprado: false, descricao: "Qual é o recheio? Ninguém sabe. +5% de CPS"},
    {nome: "Cookie com Sorvete", preço: 5_555_555_555, efeito:'3porcento', id: 'cookie12', comprado: false, descricao: "Boa combinação! +3% de CPS"},

    {nome: "Cookie Químico", preço: 1_000_000_000_000, efeito:'5porcento', id: 'chemicalcookie', comprado: false, descricao: "Cookie criado com química pura! +5% de CPS", spriteX: 8, spriteY: 9},

    // Cookies Caseiros - Vovós
    {nome: "Biscoito Polvilho", preço: 100_000_000_000, efeito:'3porcento', id: 'cookievovo1', comprado: false, descricao: "Salgadinho! +3% de CPS"},
    {nome: "Casadinho", preço: 100_000_000_000, efeito:'3porcento', id: 'cookievovo2', comprado: false, descricao: "Muito bom. +3% de CPS"},
    {nome: "Biscoito de Nata", preço: 100_000_000_000, efeito:'3porcento', id: 'cookievovo3', comprado: false, descricao: "Receita de vó! +3% de CPS"},
    {nome: "Cookie de Coco", preço: 100_000_000_000, efeito:'3porcento', id: 'cookievovo4', comprado: false, descricao: "Tropical! +3% de CPS"},
    {nome: "Cookie com Goiabada", preço: 100_000_000_000, efeito:'3porcento', id: 'cookievovo5', comprado: false, descricao: "Igual da padaria! +3% de CPS"},

    // Cookies Brasileiros-fábricas
    {nome: "Biscoito Maizena", preço: 100_000_000_000_000, efeito:'3porcento', id: 'cookiebr1', comprado: false, descricao: "Não é redondo, mas serve. +3% de CPS"},
    {nome: "Trakinas", preço: 100_000_000_000_000, efeito:'3porcento', id: 'cookiebr2', comprado: false, descricao: "Cara de Bolacha! +3% de CPS"},
    {nome: "Passatempo", preço: 100_000_000_000_000, efeito:'3porcento', id: 'cookiebr3', comprado: false, descricao: "Nostálgico! +3% de CPS"},
    {nome: "Negresco", preço: 100_000_000_000_000, efeito:'3porcento', id: 'cookiebr4', comprado: false, descricao: "Melhor que Oreo! +3% de CPS"},
    {nome: "Tortinhas de Chocolate", preço: 100_000_000_000_000, efeito:'3porcento', id: 'cookiebr5', comprado: false, descricao: "Muito boa. +3% de CPS"},
    {nome: "Tortinhas de Morango", preço: 100_000_000_000_000, efeito:'5porcento', id: 'cookiebr6', comprado: false, descricao: "A Melhor de Todas! +5% de CPS"},

    // Sorte
    {nome: "Trevo de Quatro Folhas", preço: 77_777, efeito:'sorte', id: 'sorte1', comprado: false, descricao: "Aumenta sua sorte! +1 Sorte. Na primeira vez que comprar isso, também ganha um Cookie Dourado!"},
    {nome: "Pé de Coelho", preço: 7_777_777, efeito:'sorte', id: 'sorte2', comprado: false, descricao: "Aumenta sua sorte! +1 Sorte. Na primeira vez que comprar isso, também ganha um Cookie Dourado!"},
    {nome: "Ferradura Dourada", preço: 777_777_777, efeito:'sorte', id: 'sorte3', comprado: false, descricao: "Aumenta sua sorte! +1 Sorte. Na primeira vez que comprar isso, também ganha um Cookie Dourado!"},
    {nome: "Carvão da Sorte", preço: 7_777_777_777, efeito:'sorte', id: 'sorte4', comprado: false, descricao: "Aumenta sua sorte! +1 Sorte. Na primeira vez que comprar isso, também ganha um Cookie Dourado!"}
  ];

export const DEFAULT_DOURADO = [
  {
    nome: "Sorte pequena",
    tipo: "CPS",
    mult: 3,
    duração:111,
    peso: 3
  },
  {
    nome: "Sorte média!",
    tipo:"CPS",
    mult: 7,
    duração:77,
    peso: 5
  },
  {
    nome: "Sorte grande!!",
    tipo:"CPS",
    mult: 77,
    duração:33,
    peso: 2
  },
  {
    nome: "Frenesi de Clique",
    tipo:"Click",
    mult: 777,
    duração:11,
    peso: 1
  },
  {
    nome: "Explosão de cookies!",
    tipo:"Instantaneo",
    peso: 4
  }
]

// Configuração do sprite sheet das conquistas. Use esses valores no JSX
// pra calcular o background-position de cada conquista, sem precisar
// repetir os números mágicos pelos arquivos.
//   tamanho: dimensão de cada slot em pixels
//   colunas/linhas: dimensão total da sprite
export const CONQUISTA_SPRITE = {
  tamanho: 64,
  colunas: 16,
  linhas: 16,
};

export const DEFAULT_CONQUISTAS = [
    // Sprite sheet 16x16 (cada slot = 64x64). Coordenadas 0-based.
    // Layout por linha:
    //   0  CPS + cookiesTotais  (compartilham os mesmos ícones, igual Cookie Clicker)
    //   1  valorClick           (5)
    //   2  Vovó                 (6, com Doublevó)
    //   3  Fazenda              (5)
    //   4  Mina                 (5)
    //   5  Fábrica              (5)
    //   6  Computador           (5)
    //   7  Banco                (5)
    //   8  Templo de Karaj      (5)
    //   9  Laboratório          (5)
    //  10  Torre                (5)
    //  11-13  livre pra crescer
    //  14  Cookie Coin (cols 0-3) + Const. totais (cols 4-5) + Distritos (cols 6-7)
    //  15  secretas

    

    
    // número de cookies obtidos no total
    {nome: "O Primeiro", tipo: 'cookiesTotais', quantidade: 1, id: 'assar1', obtido: false, descricao: "Asse 1 cookie. Para quem nunca assou, que jogue a primeira pedra", spriteX: 0, spriteY: 0},
    {nome: "Assador Iniciante", tipo: 'cookiesTotais', quantidade: 1_000, id: 'assar2', obtido: false, descricao: "Asse 1.000 cookies", spriteX: 1, spriteY: 0},
    {nome: "Padaria de Esquina", tipo: 'cookiesTotais', quantidade: 100_000, id: 'assar3', obtido: false, descricao: "Asse 100.000 cookies", spriteX: 2, spriteY: 0},
    {nome: "Fornada Incansável", tipo: 'cookiesTotais', quantidade: 10_000_000, id: 'assar4', obtido: false, descricao: "Asse 10 milhões de cookies", spriteX: 3, spriteY: 0},
    {nome: "Bilionário do Açúcar", tipo: 'cookiesTotais', quantidade: 1_000_000_000, id: 'assar5', obtido: false, descricao: "Asse 1 bilhão de cookies", spriteX: 4, spriteY: 0},
    {nome: "Monopólio Doce", tipo: 'cookiesTotais', quantidade: 100_000_000_000, id: 'assar6', obtido: false, descricao: "Asse 100 bilhões de cookies", spriteX: 5, spriteY: 0},
    {nome: "Clica, clica, e clica...", tipo: 'cookiesTotais', quantidade: 10_000_000_000_000, id: 'assar7', obtido: false, descricao: "Asse 10 trilhões de cookies", spriteX: 6, spriteY: 0},
    {nome: "Economia Paralela", tipo: 'cookiesTotais', quantidade: 1_000_000_000_000_000, id: 'assar8', obtido: false, descricao: "Asse 1 quadrilhão de cookies", spriteX: 7, spriteY: 0},
    {nome: "Dimensão dos Cookies", tipo: 'cookiesTotais', quantidade: 100_000_000_000_000_000, id: 'assar9', obtido: false, descricao: "Asse 100 quadrilhões de cookies", spriteX: 8, spriteY: 0},
    {nome: "O Universo é Feito de Cookies", tipo: 'cookiesTotais', quantidade: 10_000_000_000_000_000_000, id: 'assar10', obtido: false, descricao: "Asse 10 quintilhões de cookies", spriteX: 9, spriteY: 0},
    {nome: "Multiverso Açucarado", tipo: 'cookiesTotais', quantidade: 100_000_000_000_000_000_000, id: 'assar11', obtido: false, descricao: "Asse 100 quintilhões de cookies", spriteX: 10, spriteY: 0},
    {nome: "A Imortalidade do Cookie", tipo: 'cookiesTotais', quantidade: 1_000_000_000_000_000_000_000, id: 'assar12', obtido: false, descricao: "Asse 1 sextilhão de cookies", spriteX: 11, spriteY: 0},
    {nome: "Eternidade Açucarada", tipo: 'cookiesTotais', quantidade: 100_000_000_000_000_000_000_000, id: 'assar13', obtido: false, descricao: "Asse 100 sextilhões de cookies", spriteX: 12, spriteY: 0},

    // CPS
    {nome: "Assando devagarinho", tipo: 'cps', quantidade: 1, id: 'cps1', obtido: false, descricao: "Faça 1 cookie por segundo. Todos tem que começar em algum lugar!", spriteX: 0, spriteY: 0},
    {nome: "Esquenta o Forno", tipo: 'cps', quantidade: 10, id: 'cps2', obtido: false, descricao: "Faça 10 cookies por segundo", spriteX: 1, spriteY: 0},
    {nome: "Assando normal", tipo: 'cps', quantidade: 100, id: 'cps3', obtido: false, descricao: "Faça 100 cookies por segundo", spriteX: 2, spriteY: 0},
    {nome: "Linha de Produção", tipo: 'cps', quantidade: 1_000, id: 'cps4', obtido: false, descricao: "Faça 1.000 cookies por segundo", spriteX: 3, spriteY: 0},
    {nome: "Indústria Pesada", tipo: 'cps', quantidade: 10_000, id: 'cps5', obtido: false, descricao: "Faça 10.000 cookies por segundo", spriteX: 4, spriteY: 0},
    {nome: "Escala Absurda", tipo: 'cps', quantidade: 100_000, id: 'cps6', obtido: false, descricao: "Faça 100.000 cookies por segundo", spriteX: 5, spriteY: 0},
    {nome: "Fábrica de Fábricas", tipo: 'cps', quantidade: 1_000_000, id: 'cps7', obtido: false, descricao: "Faça 1 milhão de cookies por segundo", spriteX: 6, spriteY: 0},
    {nome: "Velocidade da Luz Açucarada", tipo: 'cps', quantidade: 10_000_000, id: 'cps8', obtido: false, descricao: "Faça 10 milhões de cookies por segundo", spriteX: 7, spriteY: 0},
    {nome: "Supernova de Chocolate", tipo: 'cps', quantidade: 100_000_000, id: 'cps9', obtido: false, descricao: "Faça 100 milhões de cookies por segundo", spriteX: 8, spriteY: 0},
    {nome: "Big Bang de Cookie", tipo: 'cps', quantidade: 1_000_000_000, id: 'cps10', obtido: false, descricao: "Faça 1 bilhão de cookies por segundo", spriteX: 9, spriteY: 0},
    {nome: "Inflação Cósmica", tipo: 'cps', quantidade: 10_000_000_000, id: 'cps11', obtido: false, descricao: "Faça 10 bilhões de cookies por segundo", spriteX: 10, spriteY: 0},
    {nome: "Buraco Negro de Cookies", tipo: 'cps', quantidade: 100_000_000_000, id: 'cps12', obtido: false, descricao: "Faça 100 bilhões de cookies por segundo", spriteX: 11, spriteY: 0},
    {nome: "Infinito Açucarado", tipo: 'cps', quantidade: 1_000_000_000_000, id: 'cps13', obtido: false, descricao: "Faça 1 trilhão de cookies por segundo", spriteX: 12, spriteY: 0},

    // número de cookies obtidos por click
    {nome: "Click", tipo: 'valorClick', quantidade: 1, id: 'click1', obtido: false, descricao: "Clique no cookie 1 vez", spriteX: 0, spriteY: 1},
    {nome: "Clique de Gente Grande", tipo: 'valorClick', quantidade: 1_000, id: 'click2', obtido: false, descricao: "Faça 1.000 cookies em um único clique", spriteX: 1, spriteY: 1},
    {nome: "Punho de Ferro", tipo: 'valorClick', quantidade: 1_000_000, id: 'click3', obtido: false, descricao: "Faça 1 milhão de cookies em um único clique", spriteX: 2, spriteY: 1},
    {nome: "Clique Atômico", tipo: 'valorClick', quantidade: 1_000_000_000, id: 'click4', obtido: false, descricao: "Faça 1 bilhão de cookies em um único clique", spriteX: 3, spriteY: 1},
    {nome: "Dedo de Deus", tipo: 'valorClick', quantidade: 1_000_000_000_000, id: 'click5', obtido: false, descricao: "Faça 1 trilhão de cookies em um único clique", spriteX: 4, spriteY: 1},

    // número de cookies obtidos no total
    // Vovó
    {nome: "Simples Vovó", tipo: 'construcao', params: {nome: "Vovó"}, quantidade: 1, id: 'vovo1', obtido: false, descricao: "Tenha 1 vovó", spriteX: 0, spriteY: 2},
    {nome: "Doublevó", tipo: 'construcao', params: {nome: "Vovó"}, quantidade: 2, id: 'vovod', obtido: false, descricao: "Tenha 2 vovós", spriteX: 1, spriteY: 2},
    {nome: "Ancestrais", tipo: 'construcao', params: {nome: "Vovó"}, quantidade: 50, id: 'vovo2', obtido: false, descricao: "Tenha 50 vovós", spriteX: 2, spriteY: 2},
    {nome: "Asilo Industrial", tipo: 'construcao', params: {nome: "Vovó"}, quantidade: 100, id: 'vovo3', obtido: false, descricao: "Tenha 100 vovós", spriteX: 3, spriteY: 2},
    {nome: "Conselho das Matriarcas", tipo: 'construcao', params: {nome: "Vovó"}, quantidade: 150, id: 'vovo4', obtido: false, descricao: "Tenha 150 vovós", spriteX: 4, spriteY: 2},
    {nome: "Vovocracia", tipo: 'construcao', params: {nome: "Vovó"}, quantidade: 200, id: 'vovo5', obtido: false, descricao: "Tenha 200 vovós", spriteX: 5, spriteY: 2},

    // Fazenda
    {nome: "Fazenda Feliz", tipo: 'construcao', params: {nome: "Fazenda"}, quantidade: 1, id: 'fazenda1', obtido: false, descricao: "Tenha 1 fazenda", spriteX: 0, spriteY: 3},
    {nome: "Vale do Orvalho", tipo: 'construcao', params: {nome: "Fazenda"}, quantidade: 50, id: 'fazenda2', obtido: false, descricao: "Tenha 50 fazendas", spriteX: 1, spriteY: 3},
    {nome: "Agronegócio", tipo: 'construcao', params: {nome: "Fazenda"}, quantidade: 100, id: 'fazenda3', obtido: false, descricao: "Tenha 100 fazendas", spriteX: 2, spriteY: 3},
    {nome: "Fazenda Automática", tipo: 'construcao', params: {nome: "Fazenda"}, quantidade: 150, id: 'fazenda4', obtido: false, descricao: "Tenha 150 fazendas", spriteX: 3, spriteY: 3},
    {nome: "Reforma Agrária", tipo: 'construcao', params: {nome: "Fazenda"}, quantidade: 200, id: 'fazenda5', obtido: false, descricao: "Tenha 200 fazendas", spriteX: 4, spriteY: 3},

    // Mina
    {nome: "Minerar e Craftar", tipo: 'construcao', params: {nome: "Mina"}, quantidade: 1, id: 'mina1', obtido: false, descricao: "Tenha 1 mina", spriteX: 0, spriteY: 4},
    {nome: "Achou diamante", tipo: 'construcao', params: {nome: "Mina"}, quantidade: 50, id: 'mina2', obtido: false, descricao: "Tenha 50 minas", spriteX: 1, spriteY: 4},
    {nome: "Mina das Caveiras", tipo: 'construcao', params: {nome: "Mina"}, quantidade: 100, id: 'mina3', obtido: false, descricao: "Tenha 100 minas", spriteX: 2, spriteY: 4},
    {nome: "Chegou no Nether", tipo: 'construcao', params: {nome: "Mina"}, quantidade: 150, id: 'mina4', obtido: false, descricao: "Tenha 150 minas", spriteX: 3, spriteY: 4},
    {nome: "Cavou até a China", tipo: 'construcao', params: {nome: "Mina"}, quantidade: 200, id: 'mina5', obtido: false, descricao: "Tenha 200 minas", spriteX: 4, spriteY: 4},

    // Fábrica
    {nome: "Revolução Industrial", tipo: 'construcao', params: {nome: "Fábrica"}, quantidade: 1, id: 'fabrica1', obtido: false, descricao: "Tenha 1 fábrica", spriteX: 0, spriteY: 5},
    {nome: "Parque Industrial", tipo: 'construcao', params: {nome: "Fábrica"}, quantidade: 50, id: 'fabrica2', obtido: false, descricao: "Tenha 50 fábricas", spriteX: 1, spriteY: 5},
    {nome: "", tipo: 'construcao', params: {nome: "Fábrica"}, quantidade: 100, id: 'fabrica3', obtido: false, descricao: "Tenha 100 fábricas", spriteX: 2, spriteY: 5},
    {nome: "Polo Produtivo", tipo: 'construcao', params: {nome: "Fábrica"}, quantidade: 150, id: 'fabrica4', obtido: false, descricao: "Tenha 150 fábricas", spriteX: 3, spriteY: 5},
    {nome: "Nação Industrializada", tipo: 'construcao', params: {nome: "Fábrica"}, quantidade: 200, id: 'fabrica5', obtido: false, descricao: "Tenha 200 fábricas", spriteX: 4, spriteY: 5},

    // Computador
    {nome: "Liga o PC", tipo: 'construcao', params: {nome: "Computador"}, quantidade: 1, id: 'pc1', obtido: false, descricao: "Tenha 1 computador", spriteX: 0, spriteY: 6},
    {nome: "LAN House", tipo: 'construcao', params: {nome: "Computador"}, quantidade: 50, id: 'pc2', obtido: false, descricao: "Tenha 50 computadores", spriteX: 1, spriteY: 6},
    {nome: "Data Center", tipo: 'construcao', params: {nome: "Computador"}, quantidade: 100, id: 'pc3', obtido: false, descricao: "Tenha 100 computadores", spriteX: 2, spriteY: 6},
    {nome: "Nuvem Particular", tipo: 'construcao', params: {nome: "Computador"}, quantidade: 150, id: 'pc4', obtido: false, descricao: "Tenha 150 computadores", spriteX: 3, spriteY: 6},
    {nome: "Fazenda de Servidores", tipo: 'construcao', params: {nome: "Computador"}, quantidade: 200, id: 'pc5', obtido: false, descricao: "Tenha 200 computadores", spriteX: 4, spriteY: 6},

    // Banco
    {nome: "Primeiro Depósito", tipo: 'construcao', params: {nome: "Banco"}, quantidade: 1, id: 'banco1', obtido: false, descricao: "Tenha 1 banco", spriteX: 0, spriteY: 7},
    {nome: "Bote seus Cookies para render!", tipo: 'construcao', params: {nome: "Banco"}, quantidade: 50, id: 'banco2', obtido: false, descricao: "Tenha 50 bancos", spriteX: 1, spriteY: 7},
    {nome: "Juros Compostos", tipo: 'construcao', params: {nome: "Banco"}, quantidade: 100, id: 'banco3', obtido: false, descricao: "Tenha 100 bancos", spriteX: 2, spriteY: 7},
    {nome: "Cartel Financeiro", tipo: 'construcao', params: {nome: "Banco"}, quantidade: 150, id: 'banco4', obtido: false, descricao: "Tenha 150 bancos", spriteX: 3, spriteY: 7},
    {nome: "Banco Central dos Cookies", tipo: 'construcao', params: {nome: "Banco"}, quantidade: 200, id: 'banco5', obtido: false, descricao: "Tenha 200 bancos", spriteX: 4, spriteY: 7},

    // Templo de Karaj
    {nome: "Fiel Dedicado", tipo: 'construcao', params: {nome: "Templo de Karaj"}, quantidade: 1, id: 'templo1', obtido: false, descricao: "Tenha 1 Templo de Karaj", spriteX: 0, spriteY: 8},
    {nome: "Ordem Religiosa", tipo: 'construcao', params: {nome: "Templo de Karaj"}, quantidade: 50, id: 'templo2', obtido: false, descricao: "Tenha 50 Templos de Karaj", spriteX: 1, spriteY: 8},
    {nome: "Cidade Sagrada", tipo: 'construcao', params: {nome: "Templo de Karaj"}, quantidade: 100, id: 'templo3', obtido: false, descricao: "Tenha 100 Templos de Karaj", spriteX: 2, spriteY: 8},
    {nome: "Panteão Caseiro", tipo: 'construcao', params: {nome: "Templo de Karaj"}, quantidade: 150, id: 'templo4', obtido: false, descricao: "Tenha 150 Templos de Karaj", spriteX: 3, spriteY: 8},
    {nome: "Café + Sal = ?", tipo: 'construcao', params: {nome: "Templo de Karaj"}, quantidade: 200, id: 'templo5', obtido: false, descricao: "Tenha 200 Templos de Karaj", spriteX: 4, spriteY: 8},

    // Laboratório
    {nome: "Experimento Inicial", tipo: 'construcao', params: {nome: "Laboratório"}, quantidade: 1, id: 'lab1', obtido: false, descricao: "Tenha 1 laboratório", spriteX: 0, spriteY: 9},
    {nome: "Método Científico", tipo: 'construcao', params: {nome: "Laboratório"}, quantidade: 50, id: 'lab2', obtido: false, descricao: "Tenha 50 laboratórios", spriteX: 1, spriteY: 9},
    {nome: "Instituto de Pesquisa", tipo: 'construcao', params: {nome: "Laboratório"}, quantidade: 100, id: 'lab3', obtido: false, descricao: "Tenha 100 laboratórios", spriteX: 2, spriteY: 9},
    {nome: "Nobel de Química", tipo: 'construcao', params: {nome: "Laboratório"}, quantidade: 150, id: 'lab4', obtido: false, descricao: "Tenha 150 laboratórios", spriteX: 3, spriteY: 9},
    {nome: "Teoria Geral dos Cookies", tipo: 'construcao', params: {nome: "Laboratório"}, quantidade: 200, id: 'lab5', obtido: false, descricao: "Tenha 200 laboratórios", spriteX: 4, spriteY: 9},

    // Torre
    {nome: "Você é um bruxo!", tipo: 'construcao', params: {nome: "Torre"}, quantidade: 1, id: 'torre1', obtido: false, descricao: "Tenha 1 torre", spriteX: 0, spriteY: 10},
    {nome: "Escola de magia", tipo: 'construcao', params: {nome: "Torre"}, quantidade: 50, id: 'torre2', obtido: false, descricao: "Tenha 50 torres", spriteX: 1, spriteY: 10},
    {nome: "Grimório", tipo: 'construcao', params: {nome: "Torre"}, quantidade: 100, id: 'torre3', obtido: false, descricao: "Tenha 100 torres", spriteX: 2, spriteY: 10},
    {nome: "Torre de Marfim", tipo: 'construcao', params: {nome: "Torre"}, quantidade: 150, id: 'torre4', obtido: false, descricao: "Tenha 150 torres", spriteX: 3, spriteY: 10},
    {nome: "Guilda Arcana", tipo: 'construcao', params: {nome: "Torre"}, quantidade: 200, id: 'torre5', obtido: false, descricao: "Tenha 200 torres", spriteX: 4, spriteY: 10},

    // Secretas (linha 15)
    // um dos templos de karaj na "sua produção" vai ter um icone diferente, se você clicar ganha uma conquista

    // clique no cookie pequeno (ícone pequeno ao lado do contador de cookies nas estatísticas)
    {nome: "Cookie Pequeno", id: 'sec_cookiepequeno', obtido: false,
     descricao: "Ei, esse é o cookie errado!",
     spriteX: 0, spriteY: 15,
     check: (s) => s.cookiePequenoClicado === true},

    // Clique na madeleine escondida (na cidade de Karaj)
    {nome: "Madalena Perdida", id: 'sec_madalena', obtido: false,
     descricao: "Encontrou a madalena predida em Karaj!",
     spriteX: 1, spriteY: 15,
     check: (s) => s.madalenaClicada === true},

    // Clique no ícone secreto atrás de um dos Templos de Karaj
    {nome: "Encontrou!", id: 'sec_templo', obtido: false,
     descricao: "Encontrou o personagem escondido no templo",
     spriteX: 2, spriteY: 15,
     check: (s) => s.temploSecretoClicado === true},

    {nome: "Ícaro", id: 'sec_icaro', obtido: false,
     descricao: "Voou perto demais do sol.",
     spriteX: 3, spriteY: 15,
     check: (s) => s.icaroClicado === true},

    // Aplicou as 4 cores de poção na Vovó (easter egg do Laboratório)
    {nome: "Vovó Arco-Íris", id: 'sec_vovoarcoiris', obtido: false,
     descricao: "Descobriu como colorir a Vovó de todas as cores.",
     spriteX: 4, spriteY: 15,
     check: (s) => s.vovoTodasCoresClicado === true},

    // Progresso de descoberta no Laboratório de Frascos: conta só os 16
    // combos únicos e especiais (EFEITOS_COMBOS) — os efeitos genéricos
    // por cor não entram nessa contagem.
    {nome: "Aprendiz de Alquimia", id: 'lab_10efeitos', obtido: false,
     descricao: "Descobriu metade dos combos especiais do Laboratório de Frascos.",
     spriteX: 8, spriteY: 14,
     check: (s) => (s.efeitosLaboratorioDescobertos ?? 0) >= 8},

    {nome: "Minä", id: 'lab_20efeitos', obtido: false,
     descricao: "Descobriu todos os 16 combos especiais do Laboratório de Frascos.",
     spriteX: 9, spriteY: 14,
     check: (s) => (s.efeitosLaboratorioDescobertos ?? 0) >= 16},



    // Conquistas de cookie coins (linha 14, cols 0-3)
    {nome: "Primeiro Minerador", id: 'cc1', obtido: false, descricao: "Tenha 1 Cookie Coin",
     check: (s) => s.cookieCoin?.coins >= 1, spriteX: 0, spriteY: 14},
    {nome: "HODL", id: 'cc2', obtido: false, descricao: "Tenha 1.000 Cookie Coins ao mesmo tempo",
     check: (s) => s.cookieCoin?.coins >= 1000, spriteX: 1, spriteY: 14},
    {nome: "Todas que existem?", id: 'cc3', obtido: false, descricao: "Tenha 21.000.000 Cookie Coins ao mesmo tempo",
     check: (s) => s.cookieCoin?.coins >= 21_000_000, spriteX: 2, spriteY: 14},
    {nome: "Especialista em Hardware", id: 'cc4', obtido: false, descricao: "Tenha uma placa de vídeo nível 100",
     check: (s) => s.cookieCoin?.level >= 100, spriteX: 3, spriteY: 14},


    // tenha 100 construções no total (linha 14, cols 4-5)
    {nome: "Pequeno Império", id: 'const_total_100', obtido: false, descricao: "Tenha 100 construções no total",
     check: (s) => s.construcoes?.reduce((soma, c) => soma + c.quantidade, 0) >= 100, spriteX: 4, spriteY: 14},
    {nome: "Grande Construtor", id: 'const_total_1000', obtido: false, descricao: "Tenha 1000 construções no total",
     check: (s) => s.construcoes?.reduce((soma, c) => soma + c.quantidade, 0) >= 1000, spriteX: 5, spriteY: 14},

    // distritos de Karaj (linha 14, cols 6-7)
    {nome: "Urbanista", id: 'distritos5', obtido: false, descricao: "Desbloqueie 5 distritos de Karaj",
     check: (s) => {
       if (!s.ascensao) return false;
       const chaves = ['distritotemplo','distritovovo','distritofazenda','distritomina',
                       'distritofabrica','distritopc','distritobanco','distritoclick','distritoidle'];
       return chaves.filter(k => s.ascensao[k]?.desbloqueado).length >= 5;
     }, spriteX: 6, spriteY: 14},
    {nome: "Metrópole Sagrada", id: 'distritos_todos', obtido: false, descricao: "Desbloqueie todos os distritos de Karaj",
     check: (s) => {
       if (!s.ascensao) return false;
       const chaves = ['distritotemplo','distritovovo','distritofazenda','distritomina',
                       'distritofabrica','distritopc','distritobanco','distritoclick','distritoidle'];
       return chaves.every(k => s.ascensao[k]?.desbloqueado);
     }, spriteX: 7, spriteY: 14},



];

export const DEFAULT_COOKIE_COIN = {desbloqueado: false,
    level: 0,
    coins: 0,
    mercado: 1
  };

// Descrição do efeito de cada combo especial do Laboratório de Frascos,
// usada na tooltip do frasco grande — só é mostrada depois que o jogador
// já bebeu aquela combinação pelo menos uma vez (ver laboratorio.descobertos).
// Cada combo é uma LISTA de efeitos (um item por linha, direto e numérico,
// no estilo das plantas do jardim do Cookie Clicker — inclui negativos).
// Chave = "verde-vermelho-azul-amarelo" (quantidade de cada um no frasco).
export const EFEITOS_COMBOS = {
  "3-0-0-0": [
    "+10 horas de CPS instantâneo",
    "-10% CPS por 1 hora"
  ],
  "2-1-0-0": [
    "1 clique com poder x1111",
    "-10 unidades de uma construção aleatória (no clique)"
  ],
  "1-2-0-0": [
    "1 clique com poder x1111",
    "-10 unidades de uma construção aleatória (no clique)"
  ],
  "0-2-0-1": [
    "Clique x77 por 7 segundos",
    "-2 unidades de uma construção aleatória por clique"
  ],
  "0-3-0-0": [
    "Clique x100 por 10 segundos",
    "-5 unidades de uma construção aleatória por clique"
  ],
  "1-0-0-2": [
    "Invoca 1 Cookie Dourado"
  ],
  "0-0-0-3": [
    "Invoca 'O Sol' no centro da tela",
    "Ao clicar: destrói TODAS as construções",
    "Ao clicar: +3 de sorte por 1 hora"
  ],
  "1-0-2-0": [
    "+100% CPS por 10 minutos",
    "-2 de sorte por 10 minutos",
    "Efeito termina ao clicar no cookie"
  ],
  "0-1-2-0": [
    "+30% CPS por 1 hora",
    "-2 de sorte por 1 hora",
    "Efeito termina ao clicar no cookie"
  ],
  "0-0-2-1": [
    "+7% CPS por 7 horas",
    "Efeito termina ao clicar no cookie"
  ],
  "0-0-3-0": [
    "+24% CPS por 24 horas",
    "-4 de sorte por 24 horas",
    "Efeito termina ao clicar no cookie"
  ],
  "1-1-1-0": [
    "Construções 20% mais baratas por 5 minutos"
  ],
  "1-1-0-1": [
    "Cookie Coins valem 10x mais por 1 minuto"
  ],
  "0-1-1-1": [
    "Desbloqueia o upgrade 'Cookie Químico'"
  ],
  "1-0-1-1": [
    "+1 de sorte por 10 minutos"
  ],
  "0-0-1-2": [
    "Cookies Dourados duram +10% por 10 minutos"
  ],
};

// Efeitos das substâncias FORA de um combo especial (misturas genéricas),
// por cor e por quantidade daquela cor no frasco (1 ou 2 — 3 unidades puras
// de qualquer cor sempre cai em um combo especial, nunca chega aqui).
// A descoberta desses é por COR, não por mistura exata: a primeira vez que
// o jogador bebe qualquer mistura genérica contendo aquela cor, os efeitos
// dela (em qualquer quantidade) passam a ser conhecidos.
export const EFEITOS_GENERICOS = {
  verde: {
    1: ["+20 min de CPS instantâneo"],
    2: ["+40 min de CPS instantâneo"]
  },
  vermelho: {
    1: ["Clique x10 por 10 segundos", "-1 construção aleatória por clique"],
    2: ["Clique x15 por 10 segundos", "-1 construção aleatória por clique"]
  },
  azul: {
    1: ["+10% CPS por 1 hora", "Efeito termina ao clicar no cookie"],
    2: ["+20% CPS por 1 hora", "Efeito termina ao clicar no cookie"]
  },
  amarelo: {
    1: ["+1 de sorte por 3 minutos"],
    2: ["+1 de sorte por 10 minutos"]
  }
};

export const DEFAULT_LABORATORIO = {desbloqueado: false,
    substancias: {
      verde: {
        cargas: 2,
        proximaRecarga: null, // timestamp da próxima carga ficar pronta, ou null se cheio
        nome: "Essência da Ganância",
        descricao: "Para quem quer resultados instantâneos. O que pode dar errado?"
      },
      vermelho: {
        cargas: 2,
        proximaRecarga: null, // timestamp da próxima carga ficar pronta, ou null se cheio
        nome: "Essência da Raiva",
        descricao: "A Raiva pode levar a ganhos rápidos. Não a deixe te consumir"
      },
      azul: {
        cargas: 2,
        proximaRecarga: null, // timestamp da próxima carga ficar pronta, ou null se cheio
        nome: "Essência da Preguiça",
        descricao: "Para aqueles que não querem clicar e preferem a vida fácil"
      },
      amarelo: {
        cargas: 2,
        proximaRecarga: null, // timestamp da próxima carga ficar pronta, ou null se cheio
        nome: "Essência do Orgulho",
        descricao: "Dizem que isso dá sorte para aqueles que bebem. Cuidado para não se deixar levar..."
      }
    },
    Frasco: [],
    // Histórico das cargas consumidas no Frasco atual, na ordem em que
    // foram adicionadas — permite desfazer (undo) restaurando exatamente
    // o estado anterior de cada substância. É esvaziado ao beber a poção.
    historico: [],
    // Combinações (chaves de EFEITOS_COMBOS) que o jogador já bebeu pelo
    // menos uma vez — habilita a descrição do efeito na tooltip do frasco.
    descobertos: [],
    // Cores cujo efeito GENÉRICO (fora de combo especial) já foi descoberto
    // — ex: usar 1x Verde sozinho (ou com algo que não forma combo) revela
    // o efeito genérico do Verde em qualquer quantidade daqui pra frente.
    genericosDescobertos: [],
    CookieQuimico: false
  };

export const CONFIG_DOURADO = {
  TMIN: 300, // 5 minutos
  TMAX: 540, // 9 minutos
};

export const DEFAULT_ASCENSAO = {
      desbloqueado: false,
      prestigio: 0,
      prestigioTotal: 0,
  
      // Distrito dos Templos
      distritotemplo: {
        desbloqueado: true,
        construído: true,
        posicao: { x: 20, y: 20 },
        aberto: false,
        icone: Karaj,
        icone_destruido: Karaj_d,
        upgrades: [
          {nome: "Conexão Espiritual", preço: 1, efeito:'ascensao', id: 'ascensaocps', comprado: false, descricao: "Você ganha 1% de cps por nível de prestígio"},
          {nome: "Sorte dos Deuses", preço: 7, efeito:'sorte', id: 'ascensaosorte1', comprado: false, descricao: "Você ganha +1 de sorte permanentemente!"},
          {nome: "Armazém Temporal", preço: 13, efeito:'offline1', id: 'offline1', comprado: false, descricao: "Você ganha 50% de CPS enquanto o jogo está fechado (por um máximo de 2 horas)"},
          
        ]
      },
      distritovovo: {
        desbloqueado: false,
        construído: false,
        posicao: null,
        aberto: false,
        icone: Vovo1,
        icone_destruido: Vovo2,
        requisitoQuantidade: 100,
        requisitoConstrucao: "Vovó",
        upgrades: [
          {nome: "Caixa de Cookies da Vovó", preço: 25, efeito:'caixavovo', id: 'vovoascensao1', comprado: false, descricao: "Desbloqueia vários novos cookies de vovó"},
          {nome: "Sorte no Bingo!", preço: 77, efeito:'sorte', id: 'ascensaosorte2', comprado: false, descricao: "Você ganha +1 de sorte permanentemente!"},
          {nome: "Vovós Ancestrais", preço: 100, efeito:'vovoGratis', id: 'vovoascensao2', comprado: false, descricao: "Você começa a próxima ascensão com 10 vovós grátis!"}
        ]
      },
      distritofazenda: {
        desbloqueado: false,
        construído: false,
        posicao: null,
        aberto: false,
        icone: Fazenda,
        icone_destruido: Fazenda_d,
        requisitoQuantidade: 100,
        requisitoConstrucao: "Fazenda",
        upgrades: []
      },
      distritomina: {
        desbloqueado: false,
        construído: false,
        posicao: null,
        aberto: false,
        icone: Mina,
        icone_destruido: Mina_d,
        requisitoQuantidade: 100,
        requisitoConstrucao: "Mina",
        upgrades: []
      },
      distritofabrica: {
        desbloqueado: false,
        construído: false,
        posicao: null,
        aberto: false,
        icone: Fabrica,
        icone_destruido: Fabrica_d,
        requisitoQuantidade: 100,
        requisitoConstrucao: "Fábrica",
        upgrades: [
          {nome: "Caixa de Cookies Brasileiros", preço: 250, efeito:'caixafabricas', id: 'fabricaascensao1', comprado: false, descricao: "Desbloqueia vários Cookies Clássicos!"},
          {nome: "Sino da Fábrica", preço: 777, efeito:'somDourado', id: 'fabricaascensao2', comprado: false, descricao: "Avisa todos os trabalhadores que um Cookie Dourado apareceu, mesmo se você estiver em outra aba!"}
        ]
      },
      distritopc: {
        desbloqueado: false,
        construído: false,
        posicao: null,
        aberto: false,
        icone: PC,
        icone_destruido:PC,
        requisitoQuantidade: 100,
        requisitoConstrucao: "Computador",
        upgrades: []
      },
      distritobanco: {
        desbloqueado: false,
        construído: false,
        posicao: null,
        aberto: false,
        icone: Bancos,
        icone_destruido: Bancos_d,
        requisitoQuantidade: 100,
        requisitoConstrucao: "Banco",
        upgrades: []
      },
      distritoclick: {
        desbloqueado: false,
        construído: false,
        posicao: null,
        aberto: false,
        icone: Cursor,
        icone_destruido:Cursor,
        requisitoQuantidade: 0,
        requisitoConstrucao: null,
        upgrades: []
      },
      distritoidle: {
        desbloqueado: false,
        construído: false,
        posicao: null,
        aberto: false,
        icone: Karaj,
        icone_destruido:Karaj,
        requisitoQuantidade: 0,
        requisitoConstrucao: null,
        upgrades: []
      }
  };

// Filtro que decide quais melhorias estão disponíveis para o jogador comprar,
// baseado em quantos cookies ele já produziu, quantas construções ele tem, etc.
// Retorna as melhorias já filtradas, ordenadas do mais barato ao mais caro,
// e com um campo extra `indiceOriginal` que guarda a posição no array original
// (necessário para a função ComprarMelhoria saber qual melhoria foi comprada).
export function filtrarUpgradesDisponiveis(melhorias, construcoes, cookiesTotaisAscensao, douradosTotais, ascensao, laboratorio) {
  const ContagemVovo = construcoes.find((c) => c.nome === "Vovó")?.quantidade || 0;
  const ContagemFazenda = construcoes.find((c) => c.nome === "Fazenda")?.quantidade || 0;
  const ContagemMinas = construcoes.find((c) => c.nome === "Mina")?.quantidade || 0;
  const ContagemFabrica = construcoes.find((c) => c.nome === "Fábrica")?.quantidade || 0;
  const ContagemBanco = construcoes.find((c) => c.nome === "Banco")?.quantidade || 0;
  const ContagemComputador = construcoes.find((c) => c.nome === "Computador")?.quantidade || 0;
  const ContagemTemplo = construcoes.find((c) => c.nome === "Templo de Karaj")?.quantidade || 0;
  const ContagemLab = construcoes.find((c) => c.nome === "Laboratório")?.quantidade || 0;

  const disponiveis = melhorias
    .map((m, i) => ({ ...m, indiceOriginal: i }))
    .filter(m => {
      if (m.comprado) return false;

      if (m.id === "click2" && cookiesTotaisAscensao < 100) return false;
      if (m.id === "click3" && cookiesTotaisAscensao < 5000) return false;

      if (m.id === "clickcps1" && cookiesTotaisAscensao < 15_000) return false;
      if (m.id === "clickcps2" && cookiesTotaisAscensao < 1_500_000) return false;
      if (m.id === "clickcps3" && cookiesTotaisAscensao < 150_000_000) return false;
      if (m.id === "clickcps4" && cookiesTotaisAscensao < 15_000_000_000) return false;
      if (m.id === "clickcps5" && cookiesTotaisAscensao < 1_500_000_000_000) return false;

      if (m.id === "vovo1" && ContagemVovo < 1) return false;
      if (m.id === "vovo2" && ContagemVovo < 10) return false;
      if (m.id === "vovo3" && ContagemVovo < 25) return false;
      if (m.id === "vovo4" && ContagemVovo < 50) return false;
      if (m.id === "vovo5" && ContagemVovo < 100) return false;
      if (m.id === "vovo6" && ContagemVovo < 150) return false;
      if (m.id === "fazenda1" && ContagemFazenda < 1) return false;
      if (m.id === "fazenda2" && ContagemFazenda < 10) return false;
      if (m.id === "fazenda3" && ContagemFazenda < 25) return false;
      if (m.id === "fazenda4" && ContagemFazenda < 50) return false;
      if (m.id === "fazenda5" && ContagemFazenda < 100) return false;
      if (m.id === "fazenda6" && ContagemFazenda < 150) return false;
      if (m.id === "mina1" && ContagemMinas < 1) return false;
      if (m.id === "mina2" && ContagemMinas < 10) return false;
      if (m.id === "mina3" && ContagemMinas < 25) return false;
      if (m.id === "mina4" && ContagemMinas < 50) return false;
      if (m.id === "mina5" && ContagemMinas < 100) return false;
      if (m.id === "mina6" && ContagemMinas < 150) return false;
      if (m.id === "fabrica1" && ContagemFabrica < 1) return false;
      if (m.id === "fabrica2" && ContagemFabrica < 10) return false;
      if (m.id === "fabrica3" && ContagemFabrica < 25) return false;
      if (m.id === "fabrica4" && ContagemFabrica < 50) return false;
      if (m.id === "fabrica5" && ContagemFabrica < 100) return false;
      if (m.id === "fabrica6" && ContagemFabrica < 150) return false;
      if (m.id === "PC1" && ContagemComputador < 1) return false;
      if (m.id === "PC2" && ContagemComputador < 10) return false;
      if (m.id === "PC3" && ContagemComputador < 25) return false;
      if (m.id === "PC4" && ContagemComputador < 50) return false;
      if (m.id === "PC5" && ContagemComputador < 100) return false;
      if (m.id === "PC6" && ContagemComputador < 150) return false;
      if (m.id === "banco1" && ContagemBanco < 1) return false;
      if (m.id === "banco2" && ContagemBanco < 10) return false;
      if (m.id === "banco3" && ContagemBanco < 25) return false;
      if (m.id === "banco4" && ContagemBanco < 50) return false;
      if (m.id === "banco5" && ContagemBanco < 100) return false;
      if (m.id === "banco6" && ContagemBanco < 150) return false;
      if (m.id === "karaj1" && ContagemTemplo < 1) return false;
      if (m.id === "karaj2" && ContagemTemplo < 10) return false;
      if (m.id === "karaj3" && ContagemTemplo < 25) return false;
      if (m.id === "karaj4" && ContagemTemplo < 50) return false;
      if (m.id === "karaj5" && ContagemTemplo < 100) return false;
      if (m.id === "karaj6" && ContagemTemplo < 150) return false;
      if (m.id === "lab1" && ContagemLab < 1) return false;
      if (m.id === "lab2" && ContagemLab < 10) return false;
      if (m.id === "lab3" && ContagemLab < 25) return false;

      if (m.id === "cookie1" && cookiesTotaisAscensao < 50_000) return false;
      if (m.id === "cookie2" && cookiesTotaisAscensao < 250_000) return false;
      if (m.id === "cookie3" && cookiesTotaisAscensao < 500_000) return false;
      if (m.id === "cookie4" && cookiesTotaisAscensao < 5_000_000) return false;
      if (m.id === "cookie5" && cookiesTotaisAscensao < 15_000_000) return false;
      if (m.id === "cookie6" && cookiesTotaisAscensao < 15_000_000) return false;
      if (m.id === "cookie7" && cookiesTotaisAscensao < 15_000_000) return false;
      if (m.id === "cookie8" && cookiesTotaisAscensao < 15_000_000) return false;
      if (m.id === "cookie9" && cookiesTotaisAscensao < 15_000_000) return false;
      if (m.id === "cookie10" && cookiesTotaisAscensao < 15_000_000) return false;
      if (m.id === "cookie11" && cookiesTotaisAscensao < 500_000_000) return false;
      if (m.id === "cookie12" && cookiesTotaisAscensao < 1_000_000_000) return false;
      if (m.id === "chemicalcookie" && (!laboratorio || !laboratorio.CookieQuimico)) return false;

      if (m.id === "sorte1" && douradosTotais < 1) return false;
      if (m.id === "sorte2" && douradosTotais < 7) return false;
      if (m.id === "sorte3" && douradosTotais < 77) return false;
      if (m.id === "sorte4" && douradosTotais < 777) return false;

      const CaixaVovoAtivo = ascensao.distritovovo.upgrades.some(u => u.id === "vovoascensao1" && u.comprado);
      const CaixaFabricaAtivo = ascensao.distritofabrica.upgrades.some(u => u.id === "fabricaascensao1" && u.comprado);

      if ((m.id === "cookievovo1" || m.id === "cookievovo2" || m.id === "cookievovo3" || m.id === "cookievovo4" || m.id === "cookievovo5") && CaixaVovoAtivo < 1) return false;
      if ((m.id === "cookiebr1" || m.id === "cookiebr2" || m.id === "cookiebr3" || m.id === "cookiebr4" || m.id === "cookiebr5" || m.id === "cookiebr6") && CaixaFabricaAtivo < 1) return false;

      return true;
    });

  // Ordena do mais barato ao mais caro
  return [...disponiveis].sort((a, b) => a.preço - b.preço);
}