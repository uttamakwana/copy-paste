import { ComponentProps, forwardRef } from "react";
import "./button.css";
import { twMerge } from "tailwind-merge";

type TButtonProps = ComponentProps<"button">;
export const Button = forwardRef<HTMLButtonElement, TButtonProps>(
  (props, ref) => {
    const { className, children } = props;
    const mergedClassName = twMerge("ui-button", className);
    return (
      <button ref={ref} className={mergedClassName} role="button">{children}</button>
    );
  }
);
