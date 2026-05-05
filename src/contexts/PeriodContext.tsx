import { createContext, useContext, useState, ReactNode, useMemo } from "react";
import { subDays } from "date-fns";

export type PeriodPreset = "7d" | "30d" | "90d" | "custom";

interface PeriodCtx {
  preset: PeriodPreset;
  setPreset: (p: PeriodPreset) => void;
  from: Date;
  to: Date;
  setRange: (from: Date, to: Date) => void;
  label: string;
}

const Ctx = createContext<PeriodCtx | null>(null);

export const PeriodProvider = ({ children }: { children: ReactNode }) => {
  const [preset, setPresetState] = useState<PeriodPreset>("30d");
  const [custom, setCustom] = useState<{ from: Date; to: Date } | null>(null);

  const { from, to, label } = useMemo(() => {
    const now = new Date();
    if (preset === "custom" && custom) {
      return { from: custom.from, to: custom.to, label: "Personalizado" };
    }
    const days = preset === "7d" ? 7 : preset === "90d" ? 90 : 30;
    return { from: subDays(now, days), to: now, label: `Últimos ${days} dias` };
  }, [preset, custom]);

  const setPreset = (p: PeriodPreset) => setPresetState(p);
  const setRange = (f: Date, t: Date) => {
    setCustom({ from: f, to: t });
    setPresetState("custom");
  };

  return (
    <Ctx.Provider value={{ preset, setPreset, from, to, setRange, label }}>
      {children}
    </Ctx.Provider>
  );
};

export const usePeriod = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePeriod outside PeriodProvider");
  return ctx;
};
