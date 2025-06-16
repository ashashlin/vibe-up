import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

export default function useVibeFilters(cityId) {
  // useSearchParams always reads from the URL
  // Default to all vibes when user opens events page from selecting a city in the dropdown
  const [searchParams, setSearchParams] = useSearchParams();
  const vibeFilters = searchParams.getAll("vibe");

  function handleVibeChange(vibe) {
    const vibeName = vibe.name.toLowerCase();
    const sp = new URLSearchParams(searchParams);
    const currentFilters = sp.getAll("vibe");

    if (vibeName !== "all vibes") {
      // Delete all vibes from filters bc we are selecting a specific vibe
      if (currentFilters.includes("all vibes")) {
        sp.delete("vibe");
      }

      // Append to the sp object if the current filter has not been selected
      if (!currentFilters.includes(vibeName)) {
        sp.append("vibe", vibeName);
        // Delete from the sp object if the current filter has been selected
      } else {
        sp.delete("vibe");

        const newFilters = currentFilters.filter((vibe) => vibe !== vibeName);
        if (newFilters.length === 0) {
          sp.set("vibe", "all vibes");
        } else {
          newFilters.forEach((vibe) => sp.append("vibe", vibe));
        }
      }
    } else {
      sp.delete("vibe");
      sp.set("vibe", "all vibes");
    }

    setSearchParams(sp);
  }

  // Take setSearchParams out of the dependency array bc react may return a new func reference for it on each render
  useEffect(() => {
    if (!searchParams.has("vibe")) {
      setSearchParams({
        vibe: "all vibes",
      });
    }
  }, [cityId]);

  return { vibeFilters, handleVibeChange };
}
