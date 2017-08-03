var React = require('react'),
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
				<p>You have {this.state.dogs.length} dogs</p>
				{this.state.dogs.map(function(dog){ return <DogTile details={dog} key={dog.id} /> })}
			</div>
	}
});

module.exports = MyAccount;
