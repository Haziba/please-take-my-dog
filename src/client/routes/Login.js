var React = require('react');
import {Navigation} from 'react-router';

var Login = React.createClass({
	mixins: [ Navigation ],

	getInitialState: function(){
		return { loggingIn: false, email: "", password: "" };
	},

	render: function() {
		var error;

		if(this.state.error){
			error = <div>{this.state.error}</div>;
		}

		return (
			<div>
				<h2>Login Page</h2>
				{error}
				<form className="form-horizontal" onSubmit={this.handleSubmit}>
					<div className="form-group">
						<label className="control-label col-sm-2" htmlFor="email">Email:</label>
						<div className="col-xs-10">
							<input type="text" name="email" className="form-control" value={this.state.email} onChange={this.handleChange} disabled={this.state.loggingIn} />
						</div>
					</div>

					<div className="form-group">
						<label className="control-label col-sm-2" htmlFor="password">Password:</label>
						<div className="col-xs-10">
							<input type="password" name="password" className="form-control" value={this.state.password} onChange={this.handleChange} disabled={this.state.loggingIn} />
						</div>
					</div>

					<div className="form-group">
						<div className="col-sm-10 col-sm-offset-2">
							<input type="submit" value="Log In" className="btn btn-success" disabled={this.state.loggingIn} />
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

		that.setState({ loggingIn: true });

		$.post("/api/auth/login", {email: this.state.email, password: this.state.password}, (result) => {
			if(result.success){
				window.Auth.logIn(result.data.authTicket, result.data.carer);
		    this.transitionTo('/');
			} else {
				that.setState({ loggingIn: false, error: result.message });
			}
		}).catch((result) => {
				that.setState({ loggingIn: false, error: result.responseJSON.message })
		});
	}
});

module.exports = Login;
