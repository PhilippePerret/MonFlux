#!/usr/bin/env ruby
# encoding: UTF-8
=begin

Script permettant de charger les tâches de type data['type'].

data['type']    Description

  'current'     Les tâches courantes, c'est le mode normal
                C'est même le seul mode maintenant.
  
  'archives'    OBSOLÈTE (n'est plus utilisé)
                Les tâches archivées, donc non présentes. Il faut
                alors déterminer aussi 'date_from' et 'date_to' pour
                savoir quelles tâches remonter. On regardera alors
                dans l'historique, c'est-à-dire dans le dossier
                'archives'


  Le module vérifie aussi s'il faut faire l'historique du mois
  précédent.
=end
require_relative '../lib/Tasks'

# Check historique
require_relative '../lib/historique_mini'
Historique.check

# Les données transmises
data = JSON.parse(ARGV[0])

retour = {
  task_type: data['type'],
  tasks: Tasks.get_all(type: data['type'])
}

puts retour.to_json
