'use strict';
/**
 * Méthodes utiles pour les temps
 * 
**/

/**
 * Retourne {Date} la première heure du jour de la date +date+
 * 
 */
function getFirstHourOf(date){
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(),0,0,0)
}
function getLastHourOf(date){
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(),23,59,59)
}

const FIRST_HOUR_OF_DAY = (function(){
  return getFirstHourOf(new Date())
})();
const LAST_HOUR_OF_DAY =  (function(){
  return getLastHourOf(new Date())
})();
