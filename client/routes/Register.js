var React = require('react');
import Cookies from 'universal-cookie';

var Register = React.createClass({
	getInitialState: function(){
		return { registering: false, email: "", pass: "", name: "", confirmPass: "" };
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
						<label className="control-label col-xs-2" htmlFor="pass">Password:</label>
						<div className="col-xs-10">
							<input type="password" name="pass" className="form-control" value={this.state.pass} onChange={this.handleChange} disabled={this.state.registering} />
						</div>
					</div>

					<div className="form-group">
						<label className="control-label col-xs-2" htmlFor="confirmPass">Confirm Password:</label>
						<div className="col-xs-10">
							<input type="password" name="confirmPass" className="form-control" value={this.state.confirmPass} onChange={this.handleChange} disabled={this.state.registering} />
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

		if(this.state.pass.length == 0){
			that.setState({ registering: false, error: "Email invalid" });
			return;
		}

		if(this.state.pass != this.state.confirmPass){
			that.setState({ registering: false, error: "Passwords do not match" });
			return;
		}

		$.post("/api/auth/register", {email: this.state.email, pass: this.state.pass, name: this.state.name}, function(result){
			if(result.success){
				(new Cookies()).set('auth', `${result.data.carer.email}:${result.data.carer.authtoken}`);
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
