'use strict'
/**
 * Classe Jour
 * -----------
 * Gestion des jours du container historique
 * 
 */
class Jour {
constructor(jour){
  this.jour = jour
}
build(){
  const o = DCreate('DIV', {class:'jour', 'data-jour':this.jour, 'data-time': this.time, text:this.formated})
  return o
}

/**
 * @return la date formatée
 */
get formated(){
  return `${this.jourName} ${this.jour} ${this.moisName} ${this.annee}`
}

get obj(){
  return this._obj || (this._obj = this.build())
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
  var [annee,mois,jour] = this.jour.split('/')
  annee = this.annee = Number('20'+annee)
  mois  = this.mois  = Number(mois) - 1
  jour  = this.jour  = Number(jour)
  return new Date(annee, mois, jour, 12, 0, 0)
}

}//Jour
