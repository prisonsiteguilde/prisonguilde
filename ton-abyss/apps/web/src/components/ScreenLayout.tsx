import type { ReactNode } from "react";
import { ScreenHeader } from "./ScreenHeader.js";
import type { Screen } from "../store.js";

interface Props {
  title: string;
  subtitle?: string;
  back?: Screen;
  action?: ReactNode;
  accent?: string;
  children: ReactNode;
  className?: string;
}

export function ScreenLayout({ title, subtitle, back, action, accent, children, className }: Props) {
  return (
    <div className={`px-4 pt-3 pb-24 ${className ?? ""}`}>
      <div className="mb-4">
        <ScreenHeader title={title} subtitle={subtitle} back={back} action={action} accent={accent} />
      </div>
      <div className="section-gap">{children}</div>
    </div>
  );
}
