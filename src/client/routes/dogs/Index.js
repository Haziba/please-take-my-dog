var 	React = require('react'),
	DogGrid = require('../../components/DogGrid.js');

var ViewDogs = React.createClass({
	render: function() {
		return (
			<div>
				<DogGrid key="dog-grid" />
			</div>
		);
	},
});

module.exports = ViewDogs;
