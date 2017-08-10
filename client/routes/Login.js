var React = require('react');

var Login = React.createClass({
	getInitialState: function(){
		return { loggingIn: false, email: "", pass: "" };
	},

	render: function() {
		var error;

		if(this.state.error){
			error = <div>{this.state.error}</div>;
		}

		return (
			<div>
				<p>Login Page</p>
				{error}
				<form onSubmit={this.handleSubmit}>
					<label>
						Email:
						<input type="text" name="email" value={this.state.email} onChange={this.handleChange} disabled={this.state.loggingIn} />
					</label>
					<br />
					<label>
						Password:
						<input type="password" name="pass" value={this.state.pass} onChange={this.handleChange} disabled={this.state.loggingIn} />
					</label>
					<br />
					<input type="submit" value="Log In" disabled={this.state.loggingIn} />
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

		$.post("/api/auth/login", {email: this.state.email, pass: this.state.pass}, (result) => {
			if(result.success){
				var authTicket = $.cookie("auth", result.data.email + ":" + result.data.pass);
				location = "/";
			} else {
				that.setState({ loggingIn: false, error: result.message });
			}
		}).catch((result) => {
				that.setState({ loggingIn: false, error: result.responseJSON.message })
		});
	}
});

module.exports = Login;
