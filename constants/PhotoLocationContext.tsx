import type { Coords } from "@/components/MapPreview";
import React, { createContext, useContext, useState } from "react";


type Ctx = {
coords: Coords | null;
setCoords: (c: Coords) => void;
clear: () => void;
};


const PhotoLocationCtx = createContext();


export function PhotoLocationProvider({ children }: { children: React.ReactNode }) {
const [coords, setCoordsState] = useState<Coords | null>(null);
const setCoords = (c: Coords) => setCoordsState(c);
const clear = () => setCoordsState(null);


return (
<PhotoLocationCtx.Provider value={{ coords, setCoords, clear }}>
{children}
</PhotoLocationCtx.Provider>
);
}
export function usePhotoLocation() {
  const ctx = useContext(PhotoLocationCtx);
  if (!ctx) throw new Error("usePhotoLocation must be used within PhotoLocationProvider");
  return ctx;
}