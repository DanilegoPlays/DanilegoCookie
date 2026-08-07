// Módulo das funções de sorte / cookies dourados.
//
// As funções aqui são em sua maioria "factories": elas recebem os setters e
// valores do estado do App como parâmetros, e retornam uma função pronta para
// ser chamada. Isso permite extrair a lógica do App sem mover o estado.

import { DEFAULT_DOURADO, CONFIG_DOURADO } from './defaults';

// Faz o cookie dourado nascer em uma posição aleatória da tela.
// Função pura em termos de estado: só usa setCookieDourado.
export function SpawnCookieDourado(setCookieDourado) {
  const padding = 80; // evita spawn nos cantos

  const width = window.innerWidth;
  const height = window.innerHeight;

  const x = Math.random() * (width - padding * 2) + padding;
  const y = Math.random() * (height - padding * 2) + padding;

  const tempodetela = 15000; // fica por 15 segundos

  setCookieDourado({
    x,
    y,
    expira: Date.now() + tempodetela
  });
}

// Calcula quanto tempo até o próximo cookie dourado aparecer.
// Quanto maior a sorte, menor o tempo.
export function calcularProximoSpawn(sorte) {
  const { TMIN, TMAX } = CONFIG_DOURADO;
  const tempoSorteado = Math.random() * (TMAX - TMIN) + TMIN;
  const tempoFinal = Math.floor(tempoSorteado / sorte);

  console.log(`Próximo spawn calculado para daqui a: ${tempoFinal}s`);
  const timestampFuturo = Date.now() + (tempoFinal * 1000);
  return timestampFuturo;
}

// Sorteia qual efeito o cookie dourado vai dar, usando os pesos definidos
// em DEFAULT_DOURADO. Função pura.
export function rollEfeito() {
  const PesoTotal = DEFAULT_DOURADO.reduce((s, e) => s + e.peso, 0);
  let roll = Math.random() * PesoTotal;

  for (const efeito of DEFAULT_DOURADO) {
    if (roll < efeito.peso) return efeito;
    roll -= efeito.peso;
  }
}

// Aplica o multiplicador dos buffs de CPS ativos em cima do CPS base.
// Função pura.
export function CPSBuffado(baseCPS, buff) {
  const now = Date.now();

  return buff.reduce((cps, b) => {
    if (b.expira < now) return cps;

    if (b.tipo === "CPS") {
      return cps * b.mult;
    }

    return cps;
  }, baseCPS);
}

// Factory: cria a função que lida com o clique no cookie dourado.
// Recebe tudo que precisa do App (setters, refs, helpers) e devolve a função.
export function criarEfeitoCookieDourado({
  douradoSomRef,
  setDouradosTotais,
  setCookieDourado,
  setBuff,
  cookieInstaneo,
  mostrarAviso,
  buff,
}) {
  return function efeitoCookieDourado() {
    // toca som do cookie dourado
    if (douradoSomRef.current) {
      douradoSomRef.current.currentTime = 0;
      douradoSomRef.current.play().catch(() => {});
    }
    setDouradosTotais(prev => prev + 1);
    setCookieDourado(null);
    const efeito = rollEfeito();

    if (efeito.tipo === "Instantaneo") {
      cookieInstaneo(efeito.nome);
      return;
    }

    mostrarAviso(`Cookie dourado: ${efeito.nome}`);

    const now = Date.now();
    const durationBuff = buff.find(b => b.tipo === "GoldenCookieDuration" && b.expira > now);
    const finalDuration = durationBuff ? efeito.duração * durationBuff.mult : efeito.duração;

    setBuff(prev => [
      ...prev,
      {
        nome: efeito.nome,
        tipo: efeito.tipo,
        mult: efeito.mult,
        expira: Date.now() + finalDuration * 1000
      }
    ]);
  };
}

// Factory: cria a função do cookie dourado "Instantâneo" (Explosão de cookies).
// Dá o maior valor entre 30 min de CPS e 10% do banco atual.
export function criarCookieInstaneo({
  CPS,
  contagem,
  setContagem,
  setCookiesTotais,
  setCookiesTotaisAscensao,
  mostrarAviso,
  simplificarNumero,
}) {
  return function cookieInstaneo(nome) {
    const ganhoMinutos = CPS * 60 * 30;
    const ganhoBanco = contagem * 0.1;

    const ganho = Math.max(ganhoMinutos, ganhoBanco);

    mostrarAviso(`Cookie dourado: ${nome}! + ${simplificarNumero(ganho)} cookies`);

    setContagem(v => v + ganho);
    setCookiesTotais(v => v + ganho);
    setCookiesTotaisAscensao(v => v + ganho);
  };
}