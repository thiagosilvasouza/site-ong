export function iniciarFeedback() {
    const abrir = document.getElementById("abrir-modal");
    const modal = document.getElementById("modal-participacao");
    if (abrir && modal && !abrir.dataset.iniciado) {
      abrir.dataset.iniciado = "true";
      abrir.addEventListener("click", () => {
        modal.showModal();
      });
      modal.addEventListener("close", () => {
        abrir.focus();
      });
    }
}
