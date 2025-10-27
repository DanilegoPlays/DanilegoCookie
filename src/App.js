import logo from './PrimeiroCookie.png';
import Vovo1 from './Vovo1.png';
import Vovo2 from './Vovo2.png';
import Fazenda from './Fazenda.png';
import Fabrica from './Fabrica.png';
import './App.css';
import { useState, useEffect, useRef } from "react";

function App() {

  const [contagem, setContagem] = useState(0); // contagem de cookies
  const clickRef = useRef(1); // referência
  const [click, setClick] = useState(1); // valor do click
  const [CPS, setCPS] = useState(0); // CPS
  const [construcoes, setConstrucoes] = useState([
    {nome: "Vovó", preço: 15, cps: 0.5, quantidade: 0, icone: Vovo1},
    {nome: "Fazenda", preço: 100, cps: 1, quantidade: 0, icone: Fazenda},
    {nome: "Fábrica", preço: 1000, cps: 5, quantidade: 0, icone: Fabrica}
  ])
  const [melhorias, setMelhorias] = useState([
    {nome: "Mouse de Aço", preço: 100, efeito:'duplicarClick', id: 'click1', comprado: false},
    {nome: "Super Mouse", preço: 500, efeito:'duplicarClick', id: 'click2', comprado: false},
    {nome: "Treinamento da Vovó", preço: 500, efeito:'duplicarVovo', id: 'vovo1', comprado: false},
    {nome: "Super Vovó", preço: 100, efeito:'duplicarVovo', id: 'vovo2', comprado: false}
  ])


  // efeitos das melhorias
  useEffect(() => {
    const mult_click = melhorias.filter(m => m.efeito === 'duplicarClick' && m.comprado).length;
    const novoClick = 2 ** mult_click;
    setClick(novoClick);
    clickRef.current = novoClick;
    // melhoria das vovós, improvisada
    /*const mult_Vovo = melhorias.filter(m => m.efeito === 'duplicarVovo' && m.comprado).length;
    const novoVovo = 0.5 * (2 ** mult_Vovo);
    setConstrucoes((anteriores) =>
      anteriores.map((c) => {
        if (c.nome === "Vovó") {
          return { ...c, cps: novoVovo }; // multiplica o cps da vovó
        }
        return c;
      })
    );*/

  }, [melhorias]);


  // efeito CPS
  useEffect(() => {
    const mult_Vovo = melhorias.filter(m => m.efeito === 'duplicarVovo' && m.comprado).length;
    const novoVovo = 2 ** mult_Vovo;

    const timer = setInterval(() => {
      //const producao = construcoes.reduce((soma, c) => soma + c.cps * c.quantidade, 0);
      
      // calcula o CPS levando em conta construções E melhorias
      // (pode ser útil para implementar melhorias sem alterar o cps base das construções)
      const producao = construcoes.reduce((soma, c) => {
        const base = c.cps;
        const Cps_verdadeiro = (c.nome === "Vovó") ? base * novoVovo : base;
        return soma + Cps_verdadeiro * c.quantidade;
      }, 0);


      setCPS(producao);
      setContagem((atual) => atual + producao/10);
    }, 100); // a cada 0.1 segundos
    return () => clearInterval(timer); // limpa o timer
  }, [construcoes, melhorias]);


  function AssarCookies() {
    setContagem((anterior) => anterior + clickRef.current);
    document.querySelectorAll('#Escondido1').forEach((item) => {
    item.classList.toggle("showing");
  });
  }

  function DestruirCookies() {
    setContagem(contagem - 1);
    document.querySelectorAll('#Escondido2').forEach((item) => {
    item.classList.toggle("showing");
  });
  }



  function ComprarConstrucao(indice) {
    setConstrucoes((anterior) => {
      const novo = anterior.map((c, i) => {
        if (contagem >= c.preço && i === indice) {
          setContagem(contagem - c.preço);
          return {
            ...c,
            quantidade: c.quantidade + 1,
            preço: Math.floor(c.preço*1.2)
          };
        }
        return c;
      });
      return novo;
    });
  }

  function ComprarMelhoria(indice) {
    setMelhorias((anterior) =>
      anterior.map((m, i) => {
        if (contagem >= m.preço && i === indice && !m.comprado) {
          setContagem(contagem - m.preço);
          //AplicarEfeito(m.efeito);
          return { ...m, comprado: true };
        }
        return m;
      })
    );
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

  // Condição para desbloquear “Treinamento da Vovó”
  const ContagemVovo = construcoes.find((c) => c.nome === "Vovó")?.quantidade || 0;
  
  // separar somente os upgrades que devem aparecer
  const upgradesDisponiveis = melhorias
  .map((m, i) => ({ ...m, indiceOriginal: i }))
  .filter(m => {
    if (m.comprado) return false;

    // unlock rules by upgrade name:
    if (m.id === "click2" && contagem < 100) return false;
    if (m.id === "vovo1" && ContagemVovo < 1) return false;
    if (m.id === "vovo2" && ContagemVovo < 10) return false;

    // add other name-based conditions here if needed

    return true;
  });

  // lista de upgrades comprados
  const upgradesComprados = melhorias.filter((m) => m.comprado);



  return (
    <div className="App">
      <h1>Cookie Clicker</h1>
      <div className="jogo">
        <div className="seção-cookie">
          <div style={{ fontSize: "50px", margin: "20px 0" }}>{`${Math.floor(contagem)} cookies`}</div>
          <div style={{ fontSize: "50px", margin: "20px 0" }}>{`${CPS} CPS`}</div>
          <script src="cookie.js"></script>

          <button id="cookie" onClick={AssarCookies} style={{cursor: "pointer" }}>
            <img src={logo} style={{ width: "400px", height: "auto", display: "block" }}>

            </img>
          </button>

          <button id="cookie2" onClick={DestruirCookies} style={{cursor: "pointer" }}> 
            Outro Cookie? 
          </button>

          <section className="hidden" id="Escondido1">
            <h1> +{click} Cookie! </h1>
            <p> Vc ganhou 1 Cookie! </p>
          </section>

          <section className="hidden" id="Escondido2">
            <h1> -1 Cookie! </h1>
            <p> Vc destruiu 1 Cookie! </p>
          </section>
        </div>

        <div className='lado-direito'>

          <div className="seção-upgrades">
            <h2> Upgrades </h2>
            {upgradesDisponiveis.map((m, i) => (
                <button
                  key={i}
                  onClick={() => ComprarMelhoria(m.indiceOriginal)}
                  disabled={contagem < m.preço}
                  style={{
                    opacity: contagem < m.preço ? 0.6 : 1,
                    cursor: contagem < m.preço ? "not-allowed" : "pointer",
                    marginBottom: "8px",
                  }}
                >
                  {m.nome} <br /> {m.preço}
                </button>
              ))
            }
          </div>


          <div className="seção-construções">
            <h2> Construções</h2>
            {construcoes.map((c, i) => 
              <button className ="construcoes" id={c.nome} onClick={() => ComprarConstrucao(i)} style={{cursor: "pointer"}}>
              <img src={c.icone}></img>
              {c.nome} <br />
              {//CPS: {c.cps} <br />
              }
              Preço: {c.preço} <br />
              Quantidade: {c.quantidade} 
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}






export default App;
