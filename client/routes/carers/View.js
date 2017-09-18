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

			if(that.props.params.id == result.carer.id){
				that.setState({loaded: true, carer: result.carer, admin: true});
			} else {
				$.get('/api/carer/' + that.props.params.id).then((carerResult) => {
					that.setState({loaded: true, carer: carerResult.data.carer, admin: false});
				});
			}
		});
	},

	render: function() {
		if(!this.state.loaded){
			return (
				<p>Loading account...</p>
			);
		}

		return 	<div>
				<h2>{this.state.carer.name}'s Account</h2>

				<DogGrid admin={this.state.admin} carerId={this.state.carer.id} key={this.state.carer.id}/>
			</div>;
	}
});

module.exports = ViewCarer;
