var React = require('react');

var ViewDog = React.createClass({
	getInitialState: function(){
		return { loaded: false };
	},

	componentWillMount: function(){
		var that = this;

		$.get("/api/dog/" + this.props.params.id).then(function(result){
			that.setState({ loaded: true, details: result.data });
		});
	},

	render: function() {
		if(!this.state.loaded){
			return <div><p>Loading {this.props.params.name}...</p></div>;
		}

		return (
			<div>
				<p>{this.state.details.name}</p>
				<p>Breed: {this.state.details.breed}</p>
				<p>Size: {this.state.details.size}</p>
				<img clasName="col-xs-12" src={this.state.details.imageurl} />
			</div>
		);
	}
});

module.exports = ViewDog;
