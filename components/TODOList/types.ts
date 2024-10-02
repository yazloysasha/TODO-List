export enum Status {
  DONE = "DONE",
  NOT_DONE = "NOT_DONE",
}

export interface ITask {
  _id: string;
  content: string;
  status: Status;
}

export interface IData {
  totalSize: number;
  items: ITask[];
}
