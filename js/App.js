'use strict';

class AppClass {

  /**
   * Pour charger l'image définie en configuration
   */
  load_image(){
    const path = CONFIG.score_path
    if ( !path || path == ''){
      return alert("Il faut définir le chemin d'accès au fichier de la partition dans config.js")
    } else {
      UI.score.src = path
      UI.score.addEventListener('load', function(){
        //
        // Partition chargée, on peut commencer
        //
        App.start_decoupe()
      })
      UI.score.addEventListener('error', function(e){
        alert("Une erreur s'est produite pendant le chargement. Vérifier le chemin d'accès à la partition.")
      })
    }
  }

  /**
   * Pour commencer la découpe une fois que l'image est choisie
   * 
   * 
   */
  start_decoupe(){
    UI.score.addEventListener('dblclick', UI.onDoubleClickOnScore.bind(UI))
    UI.showInformation(PANNEAU_INFORMATION_DEPART)
  }

  /**
   * Confirme découpe
   * 
   * Dans cette méthode, on "surligne" les parties qui font produire
   * les systèmes (en indiquant leur) pour que l'utilisateur confirme
   * l'opération de découpe
   * 
   */
  confirmeDecoupe(){
    const lignes = UI.getTopsOfLignesCoupe()
    //console.log("Top des lignes : ", lignes)
    if ( lignes.length == 0 ) return error("Il faut placer au moins 2 lignes de découpe !");
    // Il faut qu'il y ait un nombre paire
    if ( 0 != ((lignes.length / 2) % 1)) {
      return error("Il doit obligatoirement y avoir un nombre paire de lignes (la ligne de début et la ligne de fin de chaque partie.");
    }

    let div;
    let data = {};
    let isysteme = UI.getNumberOfFirstSystem() - 1
    for (var i = 0; i < lignes.length ; i += 2){
      data.top    = lignes[i]
      data.bas    = lignes[1 + i]
      data.height = data.bas - data.top
      div = document.createElement('DIV')
      div.className = 'emporte_piece'
      div.style.top = px(data.top)
      div.style.height = px(data.height)
      document.body.appendChild(div)
      let span = document.createElement('SPAN')
      span.className = 'file_name'
      span.innerHTML = `systeme-${++isysteme}.jpg`
      div.appendChild(span)
    }

    // afficher le bouton pour confirmer
    UI.showBoutonsConfirmation()

    UI.showInformation(EXPLICATION_CONFIRMATION_DECOUPE)

  }

  /**
   * Pour renoncer à la découpe et ré-ajuster les lignes
   */
  renoncerDecoupe(){
    UI.hideBoutonsConfirmation()
    $('.emporte_piece').remove()
  }


  /**
   * 
   * Pour produire les lignes de coupe et le code
   * 
   */
  buildCodeDecoupe(confirmed){
    if ( ! confirmed ){ return this.confirmeDecoupe()}
    UI.showAction("Découpe des images en cours. Merci de patienter…")
    UI.hideBoutonsConfirmation()
    const lignes = UI.getTopsOfLignesCoupe()
    const source = CONFIG.score_path
    //console.log(lignes)
    var codes = []
    let isysteme = UI.getNumberOfFirstSystem() - 1
    var data = {source:source}
    for (var i = 0; i < lignes.length ; i += 2){
      data.top    = lignes[i]
      data.bas    = lignes[1 + i]
      data.height = data.bas - data.top
      data.dest   = `systeme-${++isysteme}.jpg`
      var code = "" + TEMP_CODE_DECOUPE
      ;['source','height','top','dest'].forEach(prop => {
        var regexp = new RegExp(`__${prop.toUpperCase()}__`)
        code = code.replace(regexp, data[prop])
      })
      codes.push(code)
    }
    codes = codes.join(";") + ' 2>&1'
    UI.codeField.value = codes
    const form = $('#form-code-decoupe').ajaxSubmit({url:'ajax.php', type:'post'})
    var xhr = form.data('jqxhr');

    xhr.done(function(ret) {
      console.log("Retour ajax", ret)
      message(CONFIRMATION_DECOUPE_EFFECTUED)
    });

  }

}
const App = new AppClass()

// Si requête ajax : /opt/homebrew/bin/convert
// const TEMP_CODE_DECOUPE = '/opt/homebrew/bin/convert /Users/philippeperret/Sites/ScoreCutting/__SOURCE__ -crop 0x__HEIGHT__+0+__TOP__ ./__DEST__ 2>&1'
const TEMP_CODE_DECOUPE = '/opt/homebrew/bin/convert __SOURCE__ -crop 0x__HEIGHT__+0+__TOP__ ./_systemes/__DEST__'



