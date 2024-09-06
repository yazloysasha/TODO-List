import Tasks from "@components/Tasks";
import { StatusTitle } from "./consts";
import style from "./style.module.scss";
import Button from "@components/Button";
import Search from "@components/Search";
import { ITask, Status } from "./types";
import Dropdown from "@components/Dropdown";
import { ButtonType } from "@components/Button/types";
import { ReactNode, useEffect, useState } from "react";
import { StatusClassName } from "@components/Tasks/consts";
import { getCountOfTasksByStatuses, getRegExpQuery } from "./utils";

export default function TODOList(): ReactNode {
  // Список задач
  const [tasks, setTasks] = useState<ITask[]>([]);

  // Текущий статус
  const [status, setStatus] = useState<Status | undefined>();

  // Текущий запрос
  const [query, setQuery] = useState<RegExp>(getRegExpQuery());

  // Ссылка для скачивания файлов
  const [link, setLink] = useState<HTMLAnchorElement | undefined>();

  // Отслеживать добавление файлов
  const onUploadFile = async (file: File): Promise<void> => {
    const text = await file.text();

    try {
      const data = JSON.parse(text);
      if (!Array.isArray(data)) return;

      for (const element of data) {
        if (
          element.content === undefined ||
          (element.status !== Status.DONE && element.status !== Status.NOT_DONE)
        )
          return;
      }

      setTasks(data as ITask[]);
    } catch (err) {
      console.error(err);
    }
  };

  // Отслеживать загрузку файлов
  const onDownloadFile = (): void => {
    if (!link) return;

    const text = JSON.stringify(tasks);
    const blob = new Blob([text]);
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.click();
  };

  // Отслеживать добавление задачи
  const onAddTask = (): void => {
    const newTask: ITask = {
      content: "",
      status: Status.NOT_DONE,
    };

    const newTasks: ITask[] = [newTask, ...tasks];

    setTasks(newTasks);
  };

  // Отслеживать перемещение задачи
  const onMoveTask = (previosKey: number, nextKey: number): void => {
    const newTasks: ITask[] = [...tasks];

    newTasks.splice(previosKey, 1);
    newTasks.splice(nextKey, 0, tasks[previosKey]);

    setTasks(newTasks);
  };

  // Отслеживать изменение текста задачи
  const onChangeTaskContent = (key: number, content: string): void => {
    const newTasks: ITask[] = [...tasks];

    newTasks[key].content = content;

    setTasks(newTasks);
  };

  // Отслеживать изменение статуса задачи
  const onChangeTaskStatus = (key: number): void => {
    const newTasks: ITask[] = [...tasks];

    switch (tasks[key].status) {
      case Status.DONE:
        newTasks[key].status = Status.NOT_DONE;
        break;

      case Status.NOT_DONE:
        newTasks[key].status = Status.DONE;
        break;
    }

    setTasks(newTasks);
  };

  // Отслеживать удаление задач
  const onDeleteTask = (key: number): void => {
    const newTasks: ITask[] = tasks.filter((_, taskKey) => taskKey !== key);

    setTasks(newTasks);
  };

  // Количество задач по статусам
  const countOfTasksByStatuses = getCountOfTasksByStatuses(tasks);

  // Отображаемые задачи
  const showedTasks = tasks.filter(
    (task) => query.test(task.content) && (!status || status === task.status)
  );

  useEffect(() => {
    const newLink = document.createElement("a");

    newLink.download = "tasks.json";

    setLink(newLink);
  }, []);

  return (
    <div className={style.todoList}>
      <h2 className={style.title}>Список задач</h2>

      <div className={style.todoHead}>
        <div className={style.headContainer}>
          {Object.values(Status).map((status, key) => (
            <span key={key} className={style.info}>
              <span className={style[StatusClassName[status]]}>
                {StatusTitle[status]}:{" "}
              </span>
              {countOfTasksByStatuses[status]}
            </span>
          ))}

          <div className={style.buttons}>
            <Button
              className={style.button}
              type={ButtonType.PRIMARY}
              onClick={() => onAddTask()}
            >
              <div className={style.add} />
              Добавить
            </Button>

            <Button
              className={style.button}
              type={ButtonType.SOFT}
              input={{
                id: "upload",
                type: "file",
                accept: ".json",
              }}
              onChange={(event) => {
                if (!event.target.files?.length) return;

                onUploadFile(event.target.files[0]);

                event.target.value = "";
              }}
            >
              <div className={style.upload} />
              Загрузить
            </Button>

            <Button
              className={style.button}
              type={ButtonType.SOFT}
              onClick={() => onDownloadFile()}
            >
              <div className={style.download} />
              Скачать
            </Button>
          </div>
        </div>

        <div className={style.headContainer}>
          <Search
            className={style.search}
            placeholder="Текст задачи"
            onChangeText={(text) => setQuery(getRegExpQuery(text))}
          />

          <Dropdown
            className={style.dropdown}
            title="Статус"
            options={StatusTitle}
            option={status}
            setOption={setStatus}
          />
        </div>

        <div className={style.headContainer}>
          <span className={style.total}>Всего: {showedTasks.length}</span>
        </div>
      </div>

      <Tasks
        tasks={showedTasks}
        status={status}
        onMoveTask={onMoveTask}
        onChangeTaskContent={onChangeTaskContent}
        onChangeTaskStatus={onChangeTaskStatus}
        onDeleteTask={onDeleteTask}
      />
    </div>
  );
}
