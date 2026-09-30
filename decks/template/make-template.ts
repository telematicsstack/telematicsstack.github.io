/**
 * make-template.ts — regenerate decks/template/telematics-stack.potx from the design system.
 *
 * Run with:  bun run make-template.ts   (from decks/template/)
 *
 * Reads design-system/tokens.json at runtime — no hex value appears in this file.
 * Geometry: 16:9 at 13.333 x 7.5 in. The design canvas is 1920x1080 (README:
 * "Slides use the same margins at 1920x1080"), so 1 px = 1/144 in for positions
 * and sizes, and a 2px border = 1 pt. Type is set at token px value = pt value
 * (2x the raster-strict mapping) so the deck reads at projection distance while
 * keeping every ratio of the type scale.
 *
 * Output is written as .pptx by pptxgenjs, then converted to a real .potx by
 * rewriting the main content type in [Content_Types].xml and stripping slides.
 *
 * The committed .potx is SOURCE once fonts have been embedded in PowerPoint;
 * only rerun this when design-system/ changes, then re-embed the fonts.
 */

import pptxgen from "pptxgenjs";
import JSZip from "jszip"; // transitive dependency of pptxgenjs, pinned via bun.lock
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";

const TEMPLATE_DIR = import.meta.dir;
const DECKS = dirname(TEMPLATE_DIR);
const REPO = dirname(DECKS);
const CACHE = join(DECKS, ".cache");
const OUT = join(TEMPLATE_DIR, "telematics-stack.potx");

// ---------------------------------------------------------------- prepare
{
  const res = Bun.spawnSync({ cmd: ["uv", "run", "prepare.py"], cwd: DECKS, stdout: "inherit", stderr: "inherit" });
  if (res.exitCode !== 0) throw new Error("prepare.py failed — cannot derive logos/fonts");
}

// ---------------------------------------------------------------- tokens
const tokens = JSON.parse(readFileSync(join(REPO, "design-system", "tokens.json"), "utf8"));
function color(name: string): string {
  const t = tokens.color.tokens.find((t: any) => t.name === name);
  if (!t) throw new Error(`token not found: ${name}`);
  return (t.value as string).replace("#", "").toUpperCase();
}
const ground = color("ground");
const ink = color("ink");
const inkMuted = color("ink-muted");
const surface = color("surface");
const lineSoft = color("line-soft");
const volt = color("volt");
const onVolt = color("on-volt");
const onBlock = color("on-block");
const onBlockMuted = color("on-block-muted");
const alert = color("alert");
const ok = color("ok");

const FONT_DISPLAY = "Archivo Black";
const FONT_SANS = "Archivo";
const FONT_MONO = "Space Mono";

// ---------------------------------------------------------------- grid
// 12 columns, 24px gutter, 64px margins on a 1920x1080 canvas (144 px/in).
const PX = 1 / 144;
const W = 13.3333;
const H = 7.5;
const M = 64 * PX; // 0.4444
const GUT = 24 * PX;
const COLW = (W - 2 * M - 11 * GUT) / 12;
const span = (n: number) => n * COLW + (n - 1) * GUT;
const colX = (i: number) => M + i * (COLW + GUT);
const BORDER_PT = 1; // 2px at 144 px/in

const logo = (name: string) => join(CACHE, "logos", `${name}.png`);
// lockup-horizontal*: 482x48 design px; wordmark-stacked: 664x156 design px.
const LOCKUP = { w: 2.51, h: 0.25 }; // 36px high — above the 32px minimum
const lockupPos = { x: M, y: 7.1, ...LOCKUP };

// ---------------------------------------------------------------- deck
const pptx = new pptxgen();
pptx.defineLayout({ name: "TS_16x9", width: W, height: H });
pptx.layout = "TS_16x9";
pptx.theme = { headFontFace: FONT_DISPLAY, bodyFontFace: FONT_SANS };
pptx.author = "Telematics Stack";
pptx.company = "Telematics Stack";

type PhOpts = Record<string, unknown>;
const ph = (name: string, type: "title" | "body" | "tbl", opts: PhOpts, text: string) => ({
  placeholder: { options: { name, type, margin: 0, valign: "top", align: "left", ...opts }, text },
});

// pptxgenjs writes generic shape names ("Text 0") into the layout XML, so the
// placeholder names are re-applied to the XML in the potx step below, matched
// by definition order. This wrapper records that order per layout.
const layoutPh: Record<string, string[]> = {};
function defineMaster(title: string, background: Record<string, unknown>, objects: any[]) {
  layoutPh[title] = objects.filter((o) => o.placeholder).map((o) => o.placeholder.options.name);
  pptx.defineSlideMaster({ title, background, objects });
}

const eyebrowStyle: PhOpts = {
  fontFace: FONT_MONO, fontSize: 11, color: inkMuted, charSpacing: 0.5,
};
const titleStyle: PhOpts = {
  fontFace: FONT_DISPLAY, fontSize: 56, color: ink, charSpacing: -2.2,
  lineSpacingMultiple: 0.9, fit: "shrink",
};
const heroTitleStyle: PhOpts = { ...titleStyle, fontSize: 84, charSpacing: -3.8, lineSpacingMultiple: 0.85 };

// 1 ---------------------------------------------------------------- Title
defineMaster("Title", { color: ground }, [
    ph("eyebrow", "body", { ...eyebrowStyle, x: M, y: M, w: span(8), h: 0.35 }, "EYEBROW · SPACE MONO"),
    // 60pt, not display-xl 84: real cover titles run a full phrase and must not
    // collide with the subtitle when a renderer ignores shrink-autofit.
    ph("title", "title", { ...heroTitleStyle, fontSize: 60, charSpacing: -2.7, x: M, y: 1.25, w: span(11), h: 3.35 }, "TITLE IN ARCHIVO BLACK"),
    ph("subtitle", "body", {
      fontFace: FONT_SANS, fontSize: 18, color: ink, lineSpacingMultiple: 1.4,
      x: M, y: 4.75, w: span(8), h: 1.5,
    }, "Subtitle in sentence case."),
    // Stacked wordmark: covers and hero placements only (min width 240px = 1.67in).
    { image: { path: logo("wordmark-stacked"), x: M, y: 6.6, w: 2.34, h: 0.55 } },
]);

// 2 -------------------------------------------------------------- Section
defineMaster("Section", { color: ink }, [ // block panel — the only dark layout
    ph("eyebrow", "body", { ...eyebrowStyle, fontSize: 14, color: onBlockMuted, x: M, y: 2.15, w: span(6), h: 0.4 }, "01"),
    ph("title", "title", { ...heroTitleStyle, color: onBlock, x: M, y: 2.7, w: span(11), h: 2.9 }, "SECTION TITLE"),
    { image: { path: logo("lockup-horizontal-reversed"), ...lockupPos } },
]);

// 3 ------------------------------------------------------------- Stat row
{
  const gap = 8 * PX; // space-2: stat blocks sit tight
  const tileW = (W - 2 * M - 3 * gap) / 4;
  const tileY = 2.5;
  const tileH = 3.5;
  const pad = 24 * PX; // space-5 card padding
  const objects: any[] = [
    ph("title", "title", { ...titleStyle, x: M, y: M, w: span(12), h: 1.6 }, "STAT ROW TITLE"),
  ];
  for (let i = 0; i < 4; i++) {
    const x = M + i * (tileW + gap);
    // first tile volt-filled, second ink-filled, others surface with 2px ink border
    const fill = i === 0 ? volt : i === 1 ? ink : surface;
    const rectOpts: PhOpts = { x, y: tileY, w: tileW, h: tileH, fill: { color: fill } };
    if (i >= 2) rectOpts.line = { color: ink, width: BORDER_PT };
    objects.push({ rect: rectOpts });
    const valueColor = i === 0 ? onVolt : i === 1 ? onBlock : ink;
    const labelColor = i === 0 ? onVolt : i === 1 ? onBlockMuted : inkMuted;
    objects.push(
      ph(`stat${i + 1}-value`, "body", {
        fontFace: FONT_DISPLAY, fontSize: 40, color: valueColor, charSpacing: -1.6, fit: "shrink",
        x: x + pad, y: tileY + pad, w: tileW - 2 * pad, h: 1.0,
      }, "0"),
      ph(`stat${i + 1}-label`, "body", {
        fontFace: FONT_MONO, fontSize: 11, color: labelColor, charSpacing: 0.45, lineSpacingMultiple: 1.3,
        x: x + pad, y: tileY + tileH - 0.85, w: tileW - 2 * pad, h: 0.7, valign: "bottom",
      }, "STAT LABEL"),
    );
  }
  objects.push({ image: { path: logo("lockup-horizontal"), ...lockupPos } });
  defineMaster("Stat row", { color: ground }, objects);
}

// 4 -------------------------------------------------------- Feature cards
{
  const gap = 12 * PX; // space-3: cards in a grid
  const cardW = (W - 2 * M - 2 * gap) / 3;
  const cardY = 2.5;
  const cardH = 4.35;
  const pad = 24 * PX;
  const objects: any[] = [
    ph("title", "title", { ...titleStyle, x: M, y: M, w: span(12), h: 1.6 }, "FEATURE CARDS TITLE"),
  ];
  for (let i = 0; i < 3; i++) {
    const x = M + i * (cardW + gap);
    const n = i + 1;
    objects.push(
      // surface card, 2px ink border, square corners, no shadow
      { rect: { x, y: cardY, w: cardW, h: cardH, fill: { color: surface }, line: { color: ink, width: BORDER_PT } } },
      ph(`card${n}-eyebrow`, "body", {
        ...eyebrowStyle, x: x + pad, y: cardY + pad, w: cardW - 2 * pad, h: 0.3,
      }, "EYEBROW"),
      ph(`card${n}-heading`, "body", {
        fontFace: FONT_SANS, fontSize: 22, bold: true, color: ink, charSpacing: -0.45,
        lineSpacingMultiple: 1.1, x: x + pad, y: cardY + 0.62, w: cardW - 2 * pad, h: 0.85,
      }, "Card heading"),
      ph(`card${n}-body`, "body", {
        fontFace: FONT_SANS, fontSize: 14, color: ink, lineSpacingMultiple: 1.4, fit: "shrink",
        x: x + pad, y: cardY + 1.5, w: cardW - 2 * pad, h: 1.75,
      }, "Card body copy in sentence case."),
      ph(`card${n}-spec`, "body", {
        fontFace: FONT_MONO, fontSize: 13, color: inkMuted, lineSpacingMultiple: 1.3, fit: "shrink",
        x: x + pad, y: cardY + cardH - 1.0, w: cardW - 2 * pad, h: 0.85, valign: "bottom",
      }, "spec line"),
    );
  }
  objects.push({ image: { path: logo("lockup-horizontal"), ...lockupPos } });
  defineMaster("Feature cards", { color: ground }, objects);
}

// 5 ----------------------------------------------------------- Spec table
defineMaster("Spec table", { color: ground }, [
    ph("title", "title", { ...titleStyle, x: M, y: M, w: span(12), h: 1.6 }, "SPEC TABLE TITLE"),
    // build.py styles the cells: Space Mono body, 1px line-soft row rules.
    ph("table", "tbl", { x: M, y: 2.5, w: span(12), h: 4.2 }, "Table"),
    { image: { path: logo("lockup-horizontal"), ...lockupPos } },
]);

// 6 -------------------------------------------------------------- Closing
defineMaster("Closing", { color: ground }, [
    ph("title", "title", { ...heroTitleStyle, x: M, y: 2.0, w: span(11), h: 2.6 }, "CLOSING TITLE"),
    ph("contact", "body", {
      fontFace: FONT_MONO, fontSize: 14, color: inkMuted, lineSpacingMultiple: 1.4,
      x: M, y: 4.9, w: span(8), h: 0.8,
    }, "contact line"),
    { image: { path: logo("lockup-horizontal"), ...lockupPos } },
]);

// pptxgenjs needs a slide for a well-formed file; it is stripped below.
pptx.addSlide({ masterName: "Title" });

// ------------------------------------------------- write, then make a potx
const buf = (await pptx.write({ outputType: "nodebuffer" })) as Buffer;
const zip = await JSZip.loadAsync(buf);

// 1. Main content type: presentation -> template.
const CT = "[Content_Types].xml";
let ct = await zip.file(CT)!.async("string");
ct = ct.replace(
  "application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml",
  "application/vnd.openxmlformats-officedocument.presentationml.template.main+xml",
);
// 2. Drop slide AND notes-slide overrides and files. pptxgenjs writes a notes
//    slide per slide; leaving it behind dangles a rel to the deleted slide,
//    which makes PowerPoint offer to "repair" the file.
ct = ct.replace(/<Override PartName="\/ppt\/(slides\/slide|notesSlides\/notesSlide)\d+\.xml"[^>]*\/>/g, "");
zip.file(CT, ct);
for (const name of Object.keys(zip.files)) {
  if (name.startsWith("ppt/slides/") || name.startsWith("ppt/notesSlides/")) zip.remove(name);
}
// 3. Remove slide references from presentation.xml and its rels.
const PRES = "ppt/presentation.xml";
let pres = await zip.file(PRES)!.async("string");
pres = pres.replace(/<p:sldIdLst>[\s\S]*?<\/p:sldIdLst>/, "");
zip.file(PRES, pres);
const RELS = "ppt/_rels/presentation.xml.rels";
let rels = await zip.file(RELS)!.async("string");
rels = rels.replace(/<Relationship[^>]*Target="slides\/slide\d+\.xml"[^>]*\/>/g, "");
zip.file(RELS, rels);
// 4. app.xml slide count.
const APP = "docProps/app.xml";
const appFile = zip.file(APP);
if (appFile) {
  let app = await appFile.async("string");
  app = app.replace(/<Slides>\d+<\/Slides>/, "<Slides>0</Slides>");
  app = app.replace(/<Notes>\d+<\/Notes>/, "<Notes>0</Notes>");
  // Drop the "Slide Titles" heading pair and the slide title entries so the
  // part inventory matches a slideless template.
  app = app.replace(
    /<HeadingPairs>[\s\S]*?<\/HeadingPairs>/,
    "<HeadingPairs><vt:vector size=\"4\" baseType=\"variant\">" +
      "<vt:variant><vt:lpstr>Fonts Used</vt:lpstr></vt:variant><vt:variant><vt:i4>2</vt:i4></vt:variant>" +
      "<vt:variant><vt:lpstr>Theme</vt:lpstr></vt:variant><vt:variant><vt:i4>1</vt:i4></vt:variant>" +
      "</vt:vector></HeadingPairs>",
  );
  app = app.replace(
    /<TitlesOfParts>[\s\S]*?<\/TitlesOfParts>/,
    "<TitlesOfParts><vt:vector size=\"3\" baseType=\"lpstr\">" +
      "<vt:lpstr>Arial</vt:lpstr><vt:lpstr>Calibri</vt:lpstr><vt:lpstr>Office Theme</vt:lpstr>" +
      "</vt:vector></TitlesOfParts>",
  );
  zip.file(APP, app);
}
// 5. Theme colours from the tokens.
const THEME = "ppt/theme/theme1.xml";
let theme = await zip.file(THEME)!.async("string");
const srgb = (v: string) => `<a:srgbClr val="${v}"/>`;
const clrScheme =
  `<a:clrScheme name="Telematics Stack">` +
  `<a:dk1>${srgb(ink)}</a:dk1><a:lt1>${srgb(ground)}</a:lt1>` +
  `<a:dk2>${srgb(inkMuted)}</a:dk2><a:lt2>${srgb(lineSoft)}</a:lt2>` +
  `<a:accent1>${srgb(volt)}</a:accent1><a:accent2>${srgb(inkMuted)}</a:accent2>` +
  `<a:accent3>${srgb(lineSoft)}</a:accent3><a:accent4>${srgb(alert)}</a:accent4>` +
  `<a:accent5>${srgb(ok)}</a:accent5><a:accent6>${srgb(ink)}</a:accent6>` +
  `<a:hlink>${srgb(ink)}</a:hlink><a:folHlink>${srgb(inkMuted)}</a:folHlink>` +
  `</a:clrScheme>`;
theme = theme.replace(/<a:clrScheme[\s\S]*?<\/a:clrScheme>/, clrScheme);
zip.file(THEME, theme);

// 6. Re-apply placeholder names (pptxgenjs writes "Text N") and mark the
//    table placeholder as type "tbl" so python-pptx offers insert_table().
//    Placeholder <p:sp> elements appear in the XML in definition order.
for (const fname of Object.keys(zip.files)) {
  if (!/^ppt\/slideLayouts\/slideLayout\d+\.xml$/.test(fname)) continue;
  let xml = await zip.file(fname)!.async("string");
  const layoutName = xml.match(/<p:cSld name="([^"]*)"/)?.[1];
  const names = layoutName ? layoutPh[layoutName] : undefined;
  if (!names) continue; // pptxgenjs's built-in DEFAULT layout
  let i = 0;
  const chunks = xml.split("</p:sp>");
  for (let k = 0; k < chunks.length; k++) {
    const at = chunks[k].lastIndexOf("<p:sp>");
    if (at < 0) continue;
    let sp = chunks[k].slice(at);
    if (!sp.includes("<p:ph")) continue; // a rect, not a placeholder
    const name = names[i++];
    if (!name) throw new Error(`layout ${layoutName}: more placeholders than names`);
    sp = sp.replace(/(<p:cNvPr [^>]*name=")[^"]*(")/, `$1${name}$2`);
    if (name === "table") sp = sp.replace(/<p:ph( type="[^"]*")?/, '<p:ph type="tbl"');
    chunks[k] = chunks[k].slice(0, at) + sp;
  }
  if (i !== names.length) throw new Error(`layout ${layoutName}: matched ${i} of ${names.length} placeholders`);
  zip.file(fname, chunks.join("</p:sp>"));
}

const out = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
await Bun.write(OUT, out);
console.log(`Wrote ${OUT} (${out.length} bytes)`);
