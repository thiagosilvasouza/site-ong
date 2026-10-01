export function iniciarCampanhas() {
    const lista = document.getElementById("lista-campanhas");
const template = document.getElementById("template-campanha");
if (lista && template && !lista.dataset.iniciado) {
  const campanhas = [
    {
      titulo: "Alimento na mesa",
      descricao:
        "Arrecadação de alimentos não perecíveis, dentro do prazo " +
        "de validade e com embalagens fechadas, para preparar " +
        "cestas destinadas às famílias atendidas."
    },
    {
      titulo: "Solidariedade que aquece",
      descricao:
        "Arrecadação de roupas e cobertores limpos e em boas " +
        "condições para pessoas que precisam de proteção " +
        "durante os períodos de frio."
    },
    {
      titulo: "Apoio financeiro aos projetos",
      descricao:
        "As contribuições financeiras ajudam na compra de materiais " +
        "e no transporte das doações. Entre em contato para conhecer " +
        "os meios de contribuição e a prestação de contas."
    }
  ];
  const fragmento = document.createDocumentFragment();
  campanhas.forEach(campanha => {
    const cartao = template.content.cloneNode(true);
    cartao.querySelector("h3").textContent = campanha.titulo;
    cartao.querySelector("p").textContent = campanha.descricao;
    fragmento.appendChild(cartao);
  });
  lista.replaceChildren(fragmento);
  lista.dataset.iniciado = "true";
}

}
