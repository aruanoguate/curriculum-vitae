const js = require('@eslint/js');
const importPlugin = require('eslint-plugin-import');
const prettier = require('eslint-config-prettier');

module.exports = [
	{
		ignores: [
			'dist/**',
			'vendor/**',
			'docs/**',
			'dist/generated-pdf/**',
			'**/*.min.js'
		]
	},
	{
		...js.configs.recommended,
		files: ['scripts/**/*.js', 'gulpfile.js'],
		plugins: { import: importPlugin },
		languageOptions: {
			ecmaVersion: 2023,
			sourceType: 'commonjs',
			globals: {
				process: 'readonly',
				__dirname: 'readonly',
				module: 'readonly',
				require: 'readonly',
				console: 'readonly',
				setTimeout: 'readonly'
			}
		},
		rules: {
			'no-unused-vars': ['warn', { argsIgnorePattern: '^_', caughtErrors: 'none' }],
			'prefer-const': 'warn',
			'import/no-unresolved': 'off'
		}
	},
	{
		...js.configs.recommended,
		files: ['js/resume.js'],
		languageOptions: {
			ecmaVersion: 2023,
			sourceType: 'script',
			globals: {
				window: 'readonly',
				document: 'readonly',
				location: 'readonly',
				jQuery: 'readonly',
				$: 'readonly',
				bootstrap: 'readonly'
			}
		},
		rules: {
			'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
			'prefer-const': 'warn'
		}
	},
	prettier
];
