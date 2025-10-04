import logo from './PrimeiroCookie.png';
import Vovo1 from './Vovo1.png';
import Vovo2 from './Vovo2.png';
import './App.css';
import { useState, useEffect } from "react";

function App() {

  const [contagem, setContagem] = useState(0); // contagem de cookies
  const [CPS, setCPS] = useState(0); // CPS
  const [preço, setPreço] = useState(15);

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
      setContagem((atual) => atual + CPS);
    }, 1000); // a cada 1 segundo
    return () => clearInterval(timer); // limpa o timer
  }, [CPS]);


  function ComprarConstrucao() {
    if (contagem >= preço) {
      setContagem(contagem - preço);
      setCPS(CPS + 1);
      setPreço(Math.floor(preço*1.2));
    }
  }




  return (
    <div className="App">
      <h1>Cookie Clicker</h1>
      <div style={{ fontSize: "50px", margin: "20px 0" }}>{`${contagem} cookies`}</div>
      <div style={{ fontSize: "50px", margin: "20px 0" }}>{`${CPS} CPS`}</div>
      <script src="cookie.js"></script>

      <button id="cookie" onClick={AssarCookies} style={{cursor: "pointer" }}>
        <img src={logo} style={{ width: "400px", height: "auto", display: "block" }}>

        </img>
      </button>

      <button id="cookie2" onClick={DestruirCookies} style={{cursor: "pointer" }}> 
        Outro Cookie? 
      </button>

      <button id="Vovo" onClick={ComprarConstrucao} style={{cursor: "pointer" }}>
        <img src={Vovo1}> 
        
        </img>
        Vovó 
        [Preço: {preço}]
      </button>

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
