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
						Event:
						<input type="text" name="event" onChange={this.handleChange} disabled={this.state.posting} />
					</label>
					<br />
					<label>
						Occurred On:
						<input type="date" name="occurredOn" onChange={this.handleChange} disabled={this.state.posting} />
					</label>
					<br />
					<input type="submit" value="Add Event" disabled={this.state.posting} />
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

		console.log(this.state.dog);
		var timeline = this.state.dog.timeline ? JSON.parse(this.state.dog.timeline) : [];
		timeline.push({event: this.state.event, occurredOn: this.state.occurredOn});
		this.state.dog.timeline = JSON.stringify(timeline);
		console.log(this.state.dog);

		$.post("/api/dog/" + that.state.dog.id + "/update", {
			dog: this.state.dog
		}, function(result){
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
