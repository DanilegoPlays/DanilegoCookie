// Módulo para permitir usar saves antigos em novas versões (para não ser necessário recomeçar a cada update)

import { DEFAULT_CONSTRUCOES, DEFAULT_MELHORIAS, DEFAULT_COOKIE_COIN, DEFAULT_ASCENSAO } from './defaults';

export const VERSAO_ATUAL = 7.2; // Versão atual do save (V7.2 - Ganho offline)

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
  ascensao: DEFAULT_ASCENSAO
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
 
function normalizeCookieCoin(saved) {
  if (!saved || Array.isArray(saved) || typeof saved !== 'object') {
    return DEFAULT_SAVE.cookieCoin;
  }
  
  return {
    ...DEFAULT_SAVE.cookieCoin,
    ...saved
  };
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
      ascensao: DEFAULT_ASCENSAO
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
      ascensao: DEFAULT_ASCENSAO
    };
  }
}
 
export function saveGame(state) {
  const save = {
    version: VERSAO_ATUAL,
    contagem: state.contagem,
    cookiesTotais: state.cookiesTotais,
    cookiesTotaisAscensao: state.cookiesTotaisAscensao,
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
    wasPageClosed: state.wasPageClosed ?? false
  };
 
  localStorage.setItem("QuickSave", JSON.stringify(save));
  return save;
}
 
export function Save(state) {
  const save = {
    version: VERSAO_ATUAL,
    contagem: state.contagem,
    cookiesTotais: state.cookiesTotais,
    cookiesTotaisAscensao: state.cookiesTotaisAscensao,
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
      ascensao: DEFAULT_ASCENSAO
    };
  }
}