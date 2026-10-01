import { iniciarCampanhas } from "./campanhas.js";
import { iniciarCadastro } from "./cadastro.js";
import { iniciarFeedback } from "./feedback.js";

(() => {
  const paginas = new Set([
    "index.html",
    "projetos.html",
    "cadastro.html"
  ]);
  let requisicao;
  let paginaAtual = location.pathname + location.search;
  function iniciarComponentes() {
    iniciarCampanhas();
    iniciarCadastro();
    iniciarFeedback();
  }
  // Mensagem acessível durante o carregamento.
  const aviso = document.createElement("p");
  aviso.setAttribute("role", "status");
  aviso.hidden = true;
  document.querySelector("main").before(aviso);
  function posicionar(url) {
    let alvo = null;
    try {
      alvo = document.getElementById(
        decodeURIComponent(url.hash.slice(1))
      );
    } catch {
      alvo = null;
    }
    alvo ||= document.querySelector("main");
    alvo.setAttribute("tabindex", "-1");
    alvo.focus({ preventScroll: true });
    if (url.hash) {
      alvo.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }
  function fecharNavegacao() {
    document.querySelector(".navegacao")
      ?.classList.remove("aberta");
    document.querySelector(".tem-submenu")
      ?.classList.remove("aberto");
    document.querySelectorAll(
      ".menu-toggle, .submenu-toggle"
    ).forEach(botao => {
      botao.setAttribute("aria-expanded", "false");
    });
    document.querySelector(".menu-toggle")
      ?.setAttribute("aria-label", "Abrir menu");
  }
  async function navegar(url, registrar = true) {
    requisicao?.abort();
    const controle = new AbortController();
    requisicao = controle;
    const principal = document.querySelector("main");
    try {
      if (
        url.pathname + url.search !== paginaAtual
      ) {
        principal.setAttribute("aria-busy", "true");
        aviso.hidden = false;
        aviso.textContent = "Carregando página…";
        const resposta = await fetch(
          url.pathname + url.search,
          { signal: controle.signal }
        );
        if (!resposta.ok) {
          throw new Error("Falha no carregamento");
        }
        const documento = new DOMParser().parseFromString(
          await resposta.text(),
          "text/html"
        );
        const conteudo = documento.querySelector("main");
        if (!conteudo) {
          throw new Error("Página sem conteúdo principal");
        }
        if (controle.signal.aborted) return;
        principal.replaceChildren(
          ...Array.from(conteudo.childNodes)
        );
        document.title = documento.title;
        const titulo = documento.querySelector("header h1");
        if (titulo) {
          document.querySelector("header h1").textContent =
            titulo.textContent;
        }
        const descricao = documento.querySelector(
          'meta[name="description"]'
        );
        if (descricao) {
          document.querySelector('meta[name="description"]')
            ?.setAttribute("content", descricao.content);
        }
        paginaAtual = url.pathname + url.search;
        iniciarComponentes();
      }
      if (registrar && url.href !== location.href) {
        history.pushState(null, "", url);
      }
      fecharNavegacao();
      posicionar(url);
    } catch (erro) {
      // Se houver uma falha, abre a página normalmente.
      if (erro.name !== "AbortError") {
        location.assign(url.href);
      }
    } finally {
      if (requisicao === controle) {
        principal.removeAttribute("aria-busy");
        aviso.hidden = true;
      }
    }
  }
  // Intercepta somente links internos das três páginas.
  document.addEventListener("click", evento => {
    const link = evento.target.closest("a[href]");
    if (
      !link ||
      evento.defaultPrevented ||
      evento.button !== 0 ||
      evento.ctrlKey ||
      evento.metaKey ||
      evento.shiftKey ||
      evento.altKey ||
      link.hasAttribute("download") ||
      (link.target && link.target !== "_self")
    ) {
      return;
    }
    const url = new URL(link.href, location.href);
    const pastaDestino = url.pathname.slice(
      0,
      url.pathname.lastIndexOf("/")
    );
    const pastaAtual = location.pathname.slice(
      0,
      location.pathname.lastIndexOf("/")
    );
    if (
      url.origin !== location.origin ||
      pastaDestino !== pastaAtual ||
      !paginas.has(url.pathname.split("/").pop())
    ) {
      return;
    }
    evento.preventDefault();
    navegar(url);
  });
  // Permite usar Voltar e Avançar do navegador.
  window.addEventListener("popstate", () => {
    navegar(new URL(location.href), false);
  });
  iniciarComponentes();
})();