var React = require('react'),
	Router = require('react-router'),
	DogTimeline = require('../../components/DogTimeline.js'),
	ImageHelper = require('../../helpers/ImageHelper.js');

var ViewDog = React.createClass({
	getInitialState: function(){
		return { loaded: false };
	},

	componentWillMount: function(){
		var that = this;

		$.get("/api/dog/" + this.props.params.id).then(function(result){
			let admin;
			if(that.state.self){
				admin = that.state.self.id == result.data.dog.carerid;
			}
			that.setState({ loaded: true, dog: result.data.dog, carer: result.data.carer, admin: admin });
		});

		window.Auth.then((result) => {
			let admin;
			if(that.state.dog){
				admin = that.state.dog.carerid == result.carer.id;
			}
			that.setState({ self: result.carer, admin: admin });
		});
	},

	render: function() {
		if(!this.state.loaded){
			return <div><p>Loading {this.props.params.name}...</p></div>;
		}

		let adminControls;

		if(this.state.admin){
			if(this.state.transfercarerid){
				adminControls =
					<div className="col-xs-6 text-right">
						<Router.Link to={`/dog/${this.state.dog.id}/edit`} className="btn btn-default">Edit</Router.Link>
					</div>;
			} else {
				adminControls =
					<div className="col-xs-6 text-right">
						<button className="btn btn-default" disabled={true}>Transfer in Progress</button>
					</div>;
			}
		}

		return (
		<div>
			<div className="row">
				<h2 className="col-xs-6">{this.state.dog.name}</h2>
				{adminControls}
			</div>

			<div className="row">
				<div className="col-xs-6">
					<p>Breed: {this.state.dog.breed}</p>
					<p>Size: {this.state.dog.size}</p>
				</div>
				<div className="col-xs-6 text-right">
					<h4>Carer</h4>
					<Router.Link to={"/carer/" + this.state.carer.id}>{this.state.carer.name}</Router.Link>
				</div>
				<div className="col-xs-12">
					{ImageHelper.Gallery(this.state.dog.images)}
				</div>
			</div>
			<DogTimeline dog={this.state.dog} admin={this.state.admin} key={`timeline-${this.state.dog.id}`} />
		</div>
		);
	}
});

module.exports = ViewDog;
