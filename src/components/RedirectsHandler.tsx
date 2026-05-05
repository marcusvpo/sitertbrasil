import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

let cache: { from_path: string; to_path: string }[] | null = null;

async function loadRedirects() {
  if (cache) return cache;
  const { data } = await supabase
    .from("redirects")
    .select("from_path, to_path")
    .eq("is_active", true);
  cache = (data as any) ?? [];
  return cache;
}

const RedirectsHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    loadRedirects().then((rows) => {
      if (!active) return;
      const match = rows.find((r) => r.from_path === location.pathname);
      if (match && match.to_path !== location.pathname) {
        navigate(match.to_path, { replace: true });
      }
    });
    return () => {
      active = false;
    };
  }, [location.pathname, navigate]);

  return null;
};

export default RedirectsHandler;
