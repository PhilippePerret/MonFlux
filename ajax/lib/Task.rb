# encoding: UTF-8
require 'json'
require_relative '_required'

class Task 

attr_reader :data

def initialize data
  @data = data
end


def save
  #
  # Si la tâche ne fait pas partie de l'historique et passe de l'état
  # à faire à l'état faite, on doit la passer du dossier current au
  # dossier archives
  #
  File.delete(path_in_current) if File.exists?(path_in_current)
  File.delete(path) if File.exist?(path)
  File.open(path,'wb'){|f| f.write(data.to_json)}
rescue Exception => e
  log("Impossible d'enregistrer les données : #{e.message}")
else
  log("Nouvelles données bien enregistrées : #{data.inspect}")
end

##
# Détruit complètement la tâche
#
def destroy
  File.delete(path_in_current)    if File.exists?(path_in_current)
  File.delete(path_in_xarchives)  if File.exist?(path_in_xarchives)
rescue Exception => e
  log("Impossible de détruire la tâche ##{id} : #{e.message}")
else
  log("Destruction OK de la tâche ##{id}")
end

def id; @id ||= data['id'] end

def filename
  @filename ||= "#{id}.json"
end
def path
  @path ||= File.join(folder, filename)
end
def path_in_current
  @path_in_current ||= File.join(TASKS_FOLDER,'current',filename)
end
def path_in_xarchives
  @path_in_xarchives ||= File.join(TASKS_FOLDER,'xarchives',filename)
end
def folder
  @folder ||= File.join(TASKS_FOLDER, folder_name)
end
def folder_name
  case data['state']
  when 0, 1 then 'current'
  else 'xarchives'
  end
end

end #/Task
