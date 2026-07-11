import * as React from "react";
import { cn } from "../../lib/utils.js";

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse bg-[var(--border)] opacity-60 rounded-md", className)}
      style={{
        backgroundImage: 'linear-gradient(90deg, var(--border) 25%, var(--neon-subtle) 50%, var(--border) 75%)',
        backgroundSize: '200% 100%',
        animation: 'pulse-glow 2.5s ease-in-out infinite',
      }}
      {...props}
    />
  );
}

export { Skeleton };
export default Skeleton;
