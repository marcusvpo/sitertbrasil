import { type ReactNode } from "react";

/**
 * Scans children (string only) and wraps every occurrence of "MOTOREX"
 * with a <span> styled in the official MOTOREX green.
 * For non-string children, returns them unchanged.
 */
export function highlightMotorex(children: ReactNode): ReactNode {
  if (typeof children !== "string") return children;

  const parts = children.split(/(MOTOREX)/gi);
  if (parts.length === 1) return children;

  return parts.map((part, i) =>
    part.toUpperCase() === "MOTOREX" ? (
      <span key={i} className="text-motorex font-bold">
        {part}
      </span>
    ) : (
      part
    )
  );
}
