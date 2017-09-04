var	React 	= require('react'),
	Router 	= require('react-router'),
	DogListItem = require('./DogListItem.js');

var DogQuickList = React.createClass({
	getInitialState: function(){
		return { loaded: false };
	},

	componentWillMount: function(){
		var that = this;

		var url = "/api/dogs/quicklist";

		$.get(url, (result) => {
			that.setState({loaded: true, dogs: result.data.dogs});
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
					{this.state.dogs.map(function(dog){ return <DogListItem dog={dog} key={`dog-list-item-${dog.id}`} /> })}
				</div>
			</div>;
	}
});

module.exports = DogQuickList;
