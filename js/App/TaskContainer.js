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

  addTask(task){
    this.taskContainer.append(task.obj)
  }


  get obj(){
    return this._obj || (this._obj = DGet(`section#${this.id}`))
  }
  get taskContainer(){
    return this._tcont || (this._tcont = DGet('div.tasks', this.obj))
  }
}
