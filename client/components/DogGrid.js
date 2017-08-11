var	React 	= require('react'),
	Router 	= require('react-router'),
	DogTile = require('./DogTile.js');

var DogGrid = React.createClass({
	getInitialState: function(){
		return { loaded: false };
	},

	componentWillMount: function(){
		var that = this;

		var url = "/api/dogs";

		if(this.props.carerId){
			url += "/" + this.props.carerId;
		}

		$.get(url, (result) => {
			that.setState({loaded: true, dogs: result.data.dogs});
		});
	},

	render: function(){
		if(!this.state.loaded){
			return (
				<p>Loading dogs...</p>
			);
		}

		let adminControls;

		if(this.props.admin){
			adminControls = 
				<div className="row">
					<div className="col-xs-6">
						<p>You have {this.state.dogs.length} dogs</p>
					</div>
					<div className="col-xs-6 text-right">
						<Router.Link to={"/dogs/add" }>Add Dog</Router.Link>
					</div>
				</div>;
		}

		return 	<div>
				{adminControls}

				<div className="row">
					{this.state.dogs.map(function(dog){ return <DogTile details={dog} key={dog.id} /> })}
				</div>
			</div>;
	}
});

module.exports = DogGrid;
