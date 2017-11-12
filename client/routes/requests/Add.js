var React = require('react'),
	Router = require('react-router');

var AddRequest = React.createClass({
	getInitialState: function(){
		return { loaded: false, posting: false, request: {
			dogid: this.props.params.dogid,
			form: {
				questions: {
					'livingSituation': {
						q: 'What\'s Your Living Situation:',
						a: ''
					},
						'doYouLikeDogs': {
							q: 'Do you like dogs:',
							a: ''
						}
				}
			},
			occurredOn: new Date().toISOString().slice(0, 19).replace('T', ' ')
		}};
	},

	componentWillMount: function(){
		var that = this;

		$.get("/api/dog/" + this.props.params.dogid).then(function(result){
			let admin = false;

			if(that.state.self){
				admin = that.state.self.id == result.data.dog.carerid;
			}
			that.setState({ loaded: true, dog: result.data.dog, carer: result.data.carer, admin: admin });
		});

		window.Auth.get((result) => {
			let admin;
			if(that.state.dog){
				admin = that.state.dog.carerid == result.carer.id;
			}

			var request = that.state.request;
			request.carerid = result.carer.id;

			that.setState({ self: result.carer, request: request, admin: admin });
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

		let questions = [];

		for(let q in this.state.request.form.questions){
			let question = this.state.request.form.questions[q];
			questions.push(<div className="form-group">
						<label className="control-label col-sm-2" htmlFor={q}>{question.q}</label>
						<div className="col-sm-10">
							<textarea className="form-control question" name={q} onChange={this.handleChange} disabled={this.state.posting}>
							</textarea>
						</div>
					</div>)
		}

		return (
			<div>
				<h2>Transfer {this.state.dog.name}</h2>

				{error}

				<form className="form-horizontal" onSubmit={this.handleSubmit}>
					<div className="form-group">
						<label className="control-label col-sm-2" htmlFor="requestType">Request Type:</label>
						<div className="col-sm-10">
							<label className="radio-inline"><input type="radio" name="requestType" onChange={this.handleChange} disabled={this.state.posting} value="adopt" />Adopt</label>
							<label className="radio-inline"><input type="radio" name="requestType" onChange={this.handleChange} disabled={this.state.posting} value="foster" />Foster</label>
						</div>
					</div>

					{questions}

					<div className="form-group">
						<div className="col-sm-10 col-sm-offset-2">
							<input type="submit" value="Request" className="btn btn-success" disabled={this.state.posting} />
						</div>
					</div>
				</form>
			</div>
		);
	},

	handleChange: function(e){
		var change = this.state.request.form;

		if(e.target.classList.contains('question')){
			change.questions[e.target.name].a = e.target.value;
		} else {
			change[e.target.name] = e.target.value;
		}

		this.setState({form: change});
	},

	handleSubmit: function(e){
		var that = this;
		e.preventDefault();

		that.setState({ posting: true });

		$.ajax({
			url: `/api/dog/${this.state.dog.id}/request`,
			data: this.state.request,
			type: 'POST',
		}).then(function(result){
			if(result.success){
				location = "/dog/" + that.state.dog.id + "/" + that.state.dog.name;
			} else {
				// todo: Validation
				console.log("Failed");
			}
		});
	}
});

module.exports = AddRequest;
