import { useEffect } from "react";

// `selected` is listed only to re-run the redraw once its highlight has rendered.
export function Loupe({ selected, draw }: { selected: string; draw: () => void }) {
  useEffect(() => {
    draw();
  }, [draw, selected]);
  return null;
}
