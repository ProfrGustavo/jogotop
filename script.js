// Elementos do DOM
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const roleta = document.getElementById("roleta");
const resultadoBox = document.getElementById("resultado");
const pontosElement = document.getElementById("pontos");
const cronometroElement = document.getElementById("cronometro");
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
  "Tempo Extra",
  "Ganhe 1 Vida",
  "Perdeu Metade",
  "Bônus"
];

const colors = [
  "#FF5733", // Vermelho - Perdeu Tudo
  "#FFC300", // Amarelo - Passa a Vez
  "#28B463", // Verde - Vale 5 Pontos
  "#3498DB", // Azul - Vale 10 Pontos
  "#9B59B6", // Roxo - Vale 100 Pontos
  "#F39C12", // Laranja - Troque Pontos
  "#1ABC9C", // Turquesa - Tempo Extra
  "#2ECC71", // Verde Claro - Ganhe 1 Vida
  "#E74C3C", // Vermelho Escuro - Perdeu Metade
  "#F1C40F"  // Amarelo Dourado - Bônus
];

// Variáveis de estado
const total = premios.length;
const anguloPorSetor = 2 * Math.PI / total;
let girando = false;
let pontos = 10;
let cronometroAtivo = false;
let tempoRestante = 0;
let cronometroInterval;

// Inicialização
pontosElement.innerText = pontos;

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
    
    // Processa o resultado
    processarResultado(resultado);
    
    girando = false;
  }, 5200);
}

// Função para processar o resultado da roleta
function processarResultado(resultado) {
  switch(resultado) {
    case "Perdeu Tudo":
      pontos = 0;
      if (somDerrota) somDerrota.play().catch(e => console.log("Erro ao tocar som:", e));
      break;
    case "Passa a Vez":
      // Apenas exibe a mensagem
      break;
    case "Vale 5 Pontos":
      pontos += 5;
      if (somVitoria) somVitoria.play().catch(e => console.log("Erro ao tocar som:", e));
      break;
    case "Vale 10 Pontos":
      pontos += 10;
      if (somVitoria) somVitoria.play().catch(e => console.log("Erro ao tocar som:", e));
      break;
    case "Vale 100 Pontos":
      pontos += 100;
      if (somVitoria) somVitoria.play().catch(e => console.log("Erro ao tocar som:", e));
      break;
    case "Troque Pontos":
      // Simulação de troca (na versão real, precisaria de interação entre equipes)
      alert("Escolha uma equipe para trocar pontos!");
      break;
    case "Tempo Extra":
      iniciarCronometro(30); // 30 segundos de tempo extra
      if (somVitoria) somVitoria.play().catch(e => console.log("Erro ao tocar som:", e));
      break;
    case "Ganhe 1 Vida":
      pontos += 1;
      if (somVitoria) somVitoria.play().catch(e => console.log("Erro ao tocar som:", e));
      break;
    case "Perdeu Metade":
      pontos = Math.floor(pontos / 2);
      if (somDerrota) somDerrota.play().catch(e => console.log("Erro ao tocar som:", e));
      break;
    case "Bônus":
      pontos += 20;
      if (somVitoria) somVitoria.play().catch(e => console.log("Erro ao tocar som:", e));
      break;
  }
  
  // Atualiza a pontuação na tela
  pontosElement.innerText = pontos;
  
  // Salva a pontuação no localStorage para compartilhar com a página de perguntas
  localStorage.setItem('pontuacao', pontos);
}

// Função para iniciar o cronômetro
function iniciarCronometro(segundos) {
  // Cancela qualquer cronômetro existente
  if (cronometroAtivo) {
    clearInterval(cronometroInterval);
  }
  
  cronometroAtivo = true;
  tempoRestante = segundos;
  atualizarCronometro();
  
  cronometroInterval = setInterval(() => {
    tempoRestante--;
    atualizarCronometro();
    
    if (tempoRestante <= 0) {
      clearInterval(cronometroInterval);
      cronometroAtivo = false;
      cronometroElement.style.color = "#28a745"; // Volta para verde
    }
  }, 1000);
}

// Função para atualizar a exibição do cronômetro
function atualizarCronometro() {
  const minutos = Math.floor(tempoRestante / 60);
  const segundos = tempoRestante % 60;
  
  cronometroElement.innerText = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
  
  // Efeito visual quando o tempo está acabando
  if (tempoRestante <= 10) {
    cronometroElement.style.color = "#FF5733"; // Vermelho quando está acabando
  } else {
    cronometroElement.style.color = "#28a745"; // Verde normal
  }
}

// Carrega a pontuação salva, se existir
window.onload = function() {
  const pontuacaoSalva = localStorage.getItem('pontuacao');
  if (pontuacaoSalva !== null) {
    pontos = parseInt(pontuacaoSalva);
    pontosElement.innerText = pontos;
  }
};
