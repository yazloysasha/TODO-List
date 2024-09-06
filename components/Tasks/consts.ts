import { Status } from "@components/TODOList/types";

export const StatusClassName: { [Property in Status]: string } = {
  [Status.DONE]: "done",
  [Status.NOT_DONE]: "notDone",
};
