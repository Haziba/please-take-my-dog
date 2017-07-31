var React = require('react');

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
					{this.state.dogs.map(function(dog){ return <Dog details={dog} key={dog.id} /> })}
				</div>;
		}

		return dogs;
	}
});

var Dog = React.createClass({
	render: function(){
		return 	<div className="col-xs-6 col-sm-4 col-md-3">
				<h3>{this.props.details.name}</h3>
				<div><img className="col-xs-12" src={this.props.details.imageUrl} /></div>
				<div>{this.props.details.breed}</div>
			</div>;
	}
});

module.exports = Home;
