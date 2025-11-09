import logo from './PrimeiroCookie.png';
import Vovo1 from './Vovo1.png';
import Vovo2 from './Vovo2.png';
import Fazenda from './Fazenda.png';
import Fabrica from './Fabrica.png';
import Karaj from './Karaj.png';
import './App.css';
import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

function App() {
  // useStates principais
  const [contagem, setContagem] = useState(0); // contagem de cookies
  const [click, setClick] = useState(1); // valor do click
  const [CPS, setCPS] = useState(0); // CPS
  const [construcoes, setConstrucoes] = useState([
    {nome: "Vovó", preço: 15, cps: 0.5, quantidade: 0, icone: Vovo1},
    {nome: "Fazenda", preço: 100, cps: 1, quantidade: 0, icone: Fazenda},
    {nome: "Fábrica", preço: 1000, cps: 5, quantidade: 0, icone: Fabrica},
    {nome: "Templo de Karaj", preço: 7777, cps: 20, quantidade: 0, icone: Karaj}
  ])
  const [melhorias, setMelhorias] = useState([
    {nome: "Mouse de Aço", preço: 100, efeito:'duplicarClick', id: 'click1', comprado: false},
    {nome: "Super Mouse", preço: 500, efeito:'duplicarClick', id: 'click2', comprado: false},
    {nome: "Treinamento da Vovó", preço: 500, efeito:'duplicarVovo', id: 'vovo1', comprado: false},
    {nome: "Super Vovó", preço: 2000, efeito:'duplicarVovo', id: 'vovo2', comprado: false},
    {nome: "Fertilizante", preço: 5000, efeito:'duplicarFazenda', id: 'fazenda1', comprado: false},
    {nome: "Super Fazenda", preço: 10000, efeito:'duplicarFazenda', id: 'fazenda2', comprado: false},
    {nome: "Engrenagens Melhores", preço: 20000, efeito:'duplicarFabrica', id: 'fabrica1', comprado: false},
    {nome: "Super Fábrica", preço: 50000, efeito:'duplicarFabrica', id: 'fabrica2', comprado: false},
    {nome: "Torres mais Pontudas", preço: 100000, efeito:'duplicarTemplo', id: 'karaj1', comprado: false},
    {nome: "Café Salgado", preço: 500000, efeito:'duplicarTemplo', id: 'karaj2', comprado: false}
  ])

  // useStates de teste
  const clickRef = useRef(1); // referência
  const [hover, setHover] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [numerinhos, setNumerinhos] = useState([]);


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
    // Contagem de quantas melhorias foram compradas para cada tipo
    const mult_Vovo = melhorias.filter(m => m.efeito === 'duplicarVovo' && m.comprado).length;
    const mult_Fazenda = melhorias.filter(m => m.efeito === 'duplicarFazenda' && m.comprado).length;
    const mult_Fabrica = melhorias.filter(m => m.efeito === 'duplicarFabrica' && m.comprado).length;
    const mult_Templo = melhorias.filter(m => m.efeito === 'duplicarTemplo' && m.comprado).length;

    // Cálculo dos multiplicadores (2x, 4x, 8x, etc)
    const novoVovo = 2 ** mult_Vovo;
    const novoFazenda = 2 ** mult_Fazenda;
    const novoFabrica = 2 ** mult_Fabrica;
    const novoTemplo = 2 ** mult_Templo;

    const timer = setInterval(() => {
      //const producao = construcoes.reduce((soma, c) => soma + c.cps * c.quantidade, 0);
      
      // calcula o CPS levando em conta construções E melhorias
      // (pode ser útil para implementar melhorias sem alterar o cps base das construções)
      const producao = construcoes.reduce((soma, c) => {
        let base = c.cps;
        let multiplicador = 1;

        // Aplica o multiplicador conforme o tipo de construção
        if (c.nome === "Vovó") multiplicador = novoVovo;
        if (c.nome === "Fazenda") multiplicador = novoFazenda;
        if (c.nome === "Fábrica") multiplicador = novoFabrica;
        if (c.nome === "Templo de Karaj") multiplicador = novoTemplo;

        return soma + base * multiplicador * c.quantidade;
      }, 0);


      setCPS(producao);
      setContagem((atual) => atual + producao/10);
    }, 100); // a cada 0.1 segundos
    return () => clearInterval(timer); // limpa o timer
  }, [construcoes, melhorias]);


  function AssarCookies() {
    setContagem((anterior) => anterior + clickRef.current);
    //document.querySelectorAll('#Escondido1').forEach((item) => {
    //item.classList.toggle("showing");});

    setIsVisible((prev) => !prev);

    // adiciona animação de CSS ao cookie
    //const cookie = document.getElementById("cookie-img");
    //cookie.classList.add("bounce"); // adiciona efeito "bounce"
    //setTimeout(() => cookie.classList.remove("bounce"), 3000); // remove efeito após um tempo


  }

  function DestruirCookies() {
    setContagem(contagem - 1);
    document.querySelectorAll('#Escondido2').forEach((item) => {
    item.classList.toggle("showing");
  });
  }

  // animação do cookie
  const controls = useAnimation();
  const Clicar = (e) => {

    // --- Animação dos numerinhos
    const id = Date.now(); // Id único para os numerinhos
    // Pega a posição onde o click foi feito
    const x = e.clientX - 20;
    const y = e.clientY - 20; // posiciona um pouco acima do mouse
    // Adiciona os numerinhos
    setNumerinhos((prev) => [...prev, { id, x, y }]);

    // Animação de clicar
    controls.start({
      scale: [1, 0.9, 1.1, 1],
      y: [0, 0, 0, 0],
      transition: { duration: 0.3, ease: "easeOut" },
    });
    
    AssarCookies();
    // Apaga os numerinhos
    setTimeout(() => {
      setNumerinhos((prev) => prev.filter((t) => t.id !== id));
    }, 2000);
  };





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
  const ContagemFazenda = construcoes.find((c) => c.nome === "Fazenda")?.quantidade || 0;
  const ContagemFabrica = construcoes.find((c) => c.nome === "Fábrica")?.quantidade || 0;
  const ContagemTemplo = construcoes.find((c) => c.nome === "Templo de Karaj")?.quantidade || 0;
  // separar somente os upgrades que devem aparecer
  const upgradesDisponiveis = melhorias
  .map((m, i) => ({ ...m, indiceOriginal: i }))
  .filter(m => {
    if (m.comprado) return false;

    if (m.id === "click2" && contagem < 100) return false;
    if (m.id === "vovo1" && ContagemVovo < 1) return false;
    if (m.id === "vovo2" && ContagemVovo < 10) return false;
    if (m.id === "fazenda1" && ContagemFazenda < 1) return false;
    if (m.id === "fazenda2" && ContagemFazenda < 10) return false;
    if (m.id === "fabrica1" && ContagemFabrica < 1) return false;
    if (m.id === "fabrica2" && ContagemFabrica < 10) return false;
    if (m.id === "karaj1" && ContagemTemplo < 1) return false;
    if (m.id === "karaj2" && ContagemTemplo < 10) return false;

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

          
          {/* novo cookie com animação! */}
          <motion.img
            id="cookie"
            src={logo}
            onClick={Clicar}
            animate={controls}
            whileHover={{
              scale: 1.1,
              //boxShadow: "0 0 25px 5px rgba(255, 200, 100, 0.8)",
              filter: "brightness(1.1)",
              transition: { duration: 0.3, repeat: Infinity, repeatType: "reverse" },
            }}
            //whileTap={{ scale: 0.95 }}
            style={{ width: "400px", cursor: "pointer", borderRadius: "50%", userSelect: "none", }}
          />

          {/* Numerinhos */}
          {numerinhos.map((text) => (
            <motion.div
              key={text.id}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -50 }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{
                position: "absolute",
                left: text.x,
                top: text.y,
                transform: "translate(-50%, -50%)",
                color: "#fff",
                fontSize: "30px",
                fontWeight: "bold",
                textShadow: "0 0 5px black",
                pointerEvents: "none",
              }}
            >
              +{click}
            </motion.div>
          ))}



          <button id="cookie2" onClick={DestruirCookies} style={{cursor: "pointer" }}> 
            Outro Cookie? 
          </button>
          


          {isVisible && <section className="escondido" id="Escondido1">
            <h1> +{click} Cookies! </h1>
            <p> Vc ganhou {click} Cookies! </p>
          </section>}

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
