import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "rt_session_id";
const HEARTBEAT_MS = 30_000;

function getSessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function detectDevice(): "mobile" | "tablet" | "desktop" {
  const w = window.innerWidth;
  if (w < 640) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

function parseUtm() {
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source: p.get("utm_source") || undefined,
    utm_medium: p.get("utm_medium") || undefined,
    utm_campaign: p.get("utm_campaign") || undefined,
  };
}

export type TrackEventType =
  | "pageview"
  | "view_product"
  | "add_to_cart"
  | "begin_checkout"
  | "lead"
  | "custom";

export async function trackEvent(
  event_type: TrackEventType,
  extra: { path?: string; product_id?: string; metadata?: any } = {},
) {
  try {
    const session_id = getSessionId();
    const utm = parseUtm();
    await supabase.from("funnel_events").insert({
      session_id,
      event_type,
      path: extra.path || window.location.pathname,
      referrer: document.referrer || null,
      device: detectDevice(),
      product_id: extra.product_id || null,
      metadata: extra.metadata || null,
      ...utm,
    });
  } catch {
    // silencioso — analytics não pode quebrar UX
  }
}

async function heartbeat(path: string) {
  try {
    const session_id = getSessionId();
    const utm = parseUtm();
    await supabase.from("live_sessions").upsert(
      {
        session_id,
        current_path: path,
        device: detectDevice(),
        referrer: document.referrer || null,
        utm_source: utm.utm_source || null,
        last_seen: new Date().toISOString(),
      },
      { onConflict: "session_id" },
    );
  } catch {}
}

/**
 * Instala o tracking global: pageview a cada navegação + heartbeat de presença.
 * Deve ser usado uma única vez (no Layout público).
 */
export function useTrack() {
  const location = useLocation();
  const lastPath = useRef<string>("");

  useEffect(() => {
    const path = location.pathname + location.search;
    if (path === lastPath.current) return;
    lastPath.current = path;
    trackEvent("pageview", { path: location.pathname });
    heartbeat(location.pathname);
  }, [location.pathname, location.search]);

  useEffect(() => {
    heartbeat(window.location.pathname);
    const id = setInterval(() => heartbeat(window.location.pathname), HEARTBEAT_MS);
    const onVis = () => {
      if (document.visibilityState === "visible") heartbeat(window.location.pathname);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);
}
