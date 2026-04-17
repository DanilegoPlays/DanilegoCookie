import logo from './arte/PrimeiroCookie.png';
import dourado from './arte/CookieDourado.png';
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
import Cursor from './arte/Cursor.png'

import somClick1 from './arte/click1.mp3';
import somClick2 from './arte/click2.mp3';
import somClick3 from './arte/click3.mp3';
import somClick4 from './arte/click4.mp3';
import somDourado from './arte/dourado.mp3';

import {ExplosaoVideo, PRIMEIRO_PRESTIGIO, calcularPrestigio, getNomeDistrito, criarAbrirDistrito, criarColocarDistrito, criarComprarUpgradeAscensao, criarAscender, criarOnMouseDown, criarOnMouseMove, criarOnMouseUp} from './Ascension';
import './App.css';
import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { Save, Load, saveGame, loadSave } from './version';
import {DEFAULT_CONSTRUCOES, DEFAULT_MELHORIAS, DEFAULT_COOKIE_COIN, DEFAULT_ASCENSAO, DEFAULT_DOURADO, CONFIG_DOURADO, filtrarUpgradesDisponiveis,} from './defaults';
import {  SpawnCookieDourado as SpawnCookieDouradoFn, calcularProximoSpawn as calcularProximoSpawnFn, CPSBuffado, criarEfeitoCookieDourado, criarCookieInstaneo} from './sorte';
import {VALOR_BASE, criarComprarCookieCoinNivel, criarVenderCookieCoin, GraficoCookieCoin} from './minigame';
import {CasasDecimais, simplificarNumero, simplificarNumeroPT, getMultiplicador, getMultiplicadorP} from './helper';

function App() {

  // Função para calcular o preço atual de cada construção baseado no preço base e quantidade
  function getPreçoAtual(preçoBase, quantidade) {
    return Math.floor(preçoBase * Math.pow(1.15, quantidade));
  }

  // useStates principais
  const [contagem, setContagem] = useState(0); // contagem de cookies
  const [click, setClick] = useState(1); // valor do click
  const [CPS, setCPS] = useState(0); // CPS
  const [construcoes, setConstrucoes] = useState(DEFAULT_CONSTRUCOES)
  const [melhorias, setMelhorias] = useState(DEFAULT_MELHORIAS)
  const [cookiesTotais, setCookiesTotais] = useState(0); // cookies totais
  const [cookiesTotaisAscensao, setCookiesTotaisAscensao] = useState(0); // cookies totais só durante a ascensão

  // Minigames
  const [cookieCoin, setCookieCoin] = useState(DEFAULT_COOKIE_COIN);
  const [ascensao, setAscensao] = useState(DEFAULT_ASCENSAO);
  const [telaAtual, setTelaAtual] = useState("jogo"); // telas: "jogo", "karaj" (ascensao), "conquistas", "opções"
  const [animandoAscensao, setAnimandoAscensao] = useState(false); // animação da ascensão
  // sorte
  const [cookieDourado, setCookieDourado] = useState(null);
  const [buff, setBuff] = useState([]);
  const [sorte, setSorte] = useState(1);
  const [tempoDourado, setTempoDourado] = useState(() => {
    // Isso garante que, se não houver save, o jogo já comece com um tempo sorteado
    const { TMIN, TMAX } = CONFIG_DOURADO;
    return Math.floor(Math.random() * (TMIN - TMAX) + TMIN);
  }); // Tempo até o próximo cookie dourado!
  const [douradosTotais, setDouradosTotais] = useState(0);

  // refs dos sons
  const clickSonsRef = useRef([]);
  const douradoSomRef = useRef(null);

  // Inicializa os Audio uma vez só
  useEffect(() => {
    clickSonsRef.current = [
      new Audio(somClick1),
      new Audio(somClick2),
      new Audio(somClick3),
      new Audio(somClick4),
    ];
    clickSonsRef.current.forEach(a => { a.volume = 0.5; });

    douradoSomRef.current = new Audio(somDourado);
    douradoSomRef.current.volume = 0.7;
  }, []);

  // use effect que desbloqueia minigames e distritos
  useEffect(() => {
    const computer = construcoes.find(c => c.nome === "Computador");
    if (computer && computer.quantidade >= 1) {
      setCookieCoin(prev =>
        prev.desbloqueado ? prev : { ...prev, desbloqueado: true }
      );
    }
    const templo = construcoes.find(c => c.nome === "Templo de Karaj");
    if (templo && templo.quantidade >= 1) {
      setAscensao(prev =>
        prev.desbloqueado ? prev : { ...prev, desbloqueado: true }
      );
    }

    // Desbloqueia distritos
    const distritosParaVerificar = [
      { key: 'distritovovo', requisito: 'Vovó', quantidade: 100 },
      { key: 'distritofazenda', requisito: 'Fazenda', quantidade: 100 },
      { key: 'distritomina', requisito: 'Mina', quantidade: 100 },
      { key: 'distritofabrica', requisito: 'Fábrica', quantidade: 100 },
      { key: 'distritopc', requisito: 'Computador', quantidade: 100 },
      { key: 'distritobanco', requisito: 'Banco', quantidade: 100 }
    ];

    distritosParaVerificar.forEach(({ key, requisito, quantidade }) => {
      const building = construcoes.find(c => c.nome === requisito);
      if (building && building.quantidade >= quantidade) {
        setAscensao(prev => {
          if (!prev[key]?.desbloqueado && !prev[key]?.construído) {
            mostrarAviso(`🏗️ Distrito desbloqueado! Você pode construir o Distrito de ${requisito} em Karaj!`);
            return {
              ...prev,
              [key]: {
                ...prev[key],
                desbloqueado: true
              }
            };
          }
          return prev;
        });
      }
    });
  }, [construcoes]);

  const [modoConstrucao, setModoConstrucao] = useState({
    ativo: false,
    distrito: null // qual distrito está sendo construído
  });

  // useStates de teste
  const [isVisible, setIsVisible] = useState(false);
  const [numerinhos, setNumerinhos] = useState([]);
  const [aviso, setAviso] = useState(false);
  const [historicoCookieCoin, setHistoricoCookieCoin] = useState([]);

  // Tooltips
  const [hoveredConstrucao, setHoveredConstrucao] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  // Avisos gerais
  function mostrarAviso(texto) {
    setAviso({ texto, id: Date.now() });
  }

  // referências
  const contagemRef = useRef(contagem);
  const clickRef = useRef(click);
  const construcoesRef = useRef(construcoes);
  const melhoriasRef = useRef(melhorias);
  const cookieCoinRef = useRef(cookieCoin);
  const ascensaoRef = useRef(ascensao);
  const cookiesTotaisRef = useRef(cookiesTotais);
  const cookiesTotaisAscensaoRef = useRef(cookiesTotaisAscensao);

  // Manter referencias sincronizadas
  useEffect(() => { 
    contagemRef.current = contagem;
    cookiesTotaisRef.current = cookiesTotais;
    cookiesTotaisAscensaoRef.current = cookiesTotaisAscensao;
   }, [contagem]);
  useEffect(() => { clickRef.current = click; }, [click]);
  useEffect(() => { construcoesRef.current = construcoes; }, [construcoes]);
  useEffect(() => { melhoriasRef.current = melhorias; }, [melhorias]);
  useEffect(() => { cookieCoinRef.current = cookieCoin; }, [cookieCoin]);
  useEffect(() => { ascensaoRef.current = ascensao; }, [ascensao]);


  // Quicksave
  useEffect(() => {
    const autoSave = setInterval(() => {
      const saveData = {
        contagem: contagemRef.current,
        click: clickRef.current,
        construcoes: construcoesRef.current,
        melhorias: melhoriasRef.current,
        cookieCoin: cookieCoinRef.current,
        ascensao: ascensaoRef.current,
        cookiesTotais: cookiesTotaisRef.current,
        lastSavedAt: Date.now()
      };
      saveGame(saveData);
      console.log("jogo salvo", saveData);

      mostrarAviso("Jogo Salvo!");
    }, 60000);

    return () => clearInterval(autoSave);
  }, []);

  // Load Quicksave
  useEffect(() => {
    const salvamento = localStorage.getItem("QuickSave");

    if (salvamento) {
      const dados = loadSave(salvamento, DEFAULT_CONSTRUCOES, DEFAULT_MELHORIAS);

      setContagem(dados.contagem ?? 0);
      setCookiesTotais(dados.cookiesTotais ?? 0);
      setCookiesTotaisAscensao(dados.cookiesTotaisAscensao ?? 0);
      setClick(dados.click ?? 1);
      setConstrucoes(dados.construcoes ?? DEFAULT_CONSTRUCOES);
      setMelhorias(dados.melhorias ?? DEFAULT_MELHORIAS);
      setCookieCoin(dados.cookieCoin ?? DEFAULT_COOKIE_COIN);
      setAscensao(dados.ascensao ?? DEFAULT_ASCENSAO);
      setDouradosTotais(dados.douradosTotais ?? 0);
      setSorte(dados.sorte ?? 1);
      setTempoDourado(dados.tempoDourado ?? 300);

      // ganho offline
      const stats = getOffline(dados.ascensao);

      if (stats.multiplier > 0 && dados.lastSavedAt) {
        const now = Date.now();
        const diffSeconds = (now - dados.lastSavedAt) / 1000;
        // limite de ganho offline (inicial: 2 horas)
        const capped = Math.min(diffSeconds, stats.capSeconds);

        // Use dados.construcoes instead of state construcoes
        const producaoBase = dados.construcoes.reduce((soma, c) => {
          const quantidadeTotal = c.quantidade + (c.quantidadeGratis || 0)
          return soma + CpsConstrucao(c) * quantidadeTotal;
        }, 0);

        // Calcula o multiplicador a partir do save
        const multiplicador = getMultiplicadorPFromData(dados.melhorias, dados.ascensao);

        const producao = producaoBase * multiplicador;

        const ganho = producao * capped * stats.multiplier;

        setContagem(prev => prev + ganho);
        setCookiesTotais(prev => prev + ganho);
        setCookiesTotaisAscensao(prev => prev + ganho);

        mostrarAviso(
          `Você ganhou ${simplificarNumeroPT(ganho)} cookies offline (${Math.floor(capped/3600)}h ${Math.floor((capped % 3600) / 60)}min)`
        );
      }
    }
    
    
  }, []);

  function SpawnCookieDourado() {
    SpawnCookieDouradoFn(setCookieDourado);
  }

  // Função para calcular o próximo cookie dourado
  const calcularProximoSpawn = () => calcularProximoSpawnFn(sorte);

  // Inicializa o primeiro timer quando o jogo começa (se não houver um salvo)
  useEffect(() => {
    if (tempoDourado === 0 && !cookieDourado) {
      calcularProximoSpawn();
    }
  }, []);

  useEffect(() => {
    const Intervalo = setInterval(() => {
      
        setTempoDourado((prev) => {
          if (prev <= 1) {
            // O Cookie Aparece
            SpawnCookieDourado(); 
            
            // Já calcula e retorna o tempo do PRÓXIMO Cookie
            return calcularProximoSpawn(); 
          }
          return prev - 1;
        });
    }, 1000);

    return () => clearInterval(Intervalo);
  }, [cookieDourado, sorte]);
    

  // some cookie dourado
  useEffect(() => {
    if (!cookieDourado) return;

    const timeout = setTimeout(() => {
      setCookieDourado(null);
    }, cookieDourado.expira - Date.now());

    return () => clearTimeout(timeout);
  }, [cookieDourado]);

  // Limpa efeitos de cookie dourado
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setBuff(prev => prev.filter(b => b.expira > Date.now()));
    }, 1000);
    return () => clearInterval(cleanupInterval);
  }, []);

  const totalLuckAnterior = useRef(0);
  // Melhorias de sorte
  useEffect(() => {
    // Upgrades normais
    const luckUpgrades = melhorias.filter(m => m.efeito === 'sorte' && m.comprado).length;
    
    // Upgrades de ascensão
    let ascensaoLuck = 0;
    Object.values(ascensao).forEach(distrito => {
      if (!distrito?.upgrades) return;
      distrito.upgrades.forEach(u => {
        if (u.comprado && u.efeito === "sorte") {
          ascensaoLuck += 1;
        }
      });
    });
 
    // Cada upgrade aumenta a sorte em 1
    const totalLuck = 1 + luckUpgrades + ascensaoLuck;
    // invoca um cookie dourado instantaneamente sempre que a sorte aumenta
    if (totalLuck > totalLuckAnterior.current && totalLuckAnterior.current !== 0) {
      SpawnCookieDourado();
    }
    totalLuckAnterior.current = totalLuck;

    setSorte(totalLuck);
  }, [melhorias, ascensao]);

  function getOffline(ascensao) {

    const offline1 =
      ascensao.distritotemplo?.upgrades
        ?.filter(u => u.efeito === "offline1" && u.comprado)
        .length || 0;

    const offline2 =
      ascensao.distritoidle?.upgrades
        ?.filter(u => u.efeito === "offline2" && u.comprado)
        .length || 0;

    // Multiplicador offline 
    const multiplier =
        offline1 * 0.5 +
        offline2 * 0.1;

    // Horas máximas offline 
    const capHours =
        offline1 * 2 +
        offline2 * 4;

    return {
      multiplier,
      capSeconds: capHours * 3600
    };
  }

  // Versão do getMultiplicadorP que usa dados do save (para ganho offline).
  // Hoje é apenas um alias — getMultiplicadorP no helper.js já recebe argumentos.
  const getMultiplicadorPFromData = getMultiplicadorP;


  function ClickPorCPS(melhorias, ascensao) {
    let total = 0;

    // upgrades normais
    total += melhorias.filter(m => m.efeito === 'clickCPS' && m.comprado).length * 0.02;

    // upgrades de ascensão
    Object.values(ascensao).forEach(distrito => {
      if (!distrito?.upgrades) return;

      distrito.upgrades.forEach(u => {
        if (u.comprado && u.efeito === "clickCPS") {
          total += 0.01;
        }
      });
    });

    return total;
  }
  // efeitos das melhorias de click
  useEffect(() => {

    // multiplicadores normais de clique
    const mult_click = melhorias.filter(m => m.efeito === 'duplicarClick' && m.comprado).length;
    const clickBaseFinal = 2 ** mult_click;

    // bônus por CPS
    const percentual = ClickPorCPS(melhorias, ascensao);
    const bonusPorCPS = CPS * percentual;
 
    const clickSemBuff = clickBaseFinal + bonusPorCPS;
    
    // Aplica Frenesi de Click
    const now = Date.now();
    const clickBuff = buff.find(b => b.tipo === "Click" && b.expira > now);

    const clickFinal = clickBuff ? clickSemBuff * clickBuff.mult : clickSemBuff;

    setClick(clickFinal);
    clickRef.current = clickFinal;


  }, [melhorias, ascensao, CPS, buff]);
  // efeitos das melhorias de ascensão
  useEffect(() => {
    
    const vovosGratis = ascensao.distritovovo.upgrades.filter(m => m.efeito === 'vovoGratis' && m.comprado).length;
    setConstrucoes(prev =>
      prev.map(c => {
        if (c.nome !== "Vovó") return c;
        return {
          ...c,
          quantidadeGratis: vovosGratis *10
        };
      })
    );
  }, [ascensao]) 

  // efeito CPS
  useEffect(() => {

    let lastUpdate = Date.now();

    const timer = setInterval(() => {
      // considera tempo com o jogo em outra aba
      const now = Date.now();
      const deltaSeconds = (now - lastUpdate) / 1000;
      lastUpdate = now;  
      // calcula o CPS levando em conta construções e melhorias de construções
      // (pode ser útil para implementar melhorias sem alterar o cps base das construções)
      const producaoBase = construcoes.reduce((soma, c) => {
        const quantidadeTotal = c.quantidade + (c.quantidadeGratis || 0)
        return soma + CpsConstrucao(c) * quantidadeTotal;
      }, 0);

      const producao = CPSBuffado(producaoBase * getMultiplicadorP(melhorias, ascensao), buff);
      

      setCPS(producao);
      setContagem((atual) => atual + (deltaSeconds*producao));
      setCookiesTotais((atual) => atual + (deltaSeconds*producao));
      setCookiesTotaisAscensao((atual) => atual + (deltaSeconds*producao));
      if (deltaSeconds > 10) {
        mostrarAviso(`Bem vindo de volta! +  ${deltaSeconds*producao} cookies`)
      }

    }, 100); // a cada 0.1 segundos
    return () => clearInterval(timer); // limpa o timer
  }, [construcoes, melhorias, buff]);

  // cps da construção (para visualização).
  // getMultiplicador e getMultiplicadorP vêm de helper.js — recebem
  // os states (melhorias, ascensao) explicitamente em vez de pegá-los do escopo.
  function CpsConstrucao(c) {
    return c.cps * getMultiplicador(c, melhorias) * getMultiplicadorP(melhorias, ascensao);
  }

  // função click (gera os cookies do click)
  function AssarCookies() {
    // toca um som de click aleatório
    const sons = clickSonsRef.current;
    if (sons.length > 0) {
      const som = sons[Math.floor(Math.random() * sons.length)];
      som.currentTime = 0;
      som.play().catch(() => {});
    }
    setContagem((anterior) => anterior + clickRef.current);
    setCookiesTotais((anterior) => anterior + clickRef.current);
    setCookiesTotaisAscensao((anterior) => anterior + clickRef.current);
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
        ascensao: ascensaoRef.current,
        cookiesTotais: cookiesTotaisRef.current,
        lastSavedAt: Date.now()
      };
    
    const encoded = Save(saveData);  // save com versionamento

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
      setCookieCoin(dados.cookieCoin ?? DEFAULT_COOKIE_COIN);
      setCookiesTotais(dados.cookiesTotais ?? 0);
      setCookiesTotaisAscensao(dados.cookiesTotaisAscensao ?? 0);
      setAscensao(dados.ascensao ?? DEFAULT_ASCENSAO);
      setDouradosTotais(dados.douradosTotais ?? 0);
      setSorte(dados.sorte ?? 1);
      setTempoDourado(dados.tempoDourado ?? 300);

      // ganho offline
      const stats = getOffline(dados.ascensao);

      if (stats.multiplier > 0 && dados.lastSavedAt) {
        const now = Date.now();
        const diffSeconds = (now - dados.lastSavedAt) / 1000;

        const capped = Math.min(diffSeconds, stats.capSeconds);

        // Usa dados do save em vez do state "construcoes"
        const producaoBase = dados.construcoes.reduce((soma, c) => {
          const quantidadeTotal = c.quantidade + (c.quantidadeGratis || 0)
          return soma + CpsConstrucao(c) * quantidadeTotal;
        }, 0);

        // Calcula multiplicador
        const multiplicador = getMultiplicadorPFromData(dados.melhorias, dados.ascensao);

        const producao = producaoBase * multiplicador;

        const ganho = producao * capped * stats.multiplier;

        setContagem(prev => prev + ganho);
        setCookiesTotais(prev => prev + ganho);
        setCookiesTotaisAscensao(prev => prev + ganho);

        mostrarAviso(
          `Você ganhou ${simplificarNumeroPT(ganho)} cookies offline (${Math.floor(capped/3600)}h ${Math.floor((capped % 3600) / 60)}min)`
        );
      }

      mostrarAviso("Save importado com sucesso!");
    } catch (error) {
      console.error("Error importing save:", error);
      alert("Erro ao carregar o save. Verifique se o save está correto.");
    }

  }

  // Upgrades disponíveis (filtragem implementada em defaults.js)
  const upgradesOrdenados = filtrarUpgradesDisponiveis(
    melhorias,
    construcoes,
    cookiesTotaisAscensao,
    douradosTotais,
    ascensao
  );

  // lista de upgrades comprados
  const upgradesComprados = melhorias.filter((m) => m.comprado);


  // Minigame Cookie Coin (implementado em minigame.js)
  const valorAtualCookieCoin = Math.floor(
    VALOR_BASE * cookieCoin.mercado
  );

  const precoNvidia = Math.floor(100000 * Math.pow(1.2, cookieCoin.level));

  const ComprarCookieCoinNivel = criarComprarCookieCoinNivel({
    contagem,
    setContagem,
    cookieCoin,
    setCookieCoin,
  });
  // ganho de Cookie Coins
  useEffect(() => {
    if (!cookieCoin.desbloqueado || cookieCoin.level === 0) return;
    let lastUpdate = Date.now();
    const timer = setInterval(() => {

      const now = Date.now();
      const deltaSeconds = (now - lastUpdate) / 1000;
      lastUpdate = now;
      setCookieCoin(prev => ({
        ...prev,
        coins: prev.coins + prev.level * 0.003 * deltaSeconds
      }));
    }, 100);

    return () => clearInterval(timer);
  }, [cookieCoin.desbloqueado, cookieCoin.level]);

  const VenderCookieCoin = criarVenderCookieCoin({
    cookieCoin,
    setCookieCoin,
    valorAtualCookieCoin,
    setContagem,
    setCookiesTotais,
    setCookiesTotaisAscensao,
    mostrarAviso,
  });
  // mercado de Cookie Coins
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
  //funções de ascensão (implementadas em Ascension.js)
  const AbrirDistrito = criarAbrirDistrito(setAscensao);

  const ComprarUpgradeAscensao = criarComprarUpgradeAscensao(setAscensao);

  // useStates para arrastar com o mouse a cidade
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const startRef = useRef({ x: 0, y: 0 });
  const posRef = useRef({ x: 0, y: 0 });

  const onMouseDown = criarOnMouseDown({ setDragging, startRef });
  const onMouseMove = criarOnMouseMove({ dragging, startRef, posRef, setPos });
  const onMouseUp = criarOnMouseUp({ setDragging, posRef, pos });

  const ColocarDistrito = criarColocarDistrito({
    modoConstrucao,
    setModoConstrucao,
    setAscensao,
    ascensao,
    mostrarAviso,
  });

  // Cálculos derivados de prestígio
  const PrestigioTotal = calcularPrestigio(cookiesTotais);
  const prestigioPossivel = PrestigioTotal - ascensao.prestigioTotal;

  // barra de progresso
  const cookiesAtual = cookiesTotais;
  const cookiesPrestigioAtual = PRIMEIRO_PRESTIGIO * (PrestigioTotal ** 2);
  const cookiesProximoPrestigio = PRIMEIRO_PRESTIGIO * ((PrestigioTotal + 1) ** 2);

  const progresso = (cookiesAtual - cookiesPrestigioAtual) / (cookiesProximoPrestigio - cookiesPrestigioAtual);
  const progressoPorcentagem = Math.min(Math.max(progresso, 0), 1);


  function Ascender(){
    // RESET
      setContagem(0);
      setCookiesTotaisAscensao(0);
      setClick(1);
      setConstrucoes(DEFAULT_CONSTRUCOES);
      setMelhorias(DEFAULT_MELHORIAS);
      setBuff([]);
      
      

    // coloca a tela de ascensão no meio da animação
    setTimeout(() => {
      setTelaAtual("ascensão");
      
      setCookieCoin(DEFAULT_COOKIE_COIN);
      setAscensao(prev=> ({
        ...prev,
        desbloqueado: true,
        prestigio: prev.prestigio + prestigioPossivel,
        prestigioTotal: prev.prestigioTotal + prestigioPossivel
      }))
    }, 4000);
  }



  // Funções de cookie dourado (implementadas em sorte.js)
  const cookieInstaneo = criarCookieInstaneo({
    CPS,
    contagem,
    setContagem,
    setCookiesTotais,
    setCookiesTotaisAscensao,
    mostrarAviso,
    simplificarNumero,
  });

  const efeitoCookieDourado = criarEfeitoCookieDourado({
    douradoSomRef,
    setDouradosTotais,
    setCookieDourado,
    setBuff,
    cookieInstaneo,
    mostrarAviso,
  });
  
  return (
    <div className="App">
      
      {/* Avisos gerais */}
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

      {cookieDourado && telaAtual !== "ascensão" &&
        <div
          onClick={efeitoCookieDourado}
          style={{
            position: "fixed",
            left: cookieDourado.x,
            top: cookieDourado.y,
            width: "100px",
            height: "100px",
            cursor: "pointer",
            zIndex: 9999,
          }}
          className="cookie-dourado"
        >
          <img style={{height: "100px", width:"100px"}}
          src={dourado} alt={"Cookie Dourado"}></img>
        </div>
      }
      
      
        <div className="jogo">
          {telaAtual !== "ascensão" && (
          <div className="lado-esquerdo">


              {/* Display de buffs */}
                {buff.filter(b => b.expira > Date.now()).length > 0 && (
                  <div className="seção-buffs">
                    <h3 style={{ color: '#ffd700', margin: '0 0 8px 0', fontSize: '16px' }}>Efeitos Ativos</h3>
                    {buff
                      .filter(b => b.expira > Date.now())
                      .map((b, i) => {
                        const tempoRestante = Math.ceil((b.expira - Date.now()) / 1000);
                        return (
                          <div key={i} style={{
                            background: 'rgba(0,0,0,0.3)',
                            padding: '6px 8px',
                            borderRadius: '4px',
                            marginBottom: '4px',
                            fontSize: '13px'
                          }}>
                            <div style={{ color: '#ffd700', fontWeight: 'bold' }}>{b.nome}</div>
                            <div style={{ color: '#fff', fontSize: '12px' }}>
                              {b.tipo === "CPS" && `${b.mult}x CPS`}
                              {b.tipo === "Click" && `${b.mult}x Clique`}
                              {' • '}
                              <span style={{ color: '#aaa' }}>{tempoRestante}s</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}

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
                  <GraficoCookieCoin dados={historicoCookieCoin} simplificarNumero={simplificarNumero} />

                <button
                  onClick={VenderCookieCoin}
                  disabled={cookieCoin.coins < 1}
                  style={{cursor: "pointer"}}
                >
                  Vender Cookie Coins<br />
                </button>

                

              </div>
              )}
              {ascensao.desbloqueado && (
                <div className="seção-karaj">
                  <h2>A Cidade de Karaj</h2>
                  
                  <div className="prestigio-box" style={{cursor: "pointer" }}>
                    <div className="prestigio-header">
                      Prestigio a ser ganho: <strong>+{prestigioPossivel}</strong>
                    </div>

                    <div className="prestigio-bar-outer">
                      <div
                        className="prestigio-bar-inner"
                        style={{ width: `${progressoPorcentagem * 100}%` }}
                      />
                    </div>

                    <div className="prestigio-info">
                      {simplificarNumero(
                        cookiesProximoPrestigio - cookiesTotais
                      )} cookies até o próximo nível
                    </div>
                  </div>

                  <p>
                    A cidade eterna de Karaj observa seus ciclos
                  </p>

                  <div className="templo-icone">
                    <img src={Karaj} alt={"Templo"}></img>
                  </div>
                  {telaAtual === "jogo" && (
                    <button
                      className="portao-karaj"
                      onClick={() => setTelaAtual("karaj")}
                    >
                      Portão da Cidade
                    </button>
                  )}
                  {telaAtual === "karaj" && (
                    <button
                      className="portao-karaj"
                      onClick={() => setTelaAtual("jogo")}
                    >
                      Portão da Cidade
                    </button>
                  )}

                </div>
              )}

          </div>
          )}

          {(telaAtual === "karaj" || telaAtual === "ascensão") && (
            <div   className={`karaj-viewport ${dragging ? "dragging" : ""} ${telaAtual === "ascensão" ? "fullscreen" : ""}`}
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    onMouseLeave={onMouseUp}>

              {/* Botão que ativa o Modo Construção */}
              <div className="modo-const"
              style={{
                position: 'fixed',
                top: '20px',
                left: '25%',
                zIndex: 100,
                background: 'rgba(0,0,0,0.85)',
                padding: '15px',
                borderRadius: '12px',
                border: modoConstrucao.ativo ? '3px solid #ffd700' : '3px solid #666',
                minWidth: '200px'
              }}>
                  <button
                    
                    onClick={(e) => {
                      e.stopPropagation();
                      setModoConstrucao(prev => ({
                        ...prev,
                        ativo: !prev.ativo,
                        distrito: prev.ativo ? null : prev.distrito
                      }));
                    }}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: modoConstrucao.ativo ? '#ffd700' : '#666',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: modoConstrucao.ativo ? '#000' : '#fff',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      marginBottom: modoConstrucao.ativo ? '10px' : '0'
                    }}
                  >
                    {modoConstrucao.ativo ? '🏗️ Modo Construção (Ativo)' : '🏗️ Modo Construção'}
                  </button>
                  <div className ="prestigio-info">
                    No modo construção, você pode construir novos distritos em Karaj, e também mover qualquer distrito de lugar!
                  </div>

                  {modoConstrucao.ativo && (
                    <div>
                      <div style={{
                        color: '#ffd700',
                        fontSize: '12px',
                        marginBottom: '8px',
                        borderBottom: '1px solid #666',
                        paddingBottom: '5px'
                      }}>
                        Distritos Disponíveis:
                      </div>
                      
                      {Object.entries(ascensao).map(([key, distrito]) => {
                        if (!distrito || typeof distrito !== 'object' || !distrito.hasOwnProperty('construído')) {
                          return null;
                        }

                        // Construir Distritos
                        if (distrito.desbloqueado && !distrito.construído) {
                          return (
                            <button
                              key={key}
                              onClick={(e) => {
                                e.stopPropagation();
                                setModoConstrucao({
                                  ativo: true,
                                  distrito: key
                                });
                              }}
                              style={{
                                width: '100%',
                                padding: '8px',
                                margin: '5px 0',
                                background: modoConstrucao.distrito === key ? '#4CAF50' : 'rgba(255,215,0,0.2)',
                                border: modoConstrucao.distrito === key ? '2px solid #4CAF50' : '1px solid #888',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                color: '#fff',
                                fontSize: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                              }}
                            >
                              <img src={distrito.icone} style={{width: '20px', height: '20px'}} alt="" />
                              {getNomeDistrito(key)}
                            </button>
                          );
                        }
                        return null;
                      })}

                      {// Mover Distritos
                      Object.entries(ascensao).some(([k, d]) => d?.construído) && (
                        <>
                          <div style={{
                            color: '#ffd700',
                            fontSize: '12px',
                            margin: '10px 0 8px 0',
                            borderBottom: '1px solid #666',
                            paddingBottom: '5px'
                          }}>
                            Mover Distritos:
                          </div>
                          {Object.entries(ascensao).map(([key, distrito]) => {
                            if (!distrito || typeof distrito !== 'object' || !distrito.construído) {
                              return null;
                            }

                            return (
                              <button
                                key={key}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setModoConstrucao({
                                    ativo: true,
                                    distrito: key
                                  });
                                }}
                                style={{
                                  width: '100%',
                                  padding: '8px',
                                  margin: '5px 0',
                                  background: modoConstrucao.distrito === key ? '#2196F3' : 'rgba(33,150,243,0.2)',
                                  border: modoConstrucao.distrito === key ? '2px solid #2196F3' : '1px solid #888',
                                  borderRadius: '5px',
                                  cursor: 'pointer',
                                  color: '#fff',
                                  fontSize: '12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px'
                                }}
                              >
                                <img src={distrito.icone} style={{width: '20px', height: '20px'}} alt="" />
                                 {getNomeDistrito(key)}
                              </button>
                            );
                          })}
                        </>
                      )}

                      {modoConstrucao.distrito && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setModoConstrucao({
                              ativo: true,
                              distrito: null
                            });
                          }}
                          style={{
                            width: '100%',
                            padding: '8px',
                            marginTop: '10px',
                            background: '#f44336',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            color: '#fff',
                            fontSize: '12px'
                          }}
                        >
                          ✖ Cancelar Seleção
                        </button>
                      )}
                    </div>
                  )}
                </div>
              
              
              {/* Botão de Prestígio e Ascender */}
              <div style={{
                position: 'fixed',
                top: '20px',
                left: '40%',
                zIndex: 99,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px'
              }}>
                <div className="prestigio-grande" style={{
                  margin: 0
                }}>
                  <strong>Prestígio Atual: {ascensao.prestigio}</strong>
                  Prestígio Total: {ascensao.prestigioTotal}
                </div>
                
                {telaAtual !== "ascensão" && (
                  <button
                    className="botao-ascender"
                    onClick={() => {
                      const confirmar = window.confirm(
                          "Tem certeza que quer Ascender? \n\n O impacto da explosão irá destruir todo o seu progresso,\n\n exceto o prestígio!"
                        );

                        if (!confirmar) return;
                      Ascender() 
                      setAnimandoAscensao("true")}}
                    style={{
                      margin: 0,
                      position: 'relative',

                    }}
                  >
                    Explodir Karaj
                  </button>
                )}
                {telaAtual == "ascensão" && (
                <div className="prestigio-box">
                  Karaj foi destruída, mas será refeita mais forte do que nunca
                </div>
                )}
                {telaAtual == "ascensão" && (
                  <button
                    className="portao-karaj"
                    onClick={() => {
                      setTelaAtual("jogo");
                      // calcula o próximo spawn do cookie dourado assim que terminar a ascensão
                      calcularProximoSpawn();
                    }}
                    style={{
                      margin: 0,
                      position: 'relative',

                    }}
                  >
                    Reconstruir Karaj
                  </button>
                )}

              </div>

              {/* Mapa da Cidade */}
              <div className="tela-karaj"
                style={{
                  transform: `translate(${pos.x}px, ${pos.y}px)`,
                  cursor: "grabbing"
                }}>
                <div className="karaj-mapa" 
                  onClick={(e) => {
                    if (modoConstrucao.ativo && modoConstrucao.distrito) {
                      ColocarDistrito(e, e.currentTarget);
                    }
                  }}
                  style={{
                    cursor: modoConstrucao.ativo && modoConstrucao.distrito ? 'crosshair' : 'default'
                  }}
                >
                  {/* Renderiza todos os distritos desbloqueados */}
                  {Object.entries(ascensao).map(([key, distrito]) => {
                    if (!distrito || typeof distrito !== 'object' || !distrito.hasOwnProperty('construído')) {
                      return null;
                    }

                    // Só mostra distritos construídos
                    if (!distrito.construído || !distrito.posicao) {
                      return null;
                    }

                    const { posicao, icone, icone_destruido, aberto, upgrades } = distrito;
                    
                    return (
                      <div 
                        key={key}
                        className="distrito-wrapper"
                        style={{
                          position: 'absolute',
                          left: `${posicao.x}%`,
                          top: `${posicao.y}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        {!aberto && (
                          <div
                            className="distrito-botao"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!modoConstrucao.ativo) {
                                AbrirDistrito(key);
                              }
                              if (modoConstrucao.ativo) {
                                setModoConstrucao({
                                  ativo: true,
                                  distrito: key
                                });
                              }
                                
                            }}
                            style={{cursor: modoConstrucao.ativo ? 'crosshair' : 'pointer' }}
                          >
                            <img src={telaAtual==="ascensão" ? icone_destruido : icone} 
                            alt={`Distrito ${key}`} />
                          </div>
                        )}

                        {aberto && (
                          <div
                            className="distrito-caixa"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!modoConstrucao.ativo) {
                                AbrirDistrito(key);
                              }
                            }}
                          >
                            <h3>{getNomeDistrito(key)}</h3>

                            {upgrades && upgrades.length > 0 ? (
                              <div className="upgrades-distrito">
                                {upgrades.map((u, i) => (
                                  <div key={u.id} className="upgrade-predio">
                                    <button
                                      className={`upgrade-predio ${u.comprado ? "comprado" : ""}`}
                                      disabled={ascensao.prestigio < u.preço || u.comprado}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        ComprarUpgradeAscensao(key, i);
                                      }}
                                    >
                                      <img 
                                        className="icone-pequeno"
                                        src={u.comprado ? icone : icone_destruido}
                                        alt={u.nome}
                                      />
                                    </button>
                                    <div className="info">
                                      <strong>{u.nome}</strong><br />
                                      {u.descricao} <br />
                                      Preço: {u.preço}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p>Em Breve</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {telaAtual !== "ascensão" && (
          <div className="lado-meio">
              <div className="seção-cookie">

                {/* Contagem de Cookies */}
                <div style={{ fontSize: "40px", margin: "20px 0" }}>{`${simplificarNumeroPT(contagem)} de cookies`}</div>
                <div style={{ fontSize: "30px", margin: "20px 0" }}>{`Cookies por segundo: ${simplificarNumeroPT(CPS)}`}</div>
                <script src="cookie.js"></script>

                
                {/* novo cookie com animação! */}
                <motion.img
                  id="cookie"
                  src={logo}
                  onClick={Clicar}
                  draggable={false}
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
                    +{simplificarNumero(click)}
                  </motion.div>
                ))}

                {/*
                <button id="cookie2" onClick={DestruirCookies} style={{cursor: "pointer" }}> 
                  Outro Cookie? 
                </button>

                <section className="hidden" id="Escondido2">
                  <h1> -1 Cookie! </h1>
                  <p> Vc destruiu 1 Cookie! </p>
                </section> */}
              </div>
              {telaAtual === "jogo" && (
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
                                    Cada {c.nome} está produzindo {simplificarNumeroPT(cpsAtual)} CPS,<br />
                                    para um total de {simplificarNumeroPT(cpsTotal)} CPS
                                </div>

                              </div>
                            );

                          })}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              )}

          </div>
          )}

          {telaAtual === "jogo" && (
            <div className='lado-direito'>
              <div className="seção-upgrades">
                <h2> Upgrades </h2>
                {upgradesOrdenados.map((m, i) => (
                  <div key={m.indiceOriginal} className="upgrade-wrapper">
                    <button
                      className="melhorias"
                      onClick={() => ComprarMelhoria(m.indiceOriginal)}
                      disabled={contagem < m.preço}
                      style={{
                        opacity: contagem < m.preço ? 0.6 : 1,
                        cursor: contagem < m.preço ? "auto" : "pointer",
                        marginBottom: "8px",
                      }}
                    >
                      {m.nome} <br /> {simplificarNumeroPT(m.preço)}
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
                        <div className="construções-quantidade">{c.quantidade + (c.quantidadeGratis || 0)}</div>
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
                  CPS: {simplificarNumeroPT(CpsConstrucao(hoveredConstrucao))}
                </div>
              )}

              <div className="seção-opções">
                <div style={{ fontSize: "15px" }}>{`Cookies assados: ${simplificarNumeroPT(cookiesTotais)}`}</div>
                <div style={{ fontSize: "15px" }}>{`Cookies assados nessa ascensão: ${simplificarNumeroPT(cookiesTotaisAscensao)}`}</div>
                <div style={{ fontSize: "15px" }}>{`Cookies dourados: ${simplificarNumeroPT(douradosTotais)}`}</div>
                <div style={{ fontSize: "15px" }}>{`Sorte: ${simplificarNumeroPT(sorte)}`}</div>
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
          )}

        </div>
      

      {animandoAscensao && (
        <ExplosaoVideo
          onFinish={() => {
            setAnimandoAscensao(false);
            //Ascender();
          }}
        />
      )}

    </div>
  );
}


export default App;