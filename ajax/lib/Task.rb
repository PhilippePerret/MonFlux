# encoding: UTF-8
require 'json'
require_relative 'constants'

class Task 

attr_reader :data

def initialize data
  @data = data
end


def save
  File.open(path,'wb'){|f| f.write(data.to_json)}
end

def id; @id ||= data['id'] end

def path
  @path ||= File.join(folder, "#{id}.json")
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
