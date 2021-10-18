/**
  * @module ajax.js
  *
  * @version 4.1
  *
  * Dépendances
  *   * Nécessite l'objet Flash pour l'affichage des messages d'erreur
  *     Doit obligatoirement retourner false (requête abandonnée) ou true
  *
  * Usage
  *
  *     ajax({<data>})
  *       .then(function(rajax){
  *         ... traitement du retour ...
  *       })
  *
  */
window.Ajax = {
	// url: 			'./ajax.rb',
  url:      './ajax.php',
  //onreturn:	null,

	// Message dans le flash pendant l'opération ajax
	// Le mettre à null pour ne pas l'afficher ou le redéfinir par
	// le message propre à l'opération, grâce à :
	// Ajax.message_on_operation = "<le message opération>";
	// message_on_operation: "Opération ajax en cours…",
	message_on_operation: null,

  /**
    * Procéder à une requête ajax
    * Cf. la section Ajax dans le manuel
    * @method send
    * @param  {Hash}      data      Données à transmettre au programme serveur
    * @param  {Function}  onreturn  Méthode pour suivre
    */
  send:function( data, ok, ko ){
    if(this.before_send(data) == false) ko() ;
    data.ajx = 1 ;
    // this.onreturn = data.onreturn ;
    // delete data.onreturn ;
    if (data.url){this.url = data.url; delete data.url}
		if (data.message_on_operation != undefined){
			this.message_on_operation = data.message_on_operation ;
			delete data.message_on_operation ;
		}
		// Note : Même si le message est défini ci-dessus, il peut avoir
		// été mis à null par la méthode appelante. Il faut donc faire le
		// test ci-dessous.
		// Flash.clear('Ajax.send');
		// if (this.message_on_operation){
		// 	Flash.show(this.message_on_operation)
		// }
    this.ok = ok ;
    this.ko = ko ;
    this.proceed_send_json(data); // version sans jQuery
  },

  /**
    * Méthode propre à l'application pour vérfier les données ou les modifier
    * @method before_send
    * @param  {Object} data Les données envoyées à send
    * @return {Boolean} True si la requête peut se faire, false otherwise
    */
  before_send:function(data)
  {
    return true;
  },

  // Méthode qui procède à la soumission de la requête ajax
  // sans jQuery
  proceed_send_json: function(hdata)
  {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', this.url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
      if (xhr.status === 200) {
        console.log("xhr = ", xhr)
        var newhdata = JSON.parse(xhr.responseText);
        if (newhdata.error){
          console.error(newhdata.error.message);
          Ajax.ko()
        } else {
          Ajax.ok(newhdata);
        }
      }
      else if (xhr.status !== 200){
        Ajax.ko(Error(xhr.statusText));
      }
    };
		if ( hdata.file_contents ){
			// // Je transforme un peu , pour essayer de passer
			// hdata.file_contents = hdata.file_contents
			// 	.replace(/\=/g, '\n')
			// 	.replace(/\&/g, '\&')
		}
		try {
			// encodeURIComponent est ici nécessaire pour transformer par exemple
			// les caractères '&' et '='. Notez que encodeURI ne traite pas ces
			// caractères-là.
			const xhrData = encodeURIComponent(JSON.stringify(hdata))
      console.log("xhrData = ", xhrData)
			xhr.send(xhrData);
		} catch (err) {
			console.error("ERREUR AVEC LE TABLEAU SUIVANT : ", err)
			console.log("--- hadata: ", hdata)

		}
  }

}


//window.ajax = Ajax.send.bind(Ajax);
window.ajax = function(data){
  return new Promise(function(ok,ko){
    //Ajax.send.call(Ajax, ok, ko);
    Ajax.send.bind(Ajax)(data, ok, ko);
  })
}
