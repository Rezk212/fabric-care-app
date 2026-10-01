// Provider-independent: what we ask the model, and the shape we require back.
export const FABRICS = [
  "cotton", "linen", "wool", "silk", "polyester", "nylon", "denim",
  "cashmere", "viscose", "synthetic_blend", "unknown",
] as const;

export const SCHEMA = {
  type: "object",
  properties: {
    fabric: { type: "string", enum: [...FABRICS] },
    confidence: { type: "number", description: "0 to 1: how sure you are about the fabric." },
    care_symbols: {
      type: "array",
      items: { type: "string" },
      description: "Care label symbols you can read, as short English phrases, e.g. 'wash 30C', 'do not tumble dry'.",
    },
    machine_brand: { type: ["string", "null"] },
    machine_model: { type: ["string", "null"] },
    notes: {
      type: "array",
      items: { type: "string" },
      description: "Short practical warnings for this garment, in English.",
    },
  },
  required: ["fabric", "confidence", "care_symbols", "machine_brand", "machine_model", "notes"],
  additionalProperties: false,
} as const;

export const SYSTEM = `You identify fabrics and read laundry care labels from photos for a laundry-care app.
Photos may include: a garment, its care label, and a washing machine (panel or rating plate).
- Report the fabric only from evidence in the photos (label text, texture, visible weave). If you cannot tell, use "unknown" with low confidence. Never guess a fabric to look helpful.
- Care labels override visual guesses. Read symbols and text exactly.
- For the machine, report brand and model only if they are legible in a photo or given by the user; otherwise null.
- Do not recommend wash programs. The app derives those from your fabric and symbols.`;

export function userText(modelNumber?: string): string {
  return modelNumber
    ? `The user typed this machine model number: ${modelNumber}. Identify the fabric and read the label.`
    : "Identify the fabric and read the label.";
}
