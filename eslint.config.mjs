import defineConfig from '@un-tlsn/eslint';
import 'eslint-plugin-solid';

export default defineConfig(
	{
		rules:   {
			'solid/no-react-specific-props':                     1,
			'@typescript-eslint/consistent-type-imports':        1,
			'@typescript-eslint/explicit-module-boundary-types': 1,
		},
	},
);
