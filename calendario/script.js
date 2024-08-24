// Seletores do DOM
const calendario = document.querySelector(".calendar");
const data = document.querySelector(".date");
const containerDias = document.querySelector(".days");
const anterior = document.querySelector(".prev"); // Botão para mês anterior
const proximo = document.querySelector(".next"); // Botão para próximo mês
const btnHoje = document.querySelector(".today-btn");
const btnIrPara = document.querySelector(".goto-btn");
const inputData = document.querySelector(".date-input");
const diaEvento = document.querySelector(".event-day");
const dataEvento = document.querySelector(".event-date");
const containerEventos = document.querySelector(".events");
const btnAdicionarEvento = document.querySelector(".add-event");
const wrapperAdicionarEvento = document.querySelector(".add-event-wrapper");
const btnFecharAdicionarEvento = document.querySelector(".close");
const tituloEvento = document.querySelector(".event-name");
const horarioInicioEvento = document.querySelector(".event-time-from");
const horarioFimEvento = document.querySelector(".event-time-to");
const btnConfirmarEvento = document.querySelector(".add-event-btn");

// Variáveis globais
let hoje = new Date();
let diaAtivo;
let mes = hoje.getMonth();
let ano = hoje.getFullYear();
const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];
const eventosArr = [];

// Funções principais
function iniciarCalendario() {
  const primeiroDia = new Date(ano, mes, 1);
  const ultimoDia = new Date(ano, mes + 1, 0);
  const ultimoDiaAnterior = new Date(ano, mes, 0);
  const diasAnterior = ultimoDiaAnterior.getDate();
  const ultimaData = ultimoDia.getDate();
  const dia = primeiroDia.getDay();
  const diasProximos = 7 - ultimoDia.getDay() - 1;

  data.innerHTML = `${meses[mes]} ${ano}`;

  let dias = "";

  // Dias do mês anterior
  for (let x = dia; x > 0; x--) {
    dias += `<div class="day prev-date">${diasAnterior - x + 1}</div>`;
  }

  // Dias do mês atual
  for (let i = 1; i <= ultimaData; i++) {
    const evento = eventosArr.some((objEvento) => objEvento.dia === i && objEvento.mes === mes + 1 && objEvento.ano === ano);
    if (i === hoje.getDate() && ano === hoje.getFullYear() && mes === hoje.getMonth()) {
      diaAtivo = i;
      obterDiaAtivo(i);
      atualizarEventos(i);
      dias += evento ? `<div class="day today active event">${i}</div>` : `<div class="day today active">${i}</div>`;
    } else {
      dias += evento ? `<div class="day event">${i}</div>` : `<div class="day">${i}</div>`;
    }
  }

  // Dias do próximo mês
  for (let j = 1; j <= diasProximos; j++) {
    dias += `<div class="day next-date">${j}</div>`;
  }

  containerDias.innerHTML = dias;
  adicionarListener();
}

function mesAnterior() {
  mes--;
  if (mes < 0) {
    mes = 11;
    ano--;
  }
  iniciarCalendario();
}

function mesProximo() {
  mes++;
  if (mes > 11) {
    mes = 0;
    ano++;
  }
  iniciarCalendario();
}

// Atualiza o dia ativo e eventos ao clicar no dia
function adicionarListener() {
  document.querySelectorAll(".day").forEach((dia) => {
    dia.addEventListener("click", (e) => {
      const diaSelecionado = Number(e.target.innerHTML);
      obterDiaAtivo(diaSelecionado);
      atualizarEventos(diaSelecionado);
      diaAtivo = diaSelecionado;
      document.querySelectorAll(".day").forEach((d) => d.classList.remove("active"));
      if (e.target.classList.contains("prev-date")) {
        mesAnterior();
        setTimeout(() => {
          document.querySelectorAll(".day").forEach((d) => {
            if (!d.classList.contains("prev-date") && d.innerHTML === e.target.innerHTML) {
              d.classList.add("active");
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-date")) {
        mesProximo();
        setTimeout(() => {
          document.querySelectorAll(".day").forEach((d) => {
            if (!d.classList.contains("next-date") && d.innerHTML === e.target.innerHTML) {
              d.classList.add("active");
            }
          });
        }, 100);
      } else {
        e.target.classList.add("active");
      }
    });
  });
}

function obterDiaAtivo(data) {
  const dia = new Date(ano, mes, data);
  const nomeDia = dia.toLocaleDateString('pt-BR', { weekday: 'short' });
  diaEvento.innerHTML = nomeDia;
  dataEvento.innerHTML = `${data} ${meses[mes]} ${ano}`;
}

function atualizarEventos(data) {
  let eventos = eventosArr
    .filter(evento => data === evento.dia && mes + 1 === evento.mes && ano === evento.ano)
    .flatMap(evento => evento.eventos.map(e => `
      <div class="event">
        <div class="title">
          <i class="fas fa-circle"></i>
          <h3 class="event-title">${e.titulo}</h3>
        </div>
        <div class="event-time">
          <span class="event-time">${e.horario}</span>
        </div>
      </div>
    `))
    .join("");

  if (eventos === "") {
    eventos = `<div class="no-event">
      <h3>Sem Eventos</h3>
    </div>`;
  }
  containerEventos.innerHTML = eventos;
  salvarEventos();
}

// Funções de eventos
btnAdicionarEvento.addEventListener("click", () => {
  wrapperAdicionarEvento.classList.toggle("active");
});

btnFecharAdicionarEvento.addEventListener("click", () => {
  wrapperAdicionarEvento.classList.remove("active");
});

document.addEventListener("click", (e) => {
  if (e.target !== btnAdicionarEvento && !wrapperAdicionarEvento.contains(e.target)) {
    wrapperAdicionarEvento.classList.remove("active");
  }
});

tituloEvento.addEventListener("input", () => {
  tituloEvento.value = tituloEvento.value.slice(0, 60);
});

function formatarHorario(input) {
  input.value = input.value.replace(/[^0-9:]/g, "");
  if (input.value.length === 2) {
    input.value += ":";
  }
  if (input.value.length > 5) {
    input.value = input.value.slice(0, 5);
  }
}

horarioInicioEvento.addEventListener("input", () => formatarHorario(horarioInicioEvento));
horarioFimEvento.addEventListener("input", () => formatarHorario(horarioFimEvento));

btnConfirmarEvento.addEventListener("click", () => {
  const tituloEvento = tituloEvento.value;
  const horarioInicio = horarioInicioEvento.value;
  const horarioFim = horarioFimEvento.value;

  if (tituloEvento === "" || horarioInicio === "" || horarioFim === "") {
    alert("Por favor, preencha todos os campos");
    return;
  }

  const horarioInicioArr = horarioInicio.split(":");
  const horarioFimArr = horarioFim.split(":");

  if (
    horarioInicioArr.length !== 2 ||
    horarioFimArr.length !== 2 ||
    horarioInicioArr[0] > 23 ||
    horarioInicioArr[1] > 59 ||
    horarioFimArr[0] > 23 ||
    horarioFimArr[1] > 59
  ) {
    alert("Formato de Horário Inválido");
    return;
  }

  const novoEvento = {
    titulo: tituloEvento,
    horario: `${horarioInicio} - ${horarioFim}`,
  };

  const eventoExistente = eventosArr.some(evento => 
    evento.dia === diaAtivo && evento.mes === mes + 1 && evento.ano === ano &&
    evento.eventos.some(e => e.titulo === tituloEvento)
  );

  if (eventoExistente) {
    alert("Evento já adicionado");
    return;
  }

  let eventoAdicionado = false;
  eventosArr.forEach((item) => {
    if (item.dia === diaAtivo && item.mes === mes + 1 && item.ano === ano) {
      item.eventos.push(novoEvento);
      eventoAdicionado = true;
    }
  });

  if (!eventoAdicionado) {
    eventosArr.push({
      dia: diaAtivo,
      mes: mes + 1,
      ano: ano,
      eventos: [novoEvento],
    });
  }

  wrapperAdicionarEvento.classList.remove("active");
  tituloEvento.value = "";
  horarioInicioEvento.value = "";
  horarioFimEvento.value = "";
  atualizarEventos(diaAtivo);

  const diaAtivoEl = document.querySelector(".day.active");
  if (!diaAtivoEl.classList.contains("event")) {
    diaAtivoEl.classList.add("event");
  }
});

containerEventos.addEventListener("click", (e) => {
  if (e.target.classList.contains("event")) {
    if (confirm("Tem certeza de que deseja excluir este evento?")) {
      const tituloEvento = e.target.children[0].children[1].innerHTML;
      eventosArr.forEach((evento) => {
        if (evento.dia === diaAtivo && evento.mes === mes + 1 && evento.ano === ano) {
          const index = evento.eventos.findIndex(e => e.titulo === tituloEvento);
          if (index !== -1) {
            evento.eventos.splice(index, 1);
            if (evento.eventos.length === 0) {
              eventosArr.splice(eventosArr.indexOf(evento), 1);
              const diaAtivoEl = document.querySelector(".day.active");
              if (diaAtivoEl.classList.contains("event")) {
                diaAtivoEl.classList.remove("event");
              }
            }
          }
        }
      });
      atualizarEventos(diaAtivo);
    }
  }
});

// Funções de armazenamento
function salvarEventos() {
  localStorage.setItem("eventos", JSON.stringify(eventosArr));
}

function pegarEventos() {
  const eventosSalvos = localStorage.getItem("eventos");
  if (eventosSalvos) {
    eventosArr.push(...JSON.parse(eventosSalvos));
  }
}

// Inicializa o calendário
pegarEventos(); // Carrega eventos antes de iniciar o calendário
iniciarCalendario();

// Adiciona o evento ao botão "Ir"
btnIrPara.addEventListener("click", () => {
  const inputValor = inputData.value.trim();
  const [inputMes, inputAno] = inputValor.split("/");

  if (inputMes && inputAno) {
    const mesNumerico = parseInt(inputMes, 10);
    const anoNumerico = parseInt(inputAno, 10);

    // Verifica se o mês e ano são válidos
    if (mesNumerico >= 1 && mesNumerico <= 12 && anoNumerico >= 1000 && anoNumerico <= 9999) {
      mes = mesNumerico - 1; // Ajusta o mês para o índice base 0 (Janeiro é 0)
      ano = anoNumerico;
      iniciarCalendario();
    } else {
      alert("Por favor, insira um mês válido (01-12) e um ano válido (aaaa).");
    }
  } else {
    alert("Por favor, insira uma data no formato mm/aaaa.");
  }
});

// Adiciona o evento ao botão "Hoje"
btnHoje.addEventListener("click", () => {
  hoje = new Date();
  mes = hoje.getMonth();
  ano = hoje.getFullYear();
  diaAtivo = hoje.getDate();
  iniciarCalendario();
});

// Adiciona o evento ao botão "Anterior"
anterior.addEventListener("click", mesAnterior);

// Adiciona o evento ao botão "Próximo"
proximo.addEventListener("click", mesProximo);

// Formulário de feedback
document.addEventListener('DOMContentLoaded', () => {
  const feedbackBtn = document.querySelector('.feedback-btn');
  const feedbackWrapper = document.getElementById('feedbackWrapper');
  const closeFeedback = document.getElementById('closeFeedback');

  feedbackBtn.addEventListener('click', () => {
    feedbackWrapper.style.display = 'flex'; // Usar 'flex' para centralizar
  });

  closeFeedback.addEventListener('click', () => {
    feedbackWrapper.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target === feedbackWrapper) {
      feedbackWrapper.style.display = 'none';
    }
  });
});
