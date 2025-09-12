import logo from './PrimeiroCookie.png';
import './App.css';
import { useState } from "react";

function App() {

  const [contagem, setContagem] = useState(0); // contagem de cookies

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

  return (
    <div className="App">
      <h1>Cookie Clicker</h1>
      <div style={{ fontSize: "50px", margin: "20px 0" }}>{`${contagem} cookies`}</div>
      <script src="cookie.js"></script>

      <button id="cookie" onClick={AssarCookies} style={{cursor: "pointer" }}>
        <img src={logo} style={{ width: "400px", height: "auto", display: "block" }}>

        </img>
      </button>

      <button id="cookie2" onClick={DestruirCookies} style={{cursor: "pointer" }}> 
        Outro Cookie? 
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
