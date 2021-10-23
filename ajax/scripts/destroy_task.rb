#!/usr/bin/env ruby
# encoding: UTF-8
=begin

Script permettant de sauver la tâche dont les données ont été
transmises


=end
require_relative '../lib/Task'

# Les données transmises
task_ids = JSON.parse(ARGV[0])['task_ids']

nombre_taches_a_detruire = task_ids.count
nombre_taches_detruites  = 0
task_ids.each do |task_id|
  task = Task.new('id' => task_id)
  task.destroy
  unless File.exist?(task.path)
    nombre_taches_detruites += 1
  end
end

retour = {
  ok: nombre_taches_detruites == nombre_taches_a_detruire
}

puts retour.to_json
