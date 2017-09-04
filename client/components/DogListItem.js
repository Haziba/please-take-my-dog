var React = require('react'),
	Router = require('react-router');

var DogListItem = React.createClass({
	render: function(){
		return 	<div className="row">
				<div className="col-xs-12 col-md-8">
					<h5>{this.props.dog.name}</h5>
					<img className="col-xs-12" src={this.props.dog.imageurl} />
				</div>
				<div className="hidden-xs hidden-sm col-md-4">
					<div>{this.props.dog.breed}</div>
					<Router.Link to={"/dog/" + this.props.dog.id + "/" + this.props.dog.name}>View Dog</Router.Link>
				</div>
			</div>;
	}
});

module.exports = DogListItem;
