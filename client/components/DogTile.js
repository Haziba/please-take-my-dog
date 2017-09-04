var React = require('react'),
	Router = require('react-router');

var DogTile = React.createClass({
	render: function(){
		return	<Router.Link to={"/dog/" + this.props.details.id + "/" + this.props.details.name}>
				<div className="col-xs-6 col-sm-4 col-md-3 dog-tile">
					<div><img src={this.props.details.imageurl} /></div>
					<h3 className="text-center">{this.props.details.name}</h3>
				</div>
			</Router.Link>;
	}
});

module.exports = DogTile;
