import { ReactNode } from "react";
import { OnChangeText } from "./types";
import style from "./style.module.scss";

export default function Search({
  className,
  placeholder,
  onChangeText,
}: {
  className?: string;
  placeholder?: string;
  onChangeText: OnChangeText;
}): ReactNode {
  let classNames: string | string[] = [style.search];

  if (className) classNames.push(className);

  classNames = classNames.join(" ");

  return (
    <div className={classNames}>
      <div className={style.tool} />

      <input
        type="text"
        placeholder={placeholder}
        onChange={(event) => onChangeText(event.target.value)}
      />
    </div>
  );
}
