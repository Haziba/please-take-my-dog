var React = require('react'),
	Router = require('react-router');

var Header = React.createClass({
	render: function() {
		return (
			<div className="page-header">
				<h1>Please Take My Dog</h1>
			</div>
		);
	}
});

var PageNav = React.createClass({
	componentWillMount: function(){
		var that = this;

		window.Auth.then(function(authed){
			that.setState({authed: authed});
		});
	},

	render: function() {
		var login;

		if(this.state){
			if(!this.state.authed){
				login = <Router.Link to="login">Login</Router.Link>;
			} else {
				login = <Router.Link to="myAccount">My Account</Router.Link>;
			}
		}

		return (
			<div className="nav">
				<Router.Link to="home">Home</Router.Link>
				&nbsp; | &nbsp;
				<Router.Link to="about">About</Router.Link>
				&nbsp; | &nbsp;
				{login}
			</div>
		);
	}
});

var App = React.createClass({
	render: function() {
		return (
			<div className="container">
				<Header />
				<PageNav />
				<Router.RouteHandler/>
			</div>
		);
	}
});

window.Auth = (function(){
	var authTicket = $.cookie("auth");
	var loggedIn = false;

	return new Promise(function(success, failure){
		if(authTicket){
			$.post("/api/auth/check", { ticket: authTicket }, function(result){
				if(!result.success){
					$.cookie("auth", "");
				}

				success(result);
			});
		} else {
			success(false);
		}
	});
})();

var routes = {
	Home: require('../routes/Home'),
	About: require('../routes/About'),
	ViewDog: require('../routes/dogs/View'),
	AddDog: require('../routes/dogs/Add'),
	Login: require('../routes/Login'),
	MyAccount: require('../routes/MyAccount'),
};

var routes = (
	<Router.Route name="app" path="/" handler={App}>
		<Router.Route name="home" path="/" handler={routes.Home}/>
		<Router.Route name="about" path="/about" handler={routes.About}/>

		<Router.Route name="viewDog" path="/dog/:id/:name" handler={routes.ViewDog}/>
		<Router.Route name="addDog" path="/dogs/add" handler={routes.AddDog}/>

		<Router.Route name="login" path="/login" handler={routes.Login}/>
		<Router.Route name="myAccount" path="/myAccount" handler={routes.MyAccount}/>

		<Router.DefaultRoute handler={routes.Home}/>
	</Router.Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler) {
	React.render(<Handler/>, document.body);
});
