const fs = require("node:fs/promises");
const path = require("node:path");
const esbuild = require("esbuild");
const CleanCSS = require("clean-css");
const { minify } = require("html-minifier-terser");

const raiz = __dirname;
const destino = path.join(raiz, "dist");

async function gerarBuild() {
  // Limpa somente a pasta destinada à versão de produção.
  await fs.rm(destino, { recursive: true, force: true });

  for (const pasta of ["html", "css", "js"]) {
    await fs.mkdir(path.join(destino, pasta), {
      recursive: true
    });
  }

  // Agrupa os módulos importados pela SPA e minifica o JS.
  await esbuild.build({
    entryPoints: [path.join(raiz, "js", "spa.js")],
    outfile: path.join(destino, "js", "spa.js"),
    bundle: true,
    minify: true,
    format: "esm",
    platform: "browser",
    target: "es2020",
    legalComments: "none"
  });

  // O menu continua sendo carregado como script independente.
  await esbuild.build({
    entryPoints: [path.join(raiz, "js", "menu.js")],
    outfile: path.join(destino, "js", "menu.js"),
    bundle: true,
    minify: true,
    format: "iife",
    platform: "browser",
    target: "es2020",
    legalComments: "none"
  });

  // Minifica o CSS.
  const cssOriginal = await fs.readFile(
    path.join(raiz, "css", "style.css"),
    "utf8"
  );

  const cssMinificado = new CleanCSS({
    level: 1,
    rebase: false
  }).minify(cssOriginal);

  if (cssMinificado.errors.length) {
    throw new Error(cssMinificado.errors.join("\n"));
  }

  for (const aviso of cssMinificado.warnings) {
    console.warn(aviso);
  }

  await fs.writeFile(
    path.join(destino, "css", "style.css"),
    cssMinificado.styles
  );

  // Mantém as três páginas para o carregamento via fetch.
  const paginas = [
    "index.html",
    "projetos.html",
    "cadastro.html"
  ];

  for (const pagina of paginas) {
    const original = await fs.readFile(
      path.join(raiz, "html", pagina),
      "utf8"
    );

    const htmlMinificado = await minify(original, {
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true,
      removeOptionalTags: false
    });

    await fs.writeFile(
      path.join(destino, "html", pagina),
      htmlMinificado
    );
  }

  // Copia os recursos visuais preservando seus nomes.
  await fs.cp(
    path.join(raiz, "imagens"),
    path.join(destino, "imagens"),
    { recursive: true }
  );

  console.log("Build concluída! Arquivos gerados em dist.");
}

gerarBuild().catch(erro => {
  console.error("Falha na build:", erro);
  process.exitCode = 1;
});