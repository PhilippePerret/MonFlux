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

static get(yymmdd, groupName){
  return this.items[`${yymmdd}::${groupName}`]
}
static addItem(item){
  this.items || (this.items = {});
  Object.assign(this.items, {[`${item.jour.yymmdd}::${item.groupName}`]: item})
  console.log("Items de GroupDay:", this.items)
}

constructor(groupName, jour){
  console.log("Groupe '%s' du jour", groupName, jour)
  this.groupName  = groupName // {String}
  this.jour       = jour ;    // {Jour}
  this.indexGroupInDay = jour.addGroup(groupName)
  this.constructor.addItem(this)
}

build(){
  const o = DCreate('DIV', {class:'group', 'data-jour':this.jour.date, 'data-group':this.groupName, 'data-time': this.time, text:this.groupName})
  return o
}

get obj(){
  return this._obj || (this._obj = this.build())
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
