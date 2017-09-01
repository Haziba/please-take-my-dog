var React = require('react');

var cl = cloudinary.Cloudinary.new({ cloud_name: "haziba" });
cl.init();

var AddDog = React.createClass({
	getInitialState: function(){
		return { loaded: false, posting: false, name: "", size: 10, location: "52.00000,-1.00000", breed: null };
	},

	componentWillMount: function(){
		var that = this;

		Auth.then(function(result){
			that.setState({loaded: true, carer: result.carer});
		});
	},

	componentDidMount: function(){
	  if($.fn.cloudinary_fileupload !== undefined) {
	    $("input.cloudinary-fileupload[type=file]").cloudinary_fileupload();
	  }
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

		let pictureUpload = $.cloudinary.unsigned_upload_tag()[0];

		return (
			<div>
				<p>Add Dog</p>
				{error}
				<form onSubmit={this.handleSubmit}>
					<label>
						Name:
						<input type="text" name="name" value={this.state.name} onChange={this.handleChange} disabled={this.state.posting} />
					</label>
					<br />
					<label>
						Size:
						<input type="number" name="size" value={this.state.size} onChange={this.handleChange} disabled={this.state.posting} />
					</label>
					<br />
					<label>
						Location:
						<input type="text" name="location" value={this.state.location} onChange={this.handleChange} disabled={this.state.posting} />
					</label>
					<br />
					<label>
						Breed:
						<input type="text" name="breed" value={this.state.breed} onChange={this.handleChange} disabled={this.state.posting} />
					</label>
					<br />
					<label>
						Picture:
						{pictureUpload}
					</label>
					<br />
					<input type="submit" value="Log In" disabled={this.state.posting} />
				</form>
			</div>
		);
	},

	handleChange: function(e){
		var change = {};

		change[e.target.name] = e.target.value;

		this.setState(change);
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
		}, function(result){
			if(result.success){
				location = "/carer/" + that.state.carer.id;
			} else {
				// todo: Validation
				console.log("Failed");
			}
		});
	}
});

module.exports = AddDog;
