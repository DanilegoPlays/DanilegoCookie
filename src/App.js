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
import Lab from './arte/Lab.png'

import somClick1 from './arte/click1.mp3';
import somClick2 from './arte/click2.mp3';
import somClick3 from './arte/click3.mp3';
import somClick4 from './arte/click4.mp3';
import somDourado from './arte/dourado.mp3';
import somSpawn from './arte/spawn.mp3';

import {ExplosaoVideo, PRIMEIRO_PRESTIGIO, calcularPrestigio, getNomeDistrito, criarAbrirDistrito, criarColocarDistrito, criarComprarUpgradeAscensao, criarAscender, criarOnMouseDown, criarOnMouseMove, criarOnMouseUp} from './Ascension';
import './App.css';
import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { Save, Load, saveGame, loadSave } from './version';
import {DEFAULT_CONSTRUCOES, DEFAULT_MELHORIAS, DEFAULT_COOKIE_COIN, DEFAULT_ASCENSAO, DEFAULT_DOURADO, CONFIG_DOURADO, DEFAULT_CONQUISTAS, CONQUISTA_SPRITE, filtrarUpgradesDisponiveis} from './defaults';
import conquistasSprite from './arte/conquistas.png';
import tinyCookie from './arte/TinyCookie.png';
import madalenaIcon from './arte/Madalena.png';
import temploSecretoIcon from './arte/MarioL.png';
import cookieCoinIcon from './arte/CookieCoin.png';
import {SpawnCookieDourado as SpawnCookieDouradoFn, calcularProximoSpawn as calcularProximoSpawnFn, CPSBuffado, criarEfeitoCookieDourado, criarCookieInstaneo} from './sorte';
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
  const [conquistas, setConquistas] = useState(DEFAULT_CONQUISTAS)
  // Flag pra disparar a conquista secreta do cookie pequeno (não persiste).
  const [cookiePequenoClicado, setCookiePequenoClicado] = useState(false)
  // Flag pra disparar a conquista secreta da madalena perdida (não persiste).
  const [madalenaClicada, setMadalenaClicada] = useState(false)
  // Flag pra disparar a conquista secreta do templo (não persiste).
  const [temploSecretoClicado, setTemploSecretoClicado] = useState(false)
  // Qual índice do templo (em "Sua Produção") tem o ícone secreto escondido.
  // Escolhido aleatoriamente na primeira render, mantém na sessão.
  const temploSecretoIndexRef = useRef(null);
 
 
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
    const tempoSort = Math.floor(Math.random() * (TMAX - TMIN) + TMIN);
    return Date.now() + (tempoSort * 1000);
  }); // Tempo até o próximo cookie dourado!
  const [douradosTotais, setDouradosTotais] = useState(770);
 
  // refs dos sons
  const clickSonsRef = useRef([]);
  const douradoSomRef = useRef(null);
  const spawnSomRef = useRef(null);
 
  // Inicializa os audios uma vez só
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
 
    spawnSomRef.current = new Audio(somSpawn);
    spawnSomRef.current.volume = 0.6;
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
        // Aviso só dispara se o distrito ainda não foi desbloqueado
        if (!ascensao[key]?.desbloqueado && !ascensao[key]?.construído) {
          const iconeDistrito = ascensao[key]?.icone ? (
            <img src={ascensao[key].icone} alt="" style={{ width: 64, height: 64, flexShrink: 0 }} />
          ) : null;
          mostrarAvisoPersistente(`🏗️ Distrito desbloqueado! Você pode construir o Distrito ${requisito} em Karaj!`, iconeDistrito);
        }
        setAscensao(prev => {
          if (!prev[key]?.desbloqueado && !prev[key]?.construído) {
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
  const [numerinhos, setNumerinhos] = useState([]);
  const [aviso, setAviso] = useState(false);
  const [historicoCookieCoin, setHistoricoCookieCoin] = useState([]);
  // Se a seção "Sua Produção" está minimizada. Persistido no save.
  const [producaoMinimizada, setProducaoMinimizada] = useState(false);
 
  // Tooltips
  const [hoveredConstrucao, setHoveredConstrucao] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  // Avisos gerais
  function mostrarAviso(texto) {
    setAviso({ texto, id: Date.now() });
  }
 
  // Sistema de avisos persistentes: ficam na tela até o jogador clicar pra fechar.
  // Usado para eventos importantes que o jogador não deveria perder
  // (ganho offline, venda de Cookie Coin, distrito desbloqueado, etc).
  // Estrutura: array de { id, texto }. Cada um vira uma caixinha embaixo da tela.
  const [avisosPersistentes, setAvisosPersistentes] = useState([]);
 
  function mostrarAvisoPersistente(texto, icone = null) {
    setAvisosPersistentes(prev => [...prev, { texto, icone, id: Date.now() + Math.random() }]);
  }
 
  function fecharAvisoPersistente(id) {
    setAvisosPersistentes(prev => prev.filter(a => a.id !== id));
  }
 
  function limparAvisosPersistentes() {
    setAvisosPersistentes([]);
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
  const sorteRef = useRef(sorte);
  const douradosTotaisRef = useRef(douradosTotais);
  const tempoDouradoRef = useRef(tempoDourado);
  const producaoMinimizadaRef = useRef(producaoMinimizada);
  const conquistasRef = useRef(conquistas);
 
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
  useEffect(() => { sorteRef.current = sorte; }, [sorte]);
  useEffect(() => { douradosTotaisRef.current = douradosTotais; }, [douradosTotais]);
  useEffect(() => { tempoDouradoRef.current = tempoDourado; }, [tempoDourado]);
  useEffect(() => { producaoMinimizadaRef.current = producaoMinimizada; }, [producaoMinimizada]);
  useEffect(() => { conquistasRef.current = conquistas; }, [conquistas]);
 
 
  useEffect(() => {
    
    const novasConquistas = conquistas.filter(c => !c.obtido && checkConquista(c, {cookiesTotais, CPS, construcoes, cookiePequenoClicado, madalenaClicada, temploSecretoClicado}))
 
    if (novasConquistas.length === 0) return;
 
    novasConquistas.forEach(c => {
      const T = CONQUISTA_SPRITE.tamanho;
      const icone = (
        <div
          style={{
            width: T,
            height: T,
            backgroundImage: `url(${conquistasSprite})`,
            backgroundPosition: `-${c.spriteX * T}px -${c.spriteY * T}px`,
            imageRendering: 'pixelated',
            flexShrink: 0,
          }}
        />
      );
      mostrarAvisoPersistente(`Nova Conquista: ${c.nome}`, icone);
    });
 
    const idsObtidos = new Set(novasConquistas.map(c => c.id));
    setConquistas(prev => prev.map(c => 
      idsObtidos.has(c.id) ? {...c, obtido: true} : c));
 
  }, [cookiesTotais, CPS, cookiePequenoClicado, madalenaClicada, temploSecretoClicado]);
 
 
 
  function checkConquista(conquista, state) {
    if (conquista.check) return conquista.check(state);
 
    switch (conquista.tipo) {
      case 'cookiesTotais':
        return state.cookiesTotais >= conquista.quantidade;
      case 'cps':
        return state.CPS >= conquista.quantidade;
      case 'construcao':
        return (state.construcoes.find(c => c.nome === conquista.params.nome)?.quantidade ?? 0) >= conquista.quantidade;
      case 'valorClick':
        return state.click >= conquista.quantidade;
      default:
        return false; // tipo não implementado ainda
    }
  }
 
 
  // Monta o objeto de save a partir das refs, para ser passado a saveGame/Save.
  function montarSaveData() {
    return {
      contagem: contagemRef.current,
      click: clickRef.current,
      construcoes: construcoesRef.current,
      melhorias: melhoriasRef.current,
      cookieCoin: cookieCoinRef.current,
      ascensao: ascensaoRef.current,
      cookiesTotais: cookiesTotaisRef.current,
      cookiesTotaisAscensao: cookiesTotaisAscensaoRef.current,
      sorte: sorteRef.current,
      douradosTotais: douradosTotaisRef.current,
      tempoDourado: tempoDouradoRef.current,
      producaoMinimizada: producaoMinimizadaRef.current,
      conquistas: conquistasRef.current,
      lastSavedAt: Date.now()
    };
  }
 
  // Quicksave
  useEffect(() => {
    const autoSave = setInterval(() => {
      const saveData = montarSaveData();
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
      // Se tempoDourado salvo já passou (ex: jogador ficou offline), recalcula
      // pra evitar spawn imediato no carregamento. Senão usa o salvo (caso do
      // jogador recarregar a página rapidamente sem ter passado do timer).
      {
        const tempoSalvo = dados.tempoDourado;
        if (typeof tempoSalvo === 'number' && tempoSalvo > Date.now()) {
          setTempoDourado(tempoSalvo);
        } else {
          const { TMIN, TMAX } = CONFIG_DOURADO;
          const tempoSort = Math.floor(Math.random() * (TMAX - TMIN) + TMIN);
          setTempoDourado(Date.now() + (tempoSort * 1000));
        }
      }
      setProducaoMinimizada(dados.producaoMinimizada ?? false);
      if (dados.conquistas) setConquistas(dados.conquistas);
 
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
 
        mostrarAvisoPersistente(
          `Você ganhou ${simplificarNumeroPT(ganho)} cookies offline (${Math.floor(capped/3600)}h ${Math.floor((capped % 3600) / 60)}min)`
        );
      }
    }
    
    
  }, []);
 
  // Wrapper do spawn: além de criar o cookie, toca o sino se o upgrade
  // "Sino da Fábrica" foi comprado. Centraliza aqui pra que *qualquer* spawn
  // (natural ou de upgrade) toque o som, sem precisar duplicar a lógica.
  function SpawnCookieDourado() {
    SpawnCookieDouradoFn(setCookieDourado);

    const temSino = ascensao?.distritofabrica?.upgrades?.some(
      u => u.id === "fabricaascensao2" && u.comprado
    );
    if (temSino && spawnSomRef.current) {
      spawnSomRef.current.currentTime = 0;
      spawnSomRef.current.play().catch(() => {});
    }
  }
 
  // Função para calcular o próximo cookie dourado
  const calcularProximoSpawn = () => calcularProximoSpawnFn(sorte);
 
  // Inicializa o primeiro timer quando o jogo começa (se não houver um salvo)
  useEffect(() => {
    if (tempoDourado === 0 && !cookieDourado) {
      calcularProximoSpawn();
    }
  }, []);
  // Título original da aba, pra conseguir restaurar depois.
  const tituloOriginalRef = useRef(typeof document !== 'undefined' ? document.title : '');

  // Restaura o título original da aba. Chamada quando o jogador interage
  // com o cookie dourado (clica ou deixa expirar) ou volta pra aba.
  function restaurarTitulo() {
    if (tituloOriginalRef.current) {
      document.title = tituloOriginalRef.current;
    }
  }

  // Quando o jogador volta pra aba (visibilitychange), limpa o título de aviso.
  useEffect(() => {
    function onVisibilityChange() {
      if (!document.hidden) restaurarTitulo();
    }
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  // faz o cookie dourado aparecer
  useEffect(() => {
    const Intervalo = setInterval(() => {

      const agora = Date.now();
      // hora do cookie dourado aparecer!
      if (agora >= tempoDourado) {
        SpawnCookieDourado();
        setTempoDourado(calcularProximoSpawn());

        // Aviso no título da aba: sempre que spawna com aba escondida.
        if (document.hidden) {
          document.title = "✨ Cookie Dourado!";
        }
      }
    }, 1000);
 
    return () => clearInterval(Intervalo);
  }, [cookieDourado, tempoDourado, sorte, ascensao]);
    
 
  // some cookie dourado
  useEffect(() => {
    if (!cookieDourado) return;
 
    const timeout = setTimeout(() => {
      setCookieDourado(null);
    }, cookieDourado.expira - Date.now());
 
    return () => clearTimeout(timeout);
  }, [cookieDourado]);

  // Quando o cookie dourado some (clicado, expirou, ou ascensão), limpa
  // o aviso do título da aba — não faz sentido manter "✨ Cookie Dourado!"
  // se o cookie nem existe mais.
  useEffect(() => {
    if (!cookieDourado) restaurarTitulo();
  }, [cookieDourado]);
 
  // Limpa efeitos de cookie dourado expirados.
  // Só chama setBuff se algo efetivamente expirou — senão criaria uma nova
  // referência de array toda vez, disparando re-renders à toa.
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setBuff(prev => {
        const now = Date.now();
        const filtrado = prev.filter(b => b.expira > now);
        return filtrado.length === prev.length ? prev : filtrado;
      });
    }, 1000);
    return () => clearInterval(cleanupInterval);
  }, []);
 
  // Melhorias de sorte: recalcula a sorte total quando upgrades mudam.
  // O spawn de cookie dourado em compra de upgrade de sorte foi movido pras
  // funções ComprarMelhoria e ComprarUpgradeAscensao — fazer aqui causava
  // spawn falso ao carregar saves com upgrades de sorte já comprados.
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
 
  // Mantém a produção atual numa ref pra não remontar o timer a cada mudança.
  // O effect abaixo recalcula sempre que as deps relevantes mudam.
  const producaoRef = useRef(0);
 
  useEffect(() => {
    const producaoBase = construcoes.reduce((soma, c) => {
      const quantidadeTotal = c.quantidade + (c.quantidadeGratis || 0);
      return soma + CpsConstrucao(c) * quantidadeTotal;
    }, 0);
    const multiplicador = getMultiplicadorP(melhorias, ascensao);
    const producao = CPSBuffado(producaoBase * multiplicador, buff);
 
    producaoRef.current = producao;
    setCPS(producao); // atualiza display só quando algo realmente mudou
  }, [construcoes, melhorias, ascensao, buff]);
 
  // Timer único que nunca remonta. Lê produção da ref.
  useEffect(() => {
    let lastUpdate = Date.now();
    let ganhoAcumulado = 0;
    let ticksDesdeUltimoFlush = 0;
 
    const timer = setInterval(() => {
      const now = Date.now();
      const deltaSeconds = (now - lastUpdate) / 1000;
      lastUpdate = now;
      const ganho = deltaSeconds * producaoRef.current;
 
      ganhoAcumulado += ganho;
      setContagem(atual => atual + ganho);
 
      // A cada 10 ticks (~1s), aplica o ganho acumulado nos totais.
      ticksDesdeUltimoFlush++;
      if (ticksDesdeUltimoFlush >= 10 && ganhoAcumulado > 0) {
        const ganhoTotal = ganhoAcumulado;
        ganhoAcumulado = 0;
        ticksDesdeUltimoFlush = 0;
        setCookiesTotais(atual => atual + ganhoTotal);
        setCookiesTotaisAscensao(atual => atual + ganhoTotal);
      }
 
      if (deltaSeconds > 10) {
        mostrarAviso(`Bem vindo de volta! +  ${simplificarNumero(ganho)} cookies`);
      }
    }, 100);
 
    return () => clearInterval(timer);
  }, []); // nunca remonta
 
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
    const m = melhorias[indice];
    if (!m || m.comprado || contagem < m.preço) return;

    setContagem(contagem - m.preço);
    setMelhorias(anterior => anterior.map((u, i) =>
      i === indice ? { ...u, comprado: true } : u
    ));

    // Spawn imediato de cookie dourado quando o upgrade comprado é de sorte.
    // (Antes era no useEffect da sorte, mas isso causava spawn falso ao
    // carregar saves com upgrades de sorte já comprados — o effect rodava
    // depois do load e detectava "aumento" no totalLuck.)
    if (m.efeito === 'sorte') {
      SpawnCookieDourado();
    }
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
    const encoded = Save(montarSaveData());  // save com versionamento
 
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
      // Se tempoDourado salvo já passou (ex: jogador ficou offline), recalcula
      // pra evitar spawn imediato no carregamento. Senão usa o salvo (caso do
      // jogador recarregar a página rapidamente sem ter passado do timer).
      {
        const tempoSalvo = dados.tempoDourado;
        if (typeof tempoSalvo === 'number' && tempoSalvo > Date.now()) {
          setTempoDourado(tempoSalvo);
        } else {
          const { TMIN, TMAX } = CONFIG_DOURADO;
          const tempoSort = Math.floor(Math.random() * (TMAX - TMIN) + TMIN);
          setTempoDourado(Date.now() + (tempoSort * 1000));
        }
      }
      setProducaoMinimizada(dados.producaoMinimizada ?? false);
      if (dados.conquistas) setConquistas(dados.conquistas);
 
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
 
        mostrarAvisoPersistente(
          `Você ganhou ${simplificarNumeroPT(ganho)} cookies offline (${Math.floor(capped/3600)}h ${Math.floor((capped % 3600) / 60)}min)`
        );
      }
 
      mostrarAvisoPersistente("Save importado com sucesso!");
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
    mostrarAvisoPersistente,
    iconeCookieCoin: <img src={cookieCoinIcon} alt="" style={{ width: 64, height: 64, flexShrink: 0 }} />,
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
 
  // Wrapper do ComprarUpgradeAscensao que dispara cookie dourado se o upgrade
  // comprado for de sorte. Decisão é feita ANTES de chamar a função interna,
  // que valida (preço, comprado já, etc.) — então só spawna se a compra
  // realmente aconteceu (verificamos o estado pré-compra).
  const ComprarUpgradeAscensaoBase = criarComprarUpgradeAscensao(setAscensao);
  function ComprarUpgradeAscensao(distrito, index) {
    const upgrade = ascensao[distrito]?.upgrades[index];
    const eraDeSorte = upgrade && !upgrade.comprado && upgrade.efeito === 'sorte' &&
                       (Number(ascensao.prestigio) || 0) >= (Number(upgrade.preço) || 0);

    ComprarUpgradeAscensaoBase(distrito, index);

    if (eraDeSorte) {
      SpawnCookieDourado();
    }
  }
 
  // useStates para arrastar com o mouse a cidade
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const startRef = useRef({ x: 0, y: 0 });
  const posRef = useRef({ x: 0, y: 0 });
 
  const onMouseDown = criarOnMouseDown({ setDragging, startRef });
  const onMouseMove = criarOnMouseMove({ dragging, startRef, posRef, setPos });
  const onMouseUp = criarOnMouseUp({ setDragging, posRef, pos });
 
  const ColocarDistrito = criarColocarDistrito({modoConstrucao,setModoConstrucao,setAscensao,ascensao,mostrarAviso});
 
  // Cálculos derivados de prestígio.
  // Math.max(0, ...) protege contra saves antigos/inconsistentes em que
  // ascensao.prestigioTotal > PrestigioTotal (cookiesTotais nem sempre foi
  // salvo corretamente em versões antigas) — nunca se perde prestígio ascendendo.
  const PrestigioTotal = calcularPrestigio(cookiesTotais);
  const prestigioPossivel = Math.max(0, PrestigioTotal - ascensao.prestigioTotal);
 
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
  const cookieInstaneo = criarCookieInstaneo({CPS, contagem, setContagem, setCookiesTotais, setCookiesTotaisAscensao, mostrarAviso, simplificarNumero});
 
  const efeitoCookieDourado = criarEfeitoCookieDourado({douradoSomRef, setDouradosTotais, setCookieDourado, setBuff, cookieInstaneo, mostrarAviso});
  
  return (
    <div className="App">
      
      {/* Avisos gerais */}
      <div
        style={{position: "fixed", left: 0, right: 0, bottom: 200, pointerEvents: "none", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999}}
      >
        {aviso && (
          <motion.div
            key={aviso.id}
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -30 }}
            transition={{ duration: 3.0 }}
            style={{position: "absolute",width: "100%",textAlign: "center",fontSize: "20px",fontWeight: "bold",pointerEvents: "none"}}
          >
            {aviso.texto}
          </motion.div>
        )}
      </div>
 
      {/* Avisos persistentes: ficam até o jogador clicar. Colados na parte
          de baixo da tela; novos avisos empilham pra cima (column-reverse) */}
        <div
          style={{position: "fixed",left: 0,right: 0,bottom: 0,padding: "10px 0",display: "flex",flexDirection: "column-reverse",alignItems: "center",gap: "8px",zIndex: 9998,pointerEvents: "none"}}
        >
          {(() => {
            // Mostra só os 3 mais antigos. Os novos esperam na fila; fechar um dos visíveis revela o próximo. Nunca some sem ser visto.
            const MAX_VISIVEIS = 3;
            const visiveis = avisosPersistentes.slice(0, MAX_VISIVEIS);
            const esperando = avisosPersistentes.length - visiveis.length;
            // Botão aparece quando há 2+ avisos OU há fila esperando.
            return (
              <>
                {visiveis.map(a => (
            <div
              key={a.id}
              onClick={() => fecharAvisoPersistente(a.id)}
              style={{pointerEvents: "auto", background: "rgba(0, 0, 0, 0.85)", color: "#ffd700", border: "2px solid #ffd700", borderRadius: "8px", padding: "12px 40px 12px 16px",
                fontSize: "15px",
                fontWeight: "bold",
                cursor: "pointer",
                maxWidth: "600px",
                position: "relative",
                boxShadow: "0 0 10px rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
              title="Clique para fechar"
            >
              {a.icone}
              <span>{a.texto}</span>
              <span style={{position: "absolute",right: 10,top: "50%",transform: "translateY(-50%)",fontSize: "18px",color: "#aaa"}}>×</span>
            </div>
          ))}
 
                {(avisosPersistentes.length >= 2 || esperando > 0) && (
                  <button
                    onClick={limparAvisosPersistentes}
                    style={{
                      pointerEvents: "auto",
                      background: "rgba(0, 0, 0, 0.85)",
                      color: "#fff",
                      border: "2px solid #888",
                      borderRadius: "6px",
                      padding: "6px 14px",
                      fontSize: "13px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      boxShadow: "0 0 8px rgba(0,0,0,0.4)",
                    }}
                    title="Fecha todos os avisos"
                  >
                    {esperando > 0
                      ? `Limpar notificações, +${esperando} na fila`
                      : `Limpar notificações`}
                  </button>
                )}
              </>
            );
          })()}
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

              {/* Botões para abrir menus de opções e conquistas */}
              <div className="seção-menus">
                <button
                  className="portao-karaj"
                  onClick={() => setTelaAtual(telaAtual === "opções" ? "jogo" : "opções")}
                >
                  Opções
                </button>
                <button
                  className="portao-karaj"
                  onClick={() => setTelaAtual(telaAtual === "conquistas" ? "jogo" : "conquistas")}
                >
                  Conquistas
                </button>
              </div>

              {cookieCoin.desbloqueado && (
              <div className="seção-cookie-coin">
                <h2>Mineração de Cookie Coins</h2>

                <p>
                  <img src={cookieCoinIcon} alt="" className="cookie-coin-icon" /> {CasasDecimais(cookieCoin.coins, 3)} 
                </p>
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

          {/* Tela de Opções (aparece no meio quando telaAtual === "opções") */}
          {telaAtual === "opções" && (
            <div className="tela-menu">
              <h2>Opções</h2>
              <div className="menu-botoes">
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

          {/* Tela de Conquistas e estatísticas do jogador */}
          {telaAtual === "conquistas" && (
            <div className="tela-menu">
              <h3 style={{ marginTop: 0 }}>Estatísticas</h3>
              <div className="menu-estatisticas">
                <div>
                  {`Cookies assados: `}
                  <img
                    src={tinyCookie}
                    alt="cookie"
                    className="tiny-cookie"
                    onClick={() => setCookiePequenoClicado(true)}
                    title="Hmm... clica em mim?"
                  />
                  {` ${simplificarNumero(cookiesTotais)}`}
                </div>
                <div>
                  {`Cookies assados nessa ascensão: `}
                  <img
                    src={tinyCookie}
                    alt="cookie"
                    className="tiny-cookie"
                    onClick={() => setCookiePequenoClicado(true)}
                    title="Hmm... clica em mim?"
                  />
                  {` ${simplificarNumero(cookiesTotaisAscensao)}`}
                </div>
                <div>{`Cookies dourados: ${simplificarNumero(douradosTotais)}`}</div>
                <div>{`Sorte: ${simplificarNumero(sorte)}`}</div>
              </div>

              <h3 style={{ marginTop: 30 }}>Conquistas</h3>
              <div className="menu-estatisticas" style={{ marginTop: 0, marginBottom: 10 }}>
                <div>{`Obtidas: ${conquistas.filter(c => c.obtido).length} / ${conquistas.length}`}</div>
              </div>

              {/* Grade de "troféus": cada conquista é uma caixa preta.
                  Quando obtida, aparece o sprite correspondente. Hover mostra
                  nome + descrição; não obtidas mostram "???" pra dar mistério. */}
              <div className="conquistas-grade">
                {conquistas.map((c) => {
                  const T = CONQUISTA_SPRITE.tamanho;
                  return (
                    <div
                      key={c.id}
                      className={`conquista-caixa ${c.obtido ? 'obtida' : 'bloqueada'}`}
                    >
                      {c.obtido && (
                        <div
                          className="conquista-icone"
                          style={{
                            backgroundImage: `url(${conquistasSprite})`,
                            backgroundPosition: `-${c.spriteX * T}px -${c.spriteY * T}px`,
                          }}
                        />
                      )}
                      <div className="conquista-tooltip">
                        <strong>{c.obtido ? c.nome : '???'}</strong>
                        <div>{c.obtido ? c.descricao : '???'}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
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

                  {/* Madalena perdida — conquista secreta. Fica no canto inferior
                      direito do mapa de Karaj (2400x1600), bem escondida.
                      O ícone é pequeno (24px) pra dificultar achar de relance. */}
                  <img
                    src={madalenaIcon}
                    alt=""
                    onClick={(e) => {
                      e.stopPropagation();
                      setMadalenaClicada(true);
                    }}
                    style={{position: 'absolute', right: '1000px', bottom: '100px', width: '32px', height: '32px', cursor: 'pointer', imageRendering: 'pixelated',opacity: 0.85,zIndex: 10}}
                    title="?"
                  />
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
                    style={{position: "absolute",left: text.x,top: text.y,transform: "translate(-50%, -50%)",color: "#fff",fontSize: "30px",fontWeight: "bold",textShadow: "0 0 5px black",pointerEvents: "none"}}
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
                  <div className="coleção-header">
                    <h2>Sua Produção</h2>
                    <button
                      style={{cursor: "pointer"}}
                      className="btn-minimizar"
                      onClick={() => setProducaoMinimizada(p => !p)}
                      title={producaoMinimizada ? "Mostrar produção" : "Minimizar produção"}
                    >
                      {producaoMinimizada ? "▼" : "▲"}
                    </button>
                  </div>

                  {!producaoMinimizada && construcoes.map((c) => {
                    if (c.quantidade <= 0) return null;
                    
                    // Inicializar ref do templo secreto (só uma vez)
                    if (c.nome === "Templo de Karaj" && temploSecretoIndexRef.current === null && c.quantidade > 20) {
                      temploSecretoIndexRef.current = Math.floor(Math.random() * Math.min(c.quantidade, 22));
                    }

                    // Calcula uma vez por construção, não por ícone renderizado.
                    const cpsAtual = CpsConstrucao(c);
                    const cpsTotal = cpsAtual * c.quantidade;
                    // Limita a 22 ícones na tela (~2 linhas) pra não virar centenas de DOM
                    // nodes quando o jogador tem muitas construções. O número real
                    // continua aparecendo no tooltip ("Quantidade: X").
                    const MAX_ICONES = 22;
                    const iconesExibidos = Math.min(c.quantidade, MAX_ICONES);
                    return (
                      <div key={c.nome} className="colecao-grupo">
                        <div className="colecao-icones">
                          {Array.from({ length: iconesExibidos }).map((_, i) => {
                            const temploSecretaObtida = conquistas.find(c => c.id === 'sec_templo')?.obtido;
                            const temTemploSecreto = c.nome === "Templo de Karaj" && c.quantidade > 20 && i === temploSecretoIndexRef.current && !temploSecretaObtida;
                            
                            return (
                            <div key={i} className="icone-wrapper" style={{cursor: "pointer", position: "relative" }}>
                              {/* Ícone secreto atrás do templo escolhido */}
                              {temTemploSecreto && (
                                <img
                                  src={temploSecretoIcon}
                                  alt=""
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setTemploSecretoClicado(true);
                                  }}
                                  style={{position: 'absolute',width: '80%',height: '80%',bottom: '-5px',right: '-5px',cursor: 'pointer',zIndex: 5}}
                                  title="?"
                                />
                              )}
                              
                              <motion.img
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.2 }}
                                src={c.icone_pequeno}
                                alt={c.nome}
                                className="icone-pequeno"
                                style={{ position: "relative", zIndex: 10 }}
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
                    );
                  })}
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