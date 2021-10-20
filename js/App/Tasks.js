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
      var taches = ret.tasks.map(dtache => {
        // 
        // De façon automatique, si une tâche n'a pas été exécutée,
        // elle est mise à aujourd'hui (si elle est dans l'historique)
        //
        if ( dtache.container == 2 && dtache.state == 1 ) {
          dtache['date'] = Jour.todayAsYYMMDD
        }
        return new Task(dtache)
      })
      this.display_all_tasks.call(this, taches)
    })

  }

  /**
   * Affichage de toutes les tâches
   * +taches+ Liste des instances Task des tâches
   */
  static display_all_tasks(taches){
    // console.log("Tâches à afficher : ", taches)
    taches.forEach(tache => {
      tache.addInContainer() 
    })
  }


static get containerSansEcheances(){
  return this._contsanseche || (this._contsanseche = new TaskContainer('sans_echeances'))
}
static get containerCurrent(){
  return this._contcurrent || (this._contcurrent = new TaskContainer('current'))
}
static get containerHistorique(){
  return this._conthistorique || (this._conthistorique = new TaskContainer('historique'))
}

}
