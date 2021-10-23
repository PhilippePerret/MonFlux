'use strict';

$(document).ready(e => {

  TaskContainer.all.forEach(cont => cont.prepare())
  Tasks.load_and_display() 
})
