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

    ajax({script:"load_task.rb", type:'current'})
      .then(ret => {
        console.log("Le retour d'ajax : ", ret)
      })

  }

}
