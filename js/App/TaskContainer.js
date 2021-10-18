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
      , new this('courantes')
      , new this('historique')
    ]
  }

  constructor(id){
    this.id = id
  }

  dimensionne(){
    this.obj.style.height = px(window.innerHeight - 40)
  }


  get obj(){
    return this._obj || (this._obj = document.querySelector(`section#${this.id}`))
  }
}
