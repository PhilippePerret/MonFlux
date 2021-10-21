# encoding: UTF-8


def log(msg)
  logfile = File.join(APP_FOLDER,'ajax.log')
  File.open(logfile, 'a'){|f| f.puts(msg)}
end
