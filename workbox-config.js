module.exports = {
	globDirectory: 'frontend/public/',
	globPatterns: [
	  '**/*.{css,html,png,jpg,svg,js}' 
	],
	swDest: 'frontend/public/service-worker.js',
	ignoreURLParametersMatching: [
	  /^utm_/,
	  /^fbclid$/
	]
  };
  