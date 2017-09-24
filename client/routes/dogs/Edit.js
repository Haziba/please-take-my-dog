var React = require('react'),
	Router = require('react-router'),
	ImageHelper = require('../../helpers/ImageHelper.js');

var EditDog = React.createClass({
	getInitialState: function(){
    return { loaded: false, posting: false };
	},

	componentWillMount: function(){
		var that = this;

		$.get("/api/dog/" + this.props.params.id).then(function(result){
			let admin;
			if(that.state.self){
				admin = that.state.self.id == result.data.dog.carerid;
			}
			that.setState({ loaded: true, dog: result.data.dog, carer: result.data.carer, admin: admin });
		});

		window.Auth.get().then((result) => {
			let admin;
			if(that.state.dog){
				admin = that.state.dog.carerid == result.carer.id;
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

		let images = this.state.dog.images.map((image) => {
			return <div className="col-xs-2">
				{ImageHelper.Image(image)}
				<button className="btn btn-xs btn-danger" onClick={(e) => this._handleImageRemoval(e, image)}>Remove</button>
			</div>
		});

		return (
			<div>
        <div className="row">
          <div className="col-sm-4">
				    <h2>Edit {this.state.dog.name}</h2>
          </div>

          <div className="text-right col-sm-8">
            <div className="btn-group">
              <Router.Link to={`/dog/${this.state.dog.id}/transfer`} className="btn btn-primary">Transfer Ownership</Router.Link>
              <button className="btn btn-warning" onClick={this._handlePassingOn}>Passed Away</button>
              <button className="btn btn-danger" onClick={this._handleDelete}>Delete</button>
            </div>
          </div>
        </div>

				{error}

				<form className="form-horizontal" onSubmit={this.handleSubmit}>
					<div className="form-group">
						<label className="control-label col-sm-2" htmlFor="name">Name:</label>
						<div className="col-sm-10">
							<input type="text" name="name" className="form-control" value={this.state.dog.name} onChange={this.handleChange} disabled={this.state.posting} />
						</div>
					</div>

					<div className="form-group">
						<label className="control-label col-sm-2" htmlFor="size">Size:</label>
						<div className="col-sm-10">
							<input type="number" className="form-control" name="size" value={this.state.dog.size} onChange={this.handleChange} disabled={this.state.posting} />
						</div>
					</div>

					<div className="form-group">
						<label className="control-label col-sm-2" htmlFor="location"s>Location:</label>
						<div className="col-sm-10">
							<input type="text" className="form-control" name="location" value={this.state.dog.location} onChange={this.handleChange} disabled={this.state.posting} />
						</div>
					</div>

					<div className="form-group">
						<label className="control-label col-sm-2" htmlFor="breed">Breed:</label>
						<div className="col-sm-10">
							<input type="text" className="form-control" name="breed" value={this.state.dog.breed} onChange={this.handleChange} disabled={this.state.posting} />
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
							<input type="submit" value="Update" className="btn btn-success" disabled={this.state.posting} />
						</div>
					</div>
				</form>
			</div>
		);
	},

	handleChange: function(e){
		var change = this.state.dog;

    change[e.target.name] = e.target.value;

		this.setState({dog: change});
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
				let images = that.state.dog.images;

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

		$.ajax({
      url: `/api/dog/${this.state.dog.id}`,
      data: { dog: this.state.dog },
      type: 'PUT',
		}).then(function(result){
			if(result.success){
        location = "/dog/" + that.state.dog.id + "/" + that.state.dog.name;
			} else {
				// todo: Validation
				console.log("Failed");
			}
		});
	},

	_handleImageRemoval: function(e, image){
		e.preventDefault();

		this.state.dog.images.splice(this.state.dog.images.indexOf(image), 1);
		this.setState({images: this.state.dog.images});
	},

  _handlePassingOn: function(e){
    alert("Passing on not supported. Dogs live forever");
  },

  _handleDelete: function(e){
    var confirm = window.confirm("Are you sure? If this dog has changed owner or unfortunately passed on, please choose those options instead");

    if(confirm){
      $.ajax({
        url: '/api/dog/' + this.state.dog.id,
        type: 'DELETE'
      }).then((result) => {
        if(result.success){
          location = `/carer/${this.state.carer.id}`;
        } else {
          //todo: Handle failure
        }
      });
    }
  }
});

module.exports = EditDog;
