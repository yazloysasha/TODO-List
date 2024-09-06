import { Status } from "./types";

export const StatusTitle: { [Property in Status]: string } = {
  [Status.DONE]: "Выполнено",
  [Status.NOT_DONE]: "Не выполнено",
};
