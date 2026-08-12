window.tailwind = window.tailwind || {};
window.tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#0b162c",
        "tertiary-fixed": "#ffffff",
        "inverse-primary": "#0047a0",
        "primary-fixed-dim": "#ffffff",
        "surface-tint": "#0052cc",
        outline: "#4f6b9f",
        "on-primary-container": "#ffffff",
        "on-primary-fixed-variant": "#ffffff",
        "surface-bright": "#132945",
        "on-surface": "#ffffff",
        "on-primary": "#ffffff",
        "on-secondary-fixed-variant": "#cbd7ef",
        "error-container": "#93000a",
        "surface-container": "#10213f",
        "surface-container-high": "#13274a",
        "primary-container": "#0052cc",
        "on-secondary-container": "#cbd7ef",
        "secondary-fixed": "#7b92b0",
        "surface-variant": "#15254a",
        "surface-container-lowest": "#0b162c",
        "surface-container-low": "#0f1f3f",
        "primary-fixed": "#0052cc",
        "on-tertiary-container": "#ffffff",
        "secondary-container": "#1c2d54",
        "surface-dim": "#0b162c",
        "inverse-on-surface": "#f8f9ff",
        secondary: "#8a9cc9",
        "tertiary-container": "#0f1f3f",
        "on-error-container": "#ffffff",
        "on-secondary-fixed": "#d8e0f2",
        tertiary: "#0b162c",
        "on-tertiary-fixed": "#ffffff",
        "surface-container-highest": "#1b3058",
        primary: "#0052cc",
        "on-tertiary-fixed-variant": "#cbd7ef",
        error: "#d32f2f",
        "on-background": "#ffffff",
        "on-error": "#690005",
        "secondary-fixed-dim": "#a9b6d5",
        "tertiary-fixed-dim": "#8c9ac1",
        "on-primary-fixed": "#ffffff",
        surface: "#0b162c",
        "on-tertiary": "#ffffff",
        "on-secondary": "#cbd7ef",
        "inverse-surface": "#ffffff",
        "on-surface-variant": "#c1cfe8",
        "outline-variant": "#4f6b9f",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      spacing: {
        "margin-mobile": "16px",
        gutter: "24px",
        "margin-desktop": "64px",
        unit: "4px",
        "container-max": "1440px",
      },
      fontFamily: {
        "label-caps": ["JetBrains Mono"],
        "headline-md": ["Hanken Grotesk"],
        "code-sm": ["JetBrains Mono"],
        "display-lg": ["Hanken Grotesk"],
        "display-lg-mobile": ["Hanken Grotesk"],
        "body-md": ["Inter"],
      },
      fontSize: {
        "label-caps": ["12px", { lineHeight: "1.0", letterSpacing: "0.1em", fontWeight: "600" }],
        "headline-md": ["32px", { lineHeight: "1.2", fontWeight: "500" }],
        "code-sm": ["13px", { lineHeight: "1.5", fontWeight: "400" }],
        "display-lg": ["72px", { lineHeight: "1.1", letterSpacing: "-0.04em", fontWeight: "700" }],
        "display-lg-mobile": ["40px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
      },
    },
  },
};

document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileLinks = document.querySelectorAll('#mobile-menu a');

  const setMobileMenuOpen = (open) => {
    if (!mobileMenu) {
      return;
    }

    mobileMenu.classList.toggle('hidden', !open);
    document.body.classList.toggle('overflow-hidden', open);
    if (mobileMenuButton) {
      mobileMenuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
  };

  if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', () => {
      setMobileMenuOpen(mobileMenu?.classList.contains('hidden'));
    });
  }

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', () => setMobileMenuOpen(false));
  }

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => setMobileMenuOpen(false));
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobileMenu && !mobileMenu.classList.contains('hidden')) {
      setMobileMenuOpen(false);
    }
  });

  const sectionLinks = document.querySelectorAll('[data-section]');
  const sections = document.querySelectorAll('main section[id]');

  const showSection = (sectionId) => {
    sections.forEach((section) => {
      section.classList.toggle('hidden', section.id !== sectionId);
    });
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  sectionLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const sectionId = link.getAttribute('data-section');
      if (sectionId) {
        showSection(sectionId);
      }
      if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        setMobileMenuOpen(false);
      }
    });
  });

  const interfaceSection = document.getElementById('education');
  if (interfaceSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            document.documentElement.classList.remove('dark');
          } else {
            document.documentElement.classList.add('dark');
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(interfaceSection);
  }
});
