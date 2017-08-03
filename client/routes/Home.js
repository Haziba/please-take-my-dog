var 	React = require('react'),
	DogTile = require('./DogTile.js');

var Home = React.createClass({
	componentWillMount: function(){
		var that = this;

		$.get("/api/dogs").then(function(dogs){
			that.setState({dogs: dogs});
		});
	},

	render: function() {
		return (
			<div>
				<p>Home Page</p>
				{this._renderDogs()}
			</div>
		);
	},

	_renderDogs: function(){
		let dogs = <div>Loading dogs...</div>;

		if(this.state && this.state.dogs && this.state.dogs.length > 0){
			dogs = 	<div>
					{this.state.dogs.map(function(dog){ return <DogTile details={dog} key={dog.id} /> })}
				</div>;
		}

		return dogs;
	}
});

module.exports = Home;
