import logo from './arte/PrimeiroCookie.png';
import Vovo1 from './arte/Vovo1.png';
import Vovo2 from './arte/Vovo2.png';
import Vovo3 from './arte/Vovo3.png';
import Fazenda from './arte/Fazenda.png';
import Fabrica from './arte/Fabrica.png';
import Karaj from './arte/Karaj.png';
import PC from './arte/PC.png';
import './App.css';
import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { Save, Load, saveGame, loadSave } from './version';

function App() {
  // Definir estruturas padrão para construções e melhorias
  const DEFAULT_CONSTRUCOES = [
    {nome: "Vovó", preço: 15, cps: 0.5, quantidade: 0, icone: Vovo1, icone_pequeno: Vovo3, descricao: "Uma vovó para assar cookies fresquinhos do forno"},
    {nome: "Fazenda", preço: 100, cps: 1, quantidade: 0, icone: Fazenda, icone_pequeno: Fazenda, descricao: "As Fazendas plantam pés de cookies"},
    {nome: "Fábrica", preço: 1000, cps: 5, quantidade: 0, icone: Fabrica, icone_pequeno: Fabrica, descricao: "As Fábricas produzem cookies em larga escala"},
    {nome: "Banco", preço: 11000, cps: 40, quantidade: 0, icone: Karaj, icone_pequeno: Karaj, descricao: "Os Bancos produzem cookies a partir de empréstimos"},
    {nome: "Computador", preço: 100000, cps: 200, quantidade: 0, icone: PC, icone_pequeno: PC, descricao: "O Computador produz cookies a partir do código do próprio jogo!"},
    {nome: "Templo de Karaj", preço: 777777, cps: 777, quantidade: 0, icone: Karaj, icone_pequeno: Karaj, descricao: "Os Templos louvam os Deuses dos Cookies, que entregam cookies diretamente a você!"}
  ];
  
  const DEFAULT_MELHORIAS = [
    {nome: "Mouse de Cobre", preço: 100, efeito:'duplicarClick', id: 'click1', comprado: false, descricao: "Seu Mouse é encapado com uma camada de cobre. Melhor que nada! \n Clique 2 vezes mais eficiente!"},
    {nome: "Mouse de Aço", preço: 500, efeito:'duplicarClick', id: 'click2', comprado: false, descricao: "Seu Mouse é encapado com uma camada de aço puro. \n Clique 2 vezes mais eficiente!"},
    {nome: "Mouse de Ouro", preço: 10000, efeito:'duplicarClick', id: 'click3', comprado: false, descricao: "Seu Mouse é encapado com uma camada de ouro. \n Clique 2 vezes mais eficiente!"},
    {nome: "Mouse de Vibrânio", preço: 100000, efeito:'duplicarClick', id: 'click4', comprado: false, descricao: "Seu Mouse é enriquecido com Vibrânio diretamente de Wakanda. \n Clique 2 vezes mais eficiente!"},

    //{nome: "Super Mouse", preço: 100, efeito:'ClickCPS', id: 'click11', comprado: false, descricao: "Seu Mouse ganha super poderes! \n O Clique ganha 1% do seu CPS"},

    {nome: "Treinamento da Vovó", preço: 100, efeito:'duplicarVovo', id: 'vovo1', comprado: false, descricao: "Vovós 2 vezes mais eficientes!"},
    {nome: "Fornos de Cookie", preço: 5000, efeito:'duplicarVovo', id: 'vovo2', comprado: false, descricao: "Vovós 2 vezes mais eficientes!"},
    {nome: "Dentaduras Novas", preço: 50000, efeito:'duplicarVovo', id: 'vovo3', comprado: false, descricao: "Vovós 2 vezes mais eficientes!"},
    {nome: "Super Vovó", preço: 5000000, efeito:'duplicarVovo', id: 'vovo4', comprado: false, descricao: "Vovós 2 vezes mais eficientes!"},

    {nome: "Enxada de Pedra", preço: 1000, efeito:'duplicarFazenda', id: 'fazenda1', comprado: false, descricao: "Fazendas 2 vezes mais eficientes!"},
    {nome: "Fertilizante", preço: 5000, efeito:'duplicarFazenda', id: 'fazenda2', comprado: false, descricao: "Fazendas 2 vezes mais eficientes!"},
    {nome: "Enxada de Ferro", preço: 50000, efeito:'duplicarFazenda', id: 'fazenda3', comprado: false, descricao: "Fazendas 2 vezes mais eficientes!"},
    {nome: "Super Fazenda", preço: 5000000, efeito:'duplicarFazenda', id: 'fazenda4', comprado: false, descricao: "Fazendas 2 vezes mais eficientes!"},

    {nome: "Engrenagens Melhores", preço: 11000, efeito:'duplicarFabrica', id: 'fabrica1', comprado: false, descricao: "... 2 vezes mais eficientes!"},
    {nome: "Energia Sustentável", preço: 55000, efeito:'duplicarFabrica', id: 'fabrica2', comprado: false, descricao: "... 2 vezes mais eficientes!"},
    {nome: "Trabalhadores Rápidos", preço: 555000, efeito:'duplicarFabrica', id: 'fabrica3', comprado: false, descricao: "... 2 vezes mais eficientes!"},
    {nome: "Super Fábrica", preço: 55000000, efeito:'duplicarFabrica', id: 'fabrica4', comprado: false, descricao: "... 2 vezes mais eficientes!"},

    {nome: "Cartão Sem Anuidade", preço: 120000, efeito:'duplicarBanco', id: 'banco1', comprado: false, descricao: "... 2 vezes mais eficientes!"},
    {nome: "Cofres de Cookie", preço: 600000, efeito:'duplicarBanco', id: 'banco2', comprado: false, descricao: "... 2 vezes mais eficientes!"},
    {nome: "Juros Compostos", preço: 6000000, efeito:'duplicarBanco', id: 'banco3', comprado: false, descricao: "... 2 vezes mais eficientes!"},
    {nome: "Super Banco", preço: 600000000, efeito:'duplicarBanco', id: 'banco4', comprado: false, descricao: "... 2 vezes mais eficientes!"},

    {nome: "Refrigeração", preço: 1300000, efeito:'duplicarPC', id: 'PC1', comprado: false, descricao: "Computadores 2 vezes mais eficientes!"},
    {nome: "Atualização de Software", preço: 6500000, efeito:'duplicarPC', id: 'PC2', comprado: false, descricao: "Computadores 2 vezes mais eficientes!"},
    {nome: "Novo Processador", preço: 65000000, efeito:'duplicarPC', id: 'PC3', comprado: false, descricao: "Computadores 2 vezes mais eficientes!"},
    {nome: "Mais Memória RAM", preço: 650000000, efeito:'duplicarPC', id: 'PC4', comprado: false, descricao: "Tá caro demais essa memória RAM! Computadores 2 vezes mais eficientes!"},

    {nome: "Torres mais Pontudas", preço: 14000000, efeito:'duplicarTemplo', id: 'karaj1', comprado: false, descricao: "Templos 2 vezes mais eficientes!"},
    {nome: "Festival do Sol", preço: 70000000, efeito:'duplicarTemplo', id: 'karaj2', comprado: false, descricao: "Templos 2 vezes mais eficientes!"},
    {nome: "Conexão Espiritual", preço: 700000000, efeito:'duplicarTemplo', id: 'karaj3', comprado: false, descricao: "Templos 2 vezes mais eficientes!"},
    {nome: "Café Salgado", preço: 7000000000, efeito:'duplicarTemplo', id: 'karaj4', comprado: false, descricao: "Templos 2 vezes mais eficientes!"}
  ];

  // Função para calcular o preço atual de cada construção baseado no preço base e quantidade
  function getPreçoAtual(preçoBase, quantidade) {
    return Math.floor(preçoBase * Math.pow(1.2, quantidade));
  }

  // useStates principais
  const [contagem, setContagem] = useState(0); // contagem de cookies
  const [click, setClick] = useState(1); // valor do click
  const [CPS, setCPS] = useState(0); // CPS
  const [construcoes, setConstrucoes] = useState(DEFAULT_CONSTRUCOES)
  const [melhorias, setMelhorias] = useState(DEFAULT_MELHORIAS)

  // Minigames
  
  const [cookieCoin, setCookieCoin] = useState({
    desbloqueado: false,
    level: 0,
    coins: 0,
    mercado: 1
  })

  useEffect(() => {
    const computer = construcoes.find(c => c.nome === "Computador");
    if (computer && computer.quantidade >= 1) {
      setCookieCoin(prev =>
        prev.desbloqueado ? prev : { ...prev, desbloqueado: true }
      );
    }
  }, [construcoes]);

  // useStates de teste
  //const [hover, setHover] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [numerinhos, setNumerinhos] = useState([]);
  const [aviso, setAviso] = useState(false);
  const [historicoCookieCoin, setHistoricoCookieCoin] = useState([]);
  // Tooltips
  const [hoveredConstrucao, setHoveredConstrucao] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  function mostrarAviso(texto) {
    setAviso({ texto, id: Date.now() });
  }

  // referências
  const contagemRef = useRef(contagem);
  const clickRef = useRef(click);
  const construcoesRef = useRef(construcoes);
  const melhoriasRef = useRef(melhorias);
  const cookieCoinRef = useRef(cookieCoin);

  // Manter referencias sincronizadas
  useEffect(() => { contagemRef.current = contagem; }, [contagem]);
  useEffect(() => { clickRef.current = click; }, [click]);
  useEffect(() => { construcoesRef.current = construcoes; }, [construcoes]);
  useEffect(() => { melhoriasRef.current = melhorias; }, [melhorias]);
  useEffect(() => { cookieCoinRef.current = cookieCoin; }, [cookieCoin]);

  function CasasDecimais(n, casas) {
    return n.toLocaleString("pt-BR", {
      minimumFractionDigits: casas,
      maximumFractionDigits: casas
    });
  }

  function simplificarNumero(n) {
    if (n >= 1_000_000) return CasasDecimais(n / 1_000_000 , 1) + "M";
    if (n >= 1_000) return CasasDecimais(n / 1_000 , 1) + "k";
    return Math.floor(n);
  }

  function simplificarNumeroPT(n) {
    if (n >= 1_000_000_000_000) return CasasDecimais(n / 1_000_000_000_000 , 3) + " trilhões";
    if (n >= 1_000_000_000) return CasasDecimais(n / 1_000_000_000 , 3) + " bilhões";
    if (n >= 1_000_000) return CasasDecimais(n / 1_000_000 , 3) + " milhões";
    //if (n >= 1_000) return CasasDecimais(n / 1_000 , 3) + " mil";
    if (n >= 1_000) return (n/1_000).toFixed(3);
    return Math.floor(n);
  }



  useEffect(() => {
    const autoSave = setInterval(() => {
      const saveData = {
        contagem: contagemRef.current,
        click: clickRef.current,
        construcoes: construcoesRef.current,
        melhorias: melhoriasRef.current,
        cookieCoin: cookieCoinRef.current,
      };
      saveGame(saveData);
      console.log("jogo salvo", saveData);

      mostrarAviso("Jogo Salvo!");

      // hide after animation
      //setTimeout(() => setAviso(false), 2000);

    }, 60000);

    return () => clearInterval(autoSave);
  }, []);
  /*
  useEffect(() => {
    const QuickSave = { contagem, click, construcoes, melhorias };
    localStorage.setItem("QuickSave", JSON.stringify(QuickSave));
    console.log("jogo salvo", QuickSave);
  }, [contagem, click, construcoes, melhorias]);
*/
  // Load Quicksave
  useEffect(() => {
    const salvamento = localStorage.getItem("QuickSave");

    if (salvamento) {
      const dados = loadSave(salvamento, DEFAULT_CONSTRUCOES, DEFAULT_MELHORIAS);

      setContagem(dados.contagem ?? 0);
      setClick(dados.click ?? 1);
      setConstrucoes(dados.construcoes ?? DEFAULT_CONSTRUCOES);
      setMelhorias(dados.melhorias ?? DEFAULT_MELHORIAS);
      setCookieCoin(dados.cookieCoin ?? {desbloqueado: false, level: 0, coins: 0, mercado: 1});

    }
    
  }, []);


  // efeitos das melhorias
  useEffect(() => {
    const mult_click = melhorias.filter(m => m.efeito === 'duplicarClick' && m.comprado).length;
    const novoClick = 2 ** mult_click;
    setClick(novoClick);
    clickRef.current = novoClick;
    // melhoria das vovós, improvisada
    /*const mult_Vovo = melhorias.filter(m => m.efeito === 'duplicarVovo' && m.comprado).length;
    const novoVovo = 0.5 * (2 ** mult_Vovo);
    setConstrucoes((anteriores) =>
      anteriores.map((c) => {
        if (c.nome === "Vovó") {
          return { ...c, cps: novoVovo }; // multiplica o cps da vovó
        }
        return c;
      })
    );*/

  }, [melhorias]);


  // efeito CPS
  useEffect(() => {
    const timer = setInterval(() => {
      //const producao = construcoes.reduce((soma, c) => soma + c.cps * c.quantidade, 0);
      
      // calcula o CPS levando em conta construções E melhorias
      // (pode ser útil para implementar melhorias sem alterar o cps base das construções)
      
      const producao = construcoes.reduce((soma, c) => {
        return soma + CpsConstrucao(c) * c.quantidade;
      }, 0);

      setCPS(producao);
      setContagem((atual) => atual + producao/10);
    }, 100); // a cada 0.1 segundos
    return () => clearInterval(timer); // limpa o timer
  }, [construcoes, melhorias]);

  function getMultiplicador(c) {
    if (c.nome === "Vovó") {
      const mult = melhorias.filter(
        m => m.efeito === "duplicarVovo" && m.comprado
      ).length;
      return 2 ** mult;
    }
    if (c.nome === "Fazenda") {
      const mult = melhorias.filter(
        m => m.efeito === "duplicarFazenda" && m.comprado
      ).length;
      return 2 ** mult;
    }
    if (c.nome === "Fábrica") {
      const mult = melhorias.filter(
        m => m.efeito === "duplicarFabrica" && m.comprado
      ).length;
      return 2 ** mult;
    }
    if (c.nome === "Banco") {
      const mult = melhorias.filter(
        m => m.efeito === "duplicarBanco" && m.comprado
      ).length;
      return 2 ** mult;
    }
    if (c.nome === "Computador") {
      const mult = melhorias.filter(
        m => m.efeito === "duplicarPC" && m.comprado
      ).length;
      return 2 ** mult;
    }
    if (c.nome === "Templo de Karaj") {
      const mult = melhorias.filter(
        m => m.efeito === "duplicarTemplo" && m.comprado
      ).length;
      return 2 ** mult;
    }
    return 1;
  }
  // cps da construção
  function CpsConstrucao(c) {
    return c.cps * getMultiplicador(c);
  }

  // função click (gera os cookies do click)
  function AssarCookies() {
    setContagem((anterior) => anterior + clickRef.current);
    //document.querySelectorAll('#Escondido1').forEach((item) => {
    //item.classList.toggle("showing");});

    setIsVisible((prev) => !prev);

    // adiciona animação de CSS ao cookie
    //const cookie = document.getElementById("cookie-img");
    //cookie.classList.add("bounce"); // adiciona efeito "bounce"
    //setTimeout(() => cookie.classList.remove("bounce"), 3000); // remove efeito após um tempo


  }
  // função anti-click
  function DestruirCookies() {
    setContagem(contagem - 1);
    document.querySelectorAll('#Escondido2').forEach((item) => {
    item.classList.toggle("showing");
  });
  }

  // animação do cookie
  const controls = useAnimation();
  // função click (animação)
  const Clicar = (e) => {

    // --- Animação dos numerinhos
    const id = Date.now(); // Id único para os numerinhos
    // Pega a posição onde o click foi feito
    const x = e.clientX - 20;
    const y = e.clientY - 20; // posiciona um pouco acima do mouse
    // Adiciona os numerinhos
    setNumerinhos((prev) => [...prev, { id, x, y }]);

    // Animação de clicar
    controls.start({
      scale: [1, 0.9, 1.1, 1],
      //y: [0, 0, 0, 0],
      transition: { duration: 0.3, ease: "easeOut" },
    });
    
    AssarCookies();
    // Apaga os numerinhos
    setTimeout(() => {
      setNumerinhos((prev) => prev.filter((t) => t.id !== id));
    }, 2000);
  };


  function ComprarConstrucao(indice) {
    setConstrucoes((anterior) => {
      const novo = anterior.map((c, i) => {
        const preçoAtual = getPreçoAtual(c.preço, c.quantidade);
        if (contagem >= preçoAtual && i === indice) {
          setContagem(contagem - preçoAtual);
          return {
            ...c,
            quantidade: c.quantidade + 1
            // Preço não é mais modificado, é calculado dinamicamente
          };
        }
        return c;
      });
      return novo;
    });
  }

  function ComprarMelhoria(indice) {
    setMelhorias((anterior) =>
      anterior.map((m, i) => {
        if (contagem >= m.preço && i === indice && !m.comprado) {
          setContagem(contagem - m.preço);
          //AplicarEfeito(m.efeito);
          return { ...m, comprado: true };
        }
        return m;
      })
    );
  }

  // aplicar efeito das melhorias (não funcionando)
  function AplicarEfeito(efeito) {
    if (efeito === "duplicarClick") {
      setClick((prev) => {
        const novo = prev * 2;
        clickRef.current = novo;
        return novo;
      });
    } 
    else if (efeito === "duplicarVovo") {
      setConstrucoes((anteriores) =>
        anteriores.map((c) => {
          if (c.nome === "Vovó") {
            return { ...c, cps: c.cps * 2 }; // dobra apenas o cps da vovó
          }
          return c;
        })
      );
    }
  }

  function DeletarSave() {
    const confirmar = window.confirm(
    "Tem certeza que quer deletar o save? \n\nEsta ação não pode ser desfeita!"
  );

  if (!confirmar) return;

    localStorage.removeItem("QuickSave");
    window.location.reload();

  }

  function ExportarSave() {
    const saveData = {
        contagem: contagemRef.current,
        click: clickRef.current,
        construcoes: construcoesRef.current,
        melhorias: melhoriasRef.current,
        cookieCoin: cookieCoinRef.current,
      };
    
    const encoded = Save(saveData);  // Uses versioned save system

    navigator.clipboard.writeText(encoded).catch(() => {});
    alert("Save copied:\n\n" + encoded);
  }

  function ImportarSave() {
    const input = prompt("Coloque seu save aqui:");

    if (!input) return;

    try {
      const dados = Load(input, DEFAULT_CONSTRUCOES, DEFAULT_MELHORIAS);

      setContagem(dados.contagem ?? 0);
      setClick(dados.click ?? 1);
      setConstrucoes(dados.construcoes ?? DEFAULT_CONSTRUCOES);
      setMelhorias(dados.melhorias ?? DEFAULT_MELHORIAS);
      setCookieCoin(dados.cookieCoin ?? {desbloqueado: false, level: 0, coins: 0, mercado: 1});

      mostrarAviso("Save importado com sucesso!");
    } catch (error) {
      console.error("Error importing save:", error);
      alert("Erro ao carregar o save. Verifique se o save está correto.");
    }

  }

  // Condição para desbloquear upgrades
  const ContagemVovo = construcoes.find((c) => c.nome === "Vovó")?.quantidade || 0;
  const ContagemFazenda = construcoes.find((c) => c.nome === "Fazenda")?.quantidade || 0;
  const ContagemFabrica = construcoes.find((c) => c.nome === "Fábrica")?.quantidade || 0;
  const ContagemBanco = construcoes.find((c) => c.nome === "Banco")?.quantidade || 0;
  const ContagemComputador = construcoes.find((c) => c.nome === "Computador")?.quantidade || 0;
  const ContagemTemplo = construcoes.find((c) => c.nome === "Templo de Karaj")?.quantidade || 0;
  // filtro que separa somente os upgrades que devem aparecer
  const upgradesDisponiveis = melhorias
  .map((m, i) => ({ ...m, indiceOriginal: i }))
  .filter(m => {
    if (m.comprado) return false;

    if (m.id === "click2" && contagem < 100) return false;
    if (m.id === "click3" && contagem < 5000) return false;
    if (m.id === "click4" && contagem < 50000) return false;
    if (m.id === "vovo1" && ContagemVovo < 1) return false;
    if (m.id === "vovo2" && ContagemVovo < 10) return false;
    if (m.id === "vovo3" && ContagemVovo < 25) return false;
    if (m.id === "vovo4" && ContagemVovo < 50) return false;
    if (m.id === "fazenda1" && ContagemFazenda < 1) return false;
    if (m.id === "fazenda2" && ContagemFazenda < 10) return false;
    if (m.id === "fazenda3" && ContagemFazenda < 25) return false;
    if (m.id === "fazenda4" && ContagemFazenda < 50) return false;
    if (m.id === "fabrica1" && ContagemFabrica < 1) return false;
    if (m.id === "fabrica2" && ContagemFabrica < 10) return false;
    if (m.id === "fabrica3" && ContagemFabrica < 25) return false;
    if (m.id === "fabrica4" && ContagemFabrica < 50) return false;
    if (m.id === "banco1" && ContagemBanco < 1) return false;
    if (m.id === "banco2" && ContagemBanco < 10) return false;
    if (m.id === "banco3" && ContagemBanco < 25) return false;
    if (m.id === "banco4" && ContagemBanco < 50) return false;
    if (m.id === "PC1" && ContagemComputador < 1) return false;
    if (m.id === "PC2" && ContagemComputador < 10) return false;
    if (m.id === "PC3" && ContagemComputador < 25) return false;
    if (m.id === "PC4" && ContagemComputador < 50) return false;
    if (m.id === "karaj1" && ContagemTemplo < 1) return false;
    if (m.id === "karaj2" && ContagemTemplo < 10) return false;
    if (m.id === "karaj3" && ContagemTemplo < 25) return false;
    if (m.id === "karaj4" && ContagemTemplo < 50) return false;

    return true;
  });
  // Ordena upgrades do mais barato ao mais caro
  const upgradesOrdenados = [...upgradesDisponiveis].sort(
    (a, b) => a.preço - b.preço
  );

  // lista de upgrades comprados
  const upgradesComprados = melhorias.filter((m) => m.comprado);


  // Minigame Cookie Coin (futuramente pode ser colocado em outro arquivo)
  const VALOR_BASE = 100000;
  const valorAtualCookieCoin = Math.floor(
    VALOR_BASE * cookieCoin.mercado
  );

  const precoNvidia = Math.floor(100000 * Math.pow(1.2, cookieCoin.level));

  function ComprarCookieCoinNivel() {
     if (contagem >= precoNvidia) {
      setContagem(prev => prev - precoNvidia);
      setCookieCoin(prev => ({
        ...prev,
        level: prev.level + 1
      }));
     }    
  }

  useEffect(() => {
    if (!cookieCoin.desbloqueado || cookieCoin.level === 0) return;
    
    const timer = setInterval(() => {
      setCookieCoin(prev => ({
        ...prev,
        coins: prev.coins + prev.level * 0.0003
      }));
    }, 100);

    return () => clearInterval(timer);
  }, [cookieCoin.desbloqueado, cookieCoin.level]);

  function VenderCookieCoin() {
    const moedasInteiras = Math.floor(cookieCoin.coins);
    if (moedasInteiras < 1) return;

    const ganhoCookies = moedasInteiras * valorAtualCookieCoin;

    setContagem(c => c + ganhoCookies);
    setCookieCoin(prev => ({
      ...prev,
      coins: prev.coins - moedasInteiras
    }));
    mostrarAviso(`${moedasInteiras} Cookie Coins vendidas por ${ganhoCookies.toLocaleString()} cookies`);
  }

  useEffect(() => {
    if (!cookieCoin.desbloqueado) return;

    const timer = setInterval(() => {
      const mudanca = (Math.random() - 0.5)*0.2;
      let NovoMercado = cookieCoin.mercado + mudanca;

      NovoMercado = Math.max(0.01, Math.min(100, NovoMercado))
      setCookieCoin(prev => {

      return {
        ...prev,
        mercado: Number(NovoMercado.toFixed(2))
      }})

      let Valor = NovoMercado * VALOR_BASE
      setHistoricoCookieCoin(h => {
        const novo = [...h, Valor];
        return novo.slice(-30); // últimos 30 pontos do gráfico
      });
    }, 30000);
    
    return () => clearInterval(timer);
  }, [cookieCoin.desbloqueado]);

  function GraficoCookieCoin({ dados }) {
    const width = 250;
    const height = 120;

    if (dados.length < 2) return null;

    const min = Math.min(...dados);
    const max = Math.max(...dados);
    const range = max - min || 1;

    const color =
    dados[dados.length - 1] >= dados[dados.length - 2]
      ? "#4caf50"
      : "#f44336";

  const points = dados.map((value, i) => ({
    x: (i / (dados.length - 1)) * width,
    y: height - ((value - min) / range) * height,
    value
  }));

  const labels = [
    { value: max, y: 12 },
    { value: (max + min) / 2, y: height / 2 },
    { value: min, y: height - 4 }
  ];

    return (
      <svg width={width + 40} height={height} style={{ background: "white", borderRadius: 6 }}>
        {/* rotulos do gráfico */}
        {labels.map((l, i) => (
          <text
            key={i}
            x={2}
            y={l.y}
            fill="#aaa"
            fontSize="10"
          >
            {simplificarNumero(l.value)}
          </text>
        ))}

        {/* Gráfico formado por linhas */}
        {points.slice(1).map((p, i) => {
          const prev = points[i];
          const color = p.value >= prev.value ? "#4caf50" : "#f44336";

          return (
            <line
              key={i}
              x1={prev.x + 40}
              y1={prev.y}
              x2={p.x + 40}
              y2={p.y}
              stroke={color}
              strokeWidth="2"
            />
          );
        })}
      </svg>
    );
  }



  return (
    <div className="App">
      
      {/* Aviso de jogo salvo (pode ser usado para mais avisos no futuro) */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 18,
          pointerEvents: "none",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
        }}
      >
        {aviso && (
          <motion.div
            key={aviso.id}
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -30 }}
            transition={{ duration: 3.0 }}
            style={{
              position: "absolute",
              width: "100%",
              textAlign: "center",
              fontSize: "20px",
              fontWeight: "bold",
              pointerEvents: "none",
            }}
          >
            {aviso.texto}
          </motion.div>
        )}
      </div>


      <div className="jogo">
        
        <div className="lado-esquerdo">
          {cookieCoin.desbloqueado && (
          <div className="seção-cookie-coin">
            <h2>Mineração de Cookie Coins</h2>

            <p>Coins: {CasasDecimais(cookieCoin.coins, 3)}</p>
            <p>Level: {cookieCoin.level}</p>

            <button
              onClick={ComprarCookieCoinNivel}
              disabled={contagem < precoNvidia}
              style={{cursor: "pointer"}}
            >
              Nova Placa de Vídeo<br />
              Preço: {simplificarNumeroPT(precoNvidia)}
            </button>
            
              <p>
                Valor:{" "}
                <strong>
                  {simplificarNumero(valorAtualCookieCoin).toLocaleString()} cookies
                </strong>
              </p>
              <GraficoCookieCoin dados={historicoCookieCoin} />

            <button
              onClick={VenderCookieCoin}
              disabled={cookieCoin.coins < 1}
              style={{cursor: "pointer"}}
            >
              Vender Cookie Coins<br />
            </button>

            

          </div>
        )}

        </div>
        


        <div className="lado-meio">
          <div className="seção-cookie">

            {/* Contagem de Cookies */}
            <div style={{ fontSize: "50px", margin: "20px 0" }}>{`${simplificarNumeroPT(contagem)} de cookies`}</div>
            <div style={{ fontSize: "30px", margin: "20px 0" }}>{`Cookies por segundo: ${simplificarNumeroPT(CPS)}`}</div>
            <script src="cookie.js"></script>

            
            {/* novo cookie com animação! */}
            <motion.img
              id="cookie"
              src={logo}
              onClick={Clicar}
              animate={controls}
              whileHover={{
                scale: 1.1,
                //boxShadow: "0 0 25px 5px rgba(255, 200, 100, 0.8)",
                filter: "brightness(1.1)",
                transition: { duration: 0.3, repeat: Infinity, repeatType: "reverse" },
              }}
              //whileTap={{ scale: 0.95 }}
              style={{ width: "400px", cursor: "pointer", borderRadius: "50%", userSelect: "none", }}
            />

            {/* Numerinhos */}
            {numerinhos.map((text) => (
              <motion.div
                key={text.id}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -50 }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  left: text.x,
                  top: text.y,
                  transform: "translate(-50%, -50%)",
                  color: "#fff",
                  fontSize: "30px",
                  fontWeight: "bold",
                  textShadow: "0 0 5px black",
                  pointerEvents: "none",
                }}
              >
                +{click}
              </motion.div>
            ))}


            <button id="cookie2" onClick={DestruirCookies} style={{cursor: "pointer" }}> 
              Outro Cookie? 
            </button>

            <section className="hidden" id="Escondido2">
              <h1> -1 Cookie! </h1>
              <p> Vc destruiu 1 Cookie! </p>
            </section>
          </div>


          <div className="seção-coleção">
            <h2>Sua Produção</h2>

            {construcoes.map((c) => (
              c.quantidade > 0 && (
                <div key={c.nome} className="colecao-grupo">
                  <div className="colecao-icones">
                    {Array.from({ length: c.quantidade }).map((_, i) => {
                      const cpsAtual = CpsConstrucao(c);
                      const cpsTotal = cpsAtual * c.quantidade;
                      return (
                        <div key={i} className="icone-wrapper" style={{cursor: "pointer" }}>
                          <motion.img
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                            src={c.icone_pequeno}
                            alt={c.nome}
                            className="icone-pequeno"
                          />
                          <div className="info">
                            <strong>{c.nome}</strong><br />
                              Quantidade: {c.quantidade} <br />
                              Cada {c.nome} está produzindo {cpsAtual} CPS,<br />
                              para um total de {cpsTotal} CPS
                          </div>

                        </div>
                      );

                    })}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>




        <div className='lado-direito'>

          <div className="seção-upgrades">
            <h2> Upgrades </h2>
            {upgradesOrdenados.map((m, i) => (
              <div key={m.indiceOriginal} className="upgrade-wrapper">
                <button
                  classname="melhorias"
                  onClick={() => ComprarMelhoria(m.indiceOriginal)}
                  disabled={contagem < m.preço}
                  style={{
                    opacity: contagem < m.preço ? 0.6 : 1,
                    cursor: contagem < m.preço ? "auto" : "pointer",
                    marginBottom: "8px",
                  }}
                >
                  {m.nome} <br /> {m.preço}
                </button>

                <div className="info">
                  <strong>{m.nome}</strong><br />
                  {m.descricao}
                </div>
              </div>
              ))}
          </div>


          <div className="seção-construções">
            {construcoes.map((c, i) => {
              const preçoAtual = getPreçoAtual(c.preço, c.quantidade);
              return (
                <div key={c.indiceOriginal} className="construção-wrapper">
                  <button 
                    key={c.nome}
                    className="construções" 
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltipPos({
                        x: rect.left - 10,
                        y: rect.top + rect.height / 2
                      });
                      setHoveredConstrucao(c);
                    }}
                    onMouseLeave={() => setHoveredConstrucao(null)}
                    id={c.nome} 
                    onClick={() => ComprarConstrucao(i)} 
                    disabled={contagem < preçoAtual}
                    style={{
                      cursor: contagem < preçoAtual ? "auto" : "pointer",
                      opacity: contagem < preçoAtual ? 0.6 : 1
                    }}
                  >
                    <div className="construções-icone">
                      <img src={c.icone} alt={c.nome}></img>
                    </div>
                    <div className="construções-info">
                      <div className="construções-nome">{c.nome}</div>
                      <div className="construções-preco">Preço: {simplificarNumeroPT(preçoAtual)}</div>
                    </div>
                    <div className="construções-quantidade">{c.quantidade}</div>
                  </button>

                </div>
              );
            })}
          </div>

          {hoveredConstrucao && (
            <div
              className="info-const"
              style={{
                position: "fixed",
                left: tooltipPos.x,
                top: tooltipPos.y,
                transform: "translate(-100%, -50%)",
                zIndex: 9999
              }}
            >
              <strong>{hoveredConstrucao.nome}</strong><br />
              {hoveredConstrucao.descricao}<br />
              CPS: {CpsConstrucao(hoveredConstrucao)}
            </div>
          )}

          <div className="seção-opções">
            <h2> Opções </h2>
              <button onClick={ExportarSave}>
                Exportar Save
              </button>

              <button onClick={ImportarSave}>
                Importar Save
              </button>

              <button onClick={DeletarSave}>
                Resetar Jogo
              </button>

          </div>

        </div>

      </div>
    </div>
  );
}






export default App;
