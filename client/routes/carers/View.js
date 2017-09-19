var 	React 	= require('react'),
	DogTile = require('../../components/DogTile.js'),
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

			if(that.props.params.id != result.carer.id){
				$.get('/api/carer/' + that.props.params.id).then((carerResult) => {
					that.setState({loaded: true, carer: carerResult.data.carer, admin: false});
				});
				return;
			}

			that.setState({carer: result.carer, admin: true});

			$.get('/api/dogs/' + result.carer.id + '/transfers/').then((transfersResult) => {
				that.setState({loaded: true, transfers: transfersResult.data.transfers});
			});
		});
	},

	render: function() {
		console.log(this.state);
		if(!this.state.loaded){
			return (
				<p>Loading account...</p>
			);
		}

		let transfers = <div className="row">
				<div className="col-xs-12">
					<h3>Transfers</h3>

					{this.state.transfers.map((dog) => <DogTile details={dog} acceptTransfer={() => this._acceptTransfer(dog.id)} key={`transfer-${dog.id}`} /> )}
				</div>
			</div>;

		if(this.state.admin){

		}

		return 	<div className="row">
				<div className="col-xs-12">
					<h2>{this.state.carer.name}</h2>

					{transfers}

					<h3>{this.state.carer.name}'s Dogs</h3>
					<DogGrid admin={this.state.admin} carerId={this.state.carer.id} key={this.state.carer.id}/>
				</div>;
			</div>;
	},

	_acceptTransfer: function(dogId){
		console.log(dogId);
	}
});

module.exports = ViewCarer;
