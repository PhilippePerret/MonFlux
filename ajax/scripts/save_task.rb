#!/usr/bin/env ruby
# encoding: UTF-8
=begin

Script permettant de sauver la tâche dont les données ont été
transmises


=end
require_relative '../lib/Task'

# Les données transmises
task_data = JSON.parse(ARGV[0])['data']

task = Task.new(task_data)
task.save

retour = {
  ok: File.exist?(task.path),
  task_data: task_data
}

puts retour.to_json
