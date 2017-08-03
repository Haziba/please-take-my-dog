var React = require('react'),
	Router = require('react-router'),
	DogTile = require('./DogTile.js');

var MyAccount = React.createClass({
	getInitialState: function(){
		return { loaded: false };
	},

	componentWillMount: function(){
		var that = this;

		window.Auth.then(function(result){
			if(!result.success){
				location = "/";
				return;
			}

			that.setState({loaded: true, carer: result.carer});
		});
	},

	render: function() {
		if(!this.state.loaded){
			return (
				<p>Loading account...</p>
			);
		}

		return 	<div>
				<p>{this.state.carer.name}'s Account</p>
				<MyDogs carerId={this.state.carer.id} key={this.state.carer.id}/>
			</div>;
	}
});

var MyDogs = React.createClass({
	getInitialState: function(){
		return { loaded: false };
	},

	componentWillMount: function(){
		var that = this;

		$.get("/api/dogs/" + this.props.carerId, function(data){
			console.log("Got dogs");
			that.setState({loaded: true, dogs: data});
		});
	},

	render: function(){
		if(!this.state.loaded){
			return (
				<p>Loading dogs...</p>
			);
		}

		return 	<div>
				<div className="row">
					<div className="col-xs-6">
						<p>You have {this.state.dogs.length} dogs</p>
					</div>
					<div className="col-xs-6 text-right">
						<Router.Link to={"/dogs/add" }>Add Dog</Router.Link>
					</div>
				</div>
				<div className="row">
					{this.state.dogs.map(function(dog){ return <DogTile details={dog} key={dog.id} /> })}
				</div>
			</div>;
	}
});

module.exports = MyAccount;
