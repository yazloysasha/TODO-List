import style from "./style.module.scss";
import { ButtonType, IInputProps } from "./types";
import { ReactNode, ChangeEventHandler, MouseEventHandler } from "react";

export default function Button({
  className,
  type,
  input,
  disabled = false,
  onClick,
  onChange,
  children,
}: {
  className?: string;
  type: ButtonType;
  input?: IInputProps;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  children: ReactNode;
}): ReactNode {
  let classNames: string | string[] = [style[type]];

  if (className) classNames.push(className);
  if (input && disabled) classNames.push(style.disabled);

  classNames = classNames.join(" ");

  return input ? (
    <>
      <label className={classNames} htmlFor={input.id}>
        {children}
      </label>
      <input
        hidden
        id={input.id}
        type={input.type}
        accept={input.accept}
        disabled={disabled}
        onChange={onChange}
      />
    </>
  ) : (
    <button className={classNames} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}
