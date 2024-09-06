import { OnMoveTask } from "./types";
import { DropResult } from "react-beautiful-dnd";

// Отслеживать перенос элементов
export const onDragEnd = (result: DropResult, onMoveTask: OnMoveTask): void => {
  const { source, destination } = result;

  if (!destination || source.index === destination.index) return;

  onMoveTask(source.index, destination.index);
};
