var React = require('react'),
	Router = require('react-router');

var DogListItem = React.createClass({
	render: function(){
		return 	<div className="row">
				<div className="col-xs-12 col-md-8">
					<div className="col-xs-12 col-sm-6">
						<img src={this.props.dog.imageurl} />
					</div>
					<h5 className="col-xs-12 col-sm-6">{this.props.dog.name}</h5>
				</div>
			</div>;
	}
});

module.exports = DogListItem;
