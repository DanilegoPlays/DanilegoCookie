// Módulo para permitir usar saves antigos em novas versões (para não ser necessário recomeçar a cada update)

import { DEFAULT_CONSTRUCOES, DEFAULT_MELHORIAS, DEFAULT_COOKIE_COIN, DEFAULT_ASCENSAO, DEFAULT_CONQUISTAS, DEFAULT_LABORATORIO, NVIDIA_NIVEL_MAXIMO_ABSOLUTO } from './defaults';

export const VERSAO_ATUAL = 9.1; // Versão atual do save (V9.1 - Rework dos Cookie Coins)

// Formato padrão do save
export const DEFAULT_SAVE = {
  version: VERSAO_ATUAL,
  contagem: 0,
  cookiesTotais: 0,
  cookiesTotaisAscensao: 0,
  click: 1,
  construcoes: DEFAULT_CONSTRUCOES.map(c => ({ nome: c.nome, quantidade: 0 })),
  melhorias: DEFAULT_MELHORIAS.map(m => ({ id: m.id, comprado: false })),
  cookieCoin: DEFAULT_COOKIE_COIN,
  ascensao: DEFAULT_ASCENSAO,
  sorte: 1, // Luck multiplier from upgrades
  douradosTotais: 0, // Total golden cookies clicked
  tempoDourado: null, // Time until next golden cookie spawn
  producaoMinimizada: false, // Se a seção "Sua Produção" está minimizada
  // Conquistas: só persistimos `id` + `obtido` (resto vem de DEFAULT_CONQUISTAS).
  conquistas: DEFAULT_CONQUISTAS.map(c => ({ id: c.id, obtido: false })),
  // IDs dos upgrades de sorte que já concederam o cookie dourado gratuito.
  // Persiste através de ascensões (não reseta), pra evitar farm de cookies
  // dourados grátis recomprando o mesmo upgrade de sorte toda ascensão.
  sorteUpgradesAtivados: [],
  // Laboratório de Frascos (minigame introduzido na V9.0 - Alquimia).
  laboratorio: DEFAULT_LABORATORIO,
  // Buffs/debuffs ativos (a maioria vem do Laboratório). Só os que ainda
  // não expiraram são salvos — ver normalizeBuff.
  buff: []
}
 
// --- MIGRAÇÃO  ---
// a migração recebe dados antigos e retorna com versão = N+1
 
function normalizeConstrucoes(saved = [], defaults) {
  return defaults.map(def => {
    const found = saved.find(s => s.nome === def.nome);
    if (found) {
      const quantidade = found.quantidade ?? 0;
      return {
        ...def,
        quantidade: quantidade,
        preço: def.preço
      };
    }
    return def;
  });
}
 
function normalizeMelhorias(saved = [], defaults) {
  return defaults.map(def => {
    const found = saved.find(s => s.id === def.id);
    if (found) {
      return {
        ...def,
        ...found,
        comprado: found.comprado ?? false
      };
    }
    return def;
  });
}

// Combina os metadados estáticos das conquistas (do DEFAULT_CONQUISTAS) com o
// estado persistido (só `id` + `obtido`). Conquistas adicionadas em versões
// futuras entram automaticamente como `obtido: false`.
function normalizeConquistas(saved = [], defaults) {
  return defaults.map(def => {
    const found = saved.find(s => s.id === def.id);
    return {
      ...def,
      obtido: found?.obtido ?? false
    };
  });
}
 
function normalizeCookieCoin(saved) {
  if (!saved || Array.isArray(saved) || typeof saved !== 'object') {
    return DEFAULT_SAVE.cookieCoin;
  }

  const merged = {
    ...DEFAULT_SAVE.cookieCoin,
    ...saved
  };

  // Corta o nível pro máximo mesmo em saves antigos de antes do limite
  // existir — não faz sentido converter mais de 100% da CPS.
  // Usa o teto ABSOLUTO (15, com os 2 upgrades de prestígio) — não o
  // base (5) — pra não cortar jogadores que já compraram os upgrades de
  // +5 placas do Distrito dos Computadores. O limite "de verdade" (que
  // depende de quais upgrades foram comprados) é sempre recalculado ao
  // vivo em App.js via getNivelMaximoPlacas; isso aqui é só uma trava de
  // sanidade contra saves corrompidos/editados manualmente.
  merged.level = Math.max(0, Math.min(NVIDIA_NIVEL_MAXIMO_ABSOLUTO, merged.level ?? 0));
  // Nunca deixa "ligadas" passar do número de placas realmente compradas.
  merged.ligadas = Math.max(0, Math.min(merged.level, merged.ligadas ?? 0));

  return merged;
}
 
// Laboratório de Frascos: cargas/proximaRecarga (progresso do jogador) vêm
// do save; nome/descricao sempre vêm da versão atual do jogo (podem mudar
// entre versões sem quebrar o save). Frasco/historico ficam vazios se
// ausentes — não faz sentido persistir uma poção "em preparo" pela metade
// entre sessões de um jeito confiável, então ela é descartada no load.
function normalizeLaboratorio(saved) {
  if (!saved || typeof saved !== 'object') {
    return DEFAULT_LABORATORIO;
  }

  const substancias = {};
  Object.keys(DEFAULT_LABORATORIO.substancias).forEach(cor => {
    const def = DEFAULT_LABORATORIO.substancias[cor];
    const savedCor = saved.substancias?.[cor];
    substancias[cor] = {
      ...def,
      cargas: savedCor?.cargas ?? def.cargas,
      proximaRecarga: savedCor?.proximaRecarga ?? null
    };
  });

  return {
    desbloqueado: saved.desbloqueado ?? DEFAULT_LABORATORIO.desbloqueado,
    construido: saved.construido ?? DEFAULT_LABORATORIO.construido,
    substancias,
    Frasco: Array.isArray(saved.Frasco) ? saved.Frasco : [],
    historico: Array.isArray(saved.historico) ? saved.historico : [],
    descobertos: Array.isArray(saved.descobertos) ? saved.descobertos : [],
    genericosDescobertos: Array.isArray(saved.genericosDescobertos) ? saved.genericosDescobertos : [],
    CookieQuimico: saved.CookieQuimico ?? false
  };
}

// Buffs/debuffs ativos: só mantém os que ainda não expiraram (não faz
// sentido persistir um buff de 7 segundos entre sessões).
function normalizeBuff(saved) {
  if (!Array.isArray(saved)) return [];
  const agora = Date.now();
  return saved.filter(b => b && typeof b === 'object' && typeof b.expira === 'number' && b.expira > agora);
}

function normalizeAscensao(saved) {
  if (!saved || typeof saved !== "object") {
    return DEFAULT_ASCENSAO;
  }
 
  const normalized = {
    desbloqueado: saved.desbloqueado ?? DEFAULT_ASCENSAO.desbloqueado,
    prestigio: saved.prestigio ?? DEFAULT_ASCENSAO.prestigio,
    prestigioTotal: saved.prestigioTotal ?? DEFAULT_ASCENSAO.prestigioTotal
  };
 
  const distritos = [
    'distritotemplo',
    'distritovovo', 
    'distritofazenda',
    'distritomina',
    'distritofabrica',
    'distritopc',
    'distritobanco',
    'distritoclick',
    'distritoidle'
  ];
 
  distritos.forEach(distrito => {
    const savedDistrito = distrito === 'distritofabrica' 
      ? (saved.distritofabrica || saved.distritofabricas)
      : saved[distrito];
    
    const defaultDistrito = DEFAULT_ASCENSAO[distrito];
    
    if (!defaultDistrito) {
      return;
    }
 
    normalized[distrito] = {
      aberto: savedDistrito?.aberto ?? defaultDistrito.aberto,
      desbloqueado: savedDistrito?.desbloqueado ?? defaultDistrito.desbloqueado,
      construído: savedDistrito?.construído ?? defaultDistrito.construído,
      posicao: savedDistrito?.posicao ?? defaultDistrito.posicao,
      icone: defaultDistrito.icone,
      icone_destruido: defaultDistrito.icone_destruido,
      requisitoQuantidade: defaultDistrito.requisitoQuantidade,
      requisitoConstrucao: defaultDistrito.requisitoConstrucao,
      upgrades: defaultDistrito.upgrades.map(defUpg => {
        const savedUpgrade = savedDistrito?.upgrades?.find(u => u.id === defUpg.id);
        return {
          ...defUpg,
          comprado: savedUpgrade?.comprado ?? false
        };
      })
    };
  });
 
  return normalized;
}
 
// Funções de migração
const migrations = {
  // Migração de versão 0 para versão 6.1
  0: (save) => {
    let cookieCoin = DEFAULT_SAVE.cookieCoin;
    if (save.cookieCoin && !Array.isArray(save.cookieCoin) && typeof save.cookieCoin === 'object') {
      cookieCoin = {
        ...DEFAULT_SAVE.cookieCoin,
        ...save.cookieCoin
      };
    }
    
    return {
      ...save,
      cookieCoin: cookieCoin,
      version: 6.1
    };
  },
  
  // Migração de versão 6.1 para versão 6.2
  6.1: (save) => {
    return {
      ...save,
      version: 6.2
    };
  },
  
  // Migração de versão 6.2 para versão 6.3
  6.2: (save) => {
    return {
      ...save,
      version: 6.3
    };
  },
 
  // Migração da 6.3 para 7.0 - KARAJ
  6.3: (save) => {
    return {
      ...save,
      cookiesTotais: save.cookiesTotais ?? 0,
      cookiesTotaisAscensao: save.cookiesTotaisAscensao ?? 0,
      ascensao: DEFAULT_ASCENSAO, // Simply add the entire ascensao object
      version: 7.0
    };
  },
 
  // Migração da 7.0 para 7.2 - GANHO OFFLINE
  7.0: (save) => {
    return {
      ...save,
      wasPageClosed: save.wasPageClosed ?? false, // Old saves default to false (no offline bonus on first load)
      lastSavedAt: save.lastSavedAt ?? Date.now(), // Ensure timestamp exists
      version: 7.2
    };
  },
 
  // Migração da 7.1 para 7.2
  7.1: (save) => {
    return {
      ...save,
      wasPageClosed: save.wasPageClosed ?? false,
      lastSavedAt: save.lastSavedAt ?? Date.now(),
      version: 7.2
    };
  },

  // Migração da 7.2 para 7.7 - A SORTE! (Golden Cookies)
  // No save structure changes, just version bump for new features
  7.2: (save) => {
    return {
      ...save,
      version: 7.7
    };
  },

  // Migração da 7.7 para 7.8 - Golden Cookie Stats
  // Add sorte, douradosTotais, and tempoDourado
  7.7: (save) => {
    return {
      ...save,
      sorte: save.sorte ?? 1,
      douradosTotais: save.douradosTotais ?? 0,
      tempoDourado: save.tempoDourado ?? null,
      version: 7.8
    };
  },

  // Migração da 7.8 para 7.9 - Sons de clique e refatoração de código.
  // Apenas bump de versão — essa versão foi publicada sem o fix do
  // cookiesTotaisAscensao, que ficou pra 7.11.
  7.8: (save) => {
    return {
      ...save,
      version: 7.9
    };
  },

  // Migração da 7.9 para 7.11 - Patch: recupera cookiesTotaisAscensao.
  // Em versões anteriores, esse campo não era incluído no autoSave nem no
  // ExportarSave, então virava undefined -> sumia do JSON -> voltava como 0
  // ao carregar. O patch em App.js + version.js agora salva corretamente,
  // mas saves já corrompidos de 7.8 ou 7.9 precisam dessa recuperação.
  // Heurística: se o valor está faltando ou é 0 mas o jogador tem cookiesTotais > 0,
  // usa cookiesTotais como fallback. Preciso pra quem nunca ascendeu; um pouco
  // inflado pra quem já ascendeu — mas melhor do que zerar os requisitos de upgrade.
  // (Pulamos 7.10 porque em JS 7.10 === 7.1, que conflita com a migração antiga.)
  7.9: (save) => {
    const cta = save.cookiesTotaisAscensao;
    const ct = save.cookiesTotais ?? 0;
    const cookiesTotaisAscensaoRecuperado =
      (cta === undefined || cta === null || cta === 0) && ct > 0
        ? ct
        : (cta ?? 0);

    return {
      ...save,
      cookiesTotaisAscensao: cookiesTotaisAscensaoRecuperado,
      version: 7.11
    };
  },

  // Migração da 7.11 para 8.0 - Reforma de UI (menus de opções/conquistas
  // na coluna esquerda, botão de minimizar produção) + Sistema de Conquistas.
  // Adiciona producaoMinimizada e conquistas (todas como obtido:false; o checker
  // do App.js dispara avisos pras que já bateriam o critério no carregamento).
  7.11: (save) => {
    return {
      ...save,
      producaoMinimizada: save.producaoMinimizada ?? false,
      conquistas: save.conquistas ?? DEFAULT_CONQUISTAS.map(c => ({ id: c.id, obtido: false })),
      version: 8.0
    };
  },

  // Migração da 8.0 para 8.1 - Sorte não reseta o bônus na ascensão.
  // Adiciona sorteUpgradesAtivados, pré-populado com os ids de upgrades de
  // sorte já comprados (nas melhorias normais e nos distritos de ascensão),
  // pra não conceder um cookie dourado "grátis" retroativo por upgrades que
  // o jogador já tinha antes dessa versão existir.
  8.0: (save) => {
    const idsJaComprados = new Set();

    (save.melhorias ?? [])
      .filter(m => m.efeito === 'sorte' && m.comprado)
      .forEach(m => idsJaComprados.add(m.id));

    const ascensao = save.ascensao ?? {};
    Object.values(ascensao).forEach(distrito => {
      if (!distrito || typeof distrito !== 'object' || !Array.isArray(distrito.upgrades)) return;
      distrito.upgrades
        .filter(u => u.efeito === 'sorte' && u.comprado)
        .forEach(u => idsJaComprados.add(u.id));
    });

    return {
      ...save,
      sorteUpgradesAtivados: save.sorteUpgradesAtivados ?? Array.from(idsJaComprados),
      version: 8.1
    };
  },

  // Migração da 8.1 para 9.0 - ALQUIMIA (Laboratório de Frascos)
  // Adiciona laboratorio (minigame novo) e buff (efeitos ativos), ambos
  // ausentes em saves anteriores a essa versão.
  8.1: (save) => {
    return {
      ...save,
      laboratorio: save.laboratorio ?? DEFAULT_LABORATORIO,
      buff: save.buff ?? [],
      version: 9.0
    };
  },

  // Migração da 9.0 para 9.1 - REWORK DOS COOKIE COINS
  // O nível das placas de Cookie Coin passou a ter um teto (NVIDIA_NIVEL_MAXIMO_BASE, ampliável por upgrades),
  // e o minigame foi rebalanceado (antes era fácil acumular milhares de
  // coins; agora é bem mais caro/lento). Por isso, saves de antes dessa
  // versão têm coins e nível zerados — o corte de nível em si é feito por
  // normalizeCookieCoin (roda sempre, em qualquer versão).
  // O Laboratório ganhou o campo novo "construido" (separado de
  // "desbloqueado", que agora é permanente). Pra não punir quem já tinha o
  // Laboratório funcionando no sistema antigo (uma única flag), quem já
  // estava com "desbloqueado: true" ganha "construido: true" de graça —
  // não perde o acesso nem precisa pagar 1 coin na primeira vez.
  9.0: (save) => {
    return {
      ...save,
      cookieCoin: save.cookieCoin
        ? { ...save.cookieCoin, coins: 0, level: 0 }
        : save.cookieCoin,
      laboratorio: save.laboratorio
        ? {
            ...save.laboratorio,
            construido: save.laboratorio.desbloqueado
              ? true
              : (save.laboratorio.construido ?? false)
          }
        : save.laboratorio,
      version: 9.1
    };
  }
};
 
function compareVersions(v1, v2) {
  const parts1 = String(v1).split('.').map(Number);
  const parts2 = String(v2).split('.').map(Number);
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;
    if (part1 < part2) return -1;
    if (part1 > part2) return 1;
  }
  return 0;
}
 
export function migrarSave(save) {
  let currentVersion = save.version ?? 0;
  
  if (compareVersions(currentVersion, VERSAO_ATUAL) >= 0) {
    return { ...save, version: VERSAO_ATUAL };
  }
  
  let migrated = { ...save };
  const initialVersion = currentVersion;
  let iterations = 0;
  const maxIterations = 100;
 
  while (compareVersions(currentVersion, VERSAO_ATUAL) < 0 && iterations < maxIterations) {
    iterations++;
    
    const migration = migrations[currentVersion];
    if (!migration) {
      const parts = String(currentVersion).split('.').map(Number);
      if (parts.length === 1) {
        migrated = { ...migrated, version: 6.1 };
        currentVersion = 6.1;
      } else {
        parts[parts.length - 1] = (parts[parts.length - 1] || 0) + 1;
        migrated = { ...migrated, version: parseFloat(parts.join('.')) };
        currentVersion = migrated.version;
      }
      continue;
    }
 
    migrated = migration(migrated);
    currentVersion = migrated.version;
    
    if (compareVersions(currentVersion, initialVersion) <= 0) {
      console.warn("Migration loop detected, breaking");
      break;
    }
  }
 
  if (iterations >= maxIterations) {
    console.warn("Too many migration steps, breaking");
  }
 
  migrated.version = VERSAO_ATUAL;
  return migrated;
}
 
export function loadSave(raw, defaultConstrucoes = null, defaultMelhorias = null) {
  if (!raw) {
    return {
      contagem: 0,
      cookiesTotais: 0,
      cookiesTotaisAscensao: 0,
      click: 1,
      construcoes: defaultConstrucoes || DEFAULT_CONSTRUCOES,
      melhorias: defaultMelhorias || DEFAULT_MELHORIAS,
      cookieCoin: DEFAULT_COOKIE_COIN,
      ascensao: DEFAULT_ASCENSAO,
      sorte: 1,
      douradosTotais: 0,
      tempoDourado: null,
      producaoMinimizada: false,
      conquistas: DEFAULT_CONQUISTAS,
      sorteUpgradesAtivados: [],
      laboratorio: DEFAULT_LABORATORIO,
      buff: []
    };
  }
 
  try {
    const parsed = JSON.parse(raw);
    const migrated = migrarSave(parsed);
 
    const construcoesDefaults = defaultConstrucoes || DEFAULT_CONSTRUCOES;
    const melhoriasDefaults = defaultMelhorias || DEFAULT_MELHORIAS;
    
    return {
      contagem: migrated.contagem ?? 0,
      cookiesTotais: migrated.cookiesTotais ?? 0,
      cookiesTotaisAscensao: migrated.cookiesTotaisAscensao ?? 0,
      click: migrated.click ?? 1,
      construcoes: normalizeConstrucoes(
        migrated.construcoes,
        construcoesDefaults
      ),
      melhorias: normalizeMelhorias(
        migrated.melhorias,
        melhoriasDefaults
      ),
      cookieCoin: normalizeCookieCoin(migrated.cookieCoin),
      ascensao: normalizeAscensao(migrated.ascensao),
      lastSavedAt: migrated.lastSavedAt ?? Date.now(),
      wasPageClosed: migrated.wasPageClosed ?? false,
      sorte: migrated.sorte ?? 1,
      douradosTotais: migrated.douradosTotais ?? 0,
      tempoDourado: migrated.tempoDourado ?? null,
      producaoMinimizada: migrated.producaoMinimizada ?? false,
      conquistas: normalizeConquistas(migrated.conquistas, DEFAULT_CONQUISTAS),
      sorteUpgradesAtivados: Array.isArray(migrated.sorteUpgradesAtivados) ? migrated.sorteUpgradesAtivados : [],
      laboratorio: normalizeLaboratorio(migrated.laboratorio),
      buff: normalizeBuff(migrated.buff),
      version: VERSAO_ATUAL
    };
  } catch (error) {
    console.error("Error loading save:", error);
    return {
      contagem: 0,
      cookiesTotais: 0,
      cookiesTotaisAscensao: 0,
      click: 1,
      construcoes: defaultConstrucoes || DEFAULT_CONSTRUCOES,
      melhorias: defaultMelhorias || DEFAULT_MELHORIAS,
      cookieCoin: DEFAULT_COOKIE_COIN,
      ascensao: DEFAULT_ASCENSAO,
      sorte: 1,
      douradosTotais: 0,
      tempoDourado: null,
      producaoMinimizada: false,
      conquistas: DEFAULT_CONQUISTAS,
      sorteUpgradesAtivados: [],
      laboratorio: DEFAULT_LABORATORIO,
      buff: []
    };
  }
}
 
export function saveGame(state) {
  const save = {
    version: VERSAO_ATUAL,
    contagem: state.contagem,
    cookiesTotais: state.cookiesTotais,
    cookiesTotaisAscensao: state.cookiesTotaisAscensao ?? 0,
    click: state.click,
 
    construcoes: state.construcoes.map(c => ({
      nome: c.nome,
      quantidade: c.quantidade,
      preço: c.preço
    })),
 
    melhorias: state.melhorias.map(m => ({
      id: m.id,
      comprado: m.comprado,
      nome: m.nome,
      preço: m.preço,
      efeito: m.efeito,
      descricao: m.descricao
    })),
 
    cookieCoin: state.cookieCoin,
    ascensao: state.ascensao,
    lastSavedAt: state.lastSavedAt ?? Date.now(),
    wasPageClosed: state.wasPageClosed ?? false,
    sorte: state.sorte ?? 1,
    douradosTotais: state.douradosTotais ?? 0,
    tempoDourado: state.tempoDourado ?? null,
    producaoMinimizada: state.producaoMinimizada ?? false,
    conquistas: (state.conquistas ?? []).map(c => ({ id: c.id, obtido: c.obtido ?? false })),
    sorteUpgradesAtivados: state.sorteUpgradesAtivados ?? [],
    laboratorio: state.laboratorio ?? DEFAULT_LABORATORIO,
    // Só salva buffs ainda ativos — descarta os já expirados.
    buff: (state.buff ?? []).filter(b => b && typeof b.expira === 'number' && b.expira > Date.now())
  };
 
  localStorage.setItem("QuickSave", JSON.stringify(save));
  return save;
}
 
export function Save(state) {
  const save = {
    version: VERSAO_ATUAL,
    contagem: state.contagem,
    cookiesTotais: state.cookiesTotais,
    cookiesTotaisAscensao: state.cookiesTotaisAscensao ?? 0,
    click: state.click,
 
    construcoes: state.construcoes.map(c => ({
      nome: c.nome,
      quantidade: c.quantidade,
      preço: c.preço
    })),
 
    melhorias: state.melhorias.map(m => ({
      id: m.id,
      comprado: m.comprado,
      nome: m.nome,
      preço: m.preço,
      efeito: m.efeito,
      descricao: m.descricao
    })),
 
    cookieCoin: state.cookieCoin,
    ascensao: state.ascensao,
    lastSavedAt: state.lastSavedAt ?? Date.now(),
    sorte: state.sorte ?? 1,
    douradosTotais: state.douradosTotais ?? 0,
    tempoDourado: state.tempoDourado ?? null,
    producaoMinimizada: state.producaoMinimizada ?? false,
    conquistas: (state.conquistas ?? []).map(c => ({ id: c.id, obtido: c.obtido ?? false })),
    sorteUpgradesAtivados: state.sorteUpgradesAtivados ?? [],
    laboratorio: state.laboratorio ?? DEFAULT_LABORATORIO,
    // Só salva buffs ainda ativos — descarta os já expirados.
    buff: (state.buff ?? []).filter(b => b && typeof b.expira === 'number' && b.expira > Date.now())
  };
 
  return btoa(JSON.stringify(save));
}
 
export function Load(saveString, defaultConstrucoes = null, defaultMelhorias = null) {
  try {
    const decoded = atob(saveString);
    return loadSave(decoded, defaultConstrucoes, defaultMelhorias);
  } catch (error) {
    console.error("Error loading save:", error);
    return {
      contagem: 0,
      cookiesTotais: 0,
      cookiesTotaisAscensao: 0,
      click: 1,
      construcoes: defaultConstrucoes || DEFAULT_CONSTRUCOES,
      melhorias: defaultMelhorias || DEFAULT_MELHORIAS,
      cookieCoin: DEFAULT_COOKIE_COIN,
      ascensao: DEFAULT_ASCENSAO,
      sorte: 1,
      douradosTotais: 0,
      tempoDourado: null,
      producaoMinimizada: false,
      conquistas: DEFAULT_CONQUISTAS,
      sorteUpgradesAtivados: [],
      laboratorio: DEFAULT_LABORATORIO,
      buff: []
    };
  }
}