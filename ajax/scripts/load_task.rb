#!/usr/bin/env ruby
# encoding: UTF-8
=begin

Script permettant de charger les tâches de type data['type'].

data['type']    Description

  'current'     Les tâches courantes, c'est le mode normal
  'archives'    Les tâches archivées, donc non présentes. Il faut
                alors déterminer aussi 'date_from' et 'date_to' pour
                savoir quelles tâches remonter. On regardera alors
                dans l'historique, c'est-à-dire dans le dossier
                'archives'


=end
require_relative '../lib/Tasks'

# Les données transmises
data = JSON.parse(ARGV[0])

retour = {
  task_type: data['type'],
  tasks: Tasks.get_all(type: data['type'])
}

puts retour.to_json
