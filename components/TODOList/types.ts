export enum Status {
  DONE = "DONE",
  NOT_DONE = "NOT_DONE",
}

export interface ITask {
  content: string;
  status: Status;
}
