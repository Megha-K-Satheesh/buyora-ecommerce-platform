import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export function useQueryArray(param) {
  const { search } = useLocation();

  return useMemo(() => {
    const params = new URLSearchParams(search);
    const value = params.get(param);
    return value ? value.split(",") : [];
  }, [search, param]);
}


