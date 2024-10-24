import { defineConfig } from '@solidjs/start/config';
import uno from 'unocss/vite';
import devtools from 'solid-devtools/vite';

export default defineConfig({
	vite: {
		css: {
			preprocessorOptions: {
				scss: { api: 'modern-compiler' },
			},
		},
		plugins: [
			uno() as any,
			devtools({
				autoname: true,
				locator:  {
					targetIDE: 'webstorm',
				},
			}),
		],
	},
});
