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
			adminControls =
				<div className="row">
					<div className="col-xs-12 text-right">
						<button className="btn btn-danger" onClick={this._handleDelete}><span>Delete Dog</span></button>
					</div>
				</div>;
		}

		return (
		<div>
			{adminControls}

			<div className="row">
				<div className="col-xs-6">
					<p>{this.state.dog.name}</p>
					<p>Breed: {this.state.dog.breed}</p>
					<p>Size: {this.state.dog.size}</p>
				</div>
				<div className="col-xs-6 text-right">
					<h4>Carer</h4>
					<Router.Link to={"/carer/" + this.state.carer.id}>{this.state.carer.name}</Router.Link>
				</div>
				<div className="col-xs-12">
					{ImageHelper.Gallery(this._images())}
				</div>
			</div>
			<DogTimeline dog={this.state.dog} admin={this.state.admin} key={this.state.dog.id} />
		</div>
		);
	},

	_images: function(){
		if(!this.state.dog.images || this.state.dog.images.length < 1)
			return false;
		return JSON.parse(this.state.dog.images);
	},

	_handleDelete: function(){
		var confirm = window.confirm("Are you sure? If this dog has changed owner or unfortunately passed on, please choose those options instead");

		if(confirm){
			$.ajax({
				url: '/api/dog/' + this.state.dog.id,
				type: 'DELETE'
			}).then((result) => {
				if(result.success){
					location = `/carer/${this.state.carer.id}`;
				} else {
					//todo: Handle failure
				}
			});
		}
	}
});

module.exports = ViewDog;
