import { Children, type ReactNode, isValidElement, cloneElement } from "react";

/**
 * Recursively wraps every occurrence of "MOTOREX" inside string children
 * with a <span> styled in the official MOTOREX green (#26ad97).
 */
export function highlightMotorex(children: ReactNode): ReactNode {
  if (typeof children === "string") {
    const parts = children.split(/(MOTOREX)/g);
    if (parts.length === 1) return children;
    return parts.map((part, i) =>
      part === "MOTOREX" ? (
        <span key={i} className="text-motorex font-bold">
          MOTOREX
        </span>
      ) : (
        part
      )
    );
  }

  if (Array.isArray(children)) {
    return Children.map(children, (c) => highlightMotorex(c));
  }

  if (isValidElement<{ children?: ReactNode }>(children) && children.props.children) {
    return cloneElement(children, {
      children: highlightMotorex(children.props.children),
    });
  }

  return children;
}

/** Inline component: wraps text and auto-highlights MOTOREX. */
export const MX = ({ children }: { children: ReactNode }) => <>{highlightMotorex(children)}</>;
