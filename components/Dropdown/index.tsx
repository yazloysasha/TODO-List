import style from "./style.module.scss";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";

export default function Dropdown<T extends string>({
  className,
  title,
  options,
  option,
  setOption,
}: {
  className?: string;
  title: string;
  options: { [Property in T]: string };
  option: T | undefined;
  setOption: Dispatch<SetStateAction<T | undefined>>;
}): ReactNode {
  // Открыты ли сейчас опции
  const [isOpen, setIsOpen] = useState<boolean>(false);

  let classNames: string | string[] = [style.dropdown];

  if (className) classNames.push(className);
  if (isOpen) classNames.push(style.open);
  if (option) classNames.push(style.chosen);

  classNames = classNames.join(" ");

  return (
    <div className={classNames}>
      <button
        className={style.clean}
        onClick={() => {
          setIsOpen(false);
          setOption(undefined);
        }}
      >
        Сбросить
      </button>

      <div className={style.modal}>
        <button className={style.header} onClick={() => setIsOpen(!isOpen)}>
          <p className={style.title}>{option ? options[option] : title}</p>

          <div className={style.arrow} />
        </button>

        <ul className={style.options} onClick={() => setIsOpen(false)}>
          {Object.keys(options).map((key) => (
            <li
              key={key}
              className={style.option}
              onClick={() => setOption(key as T)}
            >
              {options[key as T]}

              {key === option && <div className={style.check} />}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
