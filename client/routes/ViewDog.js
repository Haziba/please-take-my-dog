var React = require('react');

var ViewDog = React.createClass({
	render: function() {
		return (
			<p>View {this.props.params.name}</p>
		);
	}
});

module.exports = ViewDog;
