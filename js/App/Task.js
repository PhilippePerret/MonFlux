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
    this.obj = DCreate('DIV', {id: this.domId, class:'task', 'data-time':this.time})
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
// Retourne true si c'est une tâche dans l'historique
get isHistorique(){
  console.log("this.container_id = ", this.container_id)
  return this.container_id == 2
}
// La date comme date
get dateAsDate(){
  return this._dasd || (this._dasd = this.getDate())
}
// Les microsecondes
get time(){
  return this._time || (this._time = parseInt(this.dateAsDate.getTime()/10000,10))
}
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
get date(){return this._date || (this._date = this.data['date'])}
set date(v){
  this._date = this.data['date'] = v
  this._time = null
  this._dasd = null
  this.obj.setAttribute('data-time', this.time)
}
get container_id(){return this._container_id || (this._container_id = this.data['container'])}
set container_id(v){this._container_id = this.data['container'] = v}



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

getDate(){
  var [annee, mois, jour] = this.date.split('/')
  annee = Number('20' + annee)
  return new Date(annee, Number(mois) - 1, Number(jour), 1, 0, 0)
}
}// class Task
