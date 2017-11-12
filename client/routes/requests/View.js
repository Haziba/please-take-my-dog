var React = require('react'),
	Router = require('react-router'),
	ImageHelper = require('../../helpers/ImageHelper.js');

var ViewRequest = React.createClass({
	getInitialState: function(){
		return { loaded: false };
	},

	componentWillMount: function(){
		var that = this;

	   $.get("/api/request/" + this.props.params.id).then(function(result){
			let admin;
			if(that.state.self){
				admin = that.state.self.id == result.data.request.carerid;
			}
			that.setState({ loaded: true, dog: result.data.dog, carer: result.data.carer, request: result.data.request, admin: admin });
		});

		window.Auth.get((result) => {
			let admin;
			if(that.state.dog){
				admin = that.state.dog.carerid == result.carer.id;
			}
			that.setState({ self: result.carer, admin: admin });
		});
	},

	render: function() {
		if(!this.state.loaded){
			return <div><p>Loading request...</p></div>;
		}

		let formAnswers =
						<div className="col-xs-12 text-center">
							<button className="btn btn-primary" onClick={this._handleViewFormAnswers}><span>View Form Answers</span></button>
						</div>;

		if(this.state.viewFormAnswers){
			formAnswers = <div className="col-xs-12">
					<dl>
					{Object.keys(this.state.request.form.questions).map(key =>
						<div>
							<dt>{this.state.request.form.questions[key].q}</dt>
							<dd>{this.state.request.form.questions[key].a}</dd>
						</div>)}
					</dl>
				</div>
		}

		return (
		  <div className="row">
        <div className="col-xs-12 text-center">
          <h2>{this.state.carer.name} would like to {this.state.request.form.requestType} {this.state.dog.name}</h2>
        </div>

        <div className="col-xs-12 col-md-4 col-md-offset-1">
          {ImageHelper.Image(this.state.carer.avatar, {request_size: true})}
        </div>

        <div className="col-xs-12 col-md-4 col-md-offset-2">
          {ImageHelper.FirstImage(this.state.dog.images, {request_size: true})}
        </div>

				{formAnswers}
		  </div>
		);
	},

	_handleViewFormAnswers: function(){
		console.log("Handle view form answers");

		this.setState({viewFormAnswers: true});
	}
});

module.exports = ViewRequest;
