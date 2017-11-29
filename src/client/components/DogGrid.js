var	React 	= require('react'),
	Router 	= require('react-router'),
	DogTile = require('./DogTile.js');

var DogGrid = React.createClass({
	render: function(){
		let adminControls;
		
		if(this.props.admin){
			adminControls =
				<div className="row">
					<div className="col-xs-6">
						<p>You have {this.props.dogs.length} dogs</p>
					</div>
					<div className="col-xs-6 text-right">
						<Router.Link to={"/dogs/add"} className="btn btn-default">Add Dog</Router.Link>
					</div>
				</div>;
		}

		return 	<div>
				{adminControls}

				<div className="row">
					{this.props.dogs.map(function(dog){ return <DogTile details={dog} key={dog.id} /> })}
				</div>
			</div>;
	}
});

module.exports = DogGrid;
