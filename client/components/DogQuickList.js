var	React 	= require('react'),
	Router 	= require('react-router'),
	DogList = require('./DogList.js');

var DogQuickList = React.createClass({
	getInitialState: function(){
		return { loaded: false };
	},

	componentWillMount: function(){
		var that = this;

		var url = "/api/dogs/quicklist";

		$.get(url, (result) => {
			that.setState({loaded: true, lists: result.data});
		});
	},

	render: function(){
		if(!this.state.loaded){
			return (
				<p>Loading dogs...</p>
			);
		}

		var dogLists = [];
		for(let dogListName in this.state.lists){
			dogLists.push(<DogList dogs={this.state.lists[dogListName]} listName={dogListName} key={`dog-list-${dogListName}`} />);
		}

		return 	<div className="dogLists">
				{dogLists}
			</div>;
	}
});

module.exports = DogQuickList;
