var React = require('react'),
	Router = require('react-router'),
	ImageHelper = require('../helpers/ImageHelper.js');

var DogListItem = React.createClass({
	render: function(){
		return 	<div className="row">
				<Router.Link to={"/dog/" + this.props.dog.id + "/" + this.props.dog.name}>
					<div className="col-xs-12 col-md-8">
						<div className="col-xs-12 col-sm-6">
							{ImageHelper.FirstImage(this.props.dog.images)}
						</div>
						<h5 className="col-xs-12 col-sm-6">{this.props.dog.name}</h5>
					</div>
				</Router.Link>
			</div>;
	}
});

module.exports = DogListItem;
