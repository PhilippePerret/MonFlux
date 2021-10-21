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

/**
 * @return un ID pour une nouvelle tâche
 * 
**/
static getNextId(){
  this.lastId || (this.lastId = 0);
  return String(++ this.lastId).padStart(4,'0')
}

/**
 * Chargement et affichage des tâches enregistrées
 * 
 * La méthode est appelée au tout début du programme, lorsque 
 * l'interface a été préparée.
 * On commence par faire les instances :
 *  - tâches ({Task})
 *  - jour ({Jour})           Les jours de toutes les tâches
 *  - groupday ({GroupDay})   les catégories
 * 
**/
static load_and_display(){
  this.lastId = 0;
  ajax({script:"load_task.rb", type:'current'})
  .then(this.instancieAllTasks.bind(this))
  .then(this.displayAllTasks.bind(this))
  .catch(erreur)

}

static instancieAllTasks(ret){
  var taches = ret.tasks.map(dtache => {
    const tache = new Task(dtache)
    tache.initialize()
    return tache ; // map
  })
  return taches
}

static displayAllTasks(taches){
  // console.log("Tâches à afficher : ", taches)
  taches.forEach(tache => tache.addInContainer())
}



static get containerSansEcheances(){
  return this._contsanseche || (this._contsanseche = TaskContainer.sans_echeances)
}
static get containerCurrent(){
  return this._contcurrent || (this._contcurrent = TaskContainer.current)
}
static get containerHistorique(){
  return this._conthistorique || (this._conthistorique = TaskContainer.historique)
}

}
