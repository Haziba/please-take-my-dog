var	React 	= require('react'),
	Router 	= require('react-router');

var DogTimeline = React.createClass({
	getInitialState: function(){
		return { timeline: JSON.parse(this.props.dog.timeline) };
	},

	render: function(){
		let adminControls;

		if(this.props.admin){
			adminControls = 
				<div className="row">
					<div className="col-xs-6">
					</div>
					<div className="col-xs-6 text-right">
						<Router.Link to={"/dogs/" + this.props.dog.id + "/timeline/add" }>Add Event</Router.Link>
					</div>
				</div>;
		}

		var events = [];
		if(this.state.timeline){
			for(let event of this.state.timeline){
				events.push(
					<div className="row" key={"timeline-event-" + events.length}>
					    	<div className="col-xs-8">
							{event.event}
						</div>
						<div className="col-xs-4 text-right">
							{event.occurredOn}
						</div>
					</div>);
			}
		}

		return 	<div>
				{adminControls}

				<div className="row">
					<div className="col-xs-6 col-xs-offset-3">
						{events}
					</div>
				</div>
			</div>;
	}
});

module.exports = DogTimeline;
