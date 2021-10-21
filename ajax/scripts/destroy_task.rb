#!/usr/bin/env ruby
# encoding: UTF-8
=begin

Script permettant de sauver la tâche dont les données ont été
transmises


=end
require_relative '../lib/Task'

# Les données transmises
task_id = JSON.parse(ARGV[0])['task_id']

task = Task.new('id' => task_id)
task.destroy

retour = {
  ok: !File.exist?(task.path)
}

puts retour.to_json
