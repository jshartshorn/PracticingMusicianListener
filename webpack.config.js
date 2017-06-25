var path = require("path");
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: {
		a: "./webpack_mod.js"
		// kotlin:'./out/production/PracticingMusician/lib/kotlin.js',
// 		practicingmusician:'./out/production/PracticingMusician/PracticingMusician.js',
// 		index: './app/js/index.js',
// 		app_js_functions: './app/js/app_js_functions.js',
// 		audio: './app/js/audio.js',
// 		easyscore_util: './app/js/easyscore_util.js',
	},
	output: {
	    path: path.resolve(__dirname, 'webpack-build'),
	    filename: 'js/[name].js'
	  },
	  //context: path.join(__dirname,'webpack-build'),
	  plugins: [
	  	new CopyWebpackPlugin([
			{from : "./out/production/PracticingMusician/lib/kotlin.js", to: 'js/kotlin.js'},
			{from : "./out/production/PracticingMusician/PracticingMusician.js", to: 'js/PracticingMusician.js'},
			{from : "app/app.html", to: "app.html" },
			{from : "app/js", to:"js" },
	  		{from : "app/images", to: "images" },
			{from : "app/audio", to: "audio" },
			{from : "app/css", to: "css" },
			{from : "app/js/exercises", to: "js/exercises" }
	  	])
	  ]
};