import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { decode, empty, storageKey } from "../utils/training";
import type { Progress } from "../types";
type Update = (fn: (p: Progress) => Progress) => void;
const Context = createContext<{
  p: Progress;
  update: Update;
  temporary: boolean;
} | null>(null);
export function ProgressProvider({ children }: { children: ReactNode }) {
  const [p, set] = useState(() => {
    try {
      return decode(localStorage.getItem(storageKey));
    } catch {
      return empty();
    }
  });
  const current = useRef(p);
  const [temporary, warn] = useState(false);
  useEffect(() => {
    function sync(e: StorageEvent) {
      if (e.key === storageKey || e.key === null) {
        current.current = decode(e.newValue);
        set(current.current);
      }
    }
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  const update: Update = (fn) => {
    const next = fn(current.current);
    current.current = next;
    set(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      warn(false);
    } catch {
      warn(true);
    }
  };
  return (
    <Context.Provider value={{ p, update, temporary }}>
      {children}
    </Context.Provider>
  );
}
export function useProgress() {
  const ctx = useContext(Context);
  if (!ctx) throw Error("Missing progress provider");
  return ctx;
}
