import {
  OnMoveTask,
  OnDeleteTask,
  OnChangeTaskStatus,
  OnChangeTaskContent,
} from "./types";
import { onDragEnd } from "./utils";
import style from "./style.module.scss";
import Button from "@components/Button";
import { StatusClassName } from "./consts";
import { ButtonType } from "@components/Button/types";
import { ReactNode, useEffect, useState } from "react";
import { StatusTitle } from "@components/TODOList/consts";
import { ITask, Status } from "@components/TODOList/types";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

export default function Tasks({
  tasks,
  onMoveTask,
  onChangeTaskContent,
  onChangeTaskStatus,
  onDeleteTask,
}: {
  tasks: ITask[];
  onMoveTask: OnMoveTask;
  onChangeTaskContent: OnChangeTaskContent;
  onChangeTaskStatus: OnChangeTaskStatus;
  onDeleteTask: OnDeleteTask;
}): ReactNode {
  // Выполняется ли сейчас перенос элемента
  const [isGrabbing, setIsGrabbing] = useState<boolean>(false);

  // Можно ли анимировать элементы
  const [isAnimate, setIsAnimate] = useState<boolean>(true);

  // Проверка на CSR
  const [isClientSide, setIsClientSide] = useState<boolean>(false);

  // Получить задачу
  const getTaskElement = (task: ITask, key: number): ReactNode => (
    // <Draggable key={key} draggableId={String(key)} index={key}>
    //   {(provided) => (
    <li
      className={`${style.task} ${isGrabbing && style.grabbing} ${
        isAnimate && style.animate
      }`}
      // ref={provided.innerRef}
      // {...provided.draggableProps}
      // {...provided.dragHandleProps}
    >
      <div className={style.number}>
        <p>{key + 1}</p>
      </div>

      <div className={style.status}>
        <div className={style[StatusClassName[task.status]]}>
          {StatusTitle[task.status]}
        </div>
      </div>

      <div className={style.content}>
        <textarea
          value={task.content}
          disabled={task.status === Status.DONE}
          onChange={(event) => onChangeTaskContent(key, event.target.value)}
        />
      </div>

      <div className={style.buttons}>
        <Button
          className={`${style.changeStatus} ${
            style[StatusClassName[task.status]]
          }`}
          type={ButtonType.CUSTOM}
          onClick={() => onChangeTaskStatus(key)}
        >
          <div className={style.icon} />
        </Button>

        <Button
          className={style.delete}
          type={ButtonType.CUSTOM}
          onClick={() => onDeleteTask(key)}
        >
          <div className={style.icon} />
        </Button>
      </div>
    </li>
    //   )}
    // </Draggable>
  );

  // Получить задачи
  const getTasksElement = (): ReactNode => (
    // <Droppable droppableId="tasks" direction="vertical">
    //   {(provided) => (
    //     <ul
    //       className={`${style.tasks} ${isGrabbing && style.grabbing}`}
    //       ref={provided.innerRef}
    //       {...provided.droppableProps}
    //     >
    //       {tasks.map(getTaskElement)}
    //     </ul>
    //   )}
    // </Droppable>
    <ul className={`${style.tasks} ${isGrabbing && style.grabbing}`}>
      {tasks.map(getTaskElement)}
    </ul>
  );

  useEffect(() => setIsClientSide(true), []);

  // Задержка для правильной отрисовки анимации
  useEffect(() => {
    if (isGrabbing) {
      setIsAnimate(false);
    } else {
      const timeout = setTimeout(() => setIsAnimate(true), 100);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [isGrabbing]);

  return (
    <>
      <div className={style.title}>
        <div className={style.number}>
          <p>№</p>
        </div>

        <div className={style.status}>
          <p>Статус</p>
        </div>

        <div className={style.content}>
          <p>Задача</p>
        </div>
      </div>

      {isClientSide && tasks.length ? (
        // <DragDropContext
        //   onDragStart={() => setIsGrabbing(true)}
        //   onDragEnd={(result) => {
        //     setIsGrabbing(false);
        //     onDragEnd(result, onMoveTask);
        //   }}
        // >
        //   {getTasksElement()}
        // </DragDropContext>
        getTasksElement()
      ) : (
        <span className={style.nothing}>Упс! Ничего не найдено...</span>
      )}
    </>
  );
}
