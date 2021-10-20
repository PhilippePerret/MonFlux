'use strict';
/**
 * Classe TaskContainer
 * 
 * Pour gérer les container de tâches
 * 
 */


class TaskContainer {

  static get all(){
    return [
        new this(0)
      , new this(1)
      , new this(2)
    ]
  }

constructor(id){
  this.id = id
}

/**
 * Méthode appelée quand on clique sur le bouton pour ajouter une
 * tâche à la liste
**/
onClickAddButton(e){
  const dataTask = {
      id: Tasks.getNextId()
    , state: this.id == 2 ? 1 : 0
    , container: this.id
    , date: Jour.todayAsYYMMDD
    , content: "Nouveau tâche"
    , group: 'divers'
    , tasks: []
    , files: []
    ,
  }
  // console.log("Données de la nouveau tâche", dataTask)
  const itask = new Task(dataTask)
  itask.jour      = Jour.getByJour(dataTask.date)
  itask.groupday  = GroupDay.get(dataTask.date, dataTask.group)
  this.addTask(itask)
  itask.edit()
  return stopEvent(e)
}

  dimensionne(){
    this.obj.style.height = px(window.innerHeight - 40)
  }

  prepare(){
    this.dimensionne()
    this.prepareFooter()
    this.observe()
  }

observe(){
  this.addButton.addEventListener('click', this.onClickAddButton.bind(this))
}
/**
 * Pour mettre les boutons dans chaque footer
 */
prepareFooter(){
  this.addButton = DCreate('a', {text: '➕'})
  this.footer.appendChild(this.addButton)
}

// @return le pied de page (avec les boutons)
get footer(){return this._footer || (this._footer = DGet('div.container_footer', this.obj))}

/**
 * Ajoute la tâche +task+ (instance Task) au container
 * 
 * On positionne toujours la tâche après une tâche de temps inférieur
 * Si c'est une tâche historique, on s'assure également que son jour
 * soit affiché.
 * Noter que pour aboutir au classement correct, les tâches sont mises
 * à l'heure 1:00:00 de leur jour et les jours à l'heure 12:00:00
 * Sinon, les jours se retrouveraient après leurs tâches puisque 
 * l'ordre présenté est inversé.
 * 
 */
addTask(task){
  // console.log("Ajout de la tâche", task)
  if ( task.isHistorique ) { 
    this.ensureJourOfTaskExiste(task)
  }
  this.ensureGroupOfTaskExists(task)
  this.placeElementInHistorique(task)
}

/**
 * Méthode qui s'assure que le jour +jour+ ("AA/MM/JJ") existe bien
 * dans le container historique
 */
ensureJourOfTaskExiste(task){
  const jour = task.date
  if ( DGet(`div.jour[data-jour="${jour}"]`, this.taskContainer) ){
    // console.log("Le jour %s existe déjà", jour )
    task.jour = Jour.getByJour(jour)
  } else {
    // console.log("Ajout du JOUR ", jour)
    const ijour = new Jour(jour)
    task.jour = ijour
    this.placeElementInHistorique(ijour)
  }
}

/**
 * Méthode qui s'assure que le groupe de la tâche +task+ existe bien
 * dans le container historique
 * 
 */
ensureGroupOfTaskExists(task){
  // console.log("Assurer le groupe de la tâche : ", task)
  if (DGet(`div.group[data-jour="${task.date}"][data-group="${task.group}"]`, this.taskContainer)){
    // console.log("Le groupe '%s' existe pour le jour %s", task.group, task.date)
    task.groupday = GroupDay.get(task.date, task.group)
  } else {
    const igroupday = new GroupDay(task.group, task.jour)
    task.groupday = igroupday
    this.placeElementInHistorique(igroupday)
    // console.log("Ajout du groupe-jour", igroupday)
  }
}

/**
 * C'est le cœur du classement des tâches, des jours et des titres 
 * dans la colonne historique.
 * 
 */
placeElementInHistorique(foo){
  // console.log("Time de la CHOSE à placer :", foo.time)

  var placed = false
  this.getAllDivTasksOrDays().forEach( div => {
    if ( placed ) return ; // pour accélérer 
    const divtime = Number(div.getAttribute('data-time'))
    // console.log("Time du jour/tâche comparé : ", divtime)
    if (foo.time > divtime) {
      // console.log("Le time de la CHOSE est inférieur => on la place avant le jour/tâche comparé")
      this.taskContainer.insertBefore(foo.obj, div)
      placed = true
    }
  })

  if ( !placed ) {
    // console.log("CHOSE placée au bout")
    this.taskContainer.appendChild(foo.obj)
  }

}

getAllDivTasksOrDays(){
  return this.obj.querySelectorAll('div.tasks > .task, div.tasks > .jour')
}
getAllDivTasks(){
  return this.obj.querySelectorAll('div.tasks > .task')
}
getAllDivDays(){
  return this.obj.querySelectorAll('div.tasks > .jour') 
}


get obj(){
  return this._obj || (this._obj = DGet(`section#${this.name}`))
}
get name(){
  return this._name || (this._name = ['sans_echeances','current','historique'][this.id])
}
get taskContainer(){
  return this._tcont || (this._tcont = DGet('div.tasks', this.obj))
}
}
