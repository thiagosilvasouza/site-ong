const chave = "maos-solidarias-preferencia";
const opcoes = ["voluntariado", "doacao", "ambos"];

export function recuperarPreferencia() {
  try {
    const dados = JSON.parse(localStorage.getItem(chave) || "null");
    return dados && opcoes.includes(dados.interesse) ? dados.interesse : "";
  } catch (erro) {
    console.warn("Não foi possível recuperar a preferência.", erro);
    return "";
  }
}

export function salvarPreferencia(interesse) {
  try {
    if (opcoes.includes(interesse)) {
      localStorage.setItem(chave, JSON.stringify({ interesse }));
    } else {
      localStorage.removeItem(chave);
    }
    return true;
  } catch (erro) {
    console.warn("Não foi possível salvar a preferência.", erro);
    return false;
  }
}
