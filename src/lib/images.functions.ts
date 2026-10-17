import { createServerFn } from "@tanstack/react-start";
import type { ImageOverrides } from "./images";

// Used by the game's route loader so replaced images are in the first render.
export const fetchImageOverrides = createServerFn({ method: "GET" }).handler(
  async (): Promise<ImageOverrides> => {
    try {
      const { getOverrides } = await import("./images.server");
      return await getOverrides();
    } catch (e) {
      console.error(e);
      return {}; // fall back to the bundled images
    }
  },
);
