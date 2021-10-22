# encoding: UTF-8
=begin

  Script qui permet d'ouvrir un lien quelconque, fichier, dossier
  ou script

=end

require_relative '../lib/_required'
retour = {error:nil, message:[], path: nil}

begin

  link = JSON.parse(ARGV[0])['link']

  retour[:path] = link
  nfile = File.basename(link)

  if link.start_with?('http')
    #
    # Cas d'un lien HTML
    #
    `open -a Safari #{link}`

  elsif File.exist?(link)
    if File.directory?(link)
      retour[:message] << "#{link.inspect} est un dossier"
      res = `open -a Finder "#{link}"`
      retour[:message] << "Dossier #{nfile} ouvert."
    else
      case File.extname(link)
      when '.rb' then 
        retour[:message] << "#{link.inspect} est un script ruby"
        res = `ruby "#{link}" 2>&1`
        retour[:message] << "Script ruby #{nfile} joué (res = #{res})"
      else
        retour[:message] << "#{link.inspect} est un fichier normal à ouvrir"
        res = `open "#{link}" 2>&1`
        retour[:message] << "Fichier #{nfile} ouvert."
      end
    end
  else
    retour[:error] = "Le fichier/dossier #{link.inspect} est introuvable…"
  end

rescue Exception => e

  retour[:error] = "ERREUR À L'OUVERTURE : #{e.message}"

end

retour[:message] = retour[:message].join("\n")

puts retour.to_json
