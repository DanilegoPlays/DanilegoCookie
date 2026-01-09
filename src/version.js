// Módulo para permitir usar saves antigos em novas versões (para não ser necessário recomeçar a cada update)

export const VERSAO_ATUAL = 6.2; // Versão atual do save (semantic versioning: 6.2)

// Formato padrão do save
export const DEFAULT_SAVE = {
  version: VERSAO_ATUAL,
  contagem: 0,
  click: 1,
  construcoes: [
    { nome: "Vovó", quantidade: 0 },
    { nome: "Fazenda", quantidade: 0 },
    { nome: "Fábrica", quantidade: 0 },
    { nome: "Banco", quantidade: 0 },
    { nome: "Computador", quantidade: 0 },
    { nome: "Templo de Karaj", quantidade: 0 }
  ],
  melhorias: [
    { id: "click1", comprado: false },
    { id: "click2", comprado: false },
    { id: "click3", comprado: false },
    { id: "click4", comprado: false },
    { id: "vovo1", comprado: false },
    { id: "vovo2", comprado: false },
    { id: "vovo3", comprado: false },
    { id: "vovo4", comprado: false },
    { id: "fazenda1", comprado: false },
    { id: "fazenda2", comprado: false },
    { id: "fazenda3", comprado: false },
    { id: "fazenda4", comprado: false },
    { id: "fabrica1", comprado: false },
    { id: "fabrica2", comprado: false },
    { id: "fabrica3", comprado: false },
    { id: "fabrica4", comprado: false },
    { id: "banco1", comprado: false },
    { id: "banco2", comprado: false },
    { id: "banco3", comprado: false },
    { id: "banco4", comprado: false },
    { id: "PC1", comprado: false },
    { id: "PC2", comprado: false },
    { id: "PC3", comprado: false },
    { id: "PC4", comprado: false },
    { id: "karaj1", comprado: false },
    { id: "karaj2", comprado: false },
    { id: "karaj3", comprado: false },
    { id: "karaj4", comprado: false }
  ],
  cookieCoin: { desbloqueado: false, level: 0, coins: 0, mercado: 1 }
};

// --- MIGRAÇÃO  ---
// a migração recebe dados antigos e retorna com versão = N+1

function normalizeConstrucoes(saved = [], defaults) {
  return defaults.map(def => {
    const found = saved.find(s => s.nome === def.nome);
    if (found) {
      const quantidade = found.quantidade ?? 0;
      // Sempre usa o novo preço base dos defaults, independente do que estava salvo
      // O preço atual será calculado dinamicamente como: basePrice * Math.pow(1.2, quantidade)
      return {
        ...def,
        quantidade: quantidade,
        preço: def.preço // Sempre usa o preço base atual dos defaults
      };
    }
    return def;
  });
}

function normalizeMelhorias(saved = [], defaults) {
  return defaults.map(def => {
    const found = saved.find(s => s.id === def.id);
    if (found) {
      // Preserva todas as propriedades do save, mas garante que tem id e comprado
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
  // Handle old saves where cookieCoin might be an array or invalid format
  if (!saved || Array.isArray(saved) || typeof saved !== 'object') {
    return DEFAULT_SAVE.cookieCoin;
  }
  
  return {
    ...DEFAULT_SAVE.cookieCoin,
    ...saved
  };
}


// Funções de migração - cada função migra de uma versão para a próxima
// Usa versões semânticas (6.1, 6.2, etc.) como chaves
const migrations = {
  // Migração de versão 0 (saves antigos sem version) para versão 6.1
  0: (save) => {
    // Saves antigos podem não ter cookieCoin ou ter formato inválido
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
  // Adiciona novos edifícios (Banco) e novos upgrades
  6.1: (save) => {
    // Garante que o Banco existe nas construções (se não existir, será adicionado pela normalização)
    // Garante que os novos upgrades existem (se não existirem, serão adicionados pela normalização)
    return {
      ...save,
      version: 6.2
    };
  },
  
  // Adicione novas migrações aqui quando a versão aumentar
  // Exemplo para versão 6.3:
  // 6.2: (save) => {
  //   return {
  //     ...save,
  //     version: 6.3
  //   };
  // },
  // IMPORTANTE: Sempre atualize VERSAO_ATUAL quando adicionar uma nova migração!
};

// Função auxiliar para comparar versões semânticas
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
  
  // Se já está na versão atual ou mais recente, não precisa migrar
  if (compareVersions(currentVersion, VERSAO_ATUAL) >= 0) {
    return { ...save, version: VERSAO_ATUAL };
  }
  
  let migrated = { ...save };
  const initialVersion = currentVersion;
  let iterations = 0;
  const maxIterations = 100;

  // Aplica migrações sequencialmente até chegar na versão atual
  while (compareVersions(currentVersion, VERSAO_ATUAL) < 0 && iterations < maxIterations) {
    iterations++;
    
    const migration = migrations[currentVersion];
    if (!migration) {
      // Se não há migração para esta versão, tenta incrementar a versão menor
      // Para versões semânticas, incrementa o patch (6.1 -> 6.2)
      const parts = String(currentVersion).split('.').map(Number);
      if (parts.length === 1) {
        // Versão antiga numérica, converte para 6.1
        migrated = { ...migrated, version: 6.1 };
        currentVersion = 6.1;
      } else {
        // Incrementa patch version
        parts[parts.length - 1] = (parts[parts.length - 1] || 0) + 1;
        migrated = { ...migrated, version: parseFloat(parts.join('.')) };
        currentVersion = migrated.version;
      }
      continue;
    }

    migrated = migration(migrated);
    currentVersion = migrated.version;
    
    // Safety check para evitar loops infinitos
    if (compareVersions(currentVersion, initialVersion) <= 0) {
      console.warn("Migration loop detected, breaking");
      break;
    }
  }

  if (iterations >= maxIterations) {
    console.warn("Too many migration steps, breaking");
  }

  // Garante que a versão final é a atual
  migrated.version = VERSAO_ATUAL;
  return migrated;
}

export function loadSave(raw, defaultConstrucoes = null, defaultMelhorias = null) {
  if (!raw) {
    return {
      contagem: 0,
      click: 1,
      construcoes: defaultConstrucoes || DEFAULT_SAVE.construcoes,
      melhorias: defaultMelhorias || DEFAULT_SAVE.melhorias,
      cookieCoin: DEFAULT_SAVE.cookieCoin
    };
  }

  try {
    const parsed = JSON.parse(raw);

    const migrated = migrarSave(parsed);

    // Use provided defaults or fall back to DEFAULT_SAVE
    const construcoesDefaults = defaultConstrucoes || DEFAULT_SAVE.construcoes;
    const melhoriasDefaults = defaultMelhorias || DEFAULT_SAVE.melhorias;

    return {
      contagem: migrated.contagem ?? 0,
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
      version: VERSAO_ATUAL
    };
  } catch (error) {
    console.error("Error loading save:", error);
    return {
      contagem: 0,
      click: 1,
      construcoes: defaultConstrucoes || DEFAULT_SAVE.construcoes,
      melhorias: defaultMelhorias || DEFAULT_SAVE.melhorias,
      cookieCoin: DEFAULT_SAVE.cookieCoin
    };
  }
}

export function saveGame(state) {
  const save = {
    version: VERSAO_ATUAL,
    contagem: state.contagem,
    click: state.click,

    construcoes: state.construcoes.map(c => ({
      nome: c.nome,
      quantidade: c.quantidade,
      preço: c.preço // Preserva o preço atual
    })),

    melhorias: state.melhorias.map(m => ({
      id: m.id,
      comprado: m.comprado,
      // Preserva outras propriedades se existirem
      nome: m.nome,
      preço: m.preço,
      efeito: m.efeito,
      descricao: m.descricao
    })),

    cookieCoin: state.cookieCoin
  };

  localStorage.setItem("QuickSave", JSON.stringify(save));
  return save;
}


export function Save(state) {
  const save = {
    version: VERSAO_ATUAL,
    contagem: state.contagem,
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

    cookieCoin: state.cookieCoin
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
      click: 1,
      construcoes: defaultConstrucoes || DEFAULT_SAVE.construcoes,
      melhorias: defaultMelhorias || DEFAULT_SAVE.melhorias,
      cookieCoin: DEFAULT_SAVE.cookieCoin
    };
  }
}