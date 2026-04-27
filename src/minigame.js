// Módulo do minigame de Cookie Coins.
// Contém as funções de comprar placas de vídeo, vender moedas,
// e o componente do gráfico de preço.

// Valor base de 1 Cookie Coin em cookies (multiplicado pelo "mercado").
export const VALOR_BASE = 1_000_000;

// Factory: cria a função que compra um nível de placa de vídeo.
// O preço é calculado dinamicamente com base no level atual.
export function criarComprarCookieCoinNivel({
  contagem,
  setContagem,
  cookieCoin,
  setCookieCoin,
}) {
  return function ComprarCookieCoinNivel() {
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