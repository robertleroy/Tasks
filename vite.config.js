import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
  // server: {
  //   host: true,
  //   port: 5173,
  //   hmr: {
  //     port: 443,      // ← ngrok HTTPS fix
  //     host: true
  //   },
  //   allowedHosts: ["pluriliteral-armed-terrilyn.ngrok-free.dev",  'localhost']  // Allows ALL ngrok free URLs
  // }
});
