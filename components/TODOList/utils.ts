import { ITask, Status } from "./types";

export const getRegExpQuery = (query: string = ""): RegExp => {
  return new RegExp(query, "gi");
};

export const getCountOfTasksByStatuses = (
  tasks: ITask[]
): { [Property in Status]: number } => {
  const countOfTasksByStatuses: { [Property in Status]: number } = {
    [Status.DONE]: 0,
    [Status.NOT_DONE]: 0,
  };

  tasks.forEach((task) => {
    countOfTasksByStatuses[task.status]++;
  });

  return countOfTasksByStatuses;
};
