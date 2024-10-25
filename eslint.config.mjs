import { defineConfig, solidConfig } from '@un-tlsn/eslint';

export default defineConfig(
	...solidConfig,
	{
		rules: {
			'solid/no-react-specific-props':                     1,
			'@typescript-eslint/consistent-type-imports':        1,
			'@typescript-eslint/explicit-module-boundary-types': 1,
		},
		ignores: [
			'/src/auto-imports.d.ts',
			'package-lock.json',
			'package.json',
			'pnpm-lock.yaml',
		],
	},
);
