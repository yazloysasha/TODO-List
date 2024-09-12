import { IConfig } from "@types";
import getConfig from "next/config";
import style from "./style.module.scss";
import { ButtonType, IInputProps } from "./types";
import { ReactNode, MouseEventHandler, ChangeEventHandler } from "react";

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
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLLabelElement>;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  children: ReactNode;
}): ReactNode {
  const { DEVICE } = getConfig().publicRuntimeConfig as IConfig;

  let classNames: string | string[] = [style[type]];

  if (className) classNames.push(className);
  if (DEVICE === "android") classNames.push(style.android);
  if (input && disabled) classNames.push(style.disabled);

  classNames = classNames.join(" ");

  // Создать эффект ряби
  const createRippleEffect = (
    element: HTMLButtonElement | HTMLLabelElement,
    clientX: number,
    clientY: number
  ): void => {
    const circle = document.createElement("div");
    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;

    circle.classList.add(style.ripple);

    circle.style.width = `${diameter}px`;
    circle.style.height = `${diameter}px`;

    circle.style.top = `${clientY - (element.offsetTop + radius)}px`;
    circle.style.left = `${clientX - (element.offsetLeft + radius)}px`;

    element.appendChild(circle);

    setTimeout(() => element.removeChild(circle), 600);
  };

  // Событие клика на кнопку
  const onClickHandler: MouseEventHandler<
    HTMLButtonElement | HTMLLabelElement
  > = (event) => {
    if (DEVICE === "android") {
      createRippleEffect(
        event.target as HTMLButtonElement | HTMLLabelElement,
        event.clientX,
        event.clientY
      );
    }

    if (onClick) onClick(event);
  };

  return input ? (
    <>
      <label className={classNames} htmlFor={input.id} onClick={onClickHandler}>
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
    <button className={classNames} disabled={disabled} onClick={onClickHandler}>
      {children}
    </button>
  );
}
