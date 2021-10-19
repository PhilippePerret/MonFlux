#!/usr/bin/env ruby
# encoding: UTF-8
require 'json'

# Les données transmises
data = JSON.parse(ARGV[0])

retour = {
  task_type: data['type'],
  argument: data
}

puts retour.to_json
