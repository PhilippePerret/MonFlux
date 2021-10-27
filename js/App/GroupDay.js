'use strict';
/**
 * Classe GroupDay
 * ---------------
 * Gestion d'un groupe (Group) dans un jour particulier
 * 
 * IMPORTANT : lire l'explication dans la classe Group pour ne pas
 * confondre Group et GroupDay
 * 
 */

class GroupDay {

static get(/* {String} */ groupName, /* {Jour} */ jour ){
  if ( ! this.items ) {
    this.groupNames = {}
    this.items      = {}
  }
  const key = `${jour.date}::${groupName}`
  this.items[key] || Object.assign(this.items, {[key]: new GroupDay(groupName, jour)})
  return this.items[key]
}

constructor(groupName, jour){
  this.groupName  = groupName // {String}
  this.jour       = jour ;    // {Jour}
  this.indexGroupInDay = jour.addGroup(groupName)

  this.isBuilt = false
}

get isGroupDay(){return true}

build(){
  this.obj = DCreate('DIV', {class:'group', 'data-current': String(this.jour.isCurrent), 'data-jour':this.jour.yymmdd, 'data-group':this.groupName, 'data-time': this.time, text:this.groupName})
  TaskContainer.historique.placeElementInHistorique(this)
  this.isBuilt = true
}

get time(){return this._time || (this._time = this.getTime())}
get date(){return this._date || (this._date = this.jour.date) }

/**
 * -- private methods --
 */

getTime(){
  var d = new Date()
  d.setTime(this.jour.date.getTime() - this.indexGroupInDay * (10 * 60 * 1000) /* 10 minutes */)
  return parseInt(d.getTime() / 10000, 10)
}

}// class GroupDay
