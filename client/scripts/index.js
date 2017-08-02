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
	render: function() {
		return (
			<div className="nav">
				<Router.Link to="home">Home</Router.Link>
				&nbsp; | &nbsp;
				<Router.Link to="about">About</Router.Link>
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

var Auth = (function(){
	var authTicket = $.cookie("auth");
	var loggedIn = false;

	return new Promise(function(success, failure){
		if(authTicket){
			$.post("/api/auth", { ticket: authTicket }, function(result){
				if(!result.success){
					$.cookie("auth", "");
				}

				success(result.success);
			});
		} else {
			success(false);
		}
	});
})();

var routes = {
	Home: require('../routes/Home'),
	About: require('../routes/About'),
	ViewDog: require('../routes/ViewDog'),
};

var routes = (
	<Router.Route name="app" path="/" handler={App}>
		<Router.Route name="home" path="/" handler={routes.Home}/>
		<Router.Route name="about" path="/about" handler={routes.About}/>
		<Router.Route name="viewDog" path="/viewDog/:id/:name" handler={routes.ViewDog}/>
		<Router.DefaultRoute handler={routes.Home}/>
	</Router.Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler) {
	React.render(<Handler/>, document.body);
});
