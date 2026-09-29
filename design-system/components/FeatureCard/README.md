# FeatureCard

Bordered card describing one capability: optional stroke icon, eyebrow, sentence-case heading, short body, and a mono spec line for the measurable claim.

- Title is the capability in plain words ("CAN stack", "Crash detection"), not a slogan. Body is one or two sentences. The `spec` line is where the numbers go, set in mono over a hairline.
- Lay out in a grid of three at `space-3` (12px) gap on desktop, stacked on mobile. Cards in a row should all have a spec line or none; mixed rows look ragged.
- Use `tone="block"` for one card in a group to anchor it, never for a whole row.
- Icons: inline stroke SVG on a 24px grid, 2px stroke, `currentColor`, square caps. The consumer supplies the SVG.
