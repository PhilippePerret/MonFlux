# encoding: UTF-8
require 'json'
require_relative '_required'
require_relative 'Task'

class Tasks
class << self

  ##
  # Récupère toutes les archives de type :params[:type] et les
  # retourne sous forme de table de données (Array).
  #
  def get_all(params = nil)
    params ||= {}
    params.key?(:type) || params.merge!(type: 'current')
    dossier = params[:type] == 'current' ? folder : folder_archives
    Dir["#{dossier}/*.json"].collect do |path|
      JSON.parse(File.read(path).force_encoding('utf-8'))
    end
  end

  ##
  # Renvoie la liste de toutes les instances
  #
  def all_instances
    @all_instances ||= begin
      get_all.collect do |dtache| Task.new(dtache) end
    end
  end

  ##
  # Renvoie toutes les instances mais avec les appartenances
  #
  def all_instances_with_ownership
    @all_instances_with_ownership ||= begin
      
      #
      # On commence par faire une table avec toutes les instances
      #
      table = {}
      all_instances.each do |tache|
        table.merge!(tache.id => tache)
      end

      #
      # On peut maintenant traiter les appartenance, en supprimant
      # chaque fois la tâche de la table principale
      #
      all_instances.each do |tache|
        tache.tasks.each do |stache_id|
          tache.add_task(table[stache_id])
          table.delete(stache_id)
        end
      end

      table.values
    end
  end


  ##
  # Dossier contenant les tâches courantes
  def folder
    @folder ||= File.join(TASKS_FOLDER, 'current')
  end

  ##
  # Dossier contenant les tâches en archive
  # OBSOLÈTE
  def folder_archives
    @folder_archives ||= File.join(TASKS_FOLDER,'xarchives')
  end
end #/self
end #/Tasks 
