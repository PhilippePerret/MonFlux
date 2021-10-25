'use strict';
/**
 * Class TaskEditorClass
 * Qui donne TaskEditor, l'éditeur pour toutes les tâches
 * 
 */
class TaskEditorClass {

edit(task){
  this.task = task
  this.positionne()
  this.setValues()
  this.focus()
  task.isNew && this.selectContent()
}

updateTask(){
  this.task.update(this.getValues())
}

/**
 * Méthode qui récupère les valeurs dans l'éditeur pour pouvoir les
 * affecter à la tâche
 */
getValues(){
  return {
      content:  this.contentField.value.trim()
    , date:     this.menuDays.value
    , group:    this.menuGroups.value
  }
}

/**
 * Méthode qui règle les valeurs de la tâche dans l'éditeur
 */
setValues(){
  this.contentField.value = this.task.content
  this.menuGroups.value   = this.task.group
  this.menuDays.value     = this.task.date
}

open(){
  //
  // Si la liste des groupes a changé, il faut actualiser le menu
  //
  if ( this.currentGroupCount != Group.list.length ) this.peupleGroupMenu()
  //
  // On affiche la boite
  //
  this.obj.classList.remove('hidden')
}
close(){this.obj.classList.add('hidden')}


/**
 * Pour se mettre dans le champ de texte à l'ouverture
 * 
 */
focus(){
  this.contentField.focus()
}
selectContent(){
  this.contentField.select() 
}

/**
 * --- events methods ---
 * 
 */
onClickOK(e){
  this.updateTask()
  this.close()
  return stopEvent(e)
}

onClickCancel(e){
  this.close()
  return stopEvent(e)
}

/**
 * On positionne l'éditeur en fonction de la tâche
 */
positionne(){
  const rect = this.task.obj.getBoundingClientRect()
  if ( this.task.isNew ) {
    console.log("-> nouveau")
    this.obj.style.top = px(40)
    delete this.obj.style.top
  } else {
    this.obj.style.bottom = ''
    this.obj.style.top    = px(rect.top - 10)
  }
  this.obj.style.left   = px(rect.left - 10)
  this.open()
}


get obj(){return this._obj || (this._obj = this.build_and_observe())}

/**
 * --- private methods ---
*/

build_and_observe(){
  this.build()
  this.observe()
  return this._obj
}
build(){
  const o = DCreate('DIV', {id:'task_editor'})
  var t ;

  this.contentField = DCreate('TEXTAREA', {id:'task_editor-content'})
  o.appendChild(this.contentField)

  const infos = DCreate('DIV', {class:'infos'})
  infos.appendChild(DCreate('SPAN', {text:'Groupe'}))
  this.menuGroups = DCreate('SELECT', {id:'task_editor-group'})
  infos.appendChild(this.menuGroups)
  infos.appendChild(DCreate('SPAN', {text:'Date'}))
  this.menuDays = DCreate('SELECT', {id:'task_editor-date'})
  infos.appendChild(this.menuDays)

  o.appendChild(infos)


  const tools = DCreate('DIV', {class:'tools'})
  this.cancelButton = DCreate('a', {class:'btn cancel_btn', text:'Renoncer'})
  tools.appendChild(this.cancelButton)
  this.okButton = DCreate('a', {class:'btn ok_btn', text:'OK'})
  tools.appendChild(this.okButton)
  o.appendChild(tools)

  document.body.appendChild(o)
  this._obj = o

}

observe(){
  this.peupleDayMenu()
  this.peupleGroupMenu()
  this.okButton.addEventListener('click', this.onClickOK.bind(this))
  this.cancelButton.addEventListener('click', this.onClickCancel.bind(this))
}

peupleGroupMenu(){
  this.menuGroups.innerHTML = ''
  Group.list.forEach(group => this.menuGroups.appendChild(group.asOption))
  this.currentGroupCount = Group.list.length
}

peupleDayMenu(){
  var d = new Date()
  for ( var i = 0; i < 10; ++ i) {
    var humanDate = humanDateFor(d);
    // console.log("humanDate = ", humanDate)
    var libDate   = i > 0 ? humanDate : 'Aujourd’hui' ;
    var [j,m,a]   = humanDate.split(' ')
    var value = `${Number(a - 2000)}/${m.padStart(2,'0')}/${String(j).padStart(2,'0')}`
    this.menuDays.appendChild(DCreate('OPTION',{value:value, text:libDate}))
    d.setTime(d.getTime() + 24 * 3600 * 1000)
  }

}

}//TaskEditorClass
const TaskEditor = new TaskEditorClass();
