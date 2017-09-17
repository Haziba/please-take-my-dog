var React = require('react');

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
						<input type="image" className="btn btn-default" />
					</label>
					<br />
					<input type="submit" value="Log In" className="btn btn-success" disabled={this.state.posting} />
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
