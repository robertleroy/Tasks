import adapter from '@sveltejs/adapter-node';

const config = {
	kit: {
		adapter: adapter(),
    csrf: {
      trustedOrigins: [
        'https://cisco.tailef5bcf.ts.net'
      ]
    },    
	},
};

export default config;


        // 'http://100.88.232.72:3002'
