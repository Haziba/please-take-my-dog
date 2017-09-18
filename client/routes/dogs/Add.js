var React = require('react'),
	ImageHelper = require('../../helpers/ImageHelper.js');

var AddDog = React.createClass({
	getInitialState: function(){
		return { loaded: false, posting: false, name: "", size: 10, location: "52.00000,-1.00000", breed: null, images: [] };
	},

	componentWillMount: function(){
		var that = this;

		Auth.then(function(result){
			that.setState({loaded: true, carer: result.carer});
		});
	},

	render: function() {
		var error;

		if(!this.state.loaded){
			return 	<div>
					Loading form...
				</div>;
		}

		if(this.state.error){
			error = <div>{this.state.error}</div>;
		}

		let images = this.state.images.map((image) => {
			return <div className="col-xs-2">
				{ImageHelper.Image(image)}
				<button className="btn btn-xs btn-danger" onClick={(e) => this._handleImageRemoval(e, image)}>Remove</button>
			</div>
		});

		return (
			<div>
				<h2>Add A Dog</h2>
				{error}
				<form className="form-horizontal" onSubmit={this.handleSubmit}>
					<div className="form-group">
						<label className="control-label col-sm-2" htmlFor="name">Name:</label>
						<div className="col-sm-10">
							<input type="text" name="name" className="form-control" value={this.state.name} onChange={this.handleChange} disabled={this.state.posting} />
						</div>
					</div>

					<div className="form-group">
						<label className="control-label col-sm-2" htmlFor="size">Size:</label>
						<div className="col-sm-10">
							<input type="number" className="form-control" name="size" value={this.state.size} onChange={this.handleChange} disabled={this.state.posting} />
						</div>
					</div>

					<div className="form-group">
						<label className="control-label col-sm-2" htmlFor="location"s>Location:</label>
						<div className="col-sm-10">
							<input type="text" className="form-control" name="location" value={this.state.location} onChange={this.handleChange} disabled={this.state.posting} />
						</div>
					</div>

					<div className="form-group">
						<label className="control-label col-sm-2" htmlFor="breed">Breed:</label>
						<div className="col-sm-10">
							<input type="text" className="form-control" name="breed" value={this.state.breed} onChange={this.handleChange} disabled={this.state.posting} />
						</div>
					</div>

					<div className="form-group">
						<label className="control-label col-sm-2" htmlFor="picture">Picture:</label>
						<div className="col-sm-10">
							<input type="image" className="btn btn-default" value="Upload" onClick={this.handleImageWidget} />
						</div>
						<div className="col-sm-10 col-sm-offset-2">
							<div className="row">
								{images}
							</div>
						</div>
					</div>

					<div className="form-group">
						<div className="col-sm-10 col-sm-offset-2">
							<input type="submit" value="Add Dog" className="btn btn-success" disabled={this.state.posting} />
						</div>
					</div>
				</form>
			</div>
		);
	},

	handleChange: function(e){
		var change = {};

		change[e.target.name] = e.target.value;

		this.setState(change);
	},

	handleImageWidget: function(e){
		var that = this;

		e.preventDefault();

		cloudinary.openUploadWidget({
			cloud_name: 'haziba',
			upload_preset: 'whats-up-dog',
			folder: `carer-${this.state.carer.Id}`,
			sources: ['facebook', 'instagram', 'google_photos', 'local', 'url'],
		}, function(error, result) {
			//todo: Handle error
			if(!error){
				let images = that.state.images;

				for(let i = 0; i < result.length; i++){
					images.push({version: result[i].version, public_id: result[i].public_id});
				}

				that.setState({images: images});
			}
		});
	},

	handleSubmit: function(e){
		var that = this;
		e.preventDefault();

		that.setState({ posting: true });

		$.post("/api/dogs/add", {
			carerId: that.state.carer.id,
			name: that.state.name,
		  size: that.state.size,
			location: that.state.location,
			breed: that.state.breed,
			images: JSON.stringify(that.state.images),
		}, function(result){
			if(result.success){
				location = "/carer/" + that.state.carer.id;
			} else {
				// todo: Validation
				console.log("Failed");
			}
		});
	},

	_handleImageRemoval: function(e, image){
		e.preventDefault();

		this.state.images.splice(this.state.images.indexOf(image), 1);
		this.setState({images: this.state.images});
	}
});

module.exports = AddDog;
