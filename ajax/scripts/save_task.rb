#!/usr/bin/env ruby
# encoding: UTF-8
=begin

Script permettant de sauver la tâche dont les données ont été
transmises


=end
require_relative '../lib/Task'

# Les données transmises
task_data = JSON.parse(ARGV[0])['data']

# Si une tâche vient d'être marquée faite, il faut ajuster sa date
old_task = Task.new(id: task_data['id'])
if old_task.exist? && old_task.state < 2 && task_data['state'] > 1
  # 
  # <= La tâche vient d'être marquée faite
  # => On ajuste sa date
  #
  now = Time.now
  jour = now.strftime("%d")
  mois = now.strftime("%m")
  task_data['date'] = "#{now.year.to_s[2..-1]}/#{mois}/#{jour}"
  log("Date de la tâche ##{old_task.id} mise à #{task_data['date']}")
end

task = Task.new(task_data)
task.save

retour = {
  ok: File.exist?(task.path),
  task_data: task_data
}

puts retour.to_json
