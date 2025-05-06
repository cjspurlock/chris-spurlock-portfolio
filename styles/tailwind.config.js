module.exports = {
	content: ["_site/**/*.html"],
	safelist: [],
	darkMode: "class",
	theme: {
		fontFamily: {
			sans: '"Syne", ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji',
		},
		extend: {
			boxShadow: {
				button:
					"0px 3px 4px -1px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.1), inset 0px 4px 2px rgba(255, 255, 255, 0.08), inset 0px -4px 2px rgba(255, 255, 255, 0.08), inset 0px 0px 0px 1px rgba(0, 0, 0, 0.2)",
				"button-light":
					"0px 3px 4px -1px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.1), inset 0px 4px 2px rgba(255, 255, 255, 0.04), inset 0px -4px 2px rgba(255, 255, 255, 0.04), inset 0px 0px 0px 1px rgba(0, 0, 0, 0.2)",
				card: "0px_0px_0px_1px_rgba(255,255,255,0.1)",
			},
			borderRadius: {
				"4xl": "2.125rem",
			},
			colors: {
				fuchsia: {
					50: "var(--color-fuchsia-50)",
					100: "var(--color-fuchsia-100)",
					200: "var(--color-fuchsia-200)",
					300: "var(--color-fuchsia-300)",
					400: "var(--color-fuchsia-400)",
					500: "var(--color-fuchsia-500)",
					600: "var(--color-fuchsia-600)",
					700: "var(--color-fuchsia-700)",
					800: "var(--color-fuchsia-800)",
					900: "var(--color-fuchsia-900)",
					950: "var(--color-fuchsia-950)",
				},
				zinc: {
					50: "var(--color-zinc-50)",
					100: "var(--color-zinc-100)",
					200: "var(--color-zinc-200)",
					300: "var(--color-zinc-300)",
					400: "var(--color-zinc-400)",
					500: "var(--color-zinc-500)",
					600: "var(--color-zinc-600)",
					700: "var(--color-zinc-700)",
					800: "var(--color-zinc-800)",
					900: "var(--color-zinc-900)",
					950: "var(--color-zinc-950)",
				},
			},
		},
	},
	plugins: [require("@tailwindcss/typography")],
	corePlugins: {
		preflight: true,
	},
};
