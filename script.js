window.tailwind = window.tailwind || {};
window.tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                background: "#121414",
                "tertiary-fixed": "#e2e2e7",
                "inverse-primary": "#006970",
                "primary-fixed-dim": "#00dbe9",
                "surface-tint": "#00dbe9",
                outline: "#849495",
                "on-primary-container": "#006970",
                "on-primary-fixed-variant": "#004f54",
                "surface-bright": "#383939",
                "on-surface": "#e3e2e2",
                "on-primary": "#00363a",
                "on-secondary-fixed-variant": "#474746",
                "error-container": "#93000a",
                "surface-container": "#1f2020",
                "surface-container-high": "#292a2a",
                "primary-container": "#00f0ff",
                "on-secondary-container": "#b7b5b4",
                "secondary-fixed": "#e5e2e1",
                "surface-variant": "#343535",
                "surface-container-lowest": "#0d0e0f",
                "surface-container-low": "#1b1c1c",
                "primary-fixed": "#7df4ff",
                "on-tertiary-container": "#5d5f63",
                "secondary-container": "#474746",
                "surface-dim": "#121414",
                "inverse-on-surface": "#303031",
                secondary: "#c8c6c5",
                "tertiary-container": "#d9d9de",
                "on-error-container": "#ffdad6",
                "on-secondary-fixed": "#1c1b1b",
                tertiary: "#f5f5fa",
                "on-tertiary-fixed": "#1a1c1f",
                "surface-container-highest": "#343535",
                primary: "#dbfcff",
                "on-tertiary-fixed-variant": "#45474b",
                error: "#ffb4ab",
                "on-background": "#e3e2e2",
                "on-error": "#690005",
                "secondary-fixed-dim": "#c8c6c5",
                "tertiary-fixed-dim": "#c6c6cb",
                "on-primary-fixed": "#002022",
                surface: "#121414",
                "on-tertiary": "#2e3034",
                "on-secondary": "#313030",
                "inverse-surface": "#e3e2e2",
                "on-surface-variant": "#b9cacb",
                "outline-variant": "#3b494b"
            },
            borderRadius: {
                DEFAULT: "0.25rem",
                lg: "0.5rem",
                xl: "0.75rem",
                full: "9999px"
            },
            spacing: {
                "margin-mobile": "16px",
                gutter: "24px",
                "margin-desktop": "64px",
                unit: "4px",
                "container-max": "1440px"
            },
            fontFamily: {
                "label-caps": ["JetBrains Mono"],
                "headline-md": ["Hanken Grotesk"],
                "code-sm": ["JetBrains Mono"],
                "display-lg": ["Hanken Grotesk"],
                "display-lg-mobile": ["Hanken Grotesk"],
                "body-md": ["Inter"]
            },
            fontSize: {
                "label-caps": ["12px", { lineHeight: "1.0", letterSpacing: "0.1em", fontWeight: "600" }],
                "headline-md": ["32px", { lineHeight: "1.2", fontWeight: "500" }],
                "code-sm": ["13px", { lineHeight: "1.5", fontWeight: "400" }],
                "display-lg": ["72px", { lineHeight: "1.1", letterSpacing: "-0.04em", fontWeight: "700" }],
                "display-lg-mobile": ["40px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
                "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }]
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.documentElement.classList.remove('dark');
            } else {
                document.documentElement.classList.add('dark');
            }
        });
    }, { threshold: 0.5 });

    const interfaceSection = document.getElementById('interface-section');
    if (interfaceSection) {
        observer.observe(interfaceSection);
    }
});
