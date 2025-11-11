import { useContext } from "react";
import { StoreContext } from "../stores/store";

/**
 * Custom React hook that returns the application store from `StoreContext`.
 *
 * Purpose:
 * - A small convenience wrapper around `useContext(StoreContext)` so components only
 *   need to import `useStore` instead of both `useContext` and `StoreContext`.
 *
 * Usage:
 *   const store = useStore();
 *   // or destructure: const { activityStore } = useStore();
 *
 * Important:
 * - Ensure the calling component is rendered inside the `StoreContext.Provider`
 *   (typically provided at the app root). If not, the returned value may be `undefined`
 *   depending on how `StoreContext` was created.
 *
 * Notes:
 * - The exact shape (types/members) of the returned store comes from `../stores/store`.
 *   Consider adding/using explicit TypeScript typings on `StoreContext` for better IDE support.
 */
export function useStore() {
    return useContext(StoreContext);                
}