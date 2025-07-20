import React, { useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TodoItem, TaskStatus } from '../../types';
import KanbanCard from './KanbanCard';
import './KanbanColumn.css';

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  icon: string;
  todos: TodoItem[];
}

const KanbanColumn: React.FC<KanbanColumnProps> = React.memo(({ id, title, icon, todos }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  const sortableItems = useMemo(() => 
    todos.map(todo => todo.id)
  , [todos]);

  const isEmpty = useMemo(() => 
    todos.length === 0
  , [todos.length]);

  return (
    <div
      ref={setNodeRef}
      className={`kanban-column ${isOver ? 'kanban-column--over' : ''}`}
    >
      <div className="kanban-column__header">
        <div className="kanban-column__title">
          <span className="kanban-column__icon">{icon}</span>
          <h3 className="kanban-column__title-text">{title}</h3>
        </div>
        <div className="kanban-column__count">
          <span className="kanban-column__count-badge">{todos.length}</span>
        </div>
      </div>

      <div className="kanban-column__content">
        <SortableContext items={sortableItems} strategy={verticalListSortingStrategy}>
          {todos.map((todo) => (
            <KanbanCard key={todo.id} todo={todo} />
          ))}
        </SortableContext>
        
        {isEmpty && (
          <div className="kanban-column__empty">
            <p className="kanban-column__empty-text">タスクがありません</p>
          </div>
        )}
      </div>
    </div>
  );
});

KanbanColumn.displayName = 'KanbanColumn';

export default KanbanColumn; 