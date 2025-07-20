import React, { useState, useMemo, useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { TaskStatus } from '../../types';
import { useTodo } from '../../contexts/TodoContext';
import KanbanColumn from './KanbanColumn';
import './KanbanBoard.css';

const KanbanBoard: React.FC = React.memo(() => {
  const { getTodosByStatus, moveTodo } = useTodo();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    // ドラッグオーバー時の処理（必要に応じて実装）
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // 同じ要素の場合は何もしない
    if (activeId === overId) return;

    // カラムにドロップされた場合
    if (Object.values(TaskStatus).includes(overId as TaskStatus)) {
      const newStatus = overId as TaskStatus;
      const todosInColumn = getTodosByStatus(newStatus);
      const newOrder = todosInColumn.length;
      
      moveTodo(activeId, newStatus, newOrder);
      return;
    }

    // カードにドロップされた場合（同じカラム内での並び替え）
    const activeTodo = getTodosByStatus(TaskStatus.TODO)
      .concat(getTodosByStatus(TaskStatus.IN_PROGRESS))
      .concat(getTodosByStatus(TaskStatus.DONE))
      .find(todo => todo.id === activeId);

    if (activeTodo) {
      const targetTodo = getTodosByStatus(TaskStatus.TODO)
        .concat(getTodosByStatus(TaskStatus.IN_PROGRESS))
        .concat(getTodosByStatus(TaskStatus.DONE))
        .find(todo => todo.id === overId);

      if (targetTodo && activeTodo.status === targetTodo.status) {
        const todosInColumn = getTodosByStatus(activeTodo.status);
        const activeIndex = todosInColumn.findIndex(todo => todo.id === activeId);
        const targetIndex = todosInColumn.findIndex(todo => todo.id === overId);
        
        if (activeIndex !== -1 && targetIndex !== -1) {
          const newOrder = targetIndex > activeIndex ? targetIndex : targetIndex;
          moveTodo(activeId, activeTodo.status, newOrder);
        }
      }
    }
  }, [getTodosByStatus, moveTodo]);

  const columns = useMemo(() => [
    { id: TaskStatus.TODO, title: '未着手', icon: '📋' },
    { id: TaskStatus.IN_PROGRESS, title: '進行中', icon: '🔄' },
    { id: TaskStatus.DONE, title: '完了', icon: '✅' },
  ], []);

  return (
    <div className="kanban-board">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="kanban-board__columns">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              icon={column.icon}
              todos={getTodosByStatus(column.id)}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
});

KanbanBoard.displayName = 'KanbanBoard';

export default KanbanBoard; 