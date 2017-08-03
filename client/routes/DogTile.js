var React = require('react'),
	Router = require('react-router');

var DogTile = React.createClass({
	render: function(){
		return 	<div className="col-xs-6 col-sm-4 col-md-3">
				<h3>{this.props.details.name}</h3>
				<div><img className="col-xs-12" src={this.props.details.imageurl} /></div>
				<div>{this.props.details.breed}</div>
				<Router.Link to={"/viewDog/" + this.props.details.id + "/" + this.props.details.name}>View Dog</Router.Link>
			</div>;
	}
});

module.exports = DogTile;
