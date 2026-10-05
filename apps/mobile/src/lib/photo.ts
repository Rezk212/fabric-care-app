import { SaveFormat, manipulateAsync } from 'expo-image-manipulator';

/** A small copy of a picked photo as a data URI, so it survives app restarts (picker files live in a cache the OS may clear). */
export async function toStoredPhoto(uri: string): Promise<string | undefined> {
  try {
    const img = await manipulateAsync(uri, [{ resize: { width: 640 } }], { compress: 0.6, format: SaveFormat.JPEG, base64: true });
    return img.base64 ? `data:image/jpeg;base64,${img.base64}` : undefined;
  } catch {
    return undefined;
  }
}
