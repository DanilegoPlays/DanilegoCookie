import { useEffect, useRef, useState } from "react";
import explosao from "./arte/Boom.mp4";
import { DEFAULT_CONSTRUCOES, DEFAULT_MELHORIAS, DEFAULT_COOKIE_COIN } from './defaults';

export function ExplosaoVideo({ onFinish }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let animationId;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    video.play();

    function draw() {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = frame.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        if (g > 120 && g > r * 1.2 && g > b * 1.2) {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(frame, 0, 0);
      animationId = requestAnimationFrame(draw);
    }

    draw();

    // ⏳ Trigger fade 2 seconds before end
    video.ontimeupdate = () => {
      if (
        video.duration &&
        video.currentTime >= video.duration - 2
      ) {
        setFadeOut(true);
      }
    };

    video.onended = () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      onFinish?.();
    };

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [onFinish]);

  return (
    <>
      <video
        ref={videoRef}
        src={explosao}
        style={{ display: "none" }}
        playsInline
      />

      <canvas
        ref={canvasRef}
        className={`ascensao-canvas ${fadeOut ? "fade-out" : ""}`}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Constantes e funções puras do sistema de Ascensão (cidade de Karaj)
// ---------------------------------------------------------------------------

// Quantos cookies são necessários para o primeiro nível de prestígio.
export const PRIMEIRO_PRESTIGIO = 1_000_000_000;

// Dimensões do mapa da cidade (deve bater com .tela-karaj no index.css:
// width/height/background-size). A largura/altura da "visão" (viewport)
// NÃO é mais fixa aqui — .karaj-viewport é responsivo (varia de tela pra
// tela, e é 100vw/100vh no modo ascensão), então o limite do arraste é
// calculado ao vivo em criarOnMouseMove, a partir do tamanho real do
// elemento no momento do drag.
export const LARGURA_CIDADE = 2000;
export const ALTURA_CIDADE = 1200;

// Fórmula do prestígio: raiz quadrada de (cookies / bilhão), arredondada pra baixo.
export function calcularPrestigio(cookiesTotais) {
  return Math.floor(Math.sqrt(cookiesTotais / PRIMEIRO_PRESTIGIO));
}

// Limita um valor entre min e max.
export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// Mapa dos nomes "bonitos" de cada distrito, pra mostrar no UI.
export function getNomeDistrito(key) {
  const nomes = {
    distritotemplo: "Distrito dos Templos",
    distritovovo: "Distrito das Vovós",
    distritofazenda: "Distrito das Fazendas",
    distritomina: "Distrito das Minas",
    distritofabrica: "Distrito das Fábricas",
    distritopc: "Distrito dos Computadores",
    distritobanco: "Distrito dos Bancos",
    distritoclick: "Distrito do Clique",
    distritoidle: "Distrito Idle"
  };
  return nomes[key] || key;
}

// ---------------------------------------------------------------------------
// Factories para funções que mexem com o estado de ascensão
// ---------------------------------------------------------------------------

// Abre/fecha a "caixa" do distrito (mostra os upgrades dele).
export function criarAbrirDistrito(setAscensao) {
  return function AbrirDistrito(nome) {
    setAscensao(prev => ({
      ...prev,
      [nome]: {
        ...prev[nome],
        aberto: !prev[nome].aberto
      }
    }));
  };
}

// Coloca o distrito no mapa onde o jogador clicou (ou move um existente).
export function criarColocarDistrito({
  modoConstrucao,
  setModoConstrucao,
  setAscensao,
  ascensao,
  mostrarAviso,
}) {
  return function ColocarDistrito(e, karajMapaElement) {
    if (!modoConstrucao.ativo || !modoConstrucao.distrito) return;

    // Coordenadas do click relativas ao karaj-mapa
    const rect = karajMapaElement.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Converte para porcentagem do mapa (0-100%)
    const mapX = (clickX / rect.width) * 100;
    const mapY = (clickY / rect.height) * 100;

    // Clamp para garantir que está dentro do mapa
    const finalX = Math.max(5, Math.min(95, mapX));
    const finalY = Math.max(5, Math.min(95, mapY));

    // Atualiza o distrito
    setAscensao(prev => ({
      ...prev,
      [modoConstrucao.distrito]: {
        ...prev[modoConstrucao.distrito],
        construído: true,
        posicao: { x: finalX, y: finalY }
      }
    }));

    const isMoving = ascensao[modoConstrucao.distrito]?.construído;
    mostrarAviso(`✅ Distrito ${isMoving ? 'movido' : 'construído'} com sucesso!`);

    // Desativa seleção do distrito mas mantém modo construção ativo
    setModoConstrucao(prev => ({
      ...prev,
      distrito: null
    }));
  };
}

// Compra um upgrade de ascensão de um distrito usando prestígio.
export function criarComprarUpgradeAscensao(setAscensao) {
  return function ComprarUpgradeAscensao(distrito, index) {
    setAscensao(prev => {
      const upgrade = prev[distrito]?.upgrades[index];
      if (!upgrade) return prev;

      const prestigioAtual = Number(prev.prestigio) || 0;
      const preco = Number(upgrade.preço) || 0;

      if (upgrade.comprado || prestigioAtual < preco) return prev;

      return {
        ...prev,
        prestigio: prestigioAtual - preco,
        [distrito]: {
          ...prev[distrito],
          upgrades: prev[distrito].upgrades.map((u, i) =>
            i === index ? { ...u, comprado: true } : u
          )
        }
      };
    });
  };
}

// ---------------------------------------------------------------------------
// Factories para drag (arrastar a cidade com o mouse)
// ---------------------------------------------------------------------------

export function criarOnMouseDown({ setDragging, startRef }) {
  return function onMouseDown(e) {
    setDragging(true);
    startRef.current = {
      x: e.clientX,
      y: e.clientY
    };
  };
}

export function criarOnMouseMove({ dragging, startRef, posRef, setPos }) {
  return function onMouseMove(e) {
    if (!dragging) return;

    // Tamanho real do .karaj-viewport agora (responsivo — varia de tela
    // pra tela, e é 100vw/100vh no modo ascensão), não um valor fixo.
    const rect = e.currentTarget.getBoundingClientRect();

    const MIN_X = rect.width - LARGURA_CIDADE;
    const MAX_X = 0;

    const MIN_Y = rect.height - ALTURA_CIDADE;
    const MAX_Y = 0;

    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;

    const newX = posRef.current.x + dx;
    const newY = posRef.current.y + dy;

    setPos({
      x: clamp(newX, MIN_X, MAX_X),
      y: clamp(newY, MIN_Y, MAX_Y)
    });
  };
}

export function criarOnMouseUp({ setDragging, posRef, pos }) {
  return function onMouseUp() {
    setDragging(false);
    posRef.current = pos;
  };
}