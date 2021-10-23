'use strict';

$(document).ready(e => {

  TaskContainer.all.forEach(cont => cont.prepare())
  Tasks.load_and_display() 
  message("Je suis prête")
  setTimeout(message.bind(null,"Je suis toujours prête"), 2000)
})
