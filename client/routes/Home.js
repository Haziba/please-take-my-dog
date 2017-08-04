var 	React = require('react'),
	DogGrid = require('../components/DogGrid.js');

var Home = React.createClass({
	render: function() {
		return (
			<div>
				<p>Home Page</p>
				<DogGrid key="dog-grid" />
			</div>
		);
	},
});

module.exports = Home;
