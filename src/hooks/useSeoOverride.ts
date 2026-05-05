import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Override = {
  title?: string | null;
  description?: string | null;
  og_image?: string | null;
  keywords?: string | null;
  noindex?: boolean | null;
};

const cache = new Map<string, Override | null>();

export function useSeoOverride(route: string) {
  const [data, setData] = useState<Override | null>(cache.get(route) ?? null);

  useEffect(() => {
    let active = true;
    if (cache.has(route)) {
      setData(cache.get(route) ?? null);
      return;
    }
    (async () => {
      const { data: row } = await supabase
        .from("seo_overrides")
        .select("title, description, og_image, keywords, noindex")
        .eq("route", route)
        .maybeSingle();
      const value = (row as Override) ?? null;
      cache.set(route, value);
      if (active) setData(value);
    })();
    return () => {
      active = false;
    };
  }, [route]);

  return data;
}

export function clearSeoOverrideCache(route?: string) {
  if (route) cache.delete(route);
  else cache.clear();
}
