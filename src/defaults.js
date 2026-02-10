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

// Estruturas padrão para construções e melhorias
export const DEFAULT_CONSTRUCOES = [
    {nome: "Vovó", preço: 15, cps: 0.5, quantidade: 0, quantidadeGratis: 0, descricao: "Uma vovó para assar cookies fresquinhos do forno", icone: Vovo1, icone_pequeno: Vovo3},
    {nome: "Fazenda", preço: 100, cps: 1.5, quantidade: 0, descricao: "As Fazendas plantam e colhem Pés de Cookie", icone: Fazenda, icone_pequeno: Fazenda},
    {nome: "Mina", preço: 1000, cps: 8, quantidade: 0, descricao: "As Minas mineram Cookie Mineral direto da terra!", icone: Mina, icone_pequeno: Mina},
    {nome: "Fábrica", preço: 11000, cps: 45, quantidade: 0, descricao: "As Fábricas produzem cookies em larga escala", icone: Fabrica, icone_pequeno: Fabrica},
    {nome: "Computador", preço: 120_000, cps: 300, quantidade: 0, descricao: "O Computador produz cookies a partir do código do próprio jogo!", icone: PC, icone_pequeno: PC},
    {nome: "Banco", preço: 1_500_000, cps: 1600, quantidade: 0, descricao: "Os Bancos produzem cookies a partir de empréstimos", icone: PC, icone_pequeno: PC},
    {nome: "Templo de Karaj", preço: 77_777_000, cps: 7777, quantidade: 0, descricao: "Os Templos louvam os Deuses dos Cookies, que entregam cookies diretamente a você!", icone: Karaj, icone_pequeno: Karaj},
    {nome: "Laboratório", preço: 400_000_000, cps: 50_000, quantidade: 0, descricao: "Os laboratórios criam Cookies usando CIÊNCIA!", icone: PC, icone_pequeno: PC}
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
    {nome: "Cookie Recheado", preço: 111_111_111, efeito:'3porcento', id: 'cookie10', comprado: false, descricao: "Qual é o recheio? Ninguém sabe. +3% de CPS"},

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
    {nome: "Tortinhas de Morango", preço: 100_000_000_000_000, efeito:'5porcento', id: 'cookiebr6', comprado: false, descricao: "A Melhor de Todas! +5% de CPS"}
  ];

export const DEFAULT_COOKIE_COIN = {desbloqueado: false,
    level: 0,
    coins: 0,
    mercado: 1
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
          {nome: "Conexão", preço: 1, efeito:'ascensao', id: 'ascensaocps', comprado: false, descricao: "Você ganha 1% de cps por nível de prestígio"}
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
        icone: PC,
        icone_destruido:PC,
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