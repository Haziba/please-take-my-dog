var React = require('react'),
	Router = require('react-router'),
	Image = require('cloudinary-react').Image;

var DogTile = React.createClass({
	render: function(){
		return	<Router.Link to={"/dog/" + this.props.details.id + "/" + this.props.details.name}>
				<div className="col-xs-6 col-sm-4 col-md-3">
					<div className="dog-tile">
						<div>{this._firstImage()}</div>
						<h3 className="text-center">{this.props.details.name}</h3>
					</div>
				</div>
			</Router.Link>;
	},

	_images: function(){
		if(!this.props.details.images || this.props.details.images.length < 1 || this.props.details.images[0] == "h")
			return false;
		return JSON.parse(this.props.details.images);
	},

	_firstImage: function(){
		let images = this._images();
		return images ? <Image cloudName="haziba" publicId={images[0].public_id}></Image> : "";
	}
});

module.exports = DogTile;
