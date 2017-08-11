var React = require('react');

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
				<p>Register</p>
				{error}
				<form onSubmit={this.handleSubmit}>
					<label>
						Email:
						<input type="text" name="email" value={this.state.email} onChange={this.handleChange} disabled={this.state.registering} />
					</label>
					<br />
					<label>
						Name:
						<input type="text" name="name" value={this.state.name} onChange={this.handleChange} disabled={this.state.registering} />
					</label>
					<br />
					<label>
						Password:
						<input type="password" name="pass" value={this.state.pass} onChange={this.handleChange} disabled={this.state.registering} />
					</label>
					<br />
					<label>
						Confirm Password:
						<input type="password" name="confirmPass" value={this.state.confirmPass} onChange={this.handleChange} disabled={this.state.registering} />
					</label>
					<br />
					<input type="submit" value="Log In" disabled={this.state.loggingIn} />
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
				var authTicket = $.cookie("auth", result.data.carer.email + ":" + result.data.carer.pass);
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
