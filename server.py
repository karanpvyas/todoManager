import json
import os
import time
from flask import Flask, Response, request

app = Flask(__name__, static_url_path='', static_folder='public')
app.add_url_rule('/', 'root', lambda: app.send_static_file('index.html'))

@app.route('/api/todos', methods=['GET', 'POST'])
def todos_handler():
    #print "opening the file with 'r' mode"
    with open('todos.json', 'r') as file:
        todos = json.loads(file.read())
    
    if request.method == 'POST':
        flag=0
        for i in request.form.to_dict():
            if i == 'delete':
                #print "i = delete"
                flag=1
                break
        if flag == 1:
            #delete
            idToDelete=request.form.to_dict()['delete']
            print "toDelete: "+str(idToDelete)
            print len(todos)
            for t in todos:
                if str(t['id']) == idToDelete:
                    print t
                    todos.remove(t)
        
        else:
            
            #sprint str(request.form.to_dict())    
            newTodo = request.form.to_dict()
            newTodo['id'] = int(time.time() * 1000)
            todos.append(newTodo)

        with open('todos.json', 'w') as file:
            file.write(json.dumps(todos, indent=4, separators=(',', ': ')))

    return Response(json.dumps(todos), mimetype='application/json', headers={'Cache-Control': 'no-cache', 'Access-Control-Allow-Origin': '*'})




if __name__ == '__main__':
    app.run(port=int(os.environ.get("PORT",3000)))
