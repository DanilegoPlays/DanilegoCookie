// Módulo dos minigames

// Preço médio de 1 Cookie Coin: 1000% do CPS atual (ou seja, vender 1 coin
// equivale a 10 segundos de produção). O valor real ainda varia em cima
// disso conforme o "mercado" flutua (ver App.js).
export const SEGUNDOS_CPS_POR_COOKIE_COIN = 10;

// Cada placa "ligada" troca uma fatia da CPS por uma renda fixa de coins.
export const FRACAO_CPS_POR_PLACA = 0.05; // 5% de CPS por placa ligada
export const COINS_POR_SEGUNDO_POR_PLACA = 0.001; // 0.001 coin/s por placa ligada

// Factory: cria a função que compra um nível de placa de vídeo.
// O preço é calculado dinamicamente com base no level atual. "nivelMaximo"
// vem de getNivelMaximoPlacas (helper.js) — a base (5) mais os upgrades de
// prestígio "maisplacas" do Distrito dos Computadores (+5 cada). Cada nível
// comprado é um "slot" que pode depois ser ligado/desligado (ver
// criarAjustarPlacasLigadas).
export function criarComprarCookieCoinNivel({
  contagem,
  setContagem,
  cookieCoin,
  setCookieCoin,
  nivelMaximo,
}) {
  return function ComprarCookieCoinNivel() {
    if (cookieCoin.level >= nivelMaximo) return;
    const precoNvidia = Math.floor(100000 * Math.pow(1.2, cookieCoin.level));
    if (contagem >= precoNvidia) {
      setContagem(prev => prev - precoNvidia);
      setCookieCoin(prev => ({
        ...prev,
        level: prev.level + 1
      }));
    }
  };
}

// Factory: cria a função que ativa/desativa placas (o botão "+"/"-").
// "delta" é +1 (ligar mais uma) ou -1 (desligar uma), sempre travado entre
// 0 e o número de placas compradas (level).
export function criarAjustarPlacasLigadas({ cookieCoin, setCookieCoin }) {
  return function AjustarPlacasLigadas(delta) {
    setCookieCoin(prev => {
      const novasLigadas = Math.max(0, Math.min(prev.level, prev.ligadas + delta));
      return { ...prev, ligadas: novasLigadas };
    });
  };
}

// Factory: cria a função que vende todas as Cookie Coins inteiras que
// o jogador tem, recebendo cookies de volta de acordo com o mercado atual.
export function criarVenderCookieCoin({
  cookieCoin,
  setCookieCoin,
  valorAtualCookieCoin,
  setContagem,
  setCookiesTotais,
  setCookiesTotaisAscensao,
  mostrarAvisoPersistente,
  iconeCookieCoin,
}) {
  return function VenderCookieCoin() {
    const moedasInteiras = Math.floor(cookieCoin.coins);
    if (moedasInteiras < 1) return;

    const ganhoCookies = moedasInteiras * valorAtualCookieCoin;

    setContagem(c => c + ganhoCookies);
    setCookiesTotais(c => c + ganhoCookies);
    setCookiesTotaisAscensao(c => c + ganhoCookies);
    setCookieCoin(prev => ({
      ...prev,
      coins: prev.coins - moedasInteiras
    }));
    mostrarAvisoPersistente(
      `${moedasInteiras} Cookie Coins vendidas por ${ganhoCookies.toLocaleString()} cookies`,
      iconeCookieCoin
    );
  };
}

// Componente do gráfico de preço das Cookie Coins.
// Recebe o histórico de preços e uma função para formatar números.
export function GraficoCookieCoin({ dados, simplificarNumero }) {
  const width = 250;
  const height = 120;

  if (dados.length < 2) return null;

  const min = Math.min(...dados);
  const max = Math.max(...dados);
  const range = max - min || 1;

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
      {/* rótulos do gráfico */}
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


  // ========== Laboratório de Alquimia ==========

export const MAX_CARGAS = 2;
export const TEMPO_RECARGA_CARGA = 60 * 60 * 1000; // 1 hora por carga
 
// Função pura: dado o estado salvo de uma substância (cargas + próxima
// recarga) e o instante atual, calcula quantas cargas estão de fato
// disponíveis agora e qual o novo timestamp da próxima recarga pendente
// (ou null se já estiver cheio). Não muda nenhum estado — só "avança o
// relógio" sobre os dados existentes.
export function getCargasAtuais(substancia, now = Date.now()) {
  let cargas = substancia.cargas;
  let proximaRecarga = substancia.proximaRecarga;
 
  while (proximaRecarga && now >= proximaRecarga && cargas < MAX_CARGAS) {
    cargas += 1;
    proximaRecarga = cargas < MAX_CARGAS ? proximaRecarga + TEMPO_RECARGA_CARGA : null;
  }
 
  return { cargas, proximaRecarga };
}

export function criarAdicionarQuimica({
  laboratorio,
  setLaboratorio
}) {
  return function AdicionarQuimica(color) {
    const agora = Date.now();
    const { cargas, proximaRecarga } = getCargasAtuais(laboratorio.substancias[color], agora);
 
    if (cargas <= 0) {
      return;
    }
 
    if (laboratorio.Frasco.length >= 3) {
      return;
    }
 
    setLaboratorio(prev => ({
      ...prev,
      Frasco: [...prev.Frasco, color],
      // Guarda o estado exato de antes (não o recalculado), pra desfazer
      // restaurar fielmente — inclusive o "progresso" de recarga que já existia.
      historico: [...(prev.historico ?? []), { color, estadoAnterior: prev.substancias[color] }],
      substancias: {
        ...prev.substancias,
        [color]: {
          ...prev.substancias[color],
          cargas: cargas - 1,
          // Se já não tinha recarga pendente (estava cheio), começa a contar agora.
          proximaRecarga: proximaRecarga ?? (agora + TEMPO_RECARGA_CARGA)
        }
      }
    }));
  };
}

export function criarDesfazerQuimica({
  laboratorio,
  setLaboratorio,
  mostrarAviso
}) {
  return function DesfazerQuimica() {
    const historico = laboratorio.historico ?? [];
    if (historico.length === 0 || laboratorio.Frasco.length === 0) return;
 
    setLaboratorio(prev => {
      // Se a mesma cor foi usada mais de uma vez, queremos o estado mais
      // antigo dela (de antes da primeira adição), não o intermediário.
      const substanciasRestauradas = { ...prev.substancias };
      const coresJaRestauradas = new Set();
      for (const { color, estadoAnterior } of prev.historico) {
        if (!coresJaRestauradas.has(color)) {
          substanciasRestauradas[color] = estadoAnterior;
          coresJaRestauradas.add(color);
        }
      }
 
      return {
        ...prev,
        Frasco: [],
        historico: [],
        substancias: substanciasRestauradas
      };
    });
 
    mostrarAviso("Frasco esvaziado — todas as cargas foram devolvidas.");
  };
}


export function criarBeberPocao({
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
}) {
  return function BeberPocao() {
    const flask = laboratorio.Frasco;
    if (flask.length === 0) return;
    
    const now = Date.now();
    
    const greenCount = flask.filter(c => c === 'verde').length;
    const redCount = flask.filter(c => c === 'vermelho').length;
    const blueCount = flask.filter(c => c === 'azul').length;
    const yellowCount = flask.filter(c => c === 'amarelo').length;

    // Combos especiais: combinações específicas de químicos que têm um
    // efeito próprio, diferente da simples soma dos efeitos individuais.
    // Chave = "verde-vermelho-azul-amarelo" (quantidade de cada um no frasco).
    const comboKey = `${greenCount}-${redCount}-${blueCount}-${yellowCount}`;

    const combosEspeciais = {
      // 3x Verde: a "forma suprema" do efeito normal do Verde (cookies
      // instantâneos) — em vez de 20/40/60 min de CPS, dá 10 horas de uma vez.
      // Mas vem com um debuff: -10% de CPS por 1 hora.
      "3-0-0-0": () => {
        const instant = CPS * 10 * 60 * 60;
        setContagem(c => c + instant);
        setCookiesTotais(c => c + instant);
        setCookiesTotaisAscensao(c => c + instant);
        setBuff(prev => [...prev, {
          nome: "Ressaca da Clorofila",
          tipo: "CPS",
          mult: 0.9,
          debuff: true,
          expira: now + 60 * 60 * 1000
        }]);
        mostrarAvisoPersistente(`Ganhou ${instant.toLocaleString()} cookies instantaneamente (10 horas de CPS)! Mas -10% de CPS por 1 hora.`);
      },
      // 2x Verde + 1x Vermelho: um único clique com poder x1111.
      // Penalidade: perde uma construção aleatória nesse clique.
      "2-1-0-0": () => {
        setBuff(prev => [...prev, {
          nome: "Clique Supremo",
          tipo: "ClickOnce",
          mult: 1111,
          penalidade: true,
          intensidade: 10,
          expira: now + 60 * 1000 // 1 minuto pra usar, senão perde o efeito
        }]);
        mostrarAvisoPersistente("Seu próximo clique terá poder x1111! Você tem 1 minuto para usar.");
      },
      // 2x Vermelho + 1x Verde: mesmo efeito (clique único x1111), só que
      // "pelo lado do Vermelho". Também tem a penalidade.
      "1-2-0-0": () => {
        setBuff(prev => [...prev, {
          nome: "Clique Supremo",
          tipo: "ClickOnce",
          mult: 1111,
          penalidade: true,
          intensidade: 10,
          expira: now + 60 * 1000
        }]);
        mostrarAvisoPersistente("Seu próximo clique terá poder x1111! Você tem 1 minuto para usar.");
      },
      // 2x Vermelho + 1x Amarelo: clique x77 por 7 segundos, com penalidade.
      "0-2-0-1": () => {
        setBuff(prev => [...prev, {
          nome: "Fúria Instável",
          tipo: "Click",
          mult: 77,
          penalidade: true,
          intensidade: 2,
          expira: now + 7 * 1000
        }]);
        mostrarAvisoPersistente("Cliques x77 por 7 segundos — cuidado, seus prédios estão instáveis!");
      },
      // 3x Vermelho: clique x100 por 10 segundos, com penalidade.
      "0-3-0-0": () => {
        setBuff(prev => [...prev, {
          nome: "Overdose Vermelha",
          tipo: "Click",
          mult: 100,
          penalidade: true,
          intensidade: 5,
          expira: now + 10 * 1000
        }]);
        mostrarAvisoPersistente("Cliques x100 por 10 segundos — cuidado, seus prédios estão instáveis!");
      },
      // 2x Amarelo + 1x Verde: spawna um Cookie Dourado na hora.
      "1-0-0-2": () => {
        SpawnCookieDourado();
        mostrarAvisoPersistente("Um Cookie Dourado apareceu!");
      },
      // 3x Amarelo: "O Sol" — invoca um cookie gigante no centro da tela.
      "0-0-0-3": () => {
        SpawnSol();
        mostrarAvisoPersistente("O Sol nasceu no centro da tela... você tem coragem de clicar nele?");
      },
      // --- Combos do Azul ---
      // Todos os efeitos de Azul carregam "origem: azul": antes de aplicar
      // um novo, removemos qualquer efeito de Azul (CPS ou Sorte) ainda
      // ativo — eles nunca empilham. E "terminaComClique: true" faz o
      // efeito sumir assim que o jogador clica manualmente no cookie.
      // 2x Azul + 1x Verde: CPS +100% por 10 minutos, -2 de sorte.
      "1-0-2-0": () => {
        setBuff(prev => [
          ...prev.filter(b => b.origem !== "azul"),
          {
            nome: "Solução Instável",
            tipo: "CPS",
            mult: 2.0,
            origem: "azul",
            terminaComClique: true,
            expira: now + 10 * 60 * 1000
          },
          {
            nome: "Solução Instável",
            tipo: "Luck",
            mult: -2,
            debuff: true,
            intensidade: 2,
            origem: "azul",
            terminaComClique: true,
            expira: now + 10 * 60 * 1000
          }
        ]);
        mostrarAvisoPersistente("CPS +100% por 10 minutos, mas os Cookies Dourados podem sofrer! Some se você clicar no cookie.");
      },
      // 2x Azul + 1x Vermelho: CPS +30% por 1 hora, -2 de sorte.
      "0-1-2-0": () => {
        setBuff(prev => [
          ...prev.filter(b => b.origem !== "azul"),
          {
            nome: "Solução Instável",
            tipo: "CPS",
            mult: 1.3,
            origem: "azul",
            terminaComClique: true,
            expira: now + 60 * 60 * 1000
          },
          {
            nome: "Solução Instável",
            tipo: "Luck",
            mult: -2,
            debuff: true,
            intensidade: 2,
            origem: "azul",
            terminaComClique: true,
            expira: now + 60 * 60 * 1000
          }
        ]);
        mostrarAvisoPersistente("CPS +30% por 1 hora, mas os Cookies Dourados podem sofrer! Some se você clicar no cookie.");
      },
      // 2x Azul + 1x Amarelo: CPS +7% por 7 horas, sem penalidade de sorte.
      "0-0-2-1": () => {
        setBuff(prev => [
          ...prev.filter(b => b.origem !== "azul"),
          {
            nome: "Solução Estável!",
            tipo: "CPS",
            mult: 1.07,
            origem: "azul",
            terminaComClique: true,
            expira: now + 7 * 60 * 60 * 1000
          }
        ]);
        mostrarAvisoPersistente("CPS +7% por 7 horas! Some se você clicar no cookie.");
      },
      // 3x Azul: a "forma suprema" do Azul — CPS +20% por 24 horas, -3 de sorte.
      "0-0-3-0": () => {
        setBuff(prev => [
          ...prev.filter(b => b.origem !== "azul"),
          {
            nome: "Solução Instável Suprema",
            tipo: "CPS",
            mult: 1.24,
            origem: "azul",
            terminaComClique: true,
            expira: now + 24 * 60 * 60 * 1000
          },
          {
            nome: "Solução Instável Suprema",
            tipo: "Luck",
            mult: -4,
            debuff: true,
            intensidade: 4,
            origem: "azul",
            terminaComClique: true,
            expira: now + 24 * 60 * 60 * 1000
          }
        ]);
        mostrarAvisoPersistente("CPS +24% por 24 horas, mas você sente uma onda de azar! Some se você clicar no cookie.");
      },
      // Verde + Azul + Vermelho: prédios 20% mais baratos por 5 minutos.
      "1-1-1-0": () => {
        setBuff(prev => [...prev, {
          nome: "Desconto de Prédios",
          tipo: "BuildingDiscount",
          mult: 0.8,
          expira: now + 5 * 60 * 1000
        }]);
        mostrarAvisoPersistente("Prédios 20% mais baratos por 5 minutos!");
      },
      // Verde + Vermelho + Amarelo: NOVO — Cookie Coins vendem por 10x mais por 1 minuto.
      "1-1-0-1": () => {
        setBuff(prev => [...prev, {
          nome: "Mercado Manipulado",
          tipo: "CookieCoinSell",
          mult: 10,
          expira: now + 60 * 1000
        }]);
        mostrarAvisoPersistente("Suas Cookie Coins valem 10x mais por 1 minuto!");
      },
      // Azul + Vermelho + Amarelo: desbloqueia upgrade Cookie Químico.
      "0-1-1-1": () => {
        setLaboratorio(prev => ({
          ...prev,
          CookieQuimico: true
        }));
        mostrarAvisoPersistente("Upgrade 'Cookie Químico' desbloqueado!");
      },
      // Verde + Azul + Amarelo: +1 de sorte por 10 minutos.
      "1-0-1-1": () => {
        setBuff(prev => [...prev, {
          nome: "Sorte da Combinação",
          tipo: "Luck",
          mult: 1,
          expira: now + 10 * 60 * 1000
        }]);
        mostrarAvisoPersistente("+1 de sorte por 10 minutos!");
      },
      // 2x Amarelo + 1x Azul: aumenta duração de cookies dourados (efeito
      // que antes era do combo Vermelho+Azul+Amarelo).
      "0-0-1-2": () => {
        setBuff(prev => [...prev, {
          nome: "Cookie Dourado+",
          tipo: "GoldenCookieDuration",
          mult: 1.1,
          expira: now + 10 * 60 * 1000
        }]);
        mostrarAvisoPersistente("Duração de cookies dourados aumentada em 10% por 10 minutos!");
      }
    };

    if (combosEspeciais[comboKey]) {
      combosEspeciais[comboKey]();
    } else {
      if (greenCount > 0) {
        const minutes = greenCount === 1 ? 20 : greenCount === 2 ? 40 : 60;
        const instant = CPS * minutes * 60;
        setContagem(c => c + instant);
        setCookiesTotais(c => c + instant);
        setCookiesTotaisAscensao(c => c + instant);
        mostrarAvisoPersistente(`Ganhou ${instant.toLocaleString()} cookies instantaneamente!`);
      }
      
      if (redCount > 0) {
        const mult = redCount === 1 ? 10 : redCount === 2 ? 15 : 20;
        setBuff(prev => [...prev, {
          nome: "Clique Químico",
          tipo: "Click",
          mult: mult,
          penalidade: true,
          intensidade: 1,
          expira: now + 10 * 1000
        }]);
      }
      
      if (blueCount > 0) {
        const mult = 1.1 + (blueCount === 1 ? 0 : blueCount === 2 ? 0.1 : 0.1);
        const duration = blueCount === 3 ? 10 * 60 * 60 * 1000 : 1 * 60 * 60 * 1000;
        setBuff(prev => [
          ...prev.filter(b => b.origem !== "azul"),
          {
            nome: "CPS Químico",
            tipo: "CPS",
            mult: mult,
            origem: "azul",
            terminaComClique: true,
            expira: now + duration
          }
        ]);
      }
      
      if (yellowCount > 0) {
        if (yellowCount === 3) {
          SpawnCookieDourado();
          mostrarAvisoPersistente("Um Cookie Dourado apareceu!");
        } else {
          const duration = yellowCount === 1 ? 3 * 60 * 1000 : 10 * 60 * 1000;
          setBuff(prev => [...prev, {
            nome: "Sorte Química",
            tipo: "Luck",
            mult: 1,
            expira: now + duration
          }]);
        }
      }
    }

    // Se a mistura não era um combo especial, cada cor usada teve seu
    // efeito genérico revelado — registra pra tooltip do frasco a partir de agora.
    const foiComboEspecial = !!combosEspeciais[comboKey];
    const coresUsadas = [
      greenCount > 0 && 'verde',
      redCount > 0 && 'vermelho',
      blueCount > 0 && 'azul',
      yellowCount > 0 && 'amarelo'
    ].filter(Boolean);

    setLaboratorio(prev => {
      const descobertos = prev.descobertos ?? [];
      const genericosDescobertos = prev.genericosDescobertos ?? [];
      const novosGenericos = foiComboEspecial
        ? genericosDescobertos
        : Array.from(new Set([...genericosDescobertos, ...coresUsadas]));

      return {
        ...prev,
        Frasco: [],
        historico: [],
        descobertos: (foiComboEspecial && !descobertos.includes(comboKey))
          ? [...descobertos, comboKey]
          : descobertos,
        genericosDescobertos: novosGenericos
      };
    });
  };
}