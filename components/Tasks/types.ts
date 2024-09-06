export type OnMoveTask = (previosKey: number, nextKey: number) => void;

export type OnChangeTaskContent = (key: number, content: string) => void;

export type OnChangeTaskStatus = (key: number) => void;

export type OnDeleteTask = (key: number) => void;
