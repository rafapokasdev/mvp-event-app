const { hairlineWidth } = require('nativewind/theme');

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",
        secondary: "#8b5cf6",
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        dark: "#1f2937",
        light: "#f9fafb"
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
    }
  },
  plugins: []
}