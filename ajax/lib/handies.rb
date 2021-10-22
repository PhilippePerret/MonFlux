# encoding: UTF-8

##
# Enregistre un message log
# 
# Rappel : quand le fichier log n'existe pas, il est initié par le
# script ajax_by_php.php
#
def log(msg)
  logfile = File.join(APP_FOLDER,'ajax.log')
  File.open(logfile, 'a'){|f| f.puts("#{Time.now.strftime('%Y %m %d - %H:%M:%S')} --- #{msg}")}
end
