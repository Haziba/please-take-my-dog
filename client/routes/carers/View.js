var 	React 	= require('react'),
	DogTile = require('../../components/DogTile.js'),
	DogGrid = require('../../components/DogGrid.js');

var ViewCarer = React.createClass({
	getInitialState: function(){
		return { loaded: false, transfers: [], requests: [] };
	},

	componentWillMount: function(){
		var that = this;

		window.Auth.get(function(result){
			$.get('/api/carer/' + that.props.params.id).then((carerResult) => {
				that.setState({
					loaded: true,

					carer: carerResult.data.carer,
					requests: carerResult.data.requests,
					transfers: carerResult.data.transfers,
					//todo: Hand this into DogGrid
					dogs: carerResult.data.dogs,

					admin: that.props.params.id == result.carer.id
				});
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

		let transfers, requests;

		if(this.state.admin){
			if(this.state.transfers.length > 0){
				transfers = <div className="row">
							<div className="col-xs-12">
								<h3>Transfers</h3>

								{this.state.transfers.map((dog) => <DogTile details={dog} acceptTransfer={this._acceptTransfer} key={`transfer-${dog.id}`} /> )}
							</div>
						</div>;
			}

			if(this.state.requests.length > 0){
				console.log(this.state.requests);
				requests = <div className="row">
							<div className="col-xs-12">
								<h3>Requests</h3>

								{this.state.requests.map((request) => <DogTile details={this.state.dogs.find((dog) => request.dogid == dog.id)} viewRequest={this._viewRequest} key={`request-${request.carerid}-${request.dogid}`} /> )}
							</div>
						</div>;
			}
		}

		return 	<div className="row">
				<div className="col-xs-12">
					<h2>{this.state.carer.name}</h2>

					{transfers}

					{requests}

					<h3>{this.state.carer.name}'s Dogs</h3>
					<DogGrid admin={this.state.admin} carerId={this.state.carer.id} key={this.state.carer.id}/>
				</div>;
			</div>;
	},

	_acceptTransfer: function(dogId){
		var that = this;

		var dog = this.state.transfers.filter(t => t.id == dogId)[0];
		var currentDate = new Date();

		dog.carerhistory.push({id: this.state.carer.id, on: (new Date().toISOString().slice(0, 10))});
		dog.carerid = this.state.carer.id;
		//todo: Replace this hack
		dog.transfercarerid = "null";

		$.ajax({
			url: `/api/dog/${dog.id}`,
			data: {dog: dog},
			type: 'PUT'
		}).then((result) => {
			//todo: Update the grid after
			that.setState({transfers: this.state.transfers.filter(t => t != dog)});
		});
	}
});

module.exports = ViewCarer;
