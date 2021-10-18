'use strict';
/**
 * Classe Tasks
 * 
 * Pour gérer les tâches comme un ensemble. C'est ici par exemple
 * qu'on les charge et qu'on les affiche.
 * 
 * Sinon, en qualité d'instance, c'est la propriété :tasks des
 * TaskContainer.
 * 
 * 
 **/
class Tasks {

  static load_and_display(){
    ajax({code: "say 'bonjour, Phil !'"})
      .then(ret => {
        console.log("Je reviens avec ", ret)
      })
  }

}
