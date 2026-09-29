# Telematics Stack — design system

This folder is the brand's design system. Read `README.md` first (voice, colour, type, shape, logo rules), then `tokens.json` / `tokens.css` for values and `components/` for the reference components.

Rules for anything built from it:
- Use the CSS variables in `tokens.css` (`--ground`, `--ink`, `--volt`, `--space-*`, `--font-*`); never hard-code hex values.
- Volt (`--volt`) is a fill behind black text only — never text, never a border.
- Everything is square (`--radius-none`) and separated by 2px `--line-strong` borders, not shadows.
- Display type is Archivo Black, uppercase; body is Archivo; specs, captions and eyebrows are Space Mono.
- Fonts are in `fonts/` (SIL OFL); logos in `assets/Logos/` are outlined SVG, see that folder's README for which to use where.
- `components/bundle.js` + `bundle.css` are plain React 18 reference implementations of Button, Eyebrow, StatBlock and FeatureCard; port them to your framework rather than importing the bundle.
