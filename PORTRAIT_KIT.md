# PORTRAIT_KIT.md — AI-portrait pipeline for the Arda family tree

**Honest scope.** This environment has web search but **no raster image-generation tool** (no Midjourney/DALL·E/Stable-Diffusion wired in). I therefore cannot *render* the images here. What this kit delivers is everything up to the render: the generator choice (researched live, July 2026), the exact reusable style prompt, a **ready-to-run prompt for all 429 figures** (`arda_portrait_prompts.json`), the label strategy, and the integration spec. You (or a batch script against an API) run the prompts; the archive already ships lore-locked SVG portraits as the working fallback in the meantime.

---

## Phase 1 — the generator (researched, July 2026)

| Tool | Style/stylized fantasy | Consistency across many chars | In-image text (labels) | Licensing for a public archive | Cost at ~1,500 imgs |
|---|---|---|---|---|---|
| **Ideogram V3** | strong, clean illustration | **top-tier** (Character + Style reference locking) | **best in class, 90–95%** | commercial rights on paid plans | low–mid |
| **FLUX.2 Pro** | strong | top-tier (Flux Kontext ref) | strong tier | **cleanest — you own outputs**; base is Apache-2.0 | **lowest (~$0.035/img ≈ $50)** |
| **Midjourney v7** | **best raw artistry** | good (--cref, --sref) | weakest — avoid for labels | outputs under MJ ToS, not owned | mid–high |
| **Adobe Firefly** | good | Structure Reference | good | **most legally safe** (indemnified, licensed training data) | mid (CC) |
| **NightCafe / OpenArt** | flexible, sketch modes | weaker | weaker | paid commercial | low |

**Recommendation.**
- **Primary: Ideogram V3.** Our defining requirement is a *consistent character sheet with a legible name label under each face* — Ideogram is the only tool that leads on **both** text rendering and reference-locked consistency. Lock the reference sheet with a **Style Reference** image; lock face-family with **Character Reference**.
- **Backup / scale: FLUX.2 Pro.** Cheapest for 429×3–4 drafts, and crucially **you own the outputs** (ideal for a public lore site). Use Flux Kontext for consistency. Render labels *out of band* (below).
- **Skip Midjourney** for the labels (worst text), though it's the choice if you later want a single hero-quality showpiece with the label added in post.

Sources: [Fiddl.art fantasy tools](https://fiddl.art/blog/en/fantasy-ai-image-tools) · [VibeDex character-design 2026](https://vibedex.ai/blog/best-ai-image-generator-character-design-2026) · [ToolDirectory MJ vs FLUX vs Ideogram](https://tooldirectory.ai/blog/best-ai-image-generator-2026-midjourney-flux-ideogram) · [ToonyStory consistency test](https://toonystory.com/blog/best-ai-for-character-consistency-2026) · [Cliprise 2026 guide](https://medium.com/@cliprise/ai-image-generation-in-2026-midjourney-flux-2-imagen-4-and-beyond-7934a9228e98) · [ConsistentCharacterAI 2026](https://consistentcharacterai.com/posts/best-ai-character-generators-2026).

## Phase 3 — the master style prompt (in `arda_portrait_prompts.json` → `style`)

> loose expressive hand-drawn fantasy character-sheet portrait, bust / head and shoulders, mostly 3/4 view, slightly exaggerated cartoony-but-grounded proportions — strong jawline, prominent nose, distinctive characterful eyebrows, very readable facial expression; confident sketchy inklines with visible construction lines and varied line weight; soft slightly-desaturated cel-shading (one mid-tone, one darker shadow, one lighter highlight), simple consistent top-left directional light; flat plain white background, no scenery, no props; illustrated fantasy-novel / tabletop-RPG concept lineup art

**Negative** (`→ negative`): photorealistic, photograph, 3D render, CGI, smooth gradients, airbrushed, hyper-detailed oil painting, HDR, harsh cinematic lighting, complex/dark background, scenery, large weapons, glowing effects, modern/sci-fi clothing, anime moe, extra limbs, deformed hands, distorted face, watermark, signature, text artifacts.

**Per-generator syntax.** Ideogram: paste the prompt, set *Style = Design/Illustration*, attach the reference sheet as **Style Reference**, and add negatives in the negative field. FLUX: prepend the style, put subject after "Subject:", pass negatives; use Kontext with one approved portrait as the anchor. Midjourney: append `--sref <sheet-url> --cref <anchor-url> --style raw --no photo,gradient,background`.

## Phase 2 & 4 — the character bible + per-character prompts (`arda_portrait_prompts.json`)

`gen_portrait_prompts.py` builds one prompt per figure straight from the genealogy's own trait data:
- **429 figures**, each tagged `conf`: **40 "C"** (physical look stated or strongly implied in the corpus — Fëanor's raven hair, Galadriel's gold-lit hair, Thorin's forked beard, Gandalf's blue hat…) and **389 "I"** (race-typical look inferred, clearly flagged — the corpus simply doesn't describe most minor figures).
- Race → heritage phrasing (Elf/Ainu/Man/Half-elven/Dwarf/Hobbit), age cue, and an **expression** derived from role and lore-note (kings → regal; the slain/doomed → grave; warriors → stern; loremasters → wise; hobbits → warm).
- Every prompt ends "Head and shoulders only, 3/4 view, plain white background."

## Labels — do NOT let the AI draw the text

For 429 *consistent* labels, in-image text (even Ideogram's) will vary. **Generate the bust on white, then overlay the name programmatically** — perfect spelling, one handwritten font, identical placement every time. The archive can do this in the browser: drop the finished PNG behind the existing portrait frame and print `label` (already the lore-accurate name) beneath it in the site's caption font. `arda_portrait_prompts.json` gives the exact `label` string per character.

## Phase 5 — QA passes (run after rendering)

1. **Style pass:** eyeball the sheet in a grid; flag any face that's over-rendered, photoreal, or off-palette; re-roll with the style weight raised / negatives reinforced.
2. **Lore pass:** check the 40 `conf:C` figures hardest — wrong hair colour (Galadriel must be gold, Thorin's beard dark-going-grey, Círdan is the *only* bearded Elf), wrong race, wrong age. For `conf:I` figures only race-plausibility matters.
3. **Consistency pass:** keep one approved portrait per race as the Character-Reference anchor so all Elves/Men/Dwarves share a face-family.

## Integration into the archive

- **Format/size:** 512×640 PNG (or WebP), transparent or white ground; the gallery frame is 420×560, records/trees use 96–420px — one 512-wide master downsizes cleanly.
- **Drop-in:** name files `<id>.png` (e.g. `feanor.png`) in `site/portraits/`. `portraits.js` can then prefer a real PNG when present and fall back to the procedural SVG when absent — a one-line lookup, so the set can be filled in gradually without breaking anything.
- **Alt text:** `"portrait of <name>, <heritage>"` — already derivable from the JSON.
- **Licensing:** if you use FLUX Pro or Firefly you may host the outputs freely; if Ideogram/MJ, keep to their paid-tier commercial terms and credit as required.

## What already works today

The archive **already renders a lore-locked portrait for every one of the 429 figures** — the procedural SVG busts in the family-tree cards and record pages (corpus-stated traits where known, race-typical otherwise, always labelled). They are 100% consistent and 100% canon-safe by construction. The AI pipeline above is the path to richer, hand-illustrated versions when you're ready to render them; until then nothing is missing.

*Generated 2026-07 · run `python3 map/gen_portrait_prompts.py` to rebuild the prompt set after any genealogy change.*
