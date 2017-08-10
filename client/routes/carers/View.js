var 	React 	= require('react'),
	DogGrid = require('../../components/DogGrid.js');

var ViewCarer = React.createClass({
	getInitialState: function(){
		return { loaded: false };
	},

	componentWillMount: function(){
		var that = this;

		window.Auth.then(function(result){
			if(!result.authed){
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

		return 	<div>
				<p>{this.state.carer.name}'s Account</p>

				<DogGrid admin={true} carerId={this.state.carer.id} key={this.state.carer.id}/>
			</div>;
	}
});

module.exports = ViewCarer;
