import { fetcher } from "@utils";
import getConfig from "next/config";
import Tasks from "@components/Tasks";
import style from "./style.module.scss";
import Button from "@components/Button";
import Search from "@components/Search";
import { Toast } from "@capacitor/toast";
import Dropdown from "@components/Dropdown";
import { IData, ITask, Status } from "./types";
import { FILENAME, StatusTitle } from "./consts";
import { ButtonType } from "@components/Button/types";
import { ReactNode, useEffect, useState } from "react";
import { ExecuteWithErrorHandling, IConfig } from "@types";
import { StatusClassName } from "@components/Tasks/consts";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { getCountOfTasksByStatuses, getRegExpQuery } from "./utils";

export default function TODOList(): ReactNode {
  const { DEVICE } = getConfig().publicRuntimeConfig as IConfig;

  // Список задач
  const [tasks, setTasks] = useState<ITask[]>([]);

  // Текущий статус
  const [status, setStatus] = useState<Status | undefined>();

  // Текущий запрос
  const [query, setQuery] = useState<RegExp>(getRegExpQuery());

  // Ссылка для скачивания файлов
  const [link, setLink] = useState<HTMLAnchorElement | undefined>();

  // ID удаляющейся задачи
  const [deletableTaskId, setDeletableTaskId] = useState<string>();

  // ID редактирующейся задачи
  const [editableTaskId, setEditableTaskId] = useState<string>();

  // Поля редактирующейся задачи
  const [editableTaskData, setEditableTaskData] = useState<Partial<ITask>>({});

  // Список задач для замены
  const [tasksToReplace, setTasksToReplace] = useState<ITask[]>();

  // Получить список задач
  const [{ data: getTasksData }, getTasksExecute]: [
    { data: IData },
    ExecuteWithErrorHandling
  ] = fetcher({
    method: "GET",
    url: "/tasks",
  });

  // Создать новую задачу
  const [{ data: createTaskData }, createTaskExecute]: [
    { data: { task: ITask } },
    ExecuteWithErrorHandling
  ] = fetcher({
    method: "POST",
    url: "/tasks",
    data: {
      content: "",
      status: Status.NOT_DONE,
    },
  });

  // Заменить список задач
  const [{ data: replaceTasksData }, replaceTasksExecute] = fetcher({
    method: "PUT",
    url: "/tasks",
    data: {
      tasks: tasksToReplace,
    },
  });

  // Отредактировать задачу
  const [{ data: editTaskData }, editTaskExecute]: [
    { data: { task: ITask } },
    ExecuteWithErrorHandling
  ] = fetcher({
    method: "PATCH",
    url: `/tasks/${editableTaskId}`,
    data: editableTaskData,
  });

  // Удалить задачу
  const [{ data: deleteTaskData }, deleteTaskExecute]: [
    { data: { taskId: string } },
    ExecuteWithErrorHandling
  ] = fetcher({
    method: "DELETE",
    url: `/tasks/${deletableTaskId}`,
  });

  // Отслеживать скачивание приложения
  const onDownloadApp = (type: "android") => {
    if (!link) return;

    let href: string;
    let name: string;

    switch (type) {
      case "android":
        href = "app-release.apk";
        name = "TODO-List.apk";
        break;
    }

    link.href = href;
    link.download = name;
    link.click();
  };

  // Отслеживать добавление файлов
  const onUploadFile = (file: File): void => {
    const fileReader = new FileReader();

    fileReader.readAsText(file);
    fileReader.onload = () => {
      try {
        const data = JSON.parse(fileReader.result as string);
        if (!Array.isArray(data)) return;

        for (const element of data) {
          if (
            element.content === undefined ||
            (element.status !== Status.DONE &&
              element.status !== Status.NOT_DONE)
          )
            return;
        }

        data.reverse();

        setTasksToReplace(data as ITask[]);
      } catch (err) {
        console.error(err);
      }
    };
  };

  // Отслеживать загрузку файлов
  const onDownloadFile = (): void => {
    const fileReader = new FileReader();
    const text = JSON.stringify(tasks);
    const blob = new Blob([text]);

    fileReader.readAsDataURL(blob);

    fileReader.onload = async (): Promise<void> => {
      const url = fileReader.result as string;

      switch (DEVICE) {
        case "web":
          if (!link) return;

          link.href = url;
          link.download = FILENAME;
          link.click();
          break;

        case "android":
          try {
            await Filesystem.requestPermissions();

            await Filesystem.writeFile({
              path: `Download/${FILENAME}`,
              data: url,
              directory: Directory.ExternalStorage,
              recursive: true,
            });

            await Toast.show({ text: "Успешно сохранено" });
          } catch (err) {
            console.error(err);

            Toast.show({ text: (err as Error).message });
          }
          break;
      }
    };
  };

  // Отслеживать добавление задачи
  const onAddTask = (): void => {
    createTaskExecute();
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

    setTimeout(() => {
      setTasks((tasks) => {
        const currentTask = tasks.find(
          (task) => task._id === newTasks[key]._id
        );

        if (content === currentTask?.content) {
          setEditableTaskId(currentTask._id);
          setEditableTaskData({ content });
        }

        return tasks;
      });
    }, 300);
  };

  // Отслеживать изменение статуса задачи
  const onChangeTaskStatus = (key: number): void => {
    setEditableTaskId(tasks[key]._id);

    switch (tasks[key].status) {
      case Status.DONE:
        setEditableTaskData({ status: Status.NOT_DONE });
        break;

      case Status.NOT_DONE:
        setEditableTaskData({ status: Status.DONE });
        break;
    }
  };

  // Отслеживать удаление задач
  const onDeleteTask = (key: number): void => {
    setDeletableTaskId(tasks[key]._id);
  };

  // Количество задач по статусам
  const countOfTasksByStatuses = getCountOfTasksByStatuses(tasks);

  // Отображаемые задачи
  const showedTasks = tasks.filter(
    (task) => query.test(task.content) && (!status || status === task.status)
  );

  useEffect(() => {
    getTasksExecute();

    if (DEVICE !== "web") return;

    // Создать ссылку для скачивания файла
    const newLink = document.createElement("a");

    setLink(newLink);
  }, []);

  // Заменить задачи
  useEffect(() => {
    if (!tasksToReplace) return;

    replaceTasksExecute();
  }, [tasksToReplace]);

  // Отредактировать задачу
  useEffect(() => {
    if (!editableTaskId || !editableTaskData) return;

    editTaskExecute();
  }, [editableTaskData]);

  // Удалить задачу
  useEffect(() => {
    if (!deletableTaskId) return;

    deleteTaskExecute();
  }, [deletableTaskId]);

  useEffect(() => {
    if (!getTasksData) return;

    getTasksData.items.reverse();

    setTasks(getTasksData.items);
  }, [getTasksData]);

  useEffect(() => {
    if (!createTaskData) return;

    const newTasks: ITask[] = [createTaskData.task, ...tasks];

    setTasks(newTasks);
  }, [createTaskData]);

  useEffect(() => {
    if (!replaceTasksData) return;

    getTasksExecute();
  }, [replaceTasksData]);

  useEffect(() => {
    if (!editTaskData) return;

    const newTasks: ITask[] = [...tasks];

    const key = newTasks.findIndex(
      (task) => editTaskData.task._id === task._id
    );

    if (key === -1) return;

    newTasks[key].status = editTaskData.task.status;

    setTasks(newTasks);
  }, [editTaskData]);

  useEffect(() => {
    if (!deleteTaskData) return;

    const newTasks: ITask[] = tasks.filter(
      (task) => deleteTaskData.taskId !== task._id
    );

    setTasks(newTasks);
  }, [deleteTaskData]);

  return (
    <div className={style.todoList}>
      <div className={style.todoHead}>
        <div className={style.titleContainer}>
          <h2 className={style.title}>Список задач</h2>

          {DEVICE === "web" && (
            <Button
              className={style.distribution}
              type={ButtonType.SOFT}
              onClick={() => onDownloadApp("android")}
            >
              <div className={style.android} />
              Android
            </Button>
          )}
        </div>

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
        onMoveTask={onMoveTask}
        onChangeTaskContent={onChangeTaskContent}
        onChangeTaskStatus={onChangeTaskStatus}
        onDeleteTask={onDeleteTask}
      />
    </div>
  );
}
