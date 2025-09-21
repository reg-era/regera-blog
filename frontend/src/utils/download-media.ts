import { environment } from "../environments/environment.development";

export async function urlToBlobImageUrl(imageUrl: string): Promise<string> {
  try {
    const response = await fetch(`${environment.apiURL}${imageUrl}`);
    if (!response.ok) {
      return '/error-media.gif';
    }
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.log("error downloading media: ", error);
    return '/error-media.gif';
  }
}
