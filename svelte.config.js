import adapter from '@sveltejs/adapter-node';

const config = {
	kit: {
		adapter: adapter(),
    csrf: {
      trustedOrigins: [
        'http://100.88.232.72:3002'
      ]
    }
	},
};

export default config;
