
import { SceneOption } from "../types";

export const SYSTEM_INSTRUCTION = `Role: You are the MAGMA APE CORE, a high-octane conceptual AI architect for the Tribe Odyssey universe.
Aesthetic Style: Professional Urban Comic Art fused with Cyber-Fantasy and High-End Collectible Aesthetics.
Visual Rules:
1. BOLD LINEWORK: Use thick, varied-weight ink outlines reminiscent of modern gritty graphic novels.
2. CELL-SHADING: Use high-contrast, sharp-edged shadows. No soft gradients or photorealistic lighting.
3. COLOR PALETTE: Dominated by Obsidian/Charcoal fur, pulsing Magma Orange (#FF4500) circuitry/veins, and Toxic Neon Green (#ADFF2F) eyes and energy effects.
4. TEXTURES: Heavy use of halftone patterns (dot screens), ink-bleeding effects on edges, and gritty stardust grain.
5. THEME: Post-apocalyptic Section 9 ruins, floating debris, radioactive ruins, and high-tech tactical gear (beanies, energy katanas, heavy-duty exo-rigs).
IMPORTANT: Always output art that looks like a hand-drawn, digitally colored high-budget comic book panel. Avoid photorealism at all costs.`;

export const SCENE_PROMPTS = {
  [SceneOption.THRONE]: "The Apex Predator's Seat. Magma Ape reclined on a throne made of fused scrap metal and obsidian rocks. He holds a glowing neon green energy cigar. Background is a pile of high-tech gold bars and discarded cyber-cores. Lighting is dramatic low-angle, casting huge comic-book shadows. Heavy ink-shading and halftone dots in the dark areas.",
  [SceneOption.ACTION]: "The Breach Sequence. Dynamic, high-kinetic shot. Magma Ape is mid-air, crashing through a reinforced glass holographic window. Shards of glass are stylized as sharp geometric triangles. Kinetic speed lines explode from the point of impact. His glowing magma veins pulse with blinding intensity. SFX text: 'CRASH' in bold, stylized block letters integrated into the background.",
  [SceneOption.TECHNICAL]: "Genomic Blueprint X-13. A holographic character design sheet. Frontal, side, and 3/4 views of the Magma Ape. Blue-line sketch marks visible beneath the final ink. Callouts pointing to tactical sensors, the radioactive eye-lens, and obsidian fur density. Background is a dark HUD interface with scrolling binary and DNA helix diagrams.",
  [SceneOption.CINEMATIC]: "The Radioactive Gaze. An extreme cinematic close-up. Focus on a single neon-green eye with a complex digital iris pattern. Smoke from a magma-circuit cigar curls around his face in a heavy-ink, stylized swirl. The cracks in his obsidian skin glow like a dying star. Noir-style lighting with high-contrast toxic green rim lighting.",
  [SceneOption.CUSTOM]: ""
};
