var React = require('react'),
	Router = require('react-router'),
	ImageHelper = require('../../helpers/ImageHelper.js');

var EditCarer = React.createClass({
	getInitialState: function(){
		return { loaded: false, posting: false };
	},

	componentWillMount: function(){
		var that = this;

		$.get("/api/carer/" + this.props.params.id).then(function(result){
			let admin;
			if(that.state.self){
				admin = that.state.self.id == result.data.carer.id;
			}
			that.setState({ loaded: true, carer: result.data.carer, admin: admin });
		});

		window.Auth.get((result) => {
			let admin;
			if(that.state.carer){
				admin = that.state.carer.id == result.carer.id;
			}
			that.setState({ self: result.carer, admin: admin });
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

		let image = (this.state.carer.avatar ? 
			<div className="col-xs-2">
				{ImageHelper.Image(image)}
				<button className="btn btn-xs btn-danger" onClick={(e) => this._handleImageRemoval(e, image)}>Remove</button>
			</div> : undefined);

		return (
			<div>
				<div className="row">
					<div className="col-sm-4">
						<h2>Edit Profile</h2>
					</div>
				</div>

				{error}

				<form className="form-horizontal" onSubmit={this.handleSubmit}>
					<div className="form-group">
						<label className="control-label col-sm-2" htmlFor="name">Name:</label>
						<div className="col-sm-10">
							<input type="text" name="name" className="form-control" value={this.state.carer.name} onChange={this.handleChange} disabled={this.state.posting} />
						</div>
					</div>

					<div className="form-group">
						<label className="control-label col-sm-2" htmlFor="picture">Picture:</label>
						<div className="col-sm-10">
							<input type="image" className="btn btn-default" value="Upload" onClick={this.handleImageWidget} />
						</div>
						<div className="col-sm-10 col-sm-offset-2">
							<div className="row">
								{image}
							</div>
						</div>
					</div>

					<div className="form-group">
						<div className="col-sm-10 col-sm-offset-2">
							<input type="submit" value="Update" className="btn btn-success" disabled={this.state.posting} />
						</div>
					</div>
				</form>
			</div>
		);
		return <div>Hello</div>;
	},

	handleChange: function(e){
		console.log("Test");
		let change = this.state.carer;
		console.log("Testo");

		change[e.target.name] = e.target.value;

		this.setState({carer: change});
	},

	handleImageWidget: function(e){
		let that = this;

		e.preventDefault();

		//todo: Limit people to only one image
		cloudinary.openUploadWidget({
			cloud_name: 'haziba',
			upload_preset: 'whats-up-dog',
			folder: `carer-${this.state.carer.Id}`,
			sources: ['facebook', 'instagram', 'google_photos', 'local', 'url'],
		}, function(error, result) {
			//todo: Handle error
			if(!error){
				let carer = that.state.carer;

				carer.avatar = {version: result[0].version, public_id: result[0].public_id};

				that.setState({carer: carer});
			}
		});
	},

	handleSubmit: function(e){
		var that = this;
		e.preventDefault();

		that.setState({ posting: true });

		$.ajax({
			url: `/api/carer/${this.state.carer.id}`,
			data: { carer: this.state.carer },
			type: 'PUT',
		}).then(function(result){
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

		this.state.carer.avatar = undefined;
		this.setState({carer: this.state.carer});
	}
});

module.exports = EditCarer;
