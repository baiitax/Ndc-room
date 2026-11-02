"use client";
import { useEffect, useState } from "react";

/** Browser network hint only; not a server, database or Realtime health check. */
export function useConnectivity() {
  const [state, setState] = useState<{ ready: boolean; online: boolean }>({ ready: false, online: true });
  useEffect(() => {
    const update = () => setState({ ready: true, online: navigator.onLine });
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => { window.removeEventListener("online", update); window.removeEventListener("offline", update); };
  }, []);
  return state;
}
