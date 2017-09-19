var React = require('react'),
	Router = require('react-router'),
	ImageHelper = require('../helpers/ImageHelper.js');

var DogTile = React.createClass({
	render: function(){
		return	<Router.Link to={"/dog/" + this.props.details.id + "/" + this.props.details.name}>
				<div className="col-xs-6 col-sm-4 col-md-3">
					<div className="dog-tile">
						<div>{ImageHelper.FirstImage(this.props.details.images)}</div>
						<h3 className="text-center">{this.props.details.name}</h3>
					</div>
				</div>
			</Router.Link>;
	}
});

module.exports = DogTile;
