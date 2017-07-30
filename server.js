var express = require('express');
var babelify = require('babelify');
var browserify = require('browserify-middleware');
var less = require('less-middleware');
var nunjucks = require('nunjucks');
var config = require('./client/config');

// initialise express
var app = express();

// use nunjucks to process view templates in express
nunjucks.configure('server/templates/views', {
    express: app
});

// less will automatically compile matching requests for .css files
app.use(less('public'));
// public assets are served before any dynamic requests
app.use(express.static('public'));

// common packages are precompiled on server start and cached
app.get('/js/' + config.common.bundle, browserify(config.common.packages, {
	cache: true,
	precompile: true
}));

// any file in /client/scripts will automatically be browserified,
// excluding common packages.
app.use('/js', browserify('./client/scripts', {
	external: config.common.packages,
	transform: [babelify.configure({
		plugins: ['object-assign']
	})]
}));

/*
	set up any additional server routes (api endpoints, static pages, etc.)
	here before the catch-all route for index.html below.
*/

app.get('/api/dogs', function(req, res){
	res.send([{
		name: "Theo",
		dateOfBirth: "29th January 2015",
		breed: "Jack Russel Cross",
		imageUrl: "https://lh3.googleusercontent.com/ztLTQB_hHv48-JGNw-sn2IK8KcrvqRGYdRa9a2JleVQHEQiXomKK6d_e4BbXhTtfrfO41xOnVevtD0okVU7Wx61MGMeUp9jMYbTR1j-6RbDKXHHb9HZMMY2LiPXEw4yB0fy_6Xoyr02-2qFJ4jAv7bclNGZ6PayRqYV8tii88XdLHGcSvi3ZIBisuV8KnNCIwoOzO0h-3IvrPl1RnCc0aC2O_o4Vr3vAwmYbvTWzXx_AetgStoOdrcFf5xuKypqJAo8B2A_6a5BHGHZMzhGsMuF2A306Eydse0MHt-JNJcKZnn_Ui844ZEfS1JW5Y8Rrk18iSSRQi_eOJz6s6qhwwSfBz6_PbmlKevnc8trv0orACbyTII5eek0qsoKL-2HSmWyMLAocJoiu9y8tSHOPloILuif6tQzrV1o0_GnqhCiu-mlThvmrWcLmK1nLKinnbKL1kyxtg9jda5KnfTxvtCI12QHe_svkdmc5m3SqPP8xsLZhVW461hEGxqjJ1ILJW96MkVeYYfdYHh1opCD2eYTkzgpWRtfBQZt7ziy7NCTCn_iWGqhClGzRoW79ge7W1Xf-pzmZ1C6lBBrcn26_dqr8oCcxbg5BgdY_znNHmc20N-hgRqSGd1Ys23I47KQX-eLswYcUwdC7q4yydtUmFWrmLk5wHESoQrgKmfehCy_NHw=w982-h737-no",
	},{
		name: "Luna",
		dateOfBirth: "30th April 2014",
		breed: "Romanian Mix",
		imageUrl: "https://lh3.googleusercontent.com/j0uASWNb4PdzvawyUCQh4GjbOwezCJYxgEvxGWNHG9iOjkg6n_7ngiSSG0BxSQZRsIkQApIOtIz1fLOHhxTt0mQxP_fC5Mi7ghI7bbkiMMqPTEE_ahZyM30sNu9PEQ4_ftkxViwv5-nwOYnPT_3h6__KUOHyyQQSaTF_ZNTqxVoL2YIWaOhzAqLoW6_Xz8-8MdqFrqEKhyXrfGrRoL4sQey189E0HketMUJkjkFXKtYscFpt3Q6Hjl4LuWbvuGTijqi0JYZC-7WchUbljZXeEOogZa04kKbPkoTtgDXGw7EaY7xPv3-GXoiOtikovunbrA4ZjdwiOR_Oi5-K7fNRhA8UF-T69aGIHhAo5AcE0EPmvx4c8NvRnlzmbmjcpvbIRSV_EpkLZl2PZcU3u8_rQTr7hroOoXb4Q4exwqIan_r_VzUBf4CUY0tZ-9n-Q-6f2Ao7AQQAi9QN9-0dDW5-f6feIKPy1u1fUFrR19JBiuBDLOWGkO2tSHnmP5AdZh0_CbsMoa8wDJ2wTjRQyvDQQLV5pNUiBJw9NLb8lNoHhaD6k_qjksavZADiRotELUlw-FN4crh-0lwFi3f1zVd3MZguuv-VsCiQ5eiUE1GV_bDGmXd6efxNhUIqyTdoqMh5eUDtqjPwemyJG1o1DPF1_aQ1wodDucNjf7Ts1_-3S8Cz-w=w999-h749-no",
	}]);
});

app.get('*', function(req, res) {
	// this route will respond to all requests with the contents of your index
	// template. Doing this allows react-router to render the view in the app.
    res.render('index.html');
});

// start the server
var server = app.listen(process.env.PORT || 3000, function() {
	console.log('\nServer ready on port %d\n', server.address().port);
});
