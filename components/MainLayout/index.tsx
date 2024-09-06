import { ReactNode } from "react";
import style from "./style.module.scss";

export default function MainLayout({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  return <div className={style.main}>{children}</div>;
}
