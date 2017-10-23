var React = require('react'),
	Router = require('react-router'),
	ImageHelper = require('../../helpers/ImageHelper.js');

var ViewRequest = React.createClass({
	getInitialState: function(){
		return { loaded: false };
	},

	componentWillMount: function(){
		var that = this;

	   $.get("/request/" + this.props.params.id).then(function(result){
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
		});*/
	},

	render: function() {
		if(!this.state.loaded){
			return <div><p>Loading request...</p></div>;
		}

		return (
		<div>
      Request! {this.state.request}
		</div>
		);
	}
});

module.exports = ViewRequest;
