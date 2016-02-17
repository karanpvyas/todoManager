// var data = [
//    {id: 1,  todoText: "This is one comment"},
//    {id: 2, todoText: "This is *another* comment"}
// ];

var TodoElement = React.createClass({
	rawMarkup: function() {
    var rawMarkup = marked(this.props.todoText.toString(), {sanitize: true});
    return { __html: rawMarkup };
  	},

  	handleClick: function(e){
  		var todoId = this.props.id;
  		//console.log('1st');
  		this.props.handleClick(todoId);
  	},

	render: function(){
		return(
			<div className="todoElement">
				<span>  id: {this.props.id}.             </span>
				<span ><b>{this.props.todoText} </b>  </span>
				<button className="btn btn-danger" onClick={this.handleClick}>Done/Delete</button>				
			</div>
			);
	}
});

var TodoList = React.createClass({
	
	handleClick: function(todoId){
		//console.log("tofolist");
  		this.props.handleClick(todoId);
  	},

	render: function(){
		var temp=this;
		var todos = this.props.data.map(function(todo){
			return(
				<TodoElement id={todo.id} todoText={todo.todoText} handleClick={temp.handleClick} />
				);
		});
		return(
			<div className="todoList" >
				{todos}
			</div>
			);
	}
});


var TodoForm = React.createClass({
  getInitialState: function() {
    return {todoText: ''};
  },
  // handleAuthorChange: function(e) {
  //   this.setState({author: e.target.value});
  // },
  handleTodoTextChange: function(e) {
    this.setState({todoText: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    //var author = this.state.author.trim();
    var todoText = this.state.todoText.trim();
    if (!todoText) {
      return;
    }
    this.props.onTodoSubmit({todoText: todoText});
	this.setState({todoText: ''});
  },
  render: function() {
    return (
      <form className="todoForm" onSubmit={this.handleSubmit}>
        
        <input
          type="text"
          placeholder="Enter a new Todo"
          value={this.state.todoText}
          onChange={this.handleTodoTextChange}
        />
        <input type="submit" value="Post" />
      </form>
    );
  }
});


var TodoBox = React.createClass({

		getInitialState: function() {
	    	return {data: []};
	  	},
	//loading data from server
		handleClick: function(todoId){
  			//first make that todo disappear
  			console.log("to delete "+todoId);
  			//tell server to delete
			$.ajax({
				url: "/api/todos",
				dataType: 'json',
				type: 'POST',
				data: {'delete':todoId.toString()},
				success: function(data) {
        			this.setState({data: data});
      				}.bind(this),
      			error: function(xhr, status, err) {
      				this.setState({data: data});
        			console.error(this.props.url, status, err.toString());
      			}.bind(this)
			});  			
  		},

		handleTodoSubmit: function(todo){
			var todos = this.state.data;
			var newTodos = todos.concat([todo]);
			this.setState({data: newTodos});

			$.ajax({
				url: this.props.url,
				dataType: 'json',
				type: 'POST',
				data: todo,
				success: function(data) {
        			this.setState({data: data});
      				}.bind(this),
      			error: function(xhr, status, err) {
      				this.setState({data: comments});
        			console.error(this.props.url, status, err.toString());
      			}.bind(this)
			});
		},

		
	  	componentDidMount: function() {
    		this.loadTodosFromServer();
    		setInterval(this.loadTodosFromServer, this.props.pollInterval);
  		},

		loadTodosFromServer: function() {
	    $.ajax({
	      url: this.props.url,
	      dataType: 'json',
	      cache: false,
	      success: function(data) {
	        this.setState({data: data});
	      }.bind(this),
	      error: function(xhr, status, err) {
	        console.error(this.props.url, status, err.toString());
	      }.bind(this)
	    });
	  },

	render: function(){
		return(
			<div className="todoBox">
				<h1>TODOS:</h1>
				<TodoList data={this.state.data} handleClick={this.handleClick} />
				<TodoForm onTodoSubmit={this.handleTodoSubmit} />

			</div>
			);
	}
});

ReactDOM.render(
  <TodoBox url="/api/todos" pollInterval={2000} />,
  document.getElementById('content')
);