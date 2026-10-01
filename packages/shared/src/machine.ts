import type { WashRecommendation } from './domain';

type Program = WashRecommendation['program'];

// How machines usually label each kind of programme. First match in priority order wins.
const PATTERNS: Record<Program, RegExp[]> = {
  delicate: [/delicate/i, /gentle/i, /silk/i, /lingerie/i, /hand\s*wash/i],
  wool: [/wool/i, /hand\s*wash/i, /delicate/i],
  hand_wash: [/hand\s*wash/i, /wool/i, /delicate/i],
  cottons: [/cotton/i, /eco\s*40/i, /normal/i, /regular/i, /daily/i],
  synthetics: [/synthetic/i, /easy\s*care/i, /mix/i, /perm(anent)?\s*press/i],
  quick: [/quick/i, /express/i, /rapid/i, /\b(15|30)\s*(min|')/i, /speed/i],
};

/** The label on the user's own machine that best matches our generic programme, or undefined. */
export function matchMachineProgram(program: Program, machineLabels: string[]): string | undefined {
  const labels = machineLabels.map((l) => l.trim()).filter(Boolean);
  for (const re of PATTERNS[program]) {
    const hit = labels.find((l) => re.test(l));
    if (hit) return hit;
  }
  return undefined;
}
