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
import somSol from './arte/sol.mp3';

import {ExplosaoVideo, PRIMEIRO_PRESTIGIO, calcularPrestigio, getNomeDistrito, criarAbrirDistrito, criarColocarDistrito, criarComprarUpgradeAscensao, criarAscender, criarOnMouseDown, criarOnMouseMove, criarOnMouseUp} from './Ascension';
import './App.css';
import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { Save, Load, saveGame, loadSave } from './version';
import {DEFAULT_CONSTRUCOES, DEFAULT_MELHORIAS, DEFAULT_COOKIE_COIN, DEFAULT_ASCENSAO, DEFAULT_DOURADO, CONFIG_DOURADO, DEFAULT_CONQUISTAS, DEFAULT_LABORATORIO, CONQUISTA_SPRITE, EFEITOS_COMBOS, EFEITOS_GENERICOS, NVIDIA_NIVEL_MAXIMO_BASE, filtrarUpgradesDisponiveis} from './defaults';
import conquistasSprite from './arte/conquistas.png';
import tinyCookie from './arte/TinyCookie.png';
import madalenaIcon from './arte/Madalena.png';
import temploSecretoIcon from './arte/MarioL.png';
import cookieCoinIcon from './arte/CookieCoin.png';
import {SpawnCookieDourado as SpawnCookieDouradoFn, calcularProximoSpawn as calcularProximoSpawnFn, CPSBuffado, criarEfeitoCookieDourado, criarCookieInstaneo} from './sorte';
import {SEGUNDOS_CPS_POR_COOKIE_COIN, FRACAO_CPS_POR_PLACA, COINS_POR_SEGUNDO_POR_PLACA, criarComprarCookieCoinNivel, criarAjustarPlacasLigadas, criarVenderCookieCoin, GraficoCookieCoin, criarAdicionarQuimica, criarDesfazerQuimica, criarBeberPocao, getCargasAtuais, MAX_CARGAS} from './minigame';
import {CasasDecimais, simplificarNumero, simplificarNumeroPT, getMultiplicador, getMultiplicadorP, getNivelMaximoPlacas} from './helper';

function App() {
 

 
  // useStates principais
  const [contagem, setContagem] = useState(0); // contagem de cookies
  const [click, setClick] = useState(1); // valor do click
  const [CPS, setCPS] = useState(0); // CPS
  const [construcoes, setConstrucoes] = useState(DEFAULT_CONSTRUCOES)
  const [multiplicador, setMultiplicador] = useState(1);
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
  const temploSecretoIndexRef = useRef(null);
 
 
  // Minigames
  const [cookieCoin, setCookieCoin] = useState(DEFAULT_COOKIE_COIN);
  const [ascensao, setAscensao] = useState(DEFAULT_ASCENSAO);
  const [laboratorio, setLaboratorio] = useState(DEFAULT_LABORATORIO);

  const [telaAtual, setTelaAtual] = useState("jogo"); // telas: "jogo", "karaj" (ascensao), "conquistas", "opções"
  // Tooltip da grade de conquistas — position: fixed pra escapar do overflow
  // do container. Posição calculada dinamicamente no onMouseEnter da caixa.
  const [tooltipConquista, setTooltipConquista] = useState(null);
  const [animandoAscensao, setAnimandoAscensao] = useState(false); // animação da ascensão
  // sorte
  const [cookieDourado, setCookieDourado] = useState(null);
  // "O Sol" — cookie gigante do combo 3x Amarelo do Laboratório (ver mais abaixo)
  const [sol, setSol] = useState(null);
  // Flag pra disparar a conquista secreta "Ícaro" (não persiste).
  const [icaroClicado, setIcaroClicado] = useState(false)
  const [buff, setBuff] = useState([]);
  const [sorte, setSorte] = useState(1);
  const [tempoDourado, setTempoDourado] = useState(() => { // Tempo até o próximo cookie dourado!
    // Isso garante que, se não houver save, o jogo já comece com um tempo sorteado
    const { TMIN, TMAX } = CONFIG_DOURADO;
    const tempoSort = Math.floor(Math.random() * (TMAX - TMIN) + TMIN);
    return Date.now() + (tempoSort * 1000);
  }); 
  const [douradosTotais, setDouradosTotais] = useState(0);
  // IDs dos upgrades de sorte que já deram o cookie dourado gratuito.
  const [sorteUpgradesAtivados, setSorteUpgradesAtivados] = useState([]);
 
  // refs dos sons
  const clickSonsRef = useRef([]);
  const douradoSomRef = useRef(null);
  const spawnSomRef = useRef(null);
  const solSomRef = useRef(null);
 
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

    // Som contínuo do "O Sol" — toca em loop enquanto ele estiver na tela.
    solSomRef.current = new Audio(somSol);
    solSomRef.current.volume = 0.5;
    solSomRef.current.loop = true;
  }, []);

  // Função para calcular o preço atual de cada construção baseado no preço base e quantidade
  function getPreçoAtual(preçoBase, quantidade) {
    const descontoBuff = buff.find(b => b.tipo === "BuildingDiscount" && b.expira > Date.now());
    const multiplicadorDesconto = descontoBuff ? descontoBuff.mult : 1;
    return Math.floor(preçoBase * Math.pow(1.15, quantidade) * multiplicadorDesconto);
  }
  function preverCustoMultiplo(precoBase, quantidadeAtual, saldoCookies, quantidadeDesejada) {
  let custoSimulado = 0;
  let quantPossivel = 0;
  let nivel = quantidadeAtual;

  for (let i = 0; i < quantidadeDesejada; i++) {
    // Utiliza a sua função original para manter a consistência matemática
    const preco = getPreçoAtual(precoBase, nivel); 
    
    if (saldoCookies >= custoSimulado + preco) {
      custoSimulado += preco;
      quantPossivel++;
      nivel++;
    } else {
      break;
    }
  }
  return { custoSimulado, quantPossivel };
}
 
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
    const lab = construcoes.find(c => c.nome === "Laboratório");
    if (lab && lab.quantidade >= 1) {
      setLaboratorio(prev =>
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
  // Tooltip dos frascos do Laboratório (segue o mesmo padrão do tooltip das construções)
  const [hoveredFrasco, setHoveredFrasco] = useState(null); // { titulo, descricao, extra? }
  const [tooltipPosFrasco, setTooltipPosFrasco] = useState({ x: 0, y: 0 });
  // Tooltip dos ícones de buff (estilo Cookie Clicker: só o ícone, hover mostra o efeito)
  const [hoveredBuff, setHoveredBuff] = useState(null);
  const [tooltipPosBuff, setTooltipPosBuff] = useState({ x: 0, y: 0 });
  // Feedback visual de arrastar-e-soltar
  const [arrastandoSobreFrasco, setArrastandoSobreFrasco] = useState(false);
  const [arrastandoSobreVovo, setArrastandoSobreVovo] = useState(false);

  // --- Easter egg: colorir a Vovó com a poção do Laboratório ---
  const VOVO_SPRITE_X = { verde: 6, vermelho: 7, azul: 8, amarelo: 9 };
  const VOVO_NOMES = { verde: "Verde", vermelho: "Vermelha", azul: "Azul", amarelo: "Amarela" };
  const [vovoCor, setVovoCor] = useState(null); // null | 'verde' | 'vermelho' | 'azul' | 'amarelo'
  const [vovoCoresFeitas, setVovoCoresFeitas] = useState([]); // cores distintas já aplicadas
  // Flag pra disparar a conquista secreta "Vovó Arco-Íris" (não persiste).
  const [vovoTodasCoresClicado, setVovoTodasCoresClicado] = useState(false);

  function AplicarCorNaVovo(cor) {
    if (!VOVO_SPRITE_X[cor]) return;

    setVovoCor(cor);
    mostrarAvisoPersistente(`Sua Vovó agora é a Vovó ${VOVO_NOMES[cor]}! 🧪`);

    if (!vovoCoresFeitas.includes(cor)) {
      const novasCores = [...vovoCoresFeitas, cor];
      setVovoCoresFeitas(novasCores);
      if (novasCores.length === 4) {
        setVovoTodasCoresClicado(true);
      }
    }
  }
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
  const sorteUpgradesAtivadosRef = useRef(sorteUpgradesAtivados);
  const producaoMinimizadaRef = useRef(producaoMinimizada);
  const conquistasRef = useRef(conquistas);
  const laboratorioRef = useRef(laboratorio);
  const buffRef = useRef(buff);
 
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
  useEffect(() => { sorteUpgradesAtivadosRef.current = sorteUpgradesAtivados; }, [sorteUpgradesAtivados]);
  useEffect(() => { producaoMinimizadaRef.current = producaoMinimizada; }, [producaoMinimizada]);
  useEffect(() => { conquistasRef.current = conquistas; }, [conquistas]);
  useEffect(() => { laboratorioRef.current = laboratorio; }, [laboratorio]);
  useEffect(() => { buffRef.current = buff; }, [buff]);
 
 
  // Notifica e marca uma lista de conquistas como obtidas. Extraido pra
  // funcao separada porque agora tem duas fontes de conquistas desbloqueadas:
  // o useEffect passivo abaixo (cookiesTotais, CPS, construcoes, secretas) e
  // o clique em si (valorClick - ver AssarCookies), que precisa ser checado
  // no momento do clique, nao passivamente.
  function desbloquearConquistas(novasConquistas) {
    if (novasConquistas.length === 0) return;
 
    novasConquistas.forEach(c => {
      const T = CONQUISTA_SPRITE.tamanho;
      const icone = (
        <div
          style={{width: T,height: T,backgroundImage: `url(${conquistasSprite})`,backgroundPosition: `-${c.spriteX * T}px -${c.spriteY * T}px`,imageRendering: 'pixelated',flexShrink: 0,}}/>
      );
      mostrarAvisoPersistente(`Nova Conquista: ${c.nome}`, icone);
    });
 
    const idsObtidos = new Set(novasConquistas.map(c => c.id));
    setConquistas(prev => prev.map(c => 
      idsObtidos.has(c.id) ? {...c, obtido: true} : c));
  }

  useEffect(() => {
    // Progresso de descoberta no Laboratório de Frascos: só os 16 combos
    // especiais e únicos contam (efeitos genéricos por cor não entram aqui).
    // Filtra só chaves que são de fato combos especiais (defesa extra caso
    // algum save antigo tenha ficado com misturas genéricas registradas ali
    // por engano, de uma versão anterior com bug).
    const efeitosLaboratorioDescobertos =
      (laboratorio.descobertos ?? []).filter(k => EFEITOS_COMBOS[k]).length;

    const novasConquistas = conquistas.filter(c => !c.obtido && checkConquista(c, {cookiesTotais, CPS, construcoes, cookiePequenoClicado, madalenaClicada, temploSecretoClicado, icaroClicado, vovoTodasCoresClicado, efeitosLaboratorioDescobertos, cookieCoin}))
 
    if (novasConquistas.length === 0) return;
 
    novasConquistas.forEach(c => {
      const T = CONQUISTA_SPRITE.tamanho;
      const icone = (
        <div
          style={{width: T,height: T,backgroundImage: `url(${conquistasSprite})`,backgroundPosition: `-${c.spriteX * T}px -${c.spriteY * T}px`,imageRendering: 'pixelated',flexShrink: 0,}}/>
      );
      mostrarAvisoPersistente(`Nova Conquista: ${c.nome}`, icone);
    });
 
    const idsObtidos = new Set(novasConquistas.map(c => c.id));
    setConquistas(prev => prev.map(c => 
      idsObtidos.has(c.id) ? {...c, obtido: true} : c));
 
  }, [cookiesTotais, CPS, cookiePequenoClicado, madalenaClicada, temploSecretoClicado, icaroClicado, vovoTodasCoresClicado, laboratorio.descobertos, cookieCoin]);
 
 
 
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
      sorteUpgradesAtivados: sorteUpgradesAtivadosRef.current,
      producaoMinimizada: producaoMinimizadaRef.current,
      conquistas: conquistasRef.current,
      laboratorio: laboratorioRef.current,
      buff: buffRef.current,
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
      setSorteUpgradesAtivados(dados.sorteUpgradesAtivados ?? []);
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
      setLaboratorio(dados.laboratorio ?? DEFAULT_LABORATORIO);
      setBuff(dados.buff ?? []);
 
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
 
  // Wrapper do spawn: além de criar o cookie, toca o sino se o upgrade "Sino da Fábrica" foi comprado
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

  // "O Sol": cookie gigante invocado pelo combo 3x Amarelo do Laboratório de
  // Frascos. Clicar nele destrói TODAS as construções, mas dá +3 de sorte
  // por 1 hora e desbloqueia a conquista secreta "Ícaro".
  function SpawnSol() {
    // Cookie Dourado normal fica 15s na tela (ver SpawnCookieDourado em
    // sorte.js) — O Sol fica o dobro disso.
    setSol({ expira: Date.now() + 30 * 1000 });
    if (spawnSomRef.current) {
      spawnSomRef.current.currentTime = 0;
      spawnSomRef.current.play().catch(() => {});
    }
  }

  function CliqueSol() {
    if (!sol) return;

    if (douradoSomRef.current) {
      douradoSomRef.current.currentTime = 0;
      douradoSomRef.current.play().catch(() => {});
    }

    setSol(null);
    setConstrucoes(prev => prev.map(c => ({ ...c, quantidade: 0 })));
    setBuff(prev => [...prev, {
      nome: "Bênção do Sol",
      tipo: "Luck",
      mult: 3,
      expira: Date.now() + 60 * 60 * 1000
    }]);
    setIcaroClicado(true);
    mostrarAvisoPersistente("Você voou perto demais do Sol! Todas as suas construções foram destruídas — mas ganhou +3 de sorte por 1 hora.");
  }

  // Some com O Sol se o jogador não clicar a tempo.
  useEffect(() => {
    if (!sol) return;
    const timeout = setTimeout(() => {
      setSol(null);
    }, Math.max(0, sol.expira - Date.now()));
    return () => clearTimeout(timeout);
  }, [sol]);

  // Toca o som do Sol em loop enquanto ele estiver na tela; para assim que
  // ele sumir (por clique ou por expirar o tempo).
  useEffect(() => {
    const audio = solSomRef.current;
    if (!audio) return;

    if (sol) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } else {
      audio.pause();
      audio.currentTime = 0;
    }

    return () => {
      audio.pause();
    };
  }, [sol]);
 
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

  // Quando o cookie dourado some (clicado, expirou, ou ascensão), limpa o aviso do título da aba
  useEffect(() => {
    if (!cookieDourado) restaurarTitulo();
  }, [cookieDourado]);
 
  // Limpa efeitos de cookie dourado expirados.
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
    const now = Date.now();
    const luckBuff = buff.filter(b => b.tipo === "Luck" && b.expira > now).reduce((sum, b) => sum + b.mult, 0);
    const totalLuck = 1 + luckUpgrades + ascensaoLuck + luckBuff;
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
  const producaoRef = useRef(0);
 
  useEffect(() => {
    const producaoBase = construcoes.reduce((soma, c) => {
      const quantidadeTotal = c.quantidade + (c.quantidadeGratis || 0);
      return soma + CpsConstrucao(c) * quantidadeTotal;
    }, 0);
    const multiplicador = getMultiplicadorP(melhorias, ascensao);
    const producaoBruta = CPSBuffado(producaoBase * multiplicador, buff);

    // Cada placa de Cookie Coin "ligada" desvia 5% da CPS pra converter em
    // Cookie Coins (ver ganho de coins abaixo). A CPS exibida/recebida já
    // sai líquida desse desvio.
    const fracaoDesviada = Math.min(cookieCoin.ligadas, cookieCoin.level) * FRACAO_CPS_POR_PLACA;
    const producao = producaoBruta * (1 - fracaoDesviada);
 
    producaoRef.current = producao;
    setCPS(producao); // atualiza display só quando algo realmente mudou
  }, [construcoes, melhorias, ascensao, buff, cookieCoin.ligadas, cookieCoin.level]);
 
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

  // Penalidade de alguns combos "instáveis" do Laboratório de Frascos:
  // enquanto o efeito estiver ativo, cada clique no cookie derruba uma
  // construção aleatória (perde 1 unidade de um prédio já comprado).
  function PerderConstrucaoAleatoria(perda) {
    const possiveis = construcoes.filter(c => c.quantidade > 0);
    if (possiveis.length === 0) return;
    const alvo = possiveis[Math.floor(Math.random() * possiveis.length)];
    const perdaReal = Math.min(perda, alvo.quantidade); // nunca deixa a quantidade ficar negativa
    setConstrucoes(prev => prev.map(c =>
      c.nome === alvo.nome ? { ...c, quantidade: Math.max(0, c.quantidade - perda) } : c
    ));
    mostrarAviso(`💥 Instabilidade química destruiu ${perdaReal} ${alvo.nome}!`);
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

    // "Clique Supremo" (combos verde+vermelho): buff de uso único,
    // não expira por tempo, é consumido no primeiro clique após ser ativado.
    const now = Date.now();
    const cliqueSupremo = buff.find(b => b.tipo === "ClickOnce" && b.expira > now);
    // Combos "instáveis" que multiplicam o clique por uma duração (ex: Fúria
    // Instável, Overdose Vermelha) e carregam a penalidade de derrubar prédios.
    const debuffCliqueAtivo = buff.find(b => b.tipo === "Click" && b.expira > now && b.penalidade);

    const valorClique = clickRef.current * (cliqueSupremo ? cliqueSupremo.mult : 1);

    setContagem((anterior) => anterior + valorClique);
    setCookiesTotais((anterior) => anterior + valorClique);
    setCookiesTotaisAscensao((anterior) => anterior + valorClique);

    if (cliqueSupremo) {
      setBuff(prev => prev.filter(b => b !== cliqueSupremo));
      mostrarAvisoPersistente(`Clique Supremo! +${Math.floor(valorClique).toLocaleString()} cookies!`);
    }

    if (cliqueSupremo && cliqueSupremo.penalidade) {
      PerderConstrucaoAleatoria(cliqueSupremo.intensidade);
    } else if (debuffCliqueAtivo) {
      PerderConstrucaoAleatoria(debuffCliqueAtivo.intensidade);
    }

    // Penalidade do Azul: o efeito de CPS (e a sorte que vem junto) é
    // instável e some assim que o jogador clica manualmente no cookie.
    const buffsAzulAtivos = buff.filter(b => b.terminaComClique && b.expira > now);
    if (buffsAzulAtivos.length > 0) {
      setBuff(prev => prev.filter(b => !b.terminaComClique || b.expira <= now));
      mostrarAvisoPersistente("Seu clique dissipou o efeito químico instável do Azul!");
    }

    // Conquistas de valorClick só fazem sentido no momento do clique em si
    // (o valor do clique pode variar com buffs/upgrades), então checamos
    // aqui e não no useEffect passivo de conquistas.
    const novasConquistasClick = conquistas.filter(
      c => !c.obtido && c.tipo === 'valorClick' && valorClique >= c.quantidade
    );
    desbloquearConquistas(novasConquistasClick);

    return valorClique;
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
    // Posição relativa a .seção-cookie (que agora é position:relative, por
    // causa da barra de buffs) — não mais à tela inteira.
    const rect = e.currentTarget.parentElement.getBoundingClientRect();
    const x = e.clientX - rect.left - 20;
    const y = e.clientY - rect.top - 20; // posiciona um pouco acima do mouse

    // Calcula o valor do clique ANTES de criar o numerinho, pra mostrar o
    // valor real (inclusive com Clique Supremo x1111, quando ativo).
    const valorClique = AssarCookies();
    setNumerinhos((prev) => [...prev, { id, x, y, valor: valorClique }]);
 
    // Animação de clicar
    controls.start({
      scale: [1, 0.9, 1.1, 1],
      //y: [0, 0, 0, 0],
      transition: { duration: 0.3, ease: "easeOut" },
    });
    
    // Apaga os numerinhos
    setTimeout(() => {
      setNumerinhos((prev) => prev.filter((t) => t.id !== id));
    }, 2000);
  };
 
 
function comprarConstrucao(indice, quantidadeDesejada = 1) {
  // 1. Pegamos os dados da construção específica antes de mexer no estado
  const construcaoAlvo = construcoes[indice];
  
  let custoTotal = 0;
  let quantidadeComprada = 0;
  let nivelSimulado = construcaoAlvo.quantidade;
  let cookiesRestantes = contagem; // Usamos o seu estado de cookies atual

  // 2. Simula comprar 1 por 1 até bater a quantidade desejada ou acabar o dinheiro
  while (quantidadeComprada < quantidadeDesejada) {
    // Usamos a sua função getPreçoAtual normalmente
    const precoAtual = getPreçoAtual(construcaoAlvo.preço, nivelSimulado);

    if (cookiesRestantes >= precoAtual) {
      cookiesRestantes -= precoAtual; 
      custoTotal += precoAtual;       
      quantidadeComprada++;         
      nivelSimulado++;                
    } else {
      // Se não tem dinheiro para o próximo, interrompe o loop
      break; 
    }
  }

  // 3. Se o loop terminou e o jogador conseguiu comprar pelo menos 1 item:
  if (quantidadeComprada > 0) {
    // Deduz o custo total de uma vez só da sua contagem
    setContagem(contagem - custoTotal);

    // Atualiza a quantidade da construção alvo usando o map (sem side-effects dentro)
    setConstrucoes((anterior) => {
      return anterior.map((c, i) => {
        if (i === indice) {
          return {
            ...c,
            quantidade: c.quantidade + quantidadeComprada
          };
        }
        return c; // As outras construções ficam intocadas
      });
    });
  }
}
 
  function ComprarMelhoria(indice) {
    const m = melhorias[indice];
    if (!m || m.comprado || contagem < m.preço) return;

    setContagem(contagem - m.preço);
    setMelhorias(anterior => anterior.map((u, i) =>
      i === indice ? { ...u, comprado: true } : u
    ));

    // Spawn imediato de cookie dourado quando o upgrade comprado é de sorte —
    // mas só na primeira vez que ESSE upgrade específico (por id) é comprado.
    // Sem essa checagem, como "melhorias" reseta a cada ascensão, o jogador
    // ganharia um cookie dourado grátis de novo a cada ascensão só por
    // recomprar o mesmo upgrade de sorte, o que é OP demais.
    if (m.efeito === 'sorte' && !sorteUpgradesAtivados.includes(m.id)) {
      SpawnCookieDourado();
      setSorteUpgradesAtivados(prev => [...prev, m.id]);
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
      setSorteUpgradesAtivados(dados.sorteUpgradesAtivados ?? []);
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
      setLaboratorio(dados.laboratorio ?? DEFAULT_LABORATORIO);
      setBuff(dados.buff ?? []);
 
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
    ascensao,
    laboratorio
  );
 
  // lista de upgrades comprados
  const upgradesComprados = melhorias.filter((m) => m.comprado);
 
 
  // Minigame Cookie Coin (implementado em minigame.js)
  const cookieCoinSellBuff = buff.find(b => b.tipo === "CookieCoinSell" && b.expira > Date.now());
  // Preço médio (mercado = 1): 10 segundos de CPS por Cookie Coin.
  const valorBaseCookieCoin = CPS * SEGUNDOS_CPS_POR_COOKIE_COIN;
  const valorAtualCookieCoin = Math.floor(
    valorBaseCookieCoin * cookieCoin.mercado * (cookieCoinSellBuff ? cookieCoinSellBuff.mult : 1)
  );
 
  const precoNvidia = Math.floor(100000 * Math.pow(1.2, cookieCoin.level));
  // Base (5) + 5 pra cada upgrade "maisplacas" comprado no Distrito dos
  // Computadores — com os 2 upgrades, o máximo vira 15.
  const nivelMaximoPlacas = getNivelMaximoPlacas(ascensao, NVIDIA_NIVEL_MAXIMO_BASE);
 
  const ComprarCookieCoinNivel = criarComprarCookieCoinNivel({
    contagem,
    setContagem,
    cookieCoin,
    setCookieCoin,
    nivelMaximo: nivelMaximoPlacas,
  });
  const AjustarPlacasLigadas = criarAjustarPlacasLigadas({ cookieCoin, setCookieCoin });
  // ganho de Cookie Coins — só as placas "ligadas" geram renda (cada uma
  // fixo em COINS_POR_SEGUNDO_POR_PLACA, custeada pelo desvio de CPS acima).
  useEffect(() => {
    if (!cookieCoin.desbloqueado || cookieCoin.ligadas === 0) return;
    let lastUpdate = Date.now();
    const timer = setInterval(() => {
 
      const now = Date.now();
      const deltaSeconds = (now - lastUpdate) / 1000;
      lastUpdate = now;
      setCookieCoin(prev => ({
        ...prev,
        coins: prev.coins + prev.ligadas * COINS_POR_SEGUNDO_POR_PLACA * deltaSeconds
      }));
    }, 100);
 
    return () => clearInterval(timer);
  }, [cookieCoin.desbloqueado, cookieCoin.ligadas]);
 
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
      setCookieCoin(prev => {
        const mudanca = (Math.random() - 0.5) * 0.2;
        let novoMercado = prev.mercado + mudanca;
        novoMercado = Math.max(0.01, Math.min(100, novoMercado));
        novoMercado = Number(novoMercado.toFixed(2));

        // CPS lido da ref (sempre atual) — evita usar um valor de CPS
        // desatualizado de quando este efeito rodou pela última vez.
        const valor = novoMercado * producaoRef.current * SEGUNDOS_CPS_POR_COOKIE_COIN;
        setHistoricoCookieCoin(h => [...h, valor].slice(-30)); // últimos 30 pontos do gráfico

        return { ...prev, mercado: novoMercado };
      });
    }, 30000);
    
    return () => clearInterval(timer);
  }, [cookieCoin.desbloqueado]);
  //funções de ascensão (implementadas em Ascension.js)
  const AbrirDistrito = criarAbrirDistrito(setAscensao);
 
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

  const AdicionarQuimica = criarAdicionarQuimica({
      laboratorio,
      setLaboratorio
    });

  const DesfazerQuimica = criarDesfazerQuimica({
    laboratorio,
    setLaboratorio,
    mostrarAviso
  });
  
  const BeberPocao = criarBeberPocao({
    laboratorio,
    setLaboratorio,
    setBuff,
    setContagem,
    setCookiesTotais,
    setCookiesTotaisAscensao,
    CPS,
    melhorias,
    setMelhorias,
    SpawnCookieDourado,
    SpawnSol,
    mostrarAvisoPersistente
  });
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
      // O Laboratório reseta "construído" (a construção física some junto
      // das outras) — "desbloqueado" é permanente, conquistado ao construir
      // o Laboratório pela 1ª vez, e nunca reseta.
      setLaboratorio(prev => ({ ...DEFAULT_LABORATORIO, desbloqueado: prev.desbloqueado }));
      
      
 
    // coloca a tela de ascensão no meio da animação
    setTimeout(() => {
      setTelaAtual("ascensão");
      
      // Cookie Coin: as placas (level/ligadas) e o mercado resetam junto
      // do resto do progresso, mas as coins acumuladas NÃO se perdem — e o
      // desbloqueio também persiste (não precisa reconstruir 1 Computador).
      setCookieCoin(prev => ({
        ...DEFAULT_COOKIE_COIN,
        desbloqueado: prev.desbloqueado,
        coins: prev.coins
      }));
      setAscensao(prev=> ({
        ...prev,
        desbloqueado: true,
        prestigio: prev.prestigio + prestigioPossivel,
        prestigioTotal: prev.prestigioTotal + prestigioPossivel
      }))
    }, 4000);
  }

  // Gasta 1 Cookie Coin pra reativar o Laboratório depois de uma ascensão
  // (construido reseta toda ascensão; desbloqueado é permanente, conquistado
  // ao construir o Laboratório pela 1ª vez — isso já funciona via o
  // useEffect acima, não precisa de coin nenhuma).
  function DesbloquearLaboratorioComCoin() {
    if (!laboratorio.desbloqueado) return;
    if (laboratorio.construido) return;
    if (cookieCoin.coins < 1) return;
    setCookieCoin(prev => ({ ...prev, coins: prev.coins - 1 }));
    setLaboratorio(prev => ({ ...prev, construido: true }));
    mostrarAvisoPersistente("Laboratório de Frascos reativado!");
  }
 
 
 
  // Funções de cookie dourado (implementadas em sorte.js)
  const cookieInstaneo = criarCookieInstaneo({CPS, contagem, setContagem, setCookiesTotais, setCookiesTotaisAscensao, mostrarAviso, simplificarNumero});
 
  const efeitoCookieDourado = criarEfeitoCookieDourado({douradoSomRef, setDouradosTotais, setCookieDourado, setBuff, cookieInstaneo, mostrarAviso, buff});
  
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
 
      {/* Tooltip flutuante das conquistas — renderizado fora da grade pra
          escapar do overflow do container. position: fixed + transform pra
          centralizar horizontalmente e ficar acima da caixa. */}
      {tooltipConquista && (
        <div
          className="conquista-tooltip-fixo"
          style={{
            position: 'fixed',
            left: tooltipConquista.x,
            top: tooltipConquista.y,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <strong>{tooltipConquista.conquista.obtido ? tooltipConquista.conquista.nome : '???'}</strong>
          <div>{tooltipConquista.conquista.obtido ? tooltipConquista.conquista.descricao : '???'}</div>
        </div>
      )}

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
              style={{pointerEvents: "auto", background: "rgba(0, 0, 0, 0.85)", color: "#ffd700", border: "2px solid #ffd700", borderRadius: "8px", padding: "12px 40px 12px 16px",fontSize: "15px",fontWeight: "bold",cursor: "pointer",maxWidth: "600px",position: "relative",boxShadow: "0 0 10px rgba(0,0,0,0.5)",display: "flex",alignItems: "center",gap: "14px",}}
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
                    style={{pointerEvents: "auto",background: "rgba(0, 0, 0, 0.85)",color: "#fff",border: "2px solid #888",borderRadius: "6px", padding: "6px 14px",fontSize: "13px", fontWeight: "bold",cursor: "pointer",boxShadow: "0 0 8px rgba(0,0,0,0.4)",}}
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
          <motion.img style={{height: "100px", width:"100px"}}
          animate={{
            scale: [1, 1.1, 1],
            filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"],
          }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
          src={dourado} alt={"Cookie Dourado"}></motion.img>
        </div>
      }

      {sol && telaAtual !== "ascensão" &&
        <div
          onClick={CliqueSol}
          title="O Sol"
          style={{
            position: "fixed",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: "60vmin",
            height: "60vmin",
            cursor: "pointer",
            zIndex: 10000,
            filter: "drop-shadow(0 0 60px rgba(255, 200, 0, 0.8))"
          }}
          className="o-sol"
        >
          <motion.img style={{width: "100%", height: "100%"}}
          animate={{
            scale: [1, 1.1, 1],
            filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"],
          }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          src={dourado} alt={"O Sol"}></motion.img>
        </div>
      }
      
      
        <div className="jogo">
          {telaAtual !== "ascensão" && (
          <div className="lado-esquerdo">

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
              <div className="seção-minigames">
                <h3> Minigames</h3>
                {cookieCoin.desbloqueado && (
                <div className="seção-cookie-coin">
                  <h2>Mineração de Cookie Coins</h2>

                  <p>
                    <img src={cookieCoinIcon} alt="" className="cookie-coin-icon" /> {CasasDecimais(cookieCoin.coins, 3)}
                  </p>
                  <p>Placas: {cookieCoin.level} / {nivelMaximoPlacas}</p>

                  <button
                    onClick={ComprarCookieCoinNivel}
                    disabled={cookieCoin.level >= nivelMaximoPlacas || contagem < precoNvidia}
                    style={{cursor: "pointer"}}
                  >
                    {cookieCoin.level >= nivelMaximoPlacas ? (
                      "Nível Máximo Atingido"
                    ) : (
                      <>
                        Nova Placa de Vídeo<br />
                        Preço: {simplificarNumeroPT(precoNvidia)}
                      </>
                    )}
                  </button>

                  <div style={{margin: "10px 0"}}>
                    <p className='placas'
                    style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px'}}
                    onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltipPosFrasco({
                              x: rect.right + 10,
                              y: rect.top + rect.height / 2
                            });
                            setHoveredFrasco({
                              titulo: "Placas Ligadas",
                              descricao: `Ligue as placas para minerar Cookie Coins! Cada placa gasta ${simplificarNumeroPT(FRACAO_CPS_POR_PLACA * 100)}% do seu CPS.`
                            });
                          }}
                          onMouseLeave={() => setHoveredFrasco(null)}>
                      <span>Placas ligadas: <strong>{cookieCoin.ligadas} / {cookieCoin.level}</strong></span>

                      <span style={{display: "flex", gap: "8px"}}>
                        <button
                          onClick={() => AjustarPlacasLigadas(-1)}
                          disabled={cookieCoin.ligadas <= 0}
                          style={{cursor: "pointer", padding: "4px 14px", fontSize: "16px"}}
                          title="Desligar uma placa"
                        >
                          −
                        </button>
                        <button
                          onClick={() => AjustarPlacasLigadas(1)}
                          disabled={cookieCoin.ligadas >= cookieCoin.level}
                          style={{cursor: "pointer", padding: "4px 14px", fontSize: "16px"}}
                          title="Ligar mais uma placa"
                        >
                          +
                        </button>
                      </span>
                    </p>
                  </div>
                  
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

                {laboratorio.desbloqueado && !laboratorio.construido &&(
                  <div style={{textAlign: 'center', padding: '10px 0'}}>
                    <button
                      className='seção-laboratório'
                      onClick={DesbloquearLaboratorioComCoin}
                      disabled={cookieCoin.coins < 1}
                      style={{cursor: cookieCoin.coins < 1 ? 'not-allowed' : 'pointer'}}
                      title="Gaste 1 Cookie Coin pra ativar um novo minigame!"
                    >
                      🧪 Novo Minigame (1 <img src={cookieCoinIcon} alt="" className="cookie-coin-icon" style={{verticalAlign: 'middle'}} />)
                    </button>
                  </div>
                )}
                
                {laboratorio.desbloqueado && laboratorio.construido && (
              <div className='seção-laboratório'>
                <h2>Laboratório de Alquimia</h2>

                
                <div className="flasks-container" style={{display: 'flex', justifyContent: 'space-around', marginBottom: '20px'}}>
                  {['verde', 'vermelho', 'azul', 'amarelo'].map((color) => {
                    const now = Date.now();
                    const { cargas, proximaRecarga } = getCargasAtuais(laboratorio.substancias[color], now);
                    const semCargas = cargas <= 0;
                    const podeArrastar = !semCargas;
                    const spriteX = color === 'verde' ? 4 : color === 'vermelho' ? 5 : color === 'azul' ? 6 : 7;
                    const displaySpriteX = semCargas ? 3 : spriteX;
                    const T = CONQUISTA_SPRITE.tamanho;
                    
                    const info = laboratorio.substancias[color];

                    return (
                      <div key={color} className="frasco-wrapper">
                        <div
                          className="flask-icon"
                          draggable={podeArrastar}
                          style={{width: T, height: T, backgroundImage: `url(${conquistasSprite})`, backgroundPosition: `-${displaySpriteX * T}px -${9 * T}px`, backgroundSize: `${CONQUISTA_SPRITE.colunas * T}px ${CONQUISTA_SPRITE.linhas * T}px`, cursor: podeArrastar ? 'grab' : 'not-allowed', opacity: semCargas ? 0.5 : 1}}
                          onDragStart={(e) => {
                            if (!podeArrastar) { e.preventDefault(); return; }
                            e.dataTransfer.setData('text/plain', color);
                            e.dataTransfer.effectAllowed = 'copy';
                          }}
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltipPosFrasco({
                              x: rect.right + 10,
                              y: rect.top + rect.height / 2
                            });
                            setHoveredFrasco({
                              titulo: info.nome,
                              descricao: info.descricao,
                              extra: `Cargas: ${cargas}/${MAX_CARGAS}` + (
                                proximaRecarga
                                  ? ` • próxima em ${Math.ceil((proximaRecarga - now) / 60000)} min`
                                  : ''
                              ) + (podeArrastar ? " • Arraste até o frasco grande para fazer CIÊNCIA!" : '')
                            });
                          }}
                          onMouseLeave={() => setHoveredFrasco(null)}
                        />
                        <div className="flask-cargas">
                          {Array.from({ length: MAX_CARGAS }).map((_, idx) => (
                            <span
                              key={idx}
                              className="flask-carga-ponto"
                              style={{ opacity: idx < cargas ? 1 : 0.25 }}
                            />
                          ))}
                        </div>
                      </div>
                      );
                    })}
                </div>
                <div
                  className="large-flask frasco-wrapper"
                  style={{
                    margin: '20px auto',
                    textAlign: 'center',
                    padding: '10px',
                    borderRadius: '12px',
                    border: arrastandoSobreFrasco ? '2px dashed #ffd700' : '2px dashed transparent',
                    background: arrastandoSobreFrasco ? 'rgba(255, 215, 0, 0.15)' : 'transparent',
                    transition: 'background 0.15s, border-color 0.15s'
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'copy';
                  }}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    setArrastandoSobreFrasco(true);
                  }}
                  onDragLeave={() => setArrastandoSobreFrasco(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setArrastandoSobreFrasco(false);
                    const color = e.dataTransfer.getData('text/plain');
                    if (color) AdicionarQuimica(color);
                  }}
                >
                  {laboratorio.Frasco.length > 0 ? (
                    <div
                      style={{width: CONQUISTA_SPRITE.tamanho * 2, height: CONQUISTA_SPRITE.tamanho * 2, backgroundImage: `url(${conquistasSprite})`,
                        backgroundPosition: `-${(laboratorio.Frasco[0] === 'verde' ? 4 : laboratorio.Frasco[0] === 'vermelho' ? 5 : laboratorio.Frasco[0] === 'azul' ? 6 : 7) * CONQUISTA_SPRITE.tamanho * 2}px -${9 * CONQUISTA_SPRITE.tamanho * 2}px`,
                        backgroundSize: `${CONQUISTA_SPRITE.colunas * CONQUISTA_SPRITE.tamanho * 2}px ${CONQUISTA_SPRITE.linhas * CONQUISTA_SPRITE.tamanho * 2}px`,
                        margin: '0 auto',
                        cursor: 'pointer',
                        imageRendering: 'pixelated'
                      }}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltipPosFrasco({
                          x: rect.right + 10,
                          y: rect.top + rect.height / 2
                        });

                        // Calcula a "assinatura" da mistura atual (mesma lógica
                        // do BeberPocao) pra saber se o jogador já descobriu o efeito.
                        const contagens = { verde: 0, vermelho: 0, azul: 0, amarelo: 0 };
                        laboratorio.Frasco.forEach(c => { contagens[c] += 1; });
                        const comboKey = `${contagens.verde}-${contagens.vermelho}-${contagens.azul}-${contagens.amarelo}`;

                        const NOMES_COR = { verde: 'Verde', vermelho: 'Vermelho', azul: 'Azul', amarelo: 'Amarelo' };
                        let linhasEfeito;

                        if (EFEITOS_COMBOS[comboKey]) {
                          // Combo especial: descoberta é da mistura inteira.
                          const jaDescoberto = (laboratorio.descobertos ?? []).includes(comboKey);
                          linhasEfeito = jaDescoberto
                            ? EFEITOS_COMBOS[comboKey]
                            : ["Desconhecido — beba a poção pra descobrir!"];
                        } else {
                          // Mistura genérica: cada cor é descoberta independentemente.
                          const genericosDescobertos = laboratorio.genericosDescobertos ?? [];
                          linhasEfeito = [];
                          ['verde', 'vermelho', 'azul', 'amarelo'].forEach((cor) => {
                            const qtd = contagens[cor];
                            if (qtd === 0) return;
                            if (genericosDescobertos.includes(cor)) {
                              const efeitosCor = EFEITOS_GENERICOS[cor]?.[qtd] ?? EFEITOS_GENERICOS[cor]?.[2] ?? [];
                              efeitosCor.forEach((linha) => linhasEfeito.push(`${NOMES_COR[cor]}: ${linha}`));
                            } else {
                              linhasEfeito.push(`${NOMES_COR[cor]}: Desconhecido`);
                            }
                          });
                          if (linhasEfeito.length === 0) {
                            linhasEfeito = ["Desconhecido — beba a poção pra descobrir!"];
                          }
                        }

                        const efeitoTexto = linhasEfeito.map((l) => `• ${l}`).join('\n');

                        setHoveredFrasco({
                          titulo: "Frasco Atual",
                          descricao: `Contém: ${laboratorio.Frasco.map(c => laboratorio.substancias[c].nome).join(', ')}.`,
                          extra: `Efeito:\n${efeitoTexto}` + (
                            laboratorio.Frasco.length < 3
                              ? `\n\nPode adicionar mais ${3 - laboratorio.Frasco.length}`
                              : '\n\nPronto para beber'
                          )
                        });
                      }}
                      onMouseLeave={() => setHoveredFrasco(null)}
                    />
                  ) : (
                    <div
                      style={{width: CONQUISTA_SPRITE.tamanho * 2, height: CONQUISTA_SPRITE.tamanho * 2, backgroundImage: `url(${conquistasSprite})`, backgroundPosition: `-${3 * CONQUISTA_SPRITE.tamanho * 2}px -${9 * CONQUISTA_SPRITE.tamanho * 2}px`, backgroundSize: `${CONQUISTA_SPRITE.colunas * CONQUISTA_SPRITE.tamanho * 2}px ${CONQUISTA_SPRITE.linhas * CONQUISTA_SPRITE.tamanho * 2}px`, margin: '0 auto', imageRendering: 'pixelated'}}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setTooltipPosFrasco({
                            x: rect.right + 10,
                            y: rect.top + rect.height / 2
                          });
                          setHoveredFrasco({
                            titulo: "Frasco Vazio",
                            descricao: "Arraste os químicos acima até aqui para preparar uma poção.",
                            extra: null
                          });
                        }}
                        onMouseLeave={() => setHoveredFrasco(null)}
                      />
                    )}
                    <p style={{fontSize: '12px', marginTop: '5px'}}>
                      {laboratorio.Frasco.length > 0 
                        ? `${laboratorio.Frasco.length}/3 químicos` 
                        : 'Frasco vazio'}
                    </p>
                  </div>

                  {hoveredFrasco && (
                    <div
                      className="info-frasco"
                      style={{
                        position: "fixed",
                        left: tooltipPosFrasco.x,
                        top: tooltipPosFrasco.y,
                        transform: "translate(0, -50%)",
                        zIndex: 9999,
                        ...((hoveredFrasco.titulo === "Frasco Atual" || hoveredFrasco.titulo === "Frasco Vazio")
                          ? { background: "rgba(0, 0, 0, 1)" }
                          : {})
                      }}
                    >
                      <strong>{hoveredFrasco.titulo}</strong><br />
                      {hoveredFrasco.descricao}
                      {hoveredFrasco.extra && (
                        <>
                          <br />
                          <span className="info-frasco-extra">{hoveredFrasco.extra}</span>
                        </>
                      )}
                    </div>
                  )}

                   <div style={{display: 'flex', gap: '8px', marginTop: '10px'}}>
                     <button
                      onClick={DesfazerQuimica}
                      disabled={laboratorio.Frasco.length === 0}
                      title="Esvaziar o frasco e devolver todas as cargas usadas"
                      style={{
                        cursor: laboratorio.Frasco.length === 0 ? 'not-allowed' : 'pointer',
                        opacity: laboratorio.Frasco.length === 0 ? 0.6 : 1,
                        padding: '10px 14px'
                      }}
                    >
                      ↩️ Esvaziar Frasco
                    </button>
                     <button
                      onClick={BeberPocao}
                      disabled={laboratorio.Frasco.length === 0}
                      style={{
                        cursor: laboratorio.Frasco.length === 0 ? 'not-allowed' : 'pointer',
                        flex: 1,
                        padding: '10px'
                      }}
                    >
                      Beber Poção
                    </button>
                  </div>

                </div>
                )}
                {!laboratorio.desbloqueado && !ascensao.desbloqueado && !cookieCoin.desbloqueado && (
                  <div>
                  (Nenhum ainda)
                  </div>
                )}
              </div>
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
                {laboratorio.desbloqueado && (
                  <div>{`Combos especiais descobertos: ${(laboratorio.descobertos ?? []).filter(k => EFEITOS_COMBOS[k]).length} / 16`}</div>
                )}
              </div>

              <h3 style={{ marginTop: 30 }}>Conquistas</h3>
              <div className="menu-estatisticas" style={{ marginTop: 0, marginBottom: 10 }}>
                <div>{`Obtidas: ${conquistas.filter(c => c.obtido).length} / ${conquistas.length}`}</div>
              </div>

              {/* Grade de "troféus": cada conquista é uma caixa preta.
                  Quando obtida, aparece o sprite correspondente. Hover mostra
                  nome + descrição num tooltip flutuante (renderizado fora da
                  grade pra escapar do overflow do container). */}
              <div className="conquistas-grade">
                {conquistas.map((c) => {
                  const T = CONQUISTA_SPRITE.tamanho;
                  return (
                    <div
                      key={c.id}
                      className={`conquista-caixa ${c.obtido ? 'obtida' : 'bloqueada'}`}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltipConquista({
                          conquista: c,
                          // Centralizado horizontalmente em cima da caixa.
                          x: rect.left + rect.width / 2,
                          // Logo acima da caixa, com pequena margem.
                          y: rect.top - 10,
                        });
                      }}
                      onMouseLeave={() => setTooltipConquista(null)}
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

              {/* Botão que ativa o Modo Construção — fixo no canto inferior
                  esquerdo do .karaj-viewport (que é position:relative) */}
              <div className="modo-const"
              style={{position: 'absolute',bottom: '20px',left: '20px',zIndex: 100,background: 'rgba(0,0,0,0.85)',padding: '15px',borderRadius: '12px',border: modoConstrucao.ativo ? '3px solid #ffd700' : '3px solid #666',minWidth: '200px'}}>
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
                                style={{width: '100%', padding: '8px', margin: '5px 0', background: modoConstrucao.distrito === key ? '#2196F3' : 'rgba(33,150,243,0.2)', border: modoConstrucao.distrito === key ? '2px solid #2196F3' : '1px solid #888', borderRadius: '5px',cursor: 'pointer',color: '#fff',fontSize: '12px',display: 'flex',alignItems: 'center',gap: '8px'}}
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
              
              
              {/* Botão de Prestígio e Ascender — fixo no centro superior
                  do .karaj-viewport (que é position:relative) */}
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
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

                  {/* Madalena perdida — conquista secreta*/}
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

                {/* Barra de buffs ativos (estilo Cookie Clicker): só o ícone,
                    passar o mouse mostra o efeito completo num tooltip. */}
                {buff.filter(b => b.expira > Date.now()).length > 0 && (
                  <div className="barra-buffs">
                    {buff
                      .filter(b => b.expira > Date.now())
                      .map((b, i) => {
                        const ICONES_BUFF = {
                          CPS: '📈',
                          Click: '👆',
                          ClickOnce: '⚡',
                          Luck: '🍀',
                          BuildingDiscount: '🏗️',
                          GoldenCookieDuration: '🍪',
                          CookieCoinSell: '💰'
                        };
                        return (
                          <div
                            key={i}
                            className={`buff-icone ${b.debuff ? 'debuff' : ''}`}
                            onMouseEnter={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setTooltipPosBuff({
                                x: rect.right + 10,
                                y: rect.top + rect.height / 2
                              });
                              setHoveredBuff(b);
                            }}
                            onMouseLeave={() => setHoveredBuff(null)}
                          >
                            {ICONES_BUFF[b.tipo] ?? '✨'}
                          </div>
                        );
                      })}
                  </div>
                )}

                {hoveredBuff && (
                  <div
                    className="info-frasco"
                    style={{
                      position: "fixed",
                      left: tooltipPosBuff.x,
                      top: tooltipPosBuff.y,
                      transform: "translate(0, -50%)",
                      zIndex: 9999
                    }}
                  >
                    <strong style={{ color: hoveredBuff.debuff ? '#ff5252' : '#ffd700' }}>{hoveredBuff.nome}</strong><br />
                    {hoveredBuff.tipo === "CPS" && `${hoveredBuff.mult}x CPS`}
                    {hoveredBuff.tipo === "Click" && `${hoveredBuff.mult}x Clique`}
                    {hoveredBuff.tipo === "ClickOnce" && `Próximo clique: x${hoveredBuff.mult}`}
                    {hoveredBuff.tipo === "Luck" && `${hoveredBuff.mult >= 0 ? '+' : ''}${hoveredBuff.mult} Sorte`}
                    {hoveredBuff.tipo === "BuildingDiscount" && `Prédios ${Math.floor((1 - hoveredBuff.mult) * 100)}% mais baratos`}
                    {hoveredBuff.tipo === "GoldenCookieDuration" && `Cookie Dourado +${Math.floor((hoveredBuff.mult - 1) * 100)}% duração`}
                    {hoveredBuff.tipo === "CookieCoinSell" && `Cookie Coins valem ${hoveredBuff.mult}x mais`}
                    {' • '}
                    <span className="info-frasco-extra">{Math.ceil((hoveredBuff.expira - Date.now()) / 1000)}s</span>
                    {hoveredBuff.terminaComClique && (
                      <>
                        <br />
                        <span style={{ color: '#ff8a65' }}>Some se você clicar no cookie</span>
                      </>
                    )}
                  </div>
                )}

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
                    +{simplificarNumero(text.valor)}
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

                {/* Comprar múltiplas construções */}
              <div className="controles-multiplicador" style={{ display: 'flex', gap: '5px', marginBottom: '15px' }}>
                <span>Comprar:</span>
                <button 
                  onClick={() => setMultiplicador(1)} 
                  style={{ fontWeight: multiplicador === 1 ? 'bold' : 'normal', backgroundColor: multiplicador === 1 ? '#ddd' : '#fff' }}
                >
                  x1
                </button>
                <button 
                  onClick={() => setMultiplicador(10)} 
                  style={{ fontWeight: multiplicador === 10 ? 'bold' : 'normal', backgroundColor: multiplicador === 10 ? '#ddd' : '#fff' }}
                >
                  x10
                </button>
                <button 
                  onClick={() => setMultiplicador(100)} 
                  style={{ fontWeight: multiplicador === 100 ? 'bold' : 'normal', backgroundColor: multiplicador === 100 ? '#ddd' : '#fff' }}
                >
                  x100
                </button>
              </div>
                {construcoes.map((c, i) => {
                  // Preço base para de 1 construção
                  const precoAtualUm = getPreçoAtual(c.preço, c.quantidade);
                  // máximo que o jogador consegue comprar baseado no multiplicador
                  const { custoSimulado, quantPossivel } = preverCustoMultiplo(c.preço, c.quantidade, contagem, multiplicador);
                  // sem dinheiro pra comprar 1
                  const naoPodeComprarNada = quantPossivel === 0;

                  const éVovo = c.nome === "Vovó";

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
                        onClick={() => comprarConstrucao(i, multiplicador)} 
                        // O botão desativa se ele não puder comprar nem 1 unidade
                        disabled={naoPodeComprarNada}
                        style={{
                          cursor: naoPodeComprarNada ? "auto" : "pointer",
                          opacity: naoPodeComprarNada ? 0.6 : 1,
                          border: éVovo && arrastandoSobreVovo ? '2px dashed #ffd700' : undefined,
                          background: éVovo && arrastandoSobreVovo ? 'rgba(255, 215, 0, 0.15)' : undefined
                        }}
                        onDragOver={éVovo ? (e) => {
                          e.preventDefault();
                          e.dataTransfer.dropEffect = 'copy';
                        } : undefined}
                        onDragEnter={éVovo ? (e) => {
                          e.preventDefault();
                          setArrastandoSobreVovo(true);
                        } : undefined}
                        onDragLeave={éVovo ? () => setArrastandoSobreVovo(false) : undefined}
                        onDrop={éVovo ? (e) => {
                          e.preventDefault();
                          setArrastandoSobreVovo(false);
                          const cor = e.dataTransfer.getData('text/plain');
                          if (['verde', 'vermelho', 'azul', 'amarelo'].includes(cor)) AplicarCorNaVovo(cor);
                        } : undefined}
                      >
                        <div className="construções-icone">
                          {éVovo && vovoCor ? (
                            <div style={{
                              width: CONQUISTA_SPRITE.tamanho * 2,
                              height: CONQUISTA_SPRITE.tamanho * 2,
                              backgroundImage: `url(${conquistasSprite})`,
                              backgroundPosition: `-${VOVO_SPRITE_X[vovoCor] * CONQUISTA_SPRITE.tamanho * 2}px -${2 * CONQUISTA_SPRITE.tamanho * 2}px`,
                              backgroundSize: `${CONQUISTA_SPRITE.colunas * CONQUISTA_SPRITE.tamanho * 2}px ${CONQUISTA_SPRITE.linhas * CONQUISTA_SPRITE.tamanho * 2}px`,
                              imageRendering: 'pixelated'
                            }} />
                          ) : (
                            <img src={c.icone} alt={c.nome}></img>
                          )}
                        </div>
                        
                        <div className="construções-info">
                          <div className="construções-nome">{c.nome}</div>
                          
                          {/* exibição dinâmica do preço */}
                          <div className="construções-preco">
                            {multiplicador === 1 ? (// Modo padrão x1
                              <>Preço: {simplificarNumeroPT(precoAtualUm)}</>
                            ) : naoPodeComprarNada ? (// Modo múltiplo ativo, mas sem dinheiro pra comprar 1
                              <>Preço: {simplificarNumeroPT(precoAtualUm)}</>
                            ) : quantPossivel < multiplicador ? (// Sem dinheiro pra comprar tudo (ex: 47 de 100)
                              <>Preço ({quantPossivel}): {simplificarNumeroPT(custoSimulado)}</>
                            ) : (// Com dinheiro pra comprar tudo
                              <>Preço ({multiplicador}): {simplificarNumeroPT(custoSimulado)}</>
                            )}
                          </div>
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