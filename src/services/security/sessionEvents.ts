type Listener = () => void;
const listeners = new Set<Listener>();
export const sessionEvents = {
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  invalidate(): void {
    listeners.forEach(listener => listener());
  },
};
