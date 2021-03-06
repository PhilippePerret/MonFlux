'use strict';
/** ---------------------------------------------------------------------

  MÉTHODES PRATIQUES
  ------------------
  Version 1.4.0

# 1.4.0
  Gestion de la disparition des messages
  
# 1.3.0
  Ajout de l'event 'message' sur window, permettant de recevoir des
  message par origin croisée.

# 1.2.0
  Ajout de la méthode focusIn. Qui permet de focusser dans un élément
  en triggant un évènement focus.

# 1.1.1
  Amélioration de stopEvent pour désactiver encore plus de choses

# 1.1.0
  Modification de la méthode with_pixels -> px
  + Elle peut recevoir maintenant, dans les objets, des valeurs qui ont
    déjà leur unité et ne seront pas transformées. Pour ne pas avoir à
    compliquer la définition de l'attribut style lorsqu'il y a d'autres
    valeurs comme des zooms, des polices, etc.
# 1.0.2
  Ajout de la méthode 'px'
*** --------------------------------------------------------------------- */

// Pour focus dans un élément en triggant un évènement focus
// Mais bon… ça ne semble pas marcher…
function focusIn(element) {
  // var eventType = "onfocusin" in element ? "focusin" : "focus",
  //   , bubbles = "onfocusin" in element,
  //   , event;
  var eventType = 'focus'
    , bubbles = false
    , event

  if ("createEvent" in document) {
    event = document.createEvent("Event");
    event.initEvent(eventType, bubbles, true);
  }
  else if ("Event" in window) {
    event = new Event(eventType, { bubbles: bubbles, cancelable: true });
  }

  element.focus();
  element.dispatchEvent(event);
}

class Message {

  /**
   * = main =
   * 
   * Affiche le message +msg+ de type +type+ et laisse le message
   * affiché en fonction de sa longueur et de son type.
   * 
   * @param msg   {String} Le message à afficher
   * @param type  {String} Le type du message :
   *                       error, notice ou action
   */
  static display(msg, type){
    this.calcEndTime(msg, type)
    this.setTimer()
    this.setDisplay(msg, type)
    this.show()
  }

  /**
   * Place le timer de fermeture du message
   * 
   */
  static setTimer(){
    if ( this.timer ) this.clearTimer() ;
    const duree = this.calcDuree()
    this.timer = setTimeout(this.hide.bind(this), duree)
  }

  /**
   * Calcul le temps de fin en fonction de la longueur du message et
   * du temps déjà en attente (message précédent)
   */
  static calcEndTime(msg, type){
    try {
      var duree = (msg.split(' ').length / 7) * 1.5
    } catch(err) {
      console.error("J'ai recontré une erreur :", err)
      console.error("Le message msg était : ", msg)
      return
    }
    duree > 3 || (duree = 3)
    if ( type == 'error' ) duree = duree * 4
    if ( !this.endTime ) {
      this.endTime = new Date()
    }
    this.endTime.setTime(this.endTime.getTime() + duree * 1000)
  }
  
  /**
   * Calcul la durée d'affichage du message en fonction du temps
   * de fin calculé
   */
  static calcDuree(){
    return this.endTime.getTime() - new Date().getTime()
  }

  /**
   * Règle l'affichage en fonction du message et de son type
   * 
   */
  static setDisplay(msg, type){
    this.obj.innerHTML = msg
    this.obj.className = type
  }
  static show(){
    this.obj.classList.remove('hidden')
  }
  static hide(){
    this.obj.classList.add('hidden')
    this.clearAll()
  }

  static clearAll(){
    this.endTime = null
    delete this.endTime
    this.clearTimer()
  }
  static clearTimer(){
    clearTimeout(this.timer)
    this.timer = null
    delete this.timer
  }

  static get obj(){
    return this._obj || (this._obj = DGet('#message'))
  }
}


// Méthode à utiliser en catch des promesses
function onError(err){
  console.error(err)
  return erreur(err)
}

function erreur(err){
  Message.display(err, 'error')
  return false
}

/**
 * @param {String} type   Le type, entre 'notice' (défaut), 'action'
 *                        (pour une action) et 'error'
 */
function message(msg, type){
  Message.display(msg, type || 'notice')
  return true
}

/**
* Pour ajouter les pixels aux valeurs numériques (*) :
*
* (String)  "12" => "12px"
* (Number)  12 => "12px"
* (Object)  {top: 24, left: 34} => {top: "24px", left: "34px"}
*
* Si +asStyle+ est true, on retourne la donnée sous forme d'attribut style
* c'est-à-dire {top:24, left:34} => "top:24px;left:34px;"
* (ça n'est bien entendu valable que pour les Object(s))
*
* (*) Et seulement aux valeurs numériques, c'est-à-dire qu'on peut
*     laisser des propriétés déjà réglées sans problème.
***/
function px(vals, asStyle = false){
  if ('string' == typeof(vals) || 'number' == typeof(vals)) {
    return `${vals}px`
  } else {
    var newh = {}
    for(var k in vals){
      var val = vals[k]
      Object.assign(newh, { [k]: (isNaN(val) ? val : val+'px') })
    }
    if (asStyle){
      var str = []
      for(var k in newh){str.push(`${k}:${newh[k]};`)}
      return str.join('')
    } else {
      return newh
    }
  }
}

/**
  Méthode à appeler lorsque c'est un retourn ajax qui ne doit pas faire,
  dans un `catch`. La donnée retournée par le script ajax ruby doit contenir
  `error` pour signaler une erreur et/ou `message` pour afficher un message.
**/
function onAjaxSuccess(ret){
  if ( ret.error ) return erreur(ret.error)
  if (ret.message) message(ret.message)
}

function raise(msg){
  erreur(msg)
  throw new Error(msg)
}

const NOW = new Date()

/**
  Retourne le temps en secondes
  @documented
**/
function humanDateFor(timeSeconds){
  // console.log("timeSeconds", timeSeconds)
  if (undefined === timeSeconds){ timeSeconds = new Date()}
  if ('number' != typeof(timeSeconds)) timeSeconds = parseInt(timeSeconds.getTime() / 1000)
  const d = new Date(timeSeconds * 1000)
  // console.log("d = ", d)
  return `${String(d.getDate()).padStart(2,'0')} ${(String(d.getMonth()+1)).padStart(2,'0')} ${d.getFullYear()}`;
}

function stopEvent(ev){
  ev.stopPropagation();
  ev.preventDefault();
  ev.stopImmediatePropagation()
  ev.returnValue = false
  return false
}

function dorure(str){return `<span style="color:#e9e330;background-color:blueviolet;padding:1px 6px;">${str}</span>`}

function clip(what, msg){
  const field = DCreate('textarea',{text:what})
  document.body.appendChild(field)
  field.focus()
  field.select()
  document.execCommand('copy')
  msg && message(msg)
  field.remove()
}

/**
* Pour charger un module du dossier 'js/module'
***/
function loadJSModule(moduleName){
  moduleName.endsWith('.js') || (moduleName += '.js')
  return new Promise((ok,ko)=>{
    const script = DCreate('SCRIPT',{src:`js/module/${moduleName}`, type:"text/javascript"})
    document.body.appendChild(script)
    script.addEventListener('load', ok)
  })
}
