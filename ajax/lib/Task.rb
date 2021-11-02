# encoding: UTF-8
require 'json'
require_relative '_required'

class Task 

attr_reader :data

##
# Instanciation
#
# Attention, +data+ peut ne contenir que :id. Dans ce cas, on 
# charge les données depuis le fichier
#
def initialize data
  if data.key?('content')
    @data = data
  else
    @id = data['id']||data[:id]
    load if exist?
  end
end

def exist?
  File.exist?(path_in_current)
end

def load
  @data = JSON.parse(File.read(path_in_current).force_encoding('utf-8'))
end

def save
  #
  # Si la tâche ne fait pas partie de l'historique et passe de l'état
  # à faire à l'état faite, on doit la passer du dossier current au
  # dossier archives
  #
  # Non, en fait, maintenant, quelle que soit la tâche :
  #   * SI elle est marquée faite
  #   * ET qu'elle n'appartient pas à une autre tâche
  #   ALORS elle rejoint l'historique avec la date du jour.
  #
  if data['state'] > 1 && data['container'].is_a?(Integer) && data['container'] != 2
    move_in_historique
  end
  File.delete(path_in_current) if File.exists?(path_in_current)
  File.delete(path) if File.exist?(path)
  File.open(path,'wb'){|f| f.write(data.to_json)}
rescue Exception => e
  log("Impossible d'enregistrer les données : #{e.message}")
else
  log("Nouvelles données bien enregistrées : #{data.inspect}")
end

##
# "Déplace" la tâche dans l'historique
#
def move_in_historique
  data['container'] = 2
end

##
# Détruit complètement la tâche
#
# @param deep   Si true, on doit détruire aussi les tâches enfants
#
def destroy(deep = false)

  #
  # Si +deep+ est true, on doit aussi détruire les tâches enfants
  #
  if deep 
    tasks.each do |task_id|
      Task.new(task_id).destroy(deep = true)
    end
  end

  #
  # On peut détruire la tâche partout où elle se trouve
  #
  File.delete(path_in_current)    if File.exists?(path_in_current)
  File.delete(path_in_xarchives)  if File.exist?(path_in_xarchives)
  
rescue Exception => e
  log("Impossible de détruire la tâche ##{id} : #{e.message}")
else
  log("Destruction OK de la tâche ##{id}")
end

def id; @id ||= data['id'] end
def date; @date ||= data['date'] end
def state; @state ||= data['state'] end
def group; @group ||= data['group'] end
def content; @content ||= data['content'] end
def tasks; @tasks ||= data['tasks']||[] end
def files; @files ||= data['files']||[] end

def done?
  state > 1
end

##
# Sous-tâches de la tâche (instances)
#
def taches
  @taches ||= []
end
def add_task(tache)
  @taches ||= []
  @taches << tache
end

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
  'current'
end

end #/Task
