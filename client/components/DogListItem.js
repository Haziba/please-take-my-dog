var React = require('react'),
	Router = require('react-router'),
	ImageHelper = require('../helpers/ImageHelper.js');

var DogListItem = React.createClass({
	render: function(){
		return 	<div className="row">
				<div className="col-xs-12 col-md-8">
					<div className="col-xs-12 col-sm-6">
						{ImageHelper.FirstImage(this._images())}
					</div>
					<h5 className="col-xs-12 col-sm-6">{this.props.dog.name}</h5>
				</div>
			</div>;
	},

	_images: function(){
		if(!this.props.dog.images || this.props.dog.images.length < 1)
			return false;
		return JSON.parse(this.props.dog.images);
	}
});

module.exports = DogListItem;
