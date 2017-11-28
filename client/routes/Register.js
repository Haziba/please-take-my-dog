var React = require('react');

var Register = React.createClass({
	getInitialState: function(){
		return { registering: false, email: "", password: "", name: "", confirmPassword: "" };
	},

	render: function() {
		var error;

		if(this.state.error){
			error = <div>{this.state.error}</div>;
		}

		return (
			<div>
				<h2>Register</h2>
				{error}
				<form className="form-horizontal" onSubmit={this.handleSubmit}>
					<div className="form-group">
						<label className="control-label col-xs-2" htmlFor="email">Email:</label>
						<div className="col-xs-10">
							<input type="text" name="email" className="form-control" value={this.state.email} onChange={this.handleChange} disabled={this.state.registering} />
						</div>
					</div>

					<div className="form-group">
						<label className="control-label col-xs-2" htmlFor="name">Name:</label>
						<div className="col-xs-10">
							<input type="text" name="name" className="form-control" value={this.state.name} onChange={this.handleChange} disabled={this.state.registering} />
						</div>
					</div>

					<div className="form-group">
						<label className="control-label col-xs-2" htmlFor="password">Password:</label>
						<div className="col-xs-10">
							<input type="password" name="password" className="form-control" value={this.state.password} onChange={this.handleChange} disabled={this.state.registering} />
						</div>
					</div>

					<div className="form-group">
						<label className="control-label col-xs-2" htmlFor="confirmPassword">Confirm Password:</label>
						<div className="col-xs-10">
							<input type="password" name="confirmPassword" className="form-control" value={this.state.confirmPassword} onChange={this.handleChange} disabled={this.state.registering} />
						</div>
					</div>

					<div className="form-group">
						<div className="col-xs-10 col-xs-offset-2">
							<input type="submit" value="Log In" className="btn btn-success" disabled={this.state.loggingIn} />
						</div>
					</div>
				</form>
			</div>
		);
	},

	componentDidMount: function(){
		console.log(true);
	},

	handleChange: function(e){
		var change = {};

		change[e.target.name] = e.target.value;

		this.setState(change);
	},

	handleSubmit: function(e){
		var that = this;
		e.preventDefault();

		that.setState({ registering: true });

		if(this.state.email.length == 0 || this.state.email.indexOf("@") < 0){
			that.setState({ registering: false, error: "Email invalid" });
			return;
		}

		if(this.state.password.length == 0){
			that.setState({ registering: false, error: "Email invalid" });
			return;
		}

		if(this.state.password != this.state.confirmPassword){
			that.setState({ registering: false, error: "Passwords do not match" });
			return;
		}

		$.post("/api/auth/register", {email: this.state.email, password: this.state.password, name: this.state.name}, function(result){
			if(result.success){
				window.Auth.logIn(result.data.authTicket, result.data.carer);
				location = "/";
			} else {
				that.setState({ registering: false, error: result.message });
			}
		}).catch(function(result){
			that.setState({registering: false, error: result.responseJSON.message});
		});
	}
});

module.exports = Register;
