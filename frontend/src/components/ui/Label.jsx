import * as React from "react";
import { cn } from "../../lib/utils.js";

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground select-none cursor-default leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";

export { Label };
