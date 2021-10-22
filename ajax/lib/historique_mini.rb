# encoding: UTF-8
=begin

  Cf. le module historique.rb

=end
require_relative '_required'

class Historique
class << self

##
# Méthode qui regarde s'il faut faire l'historique, et le lance
# le cas échéant
def check
  unless histo_prev_month_exist?
    log "= fichier historique #{affixe} n'existe pas"
    require_relative 'historique'
    build_histo_prev_month
  else
    log "= fichier historique mois précédent existe"
  end
end

##
# @return true si le fichier historique du mois précédent existe
#
def histo_prev_month_exist?
  return File.exist?(path_histo_prev_month) 
end

##
# Chemin d'accès à l'historique du mois précédent
#
def path_histo_prev_month
  @path_histo_prev_month ||= File.join(folder, filename_prev_month)
end
def filename_prev_month
  @filename_prev_month ||= "#{affixe}.pdf"
end
def affixe
  @affixe ||= "#{year_prev}-#{month_prev}"
end

def year_prev
  @year_prev ||= begin
    (NOW.month == 1 ? NOW.year - 1 : NOW.year).to_s
  end
end
def month_prev
  @month_prev ||= begin
    (NOW.month == 1 ? 12 : NOW.month - 1).to_s.rjust(2,'0')
  end
end

##
# Dossier contenant les historiques de travail
#
def folder
  @folder ||= File.join(DATA_FOLDER, 'historiques_travail')
end

end #/<< self
end #/Historique
