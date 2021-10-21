'use strict';
/**
 * Classe Group
 * ------------
 * Pour la gestion des groupes (un groupe, c'est par exemple "ICARE"
 * OU "ICED" et ça contient les tâches)
 *
 * Attention à ne pas confondre deux choses :
 *  - le groupe par exemple "ICARE" qui peut contenir TOUTES les 
 *    tâches qui ont été exéctuées pour l'atelier
 *  - le groupe qui se trouve dans un jour particulier. À ce titre,
 *    il peut y avoir un groupe "ICARE" pour chaque jour. Mais c'est
 *    alors un {GroupDay}.
 */
class Group {

/**
 * @return l'instance {Group} du groupe de nom +groupName+ en 
 * l'instanciant si nécessaire
 */
static get(groupName){
  this.items || (this.items = {});
  this.items[groupName] || Object.assign(this.items, {[groupName]: new Group(groupName)})
  return this.items[groupName]
}

/**
 * @return la liste Array des instances de groupe (tous)
 */
static get list(){return Object.values(this.items)}

/**
 * @return la liste Array des noms de groupe (tous)
 */
static get names(){return Object.keys(this.items)}

/**
 * ===== INSTANCE =====
 */

constructor(name){
  this.name = name
}

get asOption(){return DCreate('OPTION', {value:this.name, text:this.name})}

}
