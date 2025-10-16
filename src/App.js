import logo from './PrimeiroCookie.png';
import Vovo1 from './Vovo1.png';
import Vovo2 from './Vovo2.png';
import Fazenda from './Fazenda.png';
import './App.css';
import { useState, useEffect } from "react";

function App() {

  const [contagem, setContagem] = useState(0); // contagem de cookies
  const [CPS, setCPS] = useState(0); // CPS
  const [construcoes, setConstrucoes] = useState([
    {nome: "Vovó", preço: 15, cps: 1, quantidade: 0, icone: Vovo1},
    {nome: "Fazenda", preço: 100, cps: 1, quantidade: 0, icone: Fazenda},
    {nome: "Fábrica", preço: 1000, cps: 5, quantidade: 0, icone: Vovo2}
  ]

  )

  function AssarCookies() {
    setContagem(contagem + 1);
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


  useEffect(() => {
    
    const timer = setInterval(() => {
      const producao = construcoes.reduce((soma, c) => soma + c.cps * c.quantidade, 0);
      setCPS(producao);
      setContagem((atual) => atual + producao/10);
    }, 100); // a cada 1 segundo
    return () => clearInterval(timer); // limpa o timer
  }, [construcoes]);

/*
  function ComprarConstrucao(indice) {
    setConstrucoes((anterior) =>
      anterior.map((c, i) => {
        if (contagem >= c.preço && i == indice) {
          setContagem(contagem - c.preço);
          return {
            ...c,
            quantidade: c.quantidade + 1,
            preço: Math.floor(c.preço*1.2)
          };
          }
          return c;
        }
      )
    )

    
  }
*/

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



  return (
    <div className="App">
      <h1>Cookie Clicker</h1>
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


      {construcoes.map((c, i) => 
        <button className ="construcoes" id={c.nome} onClick={() => ComprarConstrucao(i)} style={{cursor: "pointer"}}>
        <img src={c.icone}></img>
        {c.nome} <br />
        CPS: {c.cps} <br />
        Preço: {c.preço} <br />
        Quantidade: {c.quantidade} 
        </button>
      )}

      <section className="hidden" id="Escondido1">
        <h1> +1 Cookie! </h1>
        <p> Vc ganhou 1 Cookie! </p>
      </section>

      <section className="hidden" id="Escondido2">
        <h1> -1 Cookie! </h1>
        <p> Vc destruiu 1 Cookie! </p>
      </section>
    </div>
  );
}






export default App;
