(function(){
  /**
   * Components to our editor
   */
  const htmlField = document.getElementById("html");
  const cssField = document.getElementById("css");
  const jsField = document.getElementById("js");
  const preview = document.getElementById("preview");

  /**
   * Method that gets the values from the textareas
   * and insert to an iframe
   */
  function render() {
    let iframeComponent = preview.contentWindow.document;

    iframeComponent.open();
    iframeComponent.writeln(`
      ${htmlField.innerText}
      <style>${cssField.innerText}</style>
      <script>${jsField.innerText}</script>`);
    iframeComponent.close();
  }

  /**
   * Create listener to call the render
   * always after a keypress.
   */
  function compile() {
    document.addEventListener('keyup', function() {
      render();
    });
  };

  /**
   * Create the listener
   * and render the first values
   */
  compile();
  render();
})();


const W3C_HTML_VALIDATOR = "https://validator.w3.org/nu/?out=json";
const consoleView = document.getElementById("msg-console");

const CLAAT = "claat.php";

function dealError(data) {
  if(data == null) return;

  errors = JSON.parse(data);
  errors = errors["messages"];

  let contError = 0;
  let contWarning = 0;
  let contInfo = 0;

  let output = [];

  for (let i = 0; i < errors.length; i++) {
    const element = errors[i];
    //console.log(element);
    output.push('<p class="msg-' + element.type + '">' + element.type + ': ' + element.message + ' na linha ' + element.lastLine);

    switch (element.type) {
      case "error":
        contError++;
        break;
      case "warning":
        contWarning++;
        break;
      default:
        contInfo++;
        break;
    }
  }

  totalErros = contError * 0.3;
  totalWarning = contWarning * 0.1;
  notaSugeridaConta = 5 - (totalErros + totalWarning);

  let contadorView = "<p>Totais: erros(" + contError + "), warning(" + contWarning + "), info(" + contInfo + ") </p>";
  let notaSugerida = "<p>Nota sugerida: " + notaSugeridaConta;

  consoleView.innerHTML = notaSugerida + contadorView + output.join("");
}


function getCode() {
  let iframeHTML = document.getElementById("html")
  let conteudo = iframeHTML.innerText;
  
  doPost(W3C_HTML_VALIDATOR, conteudo, dealError);
}

function claat() {
  let iframeHTML = document.getElementById("html")
  let conteudo = iframeHTML.innerText;
  
  doPost(CLAAT, conteudo, handleClaatData);
}

function handleClaatData(data) {
  if(data == null) return;

  console.log(data);
}

function doPost(url, data, callback) {
  // Exemplo de requisição POST
  var ajax = new XMLHttpRequest();

  // Seta tipo de requisição: Post e a URL da API
  ajax.open("POST", url, true);
  ajax.setRequestHeader("Content-type", "text/html; charset=utf-8");

  // Seta paramêtros da requisição e envia a requisição
  ajax.send(data);
  //ajax.send(data);

  // Cria um evento para receber o retorno.
  ajax.onreadystatechange = function() {
    
    // Caso o state seja 4 e o http.status for 200, é porque a requisiçõe deu certo.
    if (ajax.readyState == 4 && ajax.status == 200) {
      
      var data = ajax.responseText;
      
      // Retorno do Ajax
      callback(data);
    }
  }
}


