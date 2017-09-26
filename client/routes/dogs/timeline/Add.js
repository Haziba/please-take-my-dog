var React = require('react');

var AddTimeline = React.createClass({
	getInitialState: function(){
		return { loaded: false, posting: false, event: "", occurredOn: new Date() };
	},

	componentWillMount: function(){
		var that = this;

		$.get("/api/dog/" + this.props.params.dogId).then((result) => {
			that.setState({dog: result.data.dog});
		});

		Auth.get(function(result){
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
				<h2>Add Dog</h2>
				{error}
				<form onSubmit={this.handleSubmit} className="form-horizontal">
					<div className="form-group">
						<label className="control-label col-sm-2" htmlFor="event">Event:</label>
						<div className="col-sm-10">
							<input type="text" name="event" className="form-control" onChange={this.handleChange} disabled={this.state.posting} />
						</div>
					</div>

					<div className="form-group">
						<label className="control-label col-sm-2" htmlFor="occurredOn">Occurred On:</label>
						<div className="col-sm-10">
							<input type="date" name="occurredOn" className="form-control" onChange={this.handleChange} disabled={this.state.posting} />
						</div>
					</div>

					<div className="form-group">
						<div className="col-sm-10 col-sm-offset-2">
							<input type="submit" value="Add Event" className="btn btn-success" disabled={this.state.posting} />
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

	handleSubmit: function(e){
		var that = this;
		e.preventDefault();

		that.setState({ posting: true });
		console.log("Hello", this.state.dog, this.state.dog.timeline);
		this.state.dog.timeline.push({event: this.state.event, occurredOn: this.state.occurredOn});

		$.post({
			url: "/api/dog/" + that.state.dog.id,
			data: { dog: this.state.dog },
			type: 'put',
		}).then((result) => {
			if(result.success){
				location = "/dog/" + that.state.dog.id + "/" + that.state.dog.name;
			} else {
				// todo: Validation
				console.log("Failed");
			}
		});
	}
});

module.exports = AddTimeline;
