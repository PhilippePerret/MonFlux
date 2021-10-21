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
 * --- Méthodes d'action --- 
**/

save(){
  ajax({script:'save_task.rb', data: this.data})
  .then(ret => {
    console.info("Tâche sauvée avec ses nouvelles données", this)
  })
}

edit(){
  TaskEditor.edit(this)
}

/**
 * Actualisation des données de la tâche 
 * (avec les données renvoyées par l'éditeur de tâche)
 * 
 */
update(newData){
  Object.keys(newData).forEach(key => {
    this[key] = newData[key]
  })
  this.save()
}

/**
 * Méthode principale appelée pour construire et placer la
 * tâche.
 * Il faut commencer par elle et non pas par build_and_observe
 * car la méthode build() a besoin de connaitre le :time de la
 * tâche, et ce time est dépendant du jour et du groupe auxquels
 * appartient la tâche. Et ce jour (Jour) et ce groupe ({GroupDay})
 * sont définis dans les méthodes de TaskContainer.
 * 
**/
addInContainer(){
  this.container.addTask(this) 
}

/**
 * Démarrage : initialisation de la tâche
 */
initialize(){
  Group.get(this.group) // Pour créer l'instance si elle n'existe pas
  this.setTodayIfUndone()
  this.defineLastTaskId()
}
/**
 * Démarrage : si c'est une tâche dans l'historique et qu'elle n'a pas été
 * exécutée, on met son jour à aujourd'hui
 * 
 * Attention : ici, la tâche n'est pas encore affichée
 */
setTodayIfUndone(){
  if ( this.state < 2 && this.container_id == 2){
    this._date = this.data['date'] = Jour.todayAsYYMMDD
  }
}
/**
 * Démarrage : si l'ID est plus grand que le dernier identifiant
 * trouvé, on l'actualise
**/
defineLastTaskId(){
  var lid = parseInt(this.id,10);
  if ( lid > Tasks.lastId ) Tasks.lastId = lid ;
}

/**
 * Construction et surveillance de la tâche
 */
build_and_observe(){
  this.build()
  this.observe()
  return this._obj
}
build(){
  var o ;
  const obj = DCreate('DIV', {id: this.domId, class:'task', 'data-time':this.time})
  
  // Boite des boutons
  var toolbox = DCreate('DIV', {class:'tools fright'})
  o = DCreate('a', {class:'btn done_btn', text:this.isDone?'refaire':'OK'})
  toolbox.appendChild(o)
  o = DCreate('a', {class:'btn kill_btn', text:'❌'})
  toolbox.appendChild(o)
  obj.appendChild(toolbox)
  
  o = DCreate('SPAN', {class:'content', text:this.content})
  obj.appendChild(o)
  this._obj = obj
}

observe(){
  this.setEtat()
  this.doneButton.addEventListener('click', this.onToggleDone.bind(this))
  this.killButton.addEventListener('click', this.onKillTask.bind(this))
}

/**
 * Définit l'état visuellement (fait/à faire)
**/
setEtat(){
  var btnName ;
  if ( this.isDone ){
    this.obj.classList.add('done')
    btnName = 'refaire'
  } else {
    this.obj.classList.remove('done')
    btnName = 'ok'
  }
  this.doneButton.innerHTML = btnName
}

get doneButton(){
  return this._btndone || (this._btndone = DGet('.done_btn', this.obj))
}
get killButton(){
  return this._btnkill || (this._btnkill = DGet('.kill_btn', this.obj))
}



/**
 * --- Méthode d'observation des évènement ---
**/


onToggleDone(e){
  this.state = this.isDone ? 1 : 2
  this.save()
  return stopEvent(e)
}

// Quand on clique sur le bouton "x" de la tâche, pour la supprimer
onKillTask(e){
  console.info("Je dois détruire la tâche (je ne sais pas encore le faire")
  return stopEvent(e)
}

/**
 * --- Propriétés volatiles ---
 **/

/** 
 * Le GroupDay de la tâche. Ne sert que pour l'historique, où le
 * le "group-day" est la marque du groupe de la tâche dans un 
 * jour particulier.
 * Ce group-day n'existe pas pour les tâches hors de l'historique
 */
get groupday(){
  return this._groupday || (this._groupday = GroupDay.get(this.group, this.jour))
}

// Retourne true si c'est une tâche dans l'historique
get isHistorique(){
  return this.container_id == 2
}
// Retourne true si la tâche est faite
get isDone(){
  return this.state == 2
}

// Le jour ({Jour}) de la tâche
get jour() { return this._jour || Jour.getByJour(this.date)}
set jour(v){ this._jour = v }
// La date comme date
get dateAsDate(){
  return this._dasd || (this._dasd = this.getDate())
}
// Les microsecondes
get time(){
  return this._time || (this._time = this.getTime())
}
get obj(){
  return this._obj || (this._obj = this.build_and_observe() )
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
get group(){return this._group || (this._group = (this.data['group']||'divers') ) }
set group(v){this._group = this.data['group'] = v}
get files(){return this._files || (this._files = (this.data['files']||[]) ) }
set files(v){this._files = this.data['files'] = v}
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
get state(){return this._state || (this._state = this.data['state'])}
set state(v){
  this._state = this.data['state'] = v
  this.setEtat()
}


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
  // var [annee, mois, jour] = this.date.split('/')
  // annee = Number('20' + annee)
  // return new Date(annee, Number(mois) - 1, Number(jour), 0, 0, 0)

  var d = new Date()
  d.setTime(this.groupday.date.getTime() - 1000)
  return d
}
getTime(){
  return parseInt(this.dateAsDate.getTime()/10000,10)
}
}// class Task
