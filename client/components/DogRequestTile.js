var React = require('react'),
	Router = require('react-router'),
	ImageHelper = require('../helpers/ImageHelper.js');

var DogRequestTile = React.createClass({
	getInitialState: function(){
		return { accepting: false };
	},

	render: function(){
		console.log(this.props.request);
		return	<div className="col-xs-6 col-sm-4 col-md-3">
				<div className="dog-request-tile">
					<Router.Link to={"/request/" + this.props.request.id}>
						<h3 className="text-center">{this.props.carer.name} would like to have {this.props.dog.name}!</h3>
						<div className="row">
							<div className="col-xs-6">{ImageHelper.Image(this.props.carer.avatar)}</div>
							<div className="col-xs-6">{ImageHelper.FirstImage(this.props.dog.images)}</div>
						</div>
					</Router.Link>
				</div>
			</div>;
	}
});

module.exports = DogRequestTile;
