export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","icon192.png","icon512.png","manifest.json"]),
	mimeTypes: {".png":"image/png",".json":"application/json"},
	_: {
		client: {start:"_app/immutable/entry/start.TzNtTYSq.js",app:"_app/immutable/entry/app.CfXjdZU1.js",imports:["_app/immutable/entry/start.TzNtTYSq.js","_app/immutable/chunks/CcLRmp2I.js","_app/immutable/chunks/oLtghWby.js","_app/immutable/chunks/CV5EsZTn.js","_app/immutable/entry/app.CfXjdZU1.js","_app/immutable/chunks/oLtghWby.js","_app/immutable/chunks/CPDYnXr9.js","_app/immutable/chunks/DOq4m96K.js","_app/immutable/chunks/CowqXRAS.js","_app/immutable/chunks/B6zllX-l.js","_app/immutable/chunks/CV5EsZTn.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
