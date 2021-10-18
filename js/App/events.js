window.onresize = function(e){

  console.log("-> Redimensionnement")
  TaskContainer.all.forEach(cont => cont.dimensionne())

  return true
}
