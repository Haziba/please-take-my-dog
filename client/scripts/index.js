var React = require('react'),
	Router = require('react-router'),
	DogQuickList = require('../components/DogQuickList.js');

var Header = React.createClass({
	render: function() {
		return (
			<div className="header row">
				<h1 className="col-xs-12">Please Take My Dog</h1>
			</div>
		);
	}
});

var PageNav = React.createClass({
	componentWillMount: function(){
		var that = this;

		window.Auth.get(function(result){
			that.setState(result);
		});
	},

	render: function() {
		var login;

		if(this.state){
			if(!this.state.authed){
				login = <div className="inline">
						&nbsp; | &nbsp;
						<Router.Link to="login">Login</Router.Link>
						&nbsp; | &nbsp;
						<Router.Link to="register">Register</Router.Link>
					</div>;
			} else {
				login = <div className="inline">
						&nbsp; | &nbsp;
						<Router.Link to={"/carer/" + this.state.carer.id}>My Account</Router.Link>
						&nbsp; | &nbsp;
						<button className="btn btn-default" onClick={this._handleLogOut}><span>Log Out</span></button>
					</div>;
			}
		}

		return (
			<div className="nav">
				<div className="nav-links">
					<div className="inline">
						<Router.Link to="home">Home</Router.Link>
						&nbsp; | &nbsp;
						<Router.Link to="viewDogs">Dogs</Router.Link>
					</div>
					{login}
				</div>
				<hr />
			</div>
		);
	},

	_handleLogOut: function(){
		window.Auth.logOut();
		this.setState({authed: false});
		location = "/";
	}
});

var App = React.createClass({
	render: function() {
		return (
			<div className="container">
				<div className="row">
					<main className="col-xs-12 col-md-10 col-md-offset-1">
						<Header />
						<PageNav />
						<div className="row">
							<div className="col-xs-12 col-sm-9">
								<Router.RouteHandler/>
							</div>
							<div className="col-sm-3 hidden-xs">
								<DogQuickList key="dog-quick-list" />
							</div>
						</div>
					</main>
				</div>
			</div>
		);
	}
});

window.Auth = (function(){
	var authTicket = $.cookie('dog_auth');

	var loggedIn = false;
	var getters = [];

	return {
		get: function(callback){
			getters.push(callback);

			if(authTicket){
				$.post("/api/auth/check", { ticket: authTicket }, function(result){
					if(!result.success){
						$.removeCookie('dog_auth', {path: '/'});
					}

					callback({ authed: result.success, carer: result.data });
				}).catch((err) => {
					$.cookie('dog_auth', '');
					callback({ authed: false, carer: undefined });
				});
			} else {
				callback({ authed: false });
			}
		},

		logIn: function(carer){
			authTicket = `${carer.email}:${carer.authtoken}`;
			$.cookie('dog_auth', authTicket, {path: '/'});
			loggedIn = true;

			for(var i = 0; i < getters.length; i++){
				getters[i]({authed: true, carer: carer});
			}
		},

		logOut: function(){
			$.removeCookie('dog_auth', {path: '/'});
			loggedIn = false;
		}
	};
})();

var routes = {
	Home: require('../routes/Home'),
	ViewDogs: require('../routes/dogs/Index'),
	ViewDog: require('../routes/dogs/View'),
	AddDog: require('../routes/dogs/Add'),
	EditDog: require('../routes/dogs/Edit'),
	TransferDog: require('../routes/dogs/Transfer'),
	RequestDog: require('../routes/dogs/Request'),
	DogAddTimeline: require('../routes/dogs/timeline/Add'),
	Login: require('../routes/Login'),
	Register: require('../routes/Register'),
	ViewCarer: require('../routes/carers/View'),
};

var routes = (
	<Router.Route name="app" path="/" handler={App}>
		<Router.Route name="home" path="/" handler={routes.Home}/>

		<Router.Route name="viewDogs" path="/dogs" handler={routes.ViewDogs}/>
		<Router.Route name="transferDog" path="/dog/:id/transfer" handler={routes.TransferDog}/>
		<Router.Route name="requestDog" path="/dog/:id/request" handler={routes.RequestDog}/>
		<Router.Route name="editDog" path="/dog/:id/edit" handler={routes.EditDog}/>
		<Router.Route name="viewDog" path="/dog/:id/:name" handler={routes.ViewDog}/>
		<Router.Route name="addDog" path="/dogs/add" handler={routes.AddDog}/>

		<Router.Route name="dogAddTimeline" path="/dogs/:dogId/timeline/add" handler={routes.DogAddTimeline}/>

		<Router.Route name="viewCarer" path="/carer/:id" handler={routes.ViewCarer}/>

		<Router.Route name="login" path="/login" handler={routes.Login}/>
		<Router.Route name="register" path="/register" handler={routes.Register}/>

		<Router.DefaultRoute handler={routes.Home}/>
	</Router.Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler) {
	React.render(<Handler/>, document.body);
});
