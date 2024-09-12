import {
  useRef,
  ReactNode,
  MouseEventHandler,
  ChangeEventHandler,
} from "react";
import { IConfig } from "@types";
import getConfig from "next/config";
import style from "./style.module.scss";
import { ButtonType, IInputProps } from "./types";

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

  const ref = useRef(null); // Ссылка на кнопку

  let classNames: string | string[] = [style[type]];

  if (className) classNames.push(className);
  if (DEVICE === "android") classNames.push(style.android);
  if (input && disabled) classNames.push(style.disabled);

  classNames = classNames.join(" ");

  // Создать эффект ряби
  const createRippleEffect = (clientX: number, clientY: number): void => {
    if (!ref.current) return;

    const element = ref.current as HTMLButtonElement | HTMLLabelElement;

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
      createRippleEffect(event.clientX, event.clientY);
    }

    if (onClick) onClick(event);
  };

  return input ? (
    <>
      <label
        ref={ref}
        className={classNames}
        htmlFor={input.id}
        onClick={onClickHandler}
      >
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
    <button
      ref={ref}
      className={classNames}
      disabled={disabled}
      onClick={onClickHandler}
    >
      {children}
    </button>
  );
}
