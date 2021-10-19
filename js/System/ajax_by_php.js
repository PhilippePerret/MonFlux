/**
* @module ajax_by_php.js
*
* @version 1.0

Ce script permet de travailler avec la côté serveur par le biais de
PHP avec jQuery.
Le principe de base est simple : on met les données à envoyer dans
un formulaire qu'on soumet.

Requis
------
• Le script 'ajax_by_php.php' placé à la racine du site
• un dossier 'ajax/scripts' contenant les scripts ruby à jouer
• tous ces scripts doivent retourner une donnée JSON en string
  (obtenue par exemple à l'aide de .to_json)
  C'est cette donnée qui est reçue par le 'then'


Usage
-----

  // script : nom du script dans le dossier ajax/scripts
  ajax({script:"...", <autres data>})
    .then(retour => {
      //... travail avec le retour ...
    })


Forme générale d'un script
--------------------------
«««««««««««««««««««««««««««««««««««
#!/usr/bin/env ruby
# encoding: UTF-8
require 'json'

# Les données transmises
data = JSON.parse(ARGV[0])

retour = {
  task_type: data['type'],
  argument: data
}

puts retour.to_json
»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»

**/

function ajax(data){

  return new Promise((ok, ko) => {
    // console.log("data : ", data)
    $('#ajax_script').val(data['script'])
    delete data.script
    $('#ajax_data').val(JSON.stringify(data))
    const form = $('#ajax_form').ajaxSubmit({url:'ajax_by_php.php', type:'post'})
    var xhr = form.data('jqxhr');
    xhr.done(function(ret) {
      // console.log("Retour ajax", ret) // pour le débug
      var retour_json = JSON.parse(ret)
      ok(retour_json.resultat)
    });
  })

}
