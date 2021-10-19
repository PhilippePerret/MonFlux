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
        new this('sans_echeances')
      , new this('current')
      , new this('historique')
    ]
  }

  constructor(id){
    this.id = id
  }

  dimensionne(){
    this.obj.style.height = px(window.innerHeight - 40)
  }

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
  console.log("Ajout de la tâche", task.obj)
  if ( task.isHistorique ) { this.ensureJourExiste(task.date) }
  const alldivs = this.getAllDivTasksOrDays()
  const nombre  = alldivs.length
  var taskAfter = null;
  for ( var i = 0; i < nombre; ++i){
    const divtask = alldivs[i]
    console.log("Test de ", divtask)
    const divtime = Number(divtask.getAttribute('data-time'))
    const divTimeIsAfter = divtime < task.time
    console.log("i: %i / Est-ce que le temps du div courant (%i) est après la tâche à placer (%i) ? %s", i, divtime, task.time, divTimeIsAfter ? "oui" : "non")
    if ( divTimeIsAfter ){
      taskAfter = divtask
      break
    }
  } 
  if (taskAfter){
    this.taskContainer.insertBefore(task.obj, taskAfter)
  } else {
    this.taskContainer.append(task.obj)  
  }
}

/**
 * Méthode qui s'assure que le jour +jour+ ("AA/MM/JJ") existe bien
 * dans le container historique
 */
ensureJourExiste(jour){
  if ( DGet(`div.jour[data-jour="${jour}"]`, this.taskContainer) ){
    console.log("Le jour %s existe déjà", jour )
  } else {
    const ijour = new Jour(jour)
    const div_tasks = this.getAllDivTasks()
    const nombre_tasks = div_tasks.length
    var task_found = null
    for(var i = 0; i < nombre_tasks ; ++i){
      var task = div_tasks[i]
      if ( Number(task.getAttribute('data-time')) < ijour.time ){
        task_found = task
        break
      }
    }
    if ( task_found ) {
      this.taskContainer.insertBefore(ijour.obj, task_found)
    } else {
      this.taskContainer.append(ijour.obj)
    }
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
  return this._obj || (this._obj = DGet(`section#${this.id}`))
}
get taskContainer(){
  return this._tcont || (this._tcont = DGet('div.tasks', this.obj))
}
}
