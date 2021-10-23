'use strict';
/**
 * Classe Task
 * 
 * La tâche (Task) est l'élément de base du programme.
 * 
 * 
 **/
class Task {

static get EDITING_TASK_METHOD(){return this._editing_task}
static set EDITING_TASK_METHOD(v){this._editing_task = v}


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
    this.data['new'] = false
  })
}

destroy(){
  ajax({script:'destroy_task.rb', task_id: this.id})
  .then(ret => {
    this.obj.remove()
    console.info("Tâche détruite", this)
  })
  .catch(onError)
}

/**
 * Méthode d'édition ou autre
 * 
 */
edit(){
  TaskEditor.edit(this)
}

/**
 * Actualisation des données de la tâche 
 * (avec les données renvoyées par l'éditeur de tâche)
 * 
 */
update(newData){
  newData = this.checkNewContent(newData)
  // console.log("newData après vérification content :", newData)
  const groupHasChanged = newData.group != this.group
  
  //
  // Pour savoir s'il y a un changement
  //
  var hasChanged = false
  Object.keys(newData).forEach(key => {
    if ( this[key] != newData[key] ) hasChanged = true ;
    this[key] = newData[key]
  })
  hasChanged && this.save()

  //
  // Si le groupe a changé, il faut 1) voir si c'est un nouveau
  // groupe et 2) placer la tâche dans ce nouveau groupe
  //
  groupHasChanged && this.onGroupChanged()
}

/**
 * Méthode qui, après modification des données (et avant enregistre-
 * ment) vérifie le contenu pour voir si un nom de groupe n'a pas
 * été utilisé (mot seul en première ligne)
 *
 */ 
checkNewContent(newData){
  var newContent = newData.content
  if ( newContent != this.content ) {
    var lines = newContent.split("\n")
    if ( lines.length > 1 ) {
      const firstLine = lines.shift().trim()
      const mots = firstLine.split(' ')
      if ( mots.length == 1 ) { //=> Groupe (catégorie)
        //
        // Changement de contenu et de groupe
        //
        newData.group   = firstLine;
        newData.content = lines.join("\n")
      }
    }
  }
  return newData;
}

/**
 * Méthode appelée quand il y a changement de grouped
 * 
 * Note : ça peut être un nouveau groupe
 */
onGroupChanged(){
  this._igroup    = null
  this._groupday  = null
  this.addInContainer()
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
  if ( this.isSubTask ) {
    this.exitButton  = DCreate('a', {class:'exit_btn', text:' 📤', placeholder:'Pour sortir la tâche de son parent'})
  } else {  
    this.insertButton = DCreate('a', {class:'insert_btn', text:'📥', placeholder:'Pour insérer la tâche dans une autre tâche'})
    toolbox.appendChild(this.insertButton)
  }
  o = DCreate('a', {class:'btn kill_btn', text:'❌'})
  toolbox.appendChild(o)
  obj.appendChild(toolbox)
  
  this.contentField = DCreate('SPAN', {class:'content', text:this.formatedContent})
  obj.appendChild(this.contentField)
  this._obj = obj
}

observe(){
  this.setEtat()
  this.doneButton.addEventListener('click', this.onToggleDone.bind(this))
  this.killButton.addEventListener('click', this.onKillTask.bind(this))
  if ( this.isSubTask ) {
    this.exitButton.addEventListener('click', this.onClickExitButton.bind(this))
  } else {
    this.insertButton.addEventListener('click', this.onClickInsertButton.bind(this))
  }
  this.contentField.addEventListener('click', this.onClickContent.bind(this))
  this.observeText()
}

updateContent(){
  this.contentField.innerHTML = this.formatedContent
  this.observeText()
}

observeText(){
  this.obj.querySelectorAll('button.link_in_content').forEach(btn => {
    btn.addEventListener('click', LinkOpener.open.bind(LinkOpener, btn))
  })
}


/**
 * Définit l'état visuellement (fait/à faire)
**/
setEtat(){
  // console.log("-> setEtat", this)
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
 * --- Méthode d'observation des évènements ---
**/

/**
 * Méthode appelée quand on clique sur le bouton pour déplacer
 * la tâche dans une autre tâche
 */
onClickInsertButton(e){
  Task.EDITING_TASK_METHOD = this.insertInTask.bind(this)
  return stopEvent()
}
insertInTask(mainTask){
  Task.EDITING_TASK_METHOD = null
  console.info("Je dois apprendre à insérer la tâche… dans la tâche…", this, mainTask)
}

/**
 * Méthode appelée quand on clique sur le bouton pour sortir la tâche
 * de son parent.
 * 
 */
onClickExitButton(e){

  return stopEvent()
}

/**
 * Méthode appelée quand on clique sur le contenu de la tâche
 * En général, cela permet d'éditer la tâche. Mais une autre méthode
 * provisoire peut être utilisée. Par exemple, lorsqu'on doit insérer
 * une tâche dans une autre, clique sur le contenu permet de choisir
 * la tâche pour en faire la tâche parent. Dans ce cas, la méthode
 * d'édition est "by passée" pour être dirigée vers l'insertion de
 * tâche.
 * 
 */
onClickContent(e){
  if ( Task.EDITING_TASK_METHOD ) {
    Task.EDITING_TASK_METHOD.call(null, this)
  } else {
    this.edit()
  }
  return stopEvent(e)
}

onToggleDone(e){
  this.state = this.isDone ? 1 : 2
  this.save()
  return stopEvent(e)
}

// Quand on clique sur le bouton "x" de la tâche, pour la supprimer
onKillTask(e){
  this.destroy()
  return stopEvent(e)
}

/**
 * --- Méthodes d'helper ---
 * 
 */

// @return le contenu formaté
get formatedContent(){
  const REG_CROCHET_CONTENT = /\[(.*?)\]\((.*?)\)/g
  var c = String(this.content)
  c = c.replace(REG_CROCHET_CONTENT, this.replaceCrochetsInContent.bind(this))
  c = c.replace(/\n/g,'<br />')
  return c
}
replaceCrochetsInContent(tout, libelle, lien){
  return `<button class="link_in_content" data-link="${lien}">${libelle}</button>`
}

/**
 * --- Propriétés volatiles ---
 **/


/**
 * Retourne true si la tâche est une sous-tâche c'est-à-dire si
 * elle appartient à une autre tâche
 * 
 * Pour le savoir, on regarde le container, qui est un nombre 0, 1 ou
 * 2 quand c'est une tâche principale, et qui est quelque chose comme
 * '0045' quand c'est une sous-tâche
 * 
 */
get isSubTask(){
  return 'string' == typeof(this.container)
}

// Retourne true si c'est une tâche dans l'historique
get isHistorique(){
  return this.container_id == 2
}
// Retourne true si la tâche est faite
get isDone(){
  return this.state > 1
}

// Retourne true si c'est une nouvelle tâche
get isNew(){ return this.data['new'] == true }


/** 
 * Le GroupDay de la tâche. Ne sert que pour l'historique, où le
 * le "group-day" est la marque du groupe de la tâche dans un 
 * jour particulier.
 * Ce group-day n'existe pas pour les tâches hors de l'historique
 */
get groupday(){
  return this._groupday || (this._groupday = GroupDay.get(this.group, this.jour))
}

/**
 * L'instance {Group} du groupe de la tâche, tout container confondu
 */
get igroup(){
  return this._igroup || (this._igroup = Group.get(this.group))
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

/**
 * --- Propriété enregistrées ---
 */

get id(){return this._id || (this._id = this.data['id']) }
set id(v){this._id = this.data['id'] = v}
// Le nom du groupe
get group(){return this._group || (this._group = (this.data['group']||'divers') ) }
set group(v){this._group = this.data['group'] = v}
get content(){return this._content || (this._content = this.data['content'])}
set content(v){
  this._content = this.data['content'] = v
  this.updateContent()
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
