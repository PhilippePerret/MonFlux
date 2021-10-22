# encoding: UTF-8
=begin

Class Historique
----------------
Pour la construction des historiques

## TODO
  * Pour le moment, toutes les tâches sont mises les unes au bout
    des autres sans tenir compte des appartenances.


Fonctionnement

  Tous les jours, quand le script de chargement des tâches est
  appelé, on vérifie qu'il ne faille pas faire l'historique. Si on
  doit le faire, ce module est appelé et la méthode Historique.build
  est invoquée.

  La construction de l'historique consiste à prendre toutes les
  tâches (faites) du mois précédent et à les mettre dans un fichier
  historique du mois dans les archives.

Nécessité de construire l'historique

  L'historique doit être fait lorsque l'on est un certain mois et
  que l'historique du mois précédent n'est pas fait. Note : donc, à 
  la première utilisation de l'application, un historique sera fait.

  C'est le module 'historique_checker.rb' qui est appelé pour 
  vérifier s'il faut faire l'historique. C'est une version réduite.

=end
require_relative 'Tasks'

class Historique
class << self

##
# = main =
#
# Construction de l'historique du mois précédent
#
def build_histo_prev_month
  log "=> Construction historique #{affixe}"

  #
  # On doit récupérer les tâches du mois passé
  #
  taches = taches_of_prev_month

  # Note : même s'il n'y a aucune tâche, on doit faire le fichier

  begin

    log "  * Fabrication du fichier Markdown de l'historique"

    File.delete(path_histo_prev_month) if File.exist?(path_histo_prev_month)
    File.delete(path_md) if File.exist?(path_md)
    ref = File.open(path_md,'a')

    #
    # Le titre
    #
    ref.puts "# Historique de travail\n\n"
    ref.puts "## #{human_month_prev} #{year_prev}\n\n"

    if taches.count
      jour_courant = nil
      taches.each do |tache|

        #
        # Si le jour n'est pas encore marqué, il faut le marquer
        #
        if jour_courant != tache.date
          jour_courant = tache.date
          ref.puts "\n\n#### #{human_date_form tache.date}\n\n"
        end

        #
        # On écrit la tâche (et ses sous-tâches)
        #
        ref.puts "* [#{tache.group}] #{tache.content}"
        tache.taches.each do |stache|
          ref.puts "  * #{stache.content}"
        end
      end
    else
      ref.puts "*Aucune tâche pour ce mois.*"
    end

  rescue Exception => e
    log "ERREUR : IMPOSSIBLE DE FABRIQUER L'HISTORIQUE.\n\t\t#{e.message}\n#{e.backtrace.join("\n")}"
    return # en cas d'erreur
  ensure
    ref.close
  end

  # 
  # On peut détruire les tâches qui ont été enregistrées
  #
  # taches.each do |tache| tache.destroy(deep = true) end


  if conv_to_pdf 
    if File.exist?(path_histo_prev_month)
      File.delete(path_md)
      log "= historique #{affixe} construit avec succès"
    else
      log "# Un problème est survenu, le PDF n'a pas pu être construit."
    end
  end
end

##
# Retourne la liste des tâches du mois précédent
# (sous forme de liste d'instances classées par date)
def taches_of_prev_month
  @taches_of_prev_month ||= begin
    # La marque de début de date qu'on devra trouver
    mark_prev = "#{year_prev[2..-1]}/#{month_prev}/"
    # On récupère les instances correspondantes
    Tasks.all_instances_with_ownership.select do |tache|
      tache.done? && tache.date.start_with?(mark_prev)
    end.sort_by do |tache|
      - tache.date
    end
  end
end

##
# Convertit le fichier Markdown en PDF
#
def conv_to_pdf
  if File.exists?(path_md)
    require_relative 'md_to_pdf'
    log "-> MdToPdf.convert avec #{path_md}"
    return MdToPdf.convert(path_md)
    log "<- MdToPdf.convert"
    # `/opt/homebrew/bin/pandoc "#{path_md}" -o "#{path_histo_prev_month}"`
  else
    log "ERREUR : impossible de construire l'historique.\n\tIntrouvable : #{path_md}"
    false
  end
end

##
# @return la date humaine d'après +yymmdd+ (au format YY/MM/JJ)
#
def human_date_form(yymmdd)
  annee, mois, jour = yymmdd.split('/')
  time = Time.new(annee.to_i, mois.to_i, jour.to_i)
  "#{human_jour_for(time.wday)} #{jour} #{human_month_for(mois)} #{annee}"
end
##
# @return le mois précédent au format humain
def human_month_prev
  @human_month_prev ||= human_month_for(month_prev)
end

def human_month_for(mois)
  ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Aout','Septembre','Octobre','Novembre','Décembre'][mois.to_i - 1]
end

def human_jour_for(ijour)
  ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'][ijour - 1]
end

##
# Chemin d'accès au fichier Markdown
def path_md
  @path_md ||= File.join(folder, filename_md)
end
def filename_md
  @filename_md ||= "#{affixe}.md"
end

end #/<< self
end #/Historique
