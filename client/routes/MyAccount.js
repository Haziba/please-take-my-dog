var React = require('react');

var MyAccount = React.createClass({
	getInitialState(){
		return { loaded: false };
	},

	componentWillMount: function(){
		var that = this;

		window.Auth.then(function(result){
			if(!result.success){
				location = "/";
				return;
			}

			that.setState({loaded: true, carer: result.carer});
		});
	},

	render: function() {
		if(!this.state.loaded){
			return (
				<p>Loading account...</p>
			);
		}

		return <p>{this.state.carer.name}'s Account</p>;
	}
});

module.exports = MyAccount;
