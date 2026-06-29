import * as React from "react";

import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  helperText?: string;
  children: React.ReactElement<React.InputHTMLAttributes<HTMLInputElement> | React.SelectHTMLAttributes<HTMLSelectElement> | React.TextareaHTMLAttributes<HTMLTextAreaElement>>;
  className?: string;
};

export function Field({ label, helperText, children, className }: FieldProps) {
  const generatedId = React.useId();
  const controlId = children.props.id ?? generatedId;
  const helperId = helperText ? `${controlId}-helper` : undefined;

  return (
    <div className={cn("grid gap-2", className)}>
      <label htmlFor={controlId} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      {React.cloneElement(children, {
        id: controlId,
        "aria-describedby": helperId,
      })}
      {helperText ? (
        <p id={helperId} className="text-xs leading-5 text-slate-500">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

export const fieldControlClass = "h-11 rounded-md border border-slate-300 bg-white px-3 text-base text-ink outline-none transition placeholder:text-slate-400 focus:border-moss focus:ring-2 focus:ring-moss/20";
