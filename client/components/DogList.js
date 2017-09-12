var React = require('react'),
	Router = require('react-router'),
	DogListItem = require('./DogListItem.js');

var DogList = React.createClass({
	render: function(){
		return 	<div className="row">
				<h3>{this.props.listName}</h3>
				{this.props.dogs.map(function(dog){ return <DogListItem dog={dog} key={`dog-list-item-${dog.id}`} /> })}
			</div>;
	}
});

module.exports = DogList;
