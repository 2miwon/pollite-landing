import aspectRatio from '@tailwindcss/aspect-ratio';
import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				'primary': '#545454',
				'background': '#EAEAEA',
				'background60': '#EAEAEA33',
				'accent' : '#7F7F7F',
				'text': '#333333',
				'bg200': '#E0E0E0',
				'primary900': '#1A1A1A',
			},
			fontFamily: {
      		  	'pretendard': ['Pretendard', 'sans-serif'],
      		},
		}
	},

	plugins: [typography, forms, containerQueries, aspectRatio]
} satisfies Config;
