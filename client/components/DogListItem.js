var React = require('react'),
	Router = require('react-router'),
	Image = require('cloudinary-react').Image;

var DogListItem = React.createClass({
	render: function(){
		return 	<div className="row">
				<div className="col-xs-12 col-md-8">
					<div className="col-xs-12 col-sm-6">
						{this._firstImage()}
					</div>
					<h5 className="col-xs-12 col-sm-6">{this.props.dog.name}</h5>
				</div>
			</div>;
	},

	_images: function(){
		if(!this.props.dog.images || this.props.dog.images.length < 1 || this.props.dog.images[0] == "h")
			return false;
		return JSON.parse(this.props.dog.images);
	},

	_firstImage: function(){
		let images = this._images();
		return images ? <Image cloudName="haziba" publicId={images[0].public_id}></Image> : "";
	}
});

module.exports = DogListItem;
