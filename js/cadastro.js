import { recuperarPreferencia, salvarPreferencia } from "./storage.js";

export function iniciarCadastro() {
    const formulario = document.getElementById("formulario-cadastro");
    if (formulario && !formulario.dataset.iniciado) {
      formulario.dataset.iniciado = "true";
      const interesseSalvo = formulario.querySelector("#interesse");
      const preferencia = recuperarPreferencia();
      if (preferencia) interesseSalvo.value = preferencia;
      interesseSalvo.addEventListener("change", () => {
        salvarPreferencia(interesseSalvo.value);
      });
      const camposValidaveis = formulario.querySelectorAll(
  "input, select, textarea"
);
function verificarCampo(campo) {
  const mensagem = document.getElementById("erro-" + campo.id);
  const invalido = !campo.validity.valid;
  campo.classList.toggle("campo-erro", invalido);
  campo.classList.toggle(
    "campo-sucesso",
    !invalido && campo.value.trim() !== ""
  );
  campo.setAttribute("aria-invalid", String(invalido));
  if (campo.validity.valueMissing) {
    mensagem.textContent = "Preencha este campo obrigatório.";
  } else if (campo.validity.typeMismatch) {
    mensagem.textContent = "Informe um e-mail válido.";
  } else if (campo.validity.patternMismatch) {
    mensagem.textContent =
      campo.title || "Confira o formato informado.";
  } else if (campo.validity.tooShort) {
    mensagem.textContent =
      "Digite pelo menos " + campo.minLength + " caracteres.";
  } else if (campo.validity.rangeOverflow) {
    mensagem.textContent =
      "A data de nascimento não pode estar no futuro.";
  } else if (invalido) {
    mensagem.textContent = campo.validationMessage;
  } else {
    mensagem.textContent = "";
  }
  mensagem.hidden = !invalido;
}
camposValidaveis.forEach(campo => {
  const mensagem = document.createElement("small");
  mensagem.id = "erro-" + campo.id;
  mensagem.className = "mensagem-erro";
  mensagem.setAttribute("aria-live", "polite");
  mensagem.hidden = true;
  campo.after(mensagem);
  const descricao = campo.getAttribute("aria-describedby");
  campo.setAttribute(
    "aria-describedby",
    [descricao, mensagem.id].filter(Boolean).join(" ")
  );
  campo.addEventListener("blur", () => {
    campo.dataset.verificado = "true";
    verificarCampo(campo);
  });

  campo.addEventListener("change", () => {
    campo.dataset.verificado = "true";
    verificarCampo(campo);
  });
  campo.addEventListener("invalid", () => {
    campo.dataset.verificado = "true";
    verificarCampo(campo);
  });
});
      const campo = id => formulario.querySelector("#" + id);
      const numeros = valor => valor.replace(/\D/g, "");
      campo("cpf").addEventListener("input", evento => {
        evento.target.value = numeros(evento.target.value)
          .slice(0, 11)
          .replace(/^(\d{3})(\d)/, "$1.$2")
          .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
          .replace(/\.(\d{3})(\d)/, ".$1-$2");
      });
      campo("telefone").addEventListener("input", evento => {
        const n = numeros(evento.target.value).slice(0, 11);
        const numero = n.slice(2);
        const tamanho = numero.length > 8 ? 5 : 4;
        if (!n) {
          evento.target.value = "";
        } else if (n.length <= 2) {
          evento.target.value = "(" + n;
        } else {
          evento.target.value =
            "(" + n.slice(0, 2) + ") " +
            numero.slice(0, tamanho) +
            (numero.length > tamanho
              ? "-" + numero.slice(tamanho)
              : "");
        }
      });
      campo("cep").addEventListener("input", evento => {
        evento.target.value = numeros(evento.target.value)
          .slice(0, 8)
          .replace(/^(\d{5})(\d)/, "$1-$2");
      });
      const hoje = new Date();
      campo("nascimento").max = [
        hoje.getFullYear(),
        String(hoje.getMonth() + 1).padStart(2, "0"),
        String(hoje.getDate()).padStart(2, "0")
      ].join("-");
      const resultado = document.getElementById("resultado");
      formulario.addEventListener("input", evento => {
        if (evento.target.dataset.verificado) verificarCampo(evento.target);
        resultado.textContent = "";
      });
      formulario.addEventListener("submit", evento => {
        evento.preventDefault();
      resultado.textContent =
  "Formulário preenchido corretamente! Nenhum cadastro foi enviado. " +
  "Apenas sua preferência de colaboração é salva neste navegador.";
      });
    }

}
