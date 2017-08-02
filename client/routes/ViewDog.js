var React = require('react');

var ViewDog = React.createClass({
	componentWillMount: function(){
		var that = this;

		$.get("/api/dog/" + this.props.params.id).then(function(details){
			that.setState({details: details});
		});
	},

	render: function() {
		if(this.state && this.state.details){
			return (
				<div>
					<p>{this.state.details.name}</p>
					<p>Breed: {this.state.details.breed}</p>
					<p>Size: {this.state.details.size}</p>
					<img clasName="col-xs-12" src={this.state.details.imageurl} />
				</div>
			);
		}

		return <div><p>Loading {this.props.params.name}...</p></div>;
	}
});

module.exports = ViewDog;
