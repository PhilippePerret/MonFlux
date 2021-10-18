'use strict';

$(document).ready(e => {

  TaskContainer.all.forEach(cont => cont.dimensionne())
  Tasks.load_and_display()  
})
