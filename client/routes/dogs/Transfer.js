var React = require('react'),
	Router = require('react-router');

var TransferDog = React.createClass({
	getInitialState: function(){
    return { loaded: false, posting: false };
	},

	componentWillMount: function(){
		var that = this;
    console.log("Will mount");
		$.get("/api/dog/" + this.props.params.id + "/transfer").then(function(result){
      console.log(result);
			let admin;
			if(that.state.self){
				admin = that.state.self.id == result.data.dog.carerid;
			}
      console.log(result.data);
			that.setState({ loaded: true, dog: result.data.dog, carers: result.data.carers, admin: admin });
		});

		window.Auth.get().then((result) => {
			let admin;
			if(that.state.dog){
				admin = that.state.dog.carerid == result.carer.id;
			}
			that.setState({ self: result.carer, admin: admin });
		});
	},

	render: function() {
		var error;

		if(!this.state.loaded){
			return 	<div>
					Loading form...
				</div>;
		}

		if(this.state.error){
			error = <div>{this.state.error}</div>;
		}

		return (
			<div>
				<h2>Transfer {this.state.dog.name}</h2>

				{error}

				<form className="form-horizontal" onSubmit={this.handleSubmit}>
					<div className="form-group">
						<label className="control-label col-sm-2" htmlFor="name">Transfer Carer:</label>
						<div className="col-sm-10">
              <select className="form-control" name="transfercarerid" onChange={this.handleChange} disabled={this.state.posting}>
                {this.state.carers.map((carer) => <option value={carer.id}>{carer.name}</option>)}
              </select>
						</div>
					</div>

					<div className="form-group">
						<div className="col-sm-10 col-sm-offset-2">
							<input type="submit" value="Transfer" className="btn btn-success" disabled={this.state.posting || this._invalidTransfer()} />
						</div>
					</div>
				</form>
			</div>
		);
	},

	handleChange: function(e){
		var change = this.state.dog;

    change[e.target.name] = e.target.value;

		this.setState({dog: change});
	},

	handleSubmit: function(e){
		var that = this;
		e.preventDefault();

		that.setState({ posting: true });

		$.ajax({
      url: `/api/dog/${this.state.dog.id}`,
      data: { dog: this.state.dog },
      type: 'PUT',
		}).then(function(result){
			if(result.success){
        location = "/dog/" + that.state.dog.id + "/" + that.state.dog.name;
			} else {
				// todo: Validation
				console.log("Failed");
			}
		});
	},

  _invalidTransfer: function(){
    return !this.state.dog.transfercarerid || this.state.dog.carerid == this.state.dog.transfercarerid;
  }
});

module.exports = TransferDog;
