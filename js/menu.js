const navegacao = document.querySelector(".navegacao");
const botaoMenu = document.querySelector(".menu-toggle");
const itemSubmenu = document.querySelector(".tem-submenu");
const botaoSubmenu = document.querySelector(".submenu-toggle");

function fecharSubmenu() {
  itemSubmenu.classList.remove("aberto");
  botaoSubmenu.setAttribute("aria-expanded", "false");
}

function fecharMenu() {
  navegacao.classList.remove("aberta");
  botaoMenu.setAttribute("aria-expanded", "false");
  botaoMenu.setAttribute("aria-label", "Abrir menu");
  fecharSubmenu();
}

botaoMenu.addEventListener("click", () => {
  const aberto = navegacao.classList.toggle("aberta");

  botaoMenu.setAttribute("aria-expanded", String(aberto));
  botaoMenu.setAttribute(
    "aria-label",
    aberto ? "Fechar menu" : "Abrir menu"
  );

  if (!aberto) fecharSubmenu();
});

botaoSubmenu.addEventListener("click", () => {
  const aberto = itemSubmenu.classList.toggle("aberto");
  botaoSubmenu.setAttribute("aria-expanded", String(aberto));
});

document.addEventListener("click", (evento) => {
  if (!navegacao.contains(evento.target)) fecharMenu();
});

navegacao.addEventListener("keydown", (evento) => {
  if (evento.key !== "Escape") return;

  if (itemSubmenu.classList.contains("aberto")) {
    fecharSubmenu();
    botaoSubmenu.focus();
  } else if (navegacao.classList.contains("aberta")) {
    fecharMenu();
    botaoMenu.focus();
  }
});

const telaMovel = window.matchMedia("(max-width: 767px)");
telaMovel.addEventListener("change", fecharMenu);