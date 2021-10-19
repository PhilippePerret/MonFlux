# encoding: UTF-8
require 'json'
require_relative 'constants'

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
  # Dossier contenant les tâches courantes
  def folder
    @folder ||= File.join(TASKS_FOLDER, 'current')
  end

  ##
  # Dossier contenant les tâches en archive
  def folder_archives
    @folder_archives ||= File.join(TASKS_FOLDER,'xarchives')
  end
end #/self
end #/Tasks 
