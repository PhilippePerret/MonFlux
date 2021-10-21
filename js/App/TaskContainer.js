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
      this.sans_echeances
    , this.current
    , this.historique
  ]
}

/**
 * Pour obtenir le container des tâches historique à l'aide de :
 *  TaskContainer.historique
 */
static get historique(){
  return this._histo || (this._histo = new TaskContainer(2))
}
static get current(){
  return this._current || (this._current = new TaskContainer(1))
}
static get sans_echeances(){
  return this._sanseche || (this._sanseche = new TaskContainer(0))
}

/**
 * ============ INSTANCE ================
*/

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
    //
    // Cas des tâches dans l'historique
    //
    task.jour.isBuilt     || task.jour.build()
    task.groupday.isBuilt || task.groupday.build()
    this.placeElementInHistorique(task)
  } else {
    //
    // Cas des tâches hors historique
    //
    task.igroup.isBuiltIn(this) || task.igroup.buildIn(this)
    this.placeElementInContainer(task)
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

/**
 * Pour placer la marque du groupe ou la tâche dans les containers
 * autres que l'historique
 * 
 */
placeElementInContainer(foo){
  var placed = false
  if ( foo.isMarkGroup ) {
    // Rien à faire, il sera ajouté à la fin
  } else {
    this.getAllDivTasksOrGroup().forEach( div => {
      if ( placed ) return ; // pour accélérer 
      const divgroup = div.getAttribute('data-group')
      if (foo.group == divgroup) {
        this.taskContainer.insertBefore(foo.obj, div.nextSibling)
        placed = true
      }
    })
  }

  if ( !placed ) {
    // console.log("CHOSE placée au bout")
    this.taskContainer.appendChild(foo.obj)
  }
}

getAllDivTasksOrDays(){
  console.log("obj (container id %i) : ", this.id, this.obj)
  return this.obj.querySelectorAll('div.tasks > .task, div.tasks > .jour')
}
getAllDivTasksOrGroup(){
  return this.obj.querySelectorAll('div.tasks > .task, div.tasks > .group')
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
