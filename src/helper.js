// Módulo de funções utilitárias usadas em vários lugares do jogo:
// - Formatação de números grandes (123_000 → "123,0k", "123 mil", etc.)
// - Cálculos de multiplicadores baseados em melhorias e upgrades de ascensão
//
// Todas as funções aqui são puras: não dependem do estado interno do App,
// recebem tudo que precisam por argumento.

// ---------------------------------------------------------------------------
// Formatação de números
// ---------------------------------------------------------------------------

// Formata um número com N casas decimais usando vírgula brasileira.
// Ex: CasasDecimais(1234.5678, 2) → "1.234,57"
export function CasasDecimais(n, casas) {
  return n.toLocaleString("pt-BR", {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas
  });
}

// Versão "curta": 1.5M, 2.3B, 4.7T, etc. Usada em rótulos compactos.
export function simplificarNumero(n) {
  if (n >= 1_000_000_000_000_000) return CasasDecimais(n / 1_000_000_000_000_000, 1) + "q";
  if (n >= 1_000_000_000_000) return CasasDecimais(n / 1_000_000_000_000, 1) + "T";
  if (n >= 1_000_000_000) return CasasDecimais(n / 1_000_000_000, 1) + "B";
  if (n >= 1_000_000) return CasasDecimais(n / 1_000_000, 1) + "M";
  if (n >= 1_000) return CasasDecimais(n / 1_000, 1) + "k";
  return Math.floor(n);
}

// Versão "por extenso" em português: 1,5 milhões, 2,3 bilhões, etc.
// Usada em textos mais longos (preços, totais).
export function simplificarNumeroPT(n) {
  if (n >= 1_000_000_000_000_000) return CasasDecimais(n / 1_000_000_000_000_000, 3) + " quadrilhões";
  if (n >= 1_000_000_000_000) return CasasDecimais(n / 1_000_000_000_000, 3) + " trilhões";
  if (n >= 1_000_000_000) return CasasDecimais(n / 1_000_000_000, 3) + " bilhões";
  if (n >= 1_000_000) return CasasDecimais(n / 1_000_000, 3) + " milhões";
  //if (n >= 1_000) return CasasDecimais(n / 1_000 , 3) + " mil";
  if (n >= 1_000) return (n / 1_000).toFixed(3);
  if (n <= 10) return Number(n.toFixed(1)).toString();
  return Math.floor(n);
}

// ---------------------------------------------------------------------------
// Multiplicadores de produção
// ---------------------------------------------------------------------------

// Mapa de qual efeito de melhoria duplica cada construção.
// Adicione aqui ao criar uma nova construção que tem upgrade do tipo "duplicar X".
const EFEITO_DUPLICA = {
  "Vovó": "duplicarVovo",
  "Fazenda": "duplicarFazenda",
  "Mina": "duplicarMinas",
  "Fábrica": "duplicarFabrica",
  "Banco": "duplicarBanco",
  "Computador": "duplicarPC",
  "Templo de Karaj": "duplicarTemplo",
  "Laboratório": "duplicarLab",
};

// Multiplicador específico daquela construção (vovós dobram com cada upgrade
// de "duplicarVovo" comprado, etc). Retorna 2^(número de upgrades comprados).
export function getMultiplicador(construcao, melhorias) {
  const efeito = EFEITO_DUPLICA[construcao.nome];
  if (!efeito) return 1;

  const mult = melhorias.filter(m => m.efeito === efeito && m.comprado).length;
  return 2 ** mult;
}

// Multiplicador global de CPS, levando em conta:
// - Upgrades de cookies (1%, 3%, 5%, 10%)
// - Bônus de prestígio se o upgrade "ascensaocps" foi comprado
//
// Esta função substitui tanto getMultiplicadorP() quanto getMultiplicadorPFromData()
// que existiam no App.js — agora é só uma, recebe os dados explicitamente.
export function getMultiplicadorP(melhorias, ascensao) {
  const m1 = melhorias.filter(m => m.efeito === "1porcento" && m.comprado).length;
  const m3 = melhorias.filter(m => m.efeito === "3porcento" && m.comprado).length;
  const m5 = melhorias.filter(m => m.efeito === "5porcento" && m.comprado).length;
  const m10 = melhorias.filter(m => m.efeito === "10porcento" && m.comprado).length;

  const multiplicadorBasico = 1 + m1 * 0.01 + m3 * 0.03 + m5 * 0.05 + m10 * 0.1;

  const CPSAscensaoAtivo = ascensao?.distritotemplo?.upgrades?.some(
    u => u.id === "ascensaocps" && u.comprado
  );
  const multiplicadorPrestigio = CPSAscensaoAtivo
    ? 1 + (ascensao.prestigioTotal || 0) * 0.01
    : 1;

  return multiplicadorBasico * multiplicadorPrestigio;
}

