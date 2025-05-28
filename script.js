// Elementos do DOM
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const roleta = document.getElementById("roleta");
const resultadoBox = document.getElementById("resultado");
const somRoleta = document.getElementById("som-roleta");
const somVitoria = document.getElementById("som-vitoria");
const somDerrota = document.getElementById("som-derrota");

// Configuração da roleta
const premios = [
  "Perdeu Tudo", 
  "Passa a Vez", 
  "Vale 5 Pontos", 
  "Vale 10 Pontos",
  "Vale 100 Pontos",
  "Troque Pontos",
  "Congele uma Equipe",
  "Duas Chances",
  "Perdeu Metade",
  "Tempo Extra + 10 Pontos"
];

const colors = [
  "#FF5733", // Vermelho - Perdeu Tudo
  "#FFC300", // Amarelo - Vale 15 Pontos
  "#28B463", // Verde - Vale 10 Pontos
  "#3498DB", // Azul - Vale 10 Pontos
  "#9B59B6", // Roxo - Vale 100 Pontos
  "#F39C12", // Laranja - Troque Pontos (se quiser)
  "#1ABC9C", // Turquesa - 20 Pontos
  "#2ECC71", // Verde Claro - Em duplas (10 pontos)
  "#E74C3C", // Vermelho Escuro - O adversário escolhe (15 pontos)
  "#F1C40F"  // Amarelo Dourado - Dobrar os pontos
];

// Variáveis de estado
const total = premios.length;
const anguloPorSetor = 2 * Math.PI / total;
let girando = false;

// Função para desenhar a roleta
function desenharRoleta() {
  for (let i = 0; i < total; i++) {
    const start = i * anguloPorSetor;
    const end = start + anguloPorSetor;

    ctx.beginPath();
    ctx.moveTo(250, 250);
    ctx.arc(250, 250, 250, start, end);
    ctx.fillStyle = colors[i];
    ctx.fill();
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    ctx.translate(250, 250);
    ctx.rotate(start + anguloPorSetor / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = "bold 18px Arial";
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.fillText(premios[i], 230, 10);
    ctx.restore();
  }
  
  // Desenha círculo central
  ctx.beginPath();
  ctx.arc(250, 250, 50, 0, 2 * Math.PI);
  ctx.fillStyle = "#333";
  ctx.fill();
  
  // Texto no centro
  ctx.fillStyle = "#fff";
  ctx.font = "bold 20px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("GIRE!", 250, 250);
}

// Desenha a roleta inicial
desenharRoleta();

// Função para girar a roleta
function girar() {
  if (girando) return;
  girando = true;

  resultadoBox.style.display = "none";
  
  // Toca o som da roleta
  if (somRoleta) {
    somRoleta.currentTime = 0;
    somRoleta.play().catch(e => console.log("Erro ao tocar som:", e));
  }

  // Configuração da rotação
  let voltas = Math.floor(Math.random() * 5) + 5;
  let destino = Math.random() * 360;
  let anguloFinal = 360 * voltas + destino;

  // Aplica a rotação com efeito suave
  roleta.style.transition = "transform 5s cubic-bezier(0.17, 0.67, 0.21, 0.99)";
  roleta.style.transform = `rotate(${anguloFinal}deg)`;

  // Processa o resultado após a animação
  setTimeout(() => {
    const anguloCorrigido = (anguloFinal % 360 + 360) % 360;
    const index = total - Math.floor(anguloCorrigido / (360 / total)) % total;
    const resultado = premios[index % total];

    // Exibe o resultado
    resultadoBox.innerText = resultado;
    resultadoBox.style.display = "block";
    
    // Toca som de acordo com o resultado
    if (resultado === "Perdeu Tudo" || resultado === "Perdeu Metade") {
      if (somDerrota) somDerrota.play().catch(e => console.log("Erro ao tocar som:", e));
    } else {
      if (somVitoria) somVitoria.play().catch(e => console.log("Erro ao tocar som:", e));
    }
    
    girando = false;
  }, 5200);
}
