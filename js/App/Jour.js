'use strict'
/**
 * Classe Jour
 * -----------
 * Gestion des jours du container historique
 * 
 */
class Jour {

/**
 * @return l'instance {Jour} du jour de date +yymmdd+ en 
 * l'instanciant si elle n'existe pas
 */
static getByJour(yymmdd){
  this.items || (this.items = {});
  this.items[yymmdd] || Object.assign(this.items, {[yymmdd]: new Jour(yymmdd)})
  return this.items[yymmdd]
}

static get todayAsYYMMDD(){
  return this._asyymmdd || (this.__asyymmdd = this.getTodayAsYYMMDD())
}

static getTodayAsYYMMDD(){
  var d = new Date()
  return `${d.getFullYear() - 2000}/${String(d.getMonth() + 1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}`
}
/**
 * ==== INSTANCE ====
 * 
 */

constructor(yymmdd){
  this.yymmdd   = yymmdd
  this.isBuilt  = false
}


get isJour(){return true}

/**
 * Ajoute un "groupe-jour" (GroupDay) au jour 
 * Un groupe-jour, c'est quelque chose comme "CAMI" ou "ICARE" mais
 * propre à chaque jour.
 * 
 * @return l'index du nouveau group-jour (GroupDay) dans le jour
 *          (1-start)
 * 
 */
addGroup(groupName){
  this.groupsNames || (this.groupsNames = []);
  this.groupsNames.push(groupName)
  return this.groupsNames.length
}


build(){
  this.obj = DCreate('DIV', {class:'jour', 'data-current': String(this.isCurrent), 'data-jour':this.yymmdd, 'data-time': this.time, text:this.formated})
  TaskContainer.historique.placeElementInHistorique(this)
  this.isBuilt = true
}

get isCurrent(){
  return this.yymmdd == Jour.todayAsYYMMDD
}

/**
 * @return la date formatée
 */
get formated(){
  return `${this.jourName} ${this.jour} ${this.moisName} ${this.annee}`
}

get date(){
  return this._date || (this._date = this.getDate() )
}
get time(){
  return this._time || (this._time = this.getTime() )
}
get moisName(){
  return this._nmois || (this._nmois = ['janvier','février','mars','avril','mai','juin','juillet','aout','septembre','octobre','novembre','décembre'][this.mois])
}
get jourName(){
  return this._njour || (this._njour = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'][this.date.getDay()])
}


getTime(){
  return parseInt(this.date.getTime()/10000,10)
}

/**
 * Note : on met la date au midi du jour pour que les
 * tâche se rangent bien après le jour
 * 
**/
getDate(){
  var [annee,mois,jour] = this.yymmdd.split('/')
  annee = this.annee = Number('20'+annee)
  mois  = this.mois  = Number(mois) - 1
  jour  = this.jour  = Number(jour)
  return new Date(annee, mois, jour, 12, 0, 0)
}

}//Jour
