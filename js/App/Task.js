'use strict';
/**
 * Classe Task
 * 
 * La tâche (Task) est l'élément de base du programme.
 * 
 * 
 **/
const STATE_DONE = 2

class Task {

static get EDITING_TASK_METHOD(){return this._editing_task}
static set EDITING_TASK_METHOD(v){this._editing_task = v}

static get(id){return Tasks.get(id)}

constructor(data){
  this.data = data
}

/**
 * --- Méthodes d'action --- 
**/

save(){
  // message("Enregistrement de la tâche…", 'action')
  return ajax({script:'save_task.rb', data: this.data})
  .then(ret => {
    console.info("Tâche sauvée avec ses nouvelles données", this)
    // message("Tâche enregistrée.")
    if ( this.isNew){ 
      //
      // Quand c'est une nouvelle tâche, il faut :
      //  - mettre son :new à false maintenant qu'elle est enregistrée
      //  - la placer au bon endroit
      //
      this.addInContainer()
      this.data['new'] = false ;
    }
  })
}

destroy(){
  var ids = this.tasks.map(id => {return id})
  ids.push(this.id)
  ajax({script:'destroy_task.rb', task_ids: ids})
  .then(ret => {
    this.obj.remove()
    const s = ids.length > 1 ? 's' : ''
    const msg = `Tâche${s} détruite${s}.`
    console.info(msg, this)
    // message(msg)
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
 * Méthode pour ajouter une tâche à la tâche courante
 * 
 */
addSubTask(task){
  if ( this.id == task.id ) {
    erreur("Une tâche ne peut pas être insérée dans elle-même")
  } else if ( this.tasks.indexOf(task.id) > -1 ) {
    erreur(`La tâche #${task.id} "${task.content.substring(0,50)}" est déjà contenu par cette tâche.`)
  } else {
    task.container = this.id
    this.tasks.push(task.id)
    task.save().then(this.save.bind(this))
  }
}

/**
 * Méthode (appelée au chargement et à l'ajout d'une sous-tâche) pour
 * afficher la sous-tâche dans la tâche.
 * 
 * Bien noter que cette méthode sert lorsque cette tâche est parente
 * donc contient la tâche +task+. Pour ajouter cette tâche à son 
 * container (quel qu'il soit), il faut utiliser : 
 *  this.addInContainer()
 * 
 */
insertTask(task){
  this.tasksField.appendChild(task.obj)
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
  this.container.insertTask(this) 
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
  this.doneButton = DCreate('a', {class:'btn done_btn', text:this.isDone?'refaire':'OK'})
  toolbox.appendChild(this.doneButton)
  if ( this.isSubTask ) {
    this.exitButton  = DCreate('a', {class:'exit_btn', text:'📤', placeholder:'Pour sortir la tâche de son parent'})
    toolbox.appendChild(this.exitButton)
  } else {  
    this.insertButton = DCreate('a', {class:'insert_btn', text:'📥', placeholder:'Pour insérer la tâche dans une autre tâche'})
    toolbox.appendChild(this.insertButton)
  }
  this.killButton = DCreate('a', {class:'btn kill_btn', text:'❌'})
  toolbox.appendChild(this.killButton)
  obj.appendChild(toolbox)
  
  this.contentField = DCreate('SPAN', {class:'content', text:this.formatedContent})
  obj.appendChild(this.contentField)

  this.tasksField = DCreate('DIV', {class:'tasks'})
  obj.appendChild(this.tasksField)

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
 * Définit l'état de la tâche (faite/à faire)
 * 
 * Noter le cas particulier d'une tâche qui en contient plusieurs :
 * elle ne peut être marquée faite que si toutes ses sous-tâches sont
 * faites. Si ça n'est pas le cas, on demande à l'utilisateur s'il
 * veut marquer toutes ses sous-tâches faites.
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


/**
 * --- Méthode d'observation des évènements ---
**/

/**
 * Méthode appelée quand on clique sur le bouton pour déplacer
 * la tâche dans une autre tâche
 */
onClickInsertButton(e){
  Task.EDITING_TASK_METHOD = this.insertInTask.bind(this)
  message("Cliquer sur la tâche dans laquelle il faut ajouter cette tâche.")
  return stopEvent(e)
}
insertInTask(mainTask){
  Task.EDITING_TASK_METHOD = null
  mainTask.addSubTask(this)
}

/**
 * Méthode appelée quand on clique sur le bouton pour sortir la tâche
 * de son parent.
 * 
 */
onClickExitButton(e){
  this.container = this.parentTask.container_id
  this.addInContainer()
  this.save()
  return stopEvent(e)
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

/**
 * Bouton appelé quand on clique sur le bouton pour marquer la
 * tâche faite ou non faite
 * 
 * Noter le cas spécial de la tâche qui en contient d'autres.
 * 
 */
onToggleDone(e){
  var stateMustChange = true
  const newState = this.isDone ? 1 : 2
  if ( this.hasTasks && newState == STATE_DONE ) {
    //
    // Si une seule sous-tâche n'est pas marquée faite, on doit
    // interroger l'utlisateur
    //
    var nombre_undone   = 0
    this.subTasks.forEach(task => {
      if ( !task.isDone ) {
        ++ nombre_undone
      }
    })
    if ( nombre_undone > 0 ) {
      stateMustChange = false
      var ajout ;
      if ( nombre_undone > 1 ) {
        ajout = `${nombre_undone} n’ont pas été accomplies`
      } else {
        ajout = "une tâche n’a pas été acomplie"
      }
      erreur(`Toutes ses tâches doivent avoir été marquées accomplies. Or, ${ajout}.`)
    }
  }

  if (stateMustChange) {
    this.state = newState
    this.save()
  }
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
  return 'string' == typeof(this.container_id)
}

/**
 * Renvoie true si la tâche contient d'autres tâches
 */
get hasTasks(){
  return this.tasks.length > 0
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
/**
 * Redéfinition du container de la tâche (lorsqu'on la place dans une
 * autre tâche ou qu'on la sort pour le remettre dans le flux princi-
 * pal)
 */
set container(v){
  this._container_id = this.data['container'] = v
  this._container = null
  // Déplacer la tâche (note : this.container est défini en fonction
  // de la nature de la tâche : si c'est une tâche principale, le
  // container est un vrai container, sinon c'est la tâche parente)
  this.container.insertTask(this)
}
get domId(){
  return this._domid || (this._domid = `task-${this.id}`)
}

get parentTask(){
  return this._parent || (this._parent = Task.get(this.container_id))
}

/**
 * Retourne la liste des instances de sous-tâches
 */
get subTasks(){
  return this._subtasks || (this._subtasks = this.getInstancesOfSubTasks())
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
get tasks(){return this._tasks || (this._tasks = this.data['tasks']||[])}

/**
 * === private methods ===
*/

defineContainer(){
  if ( 'string' == typeof(this.container_id) ) {
    return Tasks.get(this.container_id)
  } else {  
    switch(this.container_id){
      case 0: return Tasks.containerSansEcheances;
      case 1: return Tasks.containerCurrent;
      case 2: return Tasks.containerHistorique;
    }
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
getInstancesOfSubTasks(){
  return this.tasks.map(task_id => {return Task.get(task_id)})
}
}// class Task
