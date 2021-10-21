'use strict'
/**
 * Class LinkOpener
 * ----------------
 * Pour l'ouverture de tous les liens
 * 
 */

class LinkOpener {

static open(button, e){
  console.info("-> LinkOpener.open", button)
  console.log("Un évènement ?", e)
  const link = button.getAttribute('data-link')
  ajax({script:'open_link.rb', link: link})
  .then(ret=>{
    console.log("retour ajax", ret)
    if ( ret.error ) {
      erreur(ret.error)
    } else if (ret.message) {
      message(ret.message)
    }
  })

  return stopEvent(e)
}

}
