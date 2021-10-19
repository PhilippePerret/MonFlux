'use strict';
/**
 * Classe Task
 * 
 * La tâche (Task) est l'élément de base du programme.
 * 
 * 
 **/
class Task {
  constructor(data){
    this.data = data
  }

  /**
   * Construction et surveillance de la tâche
   */
  build_and_observe(){
    this.build()
    this.observe()
  }
  build(){
    var o ;
    this.obj = DCreate('DIV', {id: this.domId, class:'task'})
    o = DCreate('DIV', {class:'content', text:this.content})
    this.obj.appendChild(o)

    this.container.addTask(this)
  }
  observe(){
    console.log("Je dois observer", this)
  }


/**
 * --- Propriétés volatiles ---
 **/
  get container(){
    return this._container || (this._container = this.defineContainer())
  }
  get domId(){
    return this._domid || (this._domid = `task-${this.id}`)
  }
  // Le champ contenant le texte de la tâche
  get contentField(){
    return this._contentfield || (this._contentfield = DGet('.content', this.obj))
  }

/**
 * --- Propriété enregistrées ---
 */

get id(){return this._id || (this._id = this.data['id']) }
set id(v){this._id = this.data['id'] = v}
get content(){return this._content || (this._content = this.data['content'])}
set content(v){
  this._content = this.data['content'] = v
  this.contentField.innerHTML = v
}
get container_id(){return this._container || (this._container = this.data['container'])}
set container_id(v){this._container = this.data['container'] = v}



/**
 * === private methods ===
*/

defineContainer(){
  switch(this.container_id){
    case 0: return Tasks.containerSansEcheances;
    case 1: return Tasks.containerCurrent;
    case 2: return Tasks.containerHistorique;
  }
}

}// class Task
