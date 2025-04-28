module.exports = {
	content: ["_site/**/*.html"],
	safelist: [],
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
		},
	},
	plugins: [require("@tailwindcss/typography")],
	corePlugins: {
		preflight: true,
	},
	important: true,
};
