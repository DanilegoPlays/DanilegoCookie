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

// Estruturas padrão para construções e melhorias
export const DEFAULT_CONSTRUCOES = [
    {nome: "Vovó", preço: 15, cps: 0.5, quantidade: 0, quantidadeGratis: 0, descricao: "Uma vovó para assar cookies fresquinhos do forno", icone: Vovo1, icone_pequeno: Vovo3},
    {nome: "Fazenda", preço: 100, cps: 1.5, quantidade: 0, descricao: "As Fazendas plantam e colhem Pés de Cookie", icone: Fazenda, icone_pequeno: Fazenda},
    {nome: "Mina", preço: 1000, cps: 8, quantidade: 0, descricao: "As Minas mineram Cookie Mineral direto da terra!", icone: Mina, icone_pequeno: Mina},
    {nome: "Fábrica", preço: 11000, cps: 45, quantidade: 0, descricao: "As Fábricas produzem cookies em larga escala", icone: Fabrica, icone_pequeno: Fabrica},
    {nome: "Computador", preço: 120_000, cps: 300, quantidade: 0, descricao: "O Computador produz cookies a partir do código do próprio jogo!", icone: PC, icone_pequeno: PC},
    {nome: "Banco", preço: 1_500_000, cps: 1600, quantidade: 0, descricao: "Os Bancos produzem cookies a partir de empréstimos", icone: Bancos, icone_pequeno: Bancos},
    {nome: "Templo de Karaj", preço: 77_777_000, cps: 7777, quantidade: 0, descricao: "Os Templos louvam os Deuses dos Cookies, que entregam cookies diretamente a você!", icone: Karaj, icone_pequeno: Karaj},
    {nome: "Laboratório", preço: 400_000_000, cps: 50_000, quantidade: 0, descricao: "Os laboratórios criam Cookies usando CIÊNCIA!", icone: PC, icone_pequeno: PC},
    {nome: "Torre", preço: 5_100_000_000, cps: 300_000, quantidade: 0, descricao: "As torres criam Cookies usanso magia!", icone: PC, icone_pequeno: PC}
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
    {nome: "Treinamento da Vovó", preço: 100, efeito:'duplicarVovo', id: 'vovo1', comprado: false, descricao: "Vovós 2 vezes mais eficientes!"},
    {nome: "Fornos de Cookie", preço: 500, efeito:'duplicarVovo', id: 'vovo2', comprado: false, descricao: "Vovós 2 vezes mais eficientes!"},
    {nome: "Dentaduras Novas", preço: 10000, efeito:'duplicarVovo', id: 'vovo3', comprado: false, descricao: "Vovós 2 vezes mais eficientes!"},
    {nome: "Vovós Extra Velhas", preço: 100_000, efeito:'duplicarVovo', id: 'vovo4', comprado: false, descricao: "Vovós 2 vezes mais eficientes!"},
    {nome: "Vovós Unidas", preço: 10_000_000, efeito:'duplicarVovo', id: 'vovo5', comprado: false, descricao: "Vovós 2 vezes mais eficientes!"},
    {nome: "Vovós... Vovós?", preço: 100_000_000, efeito:'duplicarVovo', id: 'vovo6', comprado: false, descricao: "Vovós 2 vezes mais eficientes!"},
    // Fazenda
    {nome: "Enxada de Pedra", preço: 1000, efeito:'duplicarFazenda', id: 'fazenda1', comprado: false, descricao: "Fazendas 2 vezes mais eficientes!"},
    {nome: "Fertilizante", preço: 5000, efeito:'duplicarFazenda', id: 'fazenda2', comprado: false, descricao: "Fazendas 2 vezes mais eficientes!"},
    {nome: "Enxada de Ferro", preço: 50_000, efeito:'duplicarFazenda', id: 'fazenda3', comprado: false, descricao: "Fazendas 2 vezes mais eficientes!"},
    {nome: "Mais Hectares", preço: 5_000_000, efeito:'duplicarFazenda', id: 'fazenda4', comprado: false, descricao: "Fazendas 2 vezes mais eficientes!"},
    {nome: "Novos Tratores", preço: 500_000_000, efeito:'duplicarFazenda', id: 'fazenda5', comprado: false, descricao: "Fazendas 2 vezes mais eficientes!"},
    {nome: "Monocultura", preço: 50_000_000_000, efeito:'duplicarFazenda', id: 'fazenda6', comprado: false, descricao: "Fazendas 2 vezes mais eficientes!"},
    // Minas
    {nome: "Picareta de Madeira", preço: 11_000, efeito:'duplicarMinas', id: 'mina1', comprado: false, descricao: "Minas 2 vezes mais eficientes!"},
    {nome: "Picareta de Pedra", preço: 55_000, efeito:'duplicarMinas', id: 'mina2', comprado: false, descricao: "Minas 2 vezes mais eficientes!"},
    {nome: "Picareta de Ouro", preço: 555_000, efeito:'duplicarMinas', id: 'mina3', comprado: false, descricao: "Minas 2 vezes mais eficientes!"},
    {nome: "Picareta de Ferro", preço: 55_000_000, efeito:'duplicarMinas', id: 'mina4', comprado: false, descricao: "Minas 2 vezes mais eficientes!"},
    {nome: "Picareta de Diamante", preço: 5_500_000_000, efeito:'duplicarMinas', id: 'mina5', comprado: false, descricao: "Minas 2 vezes mais eficientes!"},
    {nome: "Picareta de Diamante", preço: 550_000_000_000, efeito:'duplicarMinas', id: 'mina6', comprado: false, descricao: "Minas 2 vezes mais eficientes!"},
    // Fábrica
    {nome: "Engrenagens Melhores", preço: 120_000, efeito:'duplicarFabrica', id: 'fabrica1', comprado: false, descricao: "Fábricas 2 vezes mais eficientes!"},
    {nome: "Energia Sustentável", preço: 600_000, efeito:'duplicarFabrica', id: 'fabrica2', comprado: false, descricao: "Fábricas 2 vezes mais eficientes!"},
    {nome: "Trabalhadores Rápidos", preço: 6_000_000, efeito:'duplicarFabrica', id: 'fabrica3', comprado: false, descricao: "Fábricas 2 vezes mais eficientes!"},
    {nome: "Super Fábrica", preço: 600_000_000, efeito:'duplicarFabrica', id: 'fabrica4', comprado: false, descricao: "Fábricas 2 vezes mais eficientes!"},
    {nome: "Automação", preço: 60_000_000_000, efeito:'duplicarFabrica', id: 'fabrica5', comprado: false, descricao: "Fábricas 2 vezes mais eficientes!"},
    {nome: "Automação", preço: 6_000_000_000_000, efeito:'duplicarFabrica', id: 'fabrica6', comprado: false, descricao: "Fábricas 2 vezes mais eficientes!"},
    // Computador
    {nome: "Refrigeração", preço: 1_300_000, efeito:'duplicarPC', id: 'PC1', comprado: false, descricao: "Computadores 2 vezes mais eficientes!"},
    {nome: "Atualização de Software", preço: 6_500_000, efeito:'duplicarPC', id: 'PC2', comprado: false, descricao: "Computadores 2 vezes mais eficientes!"},
    {nome: "Novo Processador", preço: 65_000_000, efeito:'duplicarPC', id: 'PC3', comprado: false, descricao: "Computadores 2 vezes mais eficientes!"},
    {nome: "Memória SSD", preço: 6_500_000_000, efeito:'duplicarPC', id: 'PC4', comprado: false, descricao: "Tá caro demais essa memória RAM! Computadores 2 vezes mais eficientes!"},
    {nome: "Formatação", preço: 650_000_000_000, efeito:'duplicarPC', id: 'PC5', comprado: false, descricao: "Computadores 2 vezes mais eficientes!"},
    {nome: "Mais Memória RAM", preço: 65_000_000_000_000, efeito:'duplicarPC', id: 'PC6', comprado: false, descricao: "Computadores 2 vezes mais eficientes!"},
    // Banco
    {nome: "Cartão Sem Anuidade", preço: 14_000_000, efeito:'duplicarBanco', id: 'banco1', comprado: false, descricao: "Bancos 2 vezes mais eficientes!"},
    {nome: "Cofres de Cookie", preço: 70_000_000, efeito:'duplicarBanco', id: 'banco2', comprado: false, descricao: "Bancos 2 vezes mais eficientes!"},
    {nome: "Juros Compostos", preço: 700_000_000, efeito:'duplicarBanco', id: 'banco3', comprado: false, descricao: "Bancos 2 vezes mais eficientes!"},
    {nome: "Super Banco", preço: 70_000_000_000, efeito:'duplicarBanco', id: 'banco4', comprado: false, descricao: "Bancos 2 vezes mais eficientes!"},
    {nome: "Corretores Corredores", preço: 7_000_000_000_000, efeito:'duplicarBanco', id: 'banco5', comprado: false, descricao: "Bancos 2 vezes mais eficientes!"},
    {nome: "Corretores Corredores", preço: 700_000_000_000_000, efeito:'duplicarBanco', id: 'banco5', comprado: false, descricao: "Bancos 2 vezes mais eficientes!"},
    // Karaj
    {nome: "Torres mais Pontudas", preço: 177_777_777, efeito:'duplicarTemplo', id: 'karaj1', comprado: false, descricao: "Templos 2 vezes mais eficientes!"},
    {nome: "Festival do Sol", preço: 777_777_777, efeito:'duplicarTemplo', id: 'karaj2', comprado: false, descricao: "Templos 2 vezes mais eficientes!"},
    {nome: "Conexão Espiritual", preço: 7_777_777_777, efeito:'duplicarTemplo', id: 'karaj3', comprado: false, descricao: "Templos 2 vezes mais eficientes!"},
    {nome: "Louvor com Fervor", preço: 777_777_777_777, efeito:'duplicarTemplo', id: 'karaj4', comprado: false, descricao: "Templos 2 vezes mais eficientes!"},
    {nome: "Santo Padeiro", preço: 77_777_777_777_777, efeito:'duplicarTemplo', id: 'karaj5', comprado: false, descricao: "Templos 2 vezes mais eficientes!"},
    {nome: "Café Salgado", preço: 7_777_777_777_777_777, efeito:'duplicarTemplo', id: 'karaj6', comprado: false, descricao: "Templos 2 vezes mais eficientes!"},
    // Laboratórios
    {nome: "Nova fórmula", preço: 3_300_000_000, efeito:'duplicarLab', id: 'lab1', comprado: false, descricao: "Laboratórios 2 vezes mais eficientes!"},
    {nome: "Ciência Maluca", preço: 15_000_000_000, efeito:'duplicarLab', id: 'lab2', comprado: false, descricao: "Laboratórios 2 vezes mais eficientes!"},
    {nome: "Experimentos", preço: 150_000_000_000, efeito:'duplicarLab', id: 'lab3', comprado: false, descricao: "Laboratórios 2 vezes mais eficientes!"},
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
    {nome: "Trevo de Quatro Folhas", preço: 77_777, efeito:'sorte', id: 'sorte1', comprado: false, descricao: "Faz um Cookie Dourado aparecer, e aumenta sua sorte! +1 Sorte"},
    {nome: "Pé de Coelho", preço: 7_777_777, efeito:'sorte', id: 'sorte2', comprado: false, descricao: "Faz um Cookie Dourado aparecer, e aumenta sua sorte! +1 Sorte"},
    {nome: "Ferradura Dourada", preço: 777_777_777, efeito:'sorte', id: 'sorte3', comprado: false, descricao: "Faz um Cookie Dourado aparecer, e aumenta sua sorte! +1 Sorte"},
    {nome: "Carvão da Sorte", preço: 7_777_777_777, efeito:'sorte', id: 'sorte4', comprado: false, descricao: "Faz um Cookie Dourado aparecer, e aumenta sua sorte! +1 Sorte"}
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

export const DEFAULT_COOKIE_COIN = {desbloqueado: false,
    level: 0,
    coins: 0,
    mercado: 1
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
          {nome: "Caixa de Cookies Brasileiros", preço: 250, efeito:'caixafabricas', id: 'fabricaascensao1', comprado: false, descricao: "Desbloqueia vários Cookies Clássicos!"}
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
export function filtrarUpgradesDisponiveis(melhorias, construcoes, cookiesTotaisAscensao, douradosTotais, ascensao) {
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