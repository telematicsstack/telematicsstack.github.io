# Decks

Slide-deck pipeline for Telematics Stack. Separate from the Astro site; the two
share only [`../design-system/`](../design-system/), which is the single source
of truth for colours, type, logos and fonts.

```
decks/
  template/              telematics-stack.potx (committed) + make-template.ts
  content/               one YAML file per deck
  prepare.py             derives PNG logos and TTF fonts into .cache/
  build.py               python-pptx builder: YAML -> dist/<deck>.pptx (+ .pdf)
  Dockerfile             pinned LibreOffice + uv + brand fonts, used by CI
  .cache/                gitignored, derived by prepare.py
  dist/                  gitignored, build output
```

## Build the decks

Requires [uv](https://docs.astral.sh/uv/). LibreOffice (`soffice` on PATH) is
optional and only needed for PDF preview output.

```sh
cd decks
uv run build.py                     # every YAML in content/
uv run build.py content/overview.yaml
DECK_VERSION=v1.0 uv run build.py   # version stamped on the closing slide
```

`build.py` runs `prepare.py` itself, so a fresh clone needs no other step:
prepare renders every SVG in `design-system/assets/Logos/` to PNG at 2x and
converts every woff2 in `design-system/fonts/` to TTF, into `.cache/`. Nothing
generated is committed.

Output lands in `dist/`. The `.pptx` is the primary asset; the PDF is a
LibreOffice preview render and may differ from PowerPoint by a few pixels
(spacing, autofit, kerning). If `soffice` is not installed the PDF is skipped
with a note. If the brand fonts are not installed on the machine, LibreOffice's
PDF falls back to substitute fonts — the Docker image (below) exists so release
PDFs never do.

## Add a deck

Create a YAML file in `content/` — one slide per entry, picking a template
layout by name and filling its placeholders by name. `build.py` uppercases
display text (titles, eyebrows, stat labels) for you.

Layouts and their fields:

| Layout | Fields |
| --- | --- |
| `Title` | `eyebrow`, `title`, `subtitle` |
| `Section` | `eyebrow` (the number), `title` |
| `Stat row` | `title`, `stats` (exactly 4 × `value` + `label`) |
| `Feature cards` | `title`, `cards` (exactly 3 × `eyebrow`, `heading`, `body`, `spec`) |
| `Spec table` | `title`, `table` (list of rows; first column is the bold label) |
| `Closing` | `title`, `contact` (the version is appended automatically) |

Example for a further module deck (crash detection, IMU trip detection and
compliance services fit the same shape as `module-can-stack.yaml`):

```yaml
# content/module-crash-detection.yaml
# deck: Telematics Stack — AI crash detection module
# slides:
#   - layout: Title
#     eyebrow: Module · AI crash detection
#     title: Crash classification on par with market leaders
#     subtitle: >-
#       The device detects a candidate crash; a trained AI model in the cloud
#       decides what it was.
#   - layout: Spec table
#     title: How it works
#     table:
#       - [Step 1 · device, Detects a candidate crash]
#       - [Step 2 · uplink, Sends the event to the cloud]
#       - [Step 3 · cloud, Trained model classifies it]
#   - layout: Closing
#     title: Go deeper with our engineers
#     contact: contact@telematicsstack.com
```

Keep to the site's real copy and numbers — every claim on a slide should exist
on the website first.

## The template

`template/telematics-stack.potx` is **committed and is the source template**:
open it in PowerPoint once, embed the fonts (File → Options → Save → *Embed
fonts in the file*) and save — python-pptx cannot embed fonts, and without
embedding, machines without Archivo/Space Mono fall back. All three typefaces
are SIL OFL licensed, so embedding is permitted.

`template/make-template.ts` only regenerates a *fresh starter* when
`design-system/` changes (it reads `tokens.json` at runtime — no hex values in
code). After regenerating you must re-embed the fonts in PowerPoint. Requires
[Bun](https://bun.sh) (not used by CI or the Dockerfile):

```sh
cd decks/template
bun install
bun run make-template.ts
```

## Docker (what CI uses)

The release workflow builds inside `decks/Dockerfile` so local and CI PDF
output are identical: pinned Debian 12 LibreOffice, pinned uv, and the brand
fonts derived from `design-system/` installed system-wide with `fc-cache`.

```sh
# from the repo root — the build context must include design-system/
docker build -f decks/Dockerfile -t decks-builder .
docker run --rm -v "$PWD:/work" -w /work/decks -e DECK_VERSION=v1.0 decks-builder \
  bash -c 'uv sync --frozen && uv run build.py'
```

## Releasing

Push a tag matching `decks-v*` (for example `decks-v1.0`); the
`release-decks.yml` workflow builds every deck in `content/` inside the Docker
image with `DECK_VERSION` set from the tag and attaches the `.pptx` and `.pdf`
files to a GitHub release. Pull requests touching `decks/` or `design-system/`
run the same build and upload `dist/` as a workflow artifact for review.
