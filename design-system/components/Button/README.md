# Button

Square, bordered, uppercase call to action in three variants: primary (black), volt, and outline.

- Primary is the default for any single action. Use **volt at most once per view**, for the one thing you most want clicked; two volt buttons cancel each other out.
- Outline is the secondary action beside a primary or volt button, at `space-3` (12px) gap.
- Labels are two to four words, uppercase, verbs first: "Talk to us", "See the components", "Download datasheet".
- Pass `href` for navigation (renders an `<a>`), omit it for actions (renders a `<button>`). Focus ring is the `focus` token at 2px offset; never remove it.
- Minimum height 48px (`sm`: 40px, only inside dense tables and toolbars).

The consumer provides the label and the handler or URL; the component supplies border, type and states.
