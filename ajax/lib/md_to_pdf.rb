# encoding: UTF-8
=begin

  Module qui permet de convertir un fichier Markdown en un
  fichier PDF
  (avec wkhtmltopdf et Kramdown)
=end
require 'kramdown'

EBOOK_CONVERT_CMD = '/Applications/calibre.app/Contents/MacOS/ebook-convert'


class MdToPdf
class << self
  def convert source, dst_name = nil
    convertor = new(source)
    return convertor.convert
  end

end # /<< self


attr_reader :src_path

def initialize path
  @src_path = path
end

def convert
  log.puts "* Conversion du fichier #{src_path}"

  convert_to_html || return

  convert_to_pdf

  if pdf?
    File.delete(html_path)
    log.close
    # File.delete(log_path) # pour le moment on le garde
    return true
  else
    log.puts "=== Fichier PDF introuvable ==="
    return false
  end

  log.puts "= Conversion effectuée ="
end

def convert_to_html
  log.puts "* Markdown => HTML"

  # Débug
  # log.puts "= CODE HTML:\n#{code_html}\n\n"

  File.open(html_path,'wb'){|f| f.write code_html }

  success = File.exist?(html_path) && code_html.length > 0

  if success
    log.puts "= Markdown => HTML (fichier HTML produit avec succès)" 
  else
    log.puts "# Impossible de produire le fichier HTML…"
  end

  return success
end

def pdf?
  File.exist?(pdf_path)
end

##
# Convertir le fichier HTML en PDF
def convert_to_pdf
  convert_to_pdf_with_wk || convert_to_pdf_with_calibre
end

def convert_to_pdf_with_calibre
  res = `#{EBOOK_CONVERT_CMD} '#{html_path}' '#{pdf_path}' 2>&1`
  log.puts "<- Retour opération Calibre : #{res.force_encoding('utf-8')}"
  File.exist?(pdf_path)
end
def convert_to_pdf_with_wk
  res = `/usr/local/bin/wkhtmltopdf "file://#{html_path}" "wk-#{pdf_path}" 2>&1`
  log.puts "<- Retour opération wkhtmltopdf : #{res.force_encoding('utf-8')}"
  File.exist?(pdf_path)
end

##
# @return le code HTML du fichier
#
def code_html
  @code_html ||= begin
    # log.puts("CODE MARKDOWN:\n#{code_md}\n\n")
    Kramdown::Document.new(code_md, kramdown_options).to_html
  end
end
def kramdown_options
  {
    header_offset:    0, # pour que '#' fasse un chapter
  }
end


# @return le code Markdown original
#
def code_md
  @code_md ||= File.read(src_path).force_encoding('utf-8')
end

def log
  @log ||= begin
    File.delete(log_path) if File.exist?(log_path)
    File.open(log_path,'a')
  end
end

def html_path
  @html_path ||= File.join(folder, "#{affixe}.html")
end
def pdf_path
  @pdf_path ||= File.join(folder, "#{affixe}.pdf")
end

def affixe
  @affixe ||= File.basename(src_path, File.extname(src_path))
end

def log_path
  @log_path ||= File.join(folder,'suivi.log')
end

def folder
  @folder ||= File.dirname(src_path)
end
end #/MdToPdf
