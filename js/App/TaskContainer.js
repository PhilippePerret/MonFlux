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
    , content: "Nouvelle tâche"
    , group: 'divers'
    , tasks:  []
    , files:  []
    , new:    true
    ,
  }
  // console.log("Données de la nouveau tâche", dataTask)
  const itask = new Task(dataTask)
  this.insertTask(itask)
  itask.edit()
  Tasks.add(itask) // pour la récupérer avec Tasks.get (ou Task.get)
  return stopEvent(e)
}

dimensionne(){
  this.obj.style.height = px(window.innerHeight - 3)
  this.tasksList.style.maxHeight = px(window.innerHeight - 83)
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
 * 
 * Ajoute la tâche +task+ (instance Task) au container
 * ---------------------------------------------------
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
insertTask(task){
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
 * Placement de la tâche dans l'historique
 * ---------------------------------------
 * Note : ça ne concerne pas les sous-tâches.
 * 
 * C'est le cœur du classement des tâches, des jours et des titres 
 * dans la colonne historique.
 * 
 * On va procéder de cette manière :
 * 
 *  1)  On cherche le jour de la tâche. Tant qu'il n'est pas trouvé,
 *      on passe à l'élément suivant.
 *  2)  Une fois le jour trouvé, on cherche le groupe trouvé. Tant
 *      qu'il n'est pas trouvé, on passe à l'élément suivant.
 *      Quand il est trouvé, on place la tâche après (peu importe 
 *      l'ordre, ici)
 */
placeElementInHistorique(foo){
  if ( foo.isTask ) {
    this.placeTaskInHistorique(foo)
  } else if ( foo.isJour ) {
    this.placeJourInHistorique(foo)
  } else if ( foo.isGroupDay ) {
    this.placeGroupDayInHistorique(foo)
  }
}
placeTaskInHistorique(task){
  const debug = false ; //task.id == '0051'
  debug && console.log("Placement de la tâche 51")
  debug && console.log("Temps de la tâche : ", String(task.time))
  // console.log("Time de la CHOSE à placer :", task.time)
  var isPlaced          = false
  var thisIsDayOfTask   = false
  var thisIsGroupOfTask = false
  this.getAllDivTasksOrDays().forEach( div => {
    if ( isPlaced ) return ; // pour accélérer
    // 
    // Est-ce qu'on a trouvé le jour de la tâche ?
    // 
    if ( thisIsDayOfTask ) {
      // 
      // Le jour de la tâche a été trouvé, on essaie de trouver son
      // groupe
      // 
      if ( div.classList.contains('group') ) {
        // <= C'est un groupe
        var divgroup = div.getAttribute('data-group')
        if ( divgroup == task.group ) {
          // 
          // C'EST LE GROUPE DU JOUR DE LA TÂCHE 
          // => On peut la placer après
          // 
          this.tasksList.insertBefore(task.obj, div.nextSibling)
          isPlaced = true
        }
      }
    } else {
      // 
      // Le jour de la tâche n'a pas été trouvé, on le cherche
      // 
      if ( div.classList.contains('jour') ) {
        var divjour = div.getAttribute('data-jour')
        // <= C'est un jour
        thisIsDayOfTask = divjour == task.date
      }
    }
  })

  if ( !isPlaced ) {
    // console.log("CHOSE placée au bout")
    this.tasksList.appendChild(task.obj)
  }
}

/**
 * Placement du jour dans l'historique
 * 
 * On doit le placer avant un jour qui serait plus tard
 */
placeJourInHistorique(jour){
  const divJours = this.getAllDivDaysInHistorique()
  const jourtime = jour.time
  var isPlaced = false
  divJours.forEach(divday => {
    if ( isPlaced ) return ;
    const daytime = Number(divday.getAttribute('data-time'))
    if ( daytime < jourtime ) {
      this.tasksList.insertBefore(jour.obj, divday)
      isPlaced = true
    }
  })
  if ( !isPlaced ) {
    this.tasksList.appendChild(jour.obj)
  }
}
/**
 * Placement d'un groupe dans l'historique
 * 
 * On doit trouver son jour et le mettre juste après
 */
placeGroupDayInHistorique(group){
  const debug = false
  debug && console.log(">> Placement du group ", group)
  const divJours = this.getAllDivDaysInHistorique()
  const groupjour = group.jour.yymmdd
  debug && console.log(">> Son jour cherché : ", groupjour)
  var isPlaced = false
  divJours.forEach(divday => {
    if ( isPlaced ) return ; 
    const dayjour = divday.getAttribute('data-jour')
    debug && console.log(">> Comparaison avec jour : ", dayjour)
    if ( groupjour == dayjour) {
      debug && console.log(">> C'est le bon jour, on place le groupe")
      this.tasksList.insertBefore(group.obj, divday.nextSibling)
      isPlaced = true
    }
  })
  if ( !isPlaced ) {
    debug && console.log(">> Le bon jour n'a pas été trouvé… (ça ne devrait pas arriver)")
    this.tasksList.appendChild(group.obj)
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
        this.tasksList.insertBefore(foo.obj, div.nextSibling)
        placed = true
      }
    })
  }

  if ( !placed ) {
    // console.log("CHOSE placée au bout")
    this.tasksList.appendChild(foo.obj)
  }
}

getAllDivTasksOrDays(){
  return document.querySelectorAll(`section#${this.name} > div.tasks > .task, section#${this.name} > div.tasks > .group, section#${this.name} > div.tasks > .jour`)
  // return this.obj.querySelectorAll('div.tasks > .task, div.tasks > .jour')
}
getAllDivTasksOrGroup(){
  return document.querySelectorAll(`section#${this.name} > div.tasks > .task, section#${this.name} > div.tasks > .group`)
  // return this.obj.querySelectorAll('div.tasks > .task, div.tasks > .group')
}
getAllDivDaysInHistorique(){
  return document.querySelectorAll(`section#historique > div.tasks > .jour`)
}

/**
 * @return l'objet DOM du container
 */
get obj(){
  return this._obj || (this._obj = DGet(`section#${this.name}`))
}

get name(){
  return this._name || (this._name = ['sans_echeances','current','historique'][this.id])
}
get tasksList(){
  return this._tcont || (this._tcont = DGet('div.tasks', this.obj))
}

} // class TaskContainer
