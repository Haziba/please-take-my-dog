var React = require('react'),
	Router = require('react-router'),
	ImageHelper = require('../helpers/ImageHelper.js');

var DogTile = React.createClass({
	getInitialState: function(){
		return { accepting: false };
	},

	render: function(){
		return	<div className="col-xs-6 col-sm-4 col-md-3">
				<div className="dog-tile">
					<Router.Link to={"/dog/" + this.props.details.id + "/" + this.props.details.name}>
						<div>{ImageHelper.FirstImage(this.props.details.images, {tile_size: true})}</div>
						<h3 className="text-center">{this.props.details.name}</h3>
					</Router.Link>
					{this.props.acceptTransfer ? <button className="btn btn-success" onClick={this._acceptTransfer} disabled={this.state.accepting}>Accept</button> : null}
				</div>
			</div>;
	},

	_acceptTransfer: function(){
		this.props.acceptTransfer(this.props.details.id);
		this.setState({accepting: true});
	}
});

module.exports = DogTile;
