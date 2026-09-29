---
name: editorial-tech-banner
description: Create or revise banners for this project's web content using its restrained editorial technical-illustration style. Use for blog banners, technical covers, and preset banner assets; do not use for unrelated photography, logos, or general UI work.
---

# Editorial Tech Banner

Create project banners that feel deliberately art-directed rather than generically AI-generated.

## Canonical direction

Use `apps/web/public/images/banners/ai-agent.png` as the primary visual reference when it exists. Treat it as a style reference, not an edit target, unless the user explicitly asks to change that file.

Preserve these characteristics:

- Flat, vector-like editorial illustration with Swiss information-design and technical-schematic influences.
- Matte shapes, crisp negative space, varied line weights, intentional irregular spacing, and subtle screen-print grain or registration texture.
- Asymmetrical but balanced composition with a clear visual hierarchy and fewer, larger purposeful shapes.
- Near-black navy, muted petrol blue, desaturated teal, warm ivory, and at most one restrained amber accent.
- A subject-specific systems metaphor such as flows, ports, queues, branches, feedback loops, or modular components. Do not reuse the same diagram for every topic.

Avoid glossy 3D, glassmorphism, neon bloom, glowing brains or orbs, humanoid robots, perfect icon grids, excessive gradients, random floating polygons, fake UI text, and decorative details without meaning.

## Production requirements

- Default to a `1600 × 686` PNG for article banners, matching the existing `21:9` assets.
- Keep meaningful content within the central 70 percent so centered `16:9` mobile cropping remains understandable.
- Do not add text, letters, numbers, logos, trademarks, or watermarks unless the user supplies exact required copy.
- Use the built-in image-generation workflow and label local inputs as edit targets or style references explicitly.
- Inspect the generated image at full width and as a centered `1220 × 686` crop before accepting it.
- Save final project assets under `apps/web/public/images/banners/` with a descriptive kebab-case filename. Resize mechanically only after selecting the image.
- Preserve existing assets by default. Replace a file only when the user requested an edit or replacement.

## Prompt scaffold

Adapt this direction to the requested topic instead of copying it verbatim:

```text
Use case: stylized-concept
Asset type: technical blog post banner
Primary request: <topic expressed as a purposeful system or process>
Style/medium: flat vector-like editorial technical illustration; Swiss information design; matte surfaces; subtle screen-print grain
Composition/framing: 1600 × 686 ultra-wide; asymmetrical but balanced; central 70 percent crop-safe; fewer, larger shapes; generous breathing room
Color palette: near-black navy, muted petrol blue, desaturated teal, warm ivory, one restrained amber accent
Constraints: no text, letters, numbers, logos, trademarks, or watermark
Avoid: glossy 3D, glassmorphism, neon bloom, glowing brain or orb, humanoid robot, perfect icon grid, excessive gradients, random floating decoration
```

When the user also wants the banner selectable in Sanity, follow the repository `AGENTS.md` pre-change process, then add the asset to `POST_BANNER_PRESETS` in `apps/web/src/sanity/constants/postBanners.ts`. Do not change schemas or queries when the existing preset mechanism already covers the request.
