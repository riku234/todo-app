import React, { useMemo, useCallback } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TodoItem, TaskStatus } from '../../types';
import { useTodo } from '../../contexts/TodoContext';
import { Badge } from '../common';
import { formatDate, getPriorityVariant } from '../../utils';
import './KanbanCard.css';

interface KanbanCardProps {
  todo: TodoItem;
}

const KanbanCard: React.FC<KanbanCardProps> = React.memo(({ todo }) => {
  const { updateTodo, deleteTodo } = useTodo();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = useMemo(() => ({
    transform: CSS.Transform.toString(transform),
    transition,
  }), [transform, transition]);

  const handleToggleComplete = useCallback(() => {
    updateTodo(todo.id, { status: todo.status === TaskStatus.DONE ? TaskStatus.TODO : TaskStatus.DONE });
  }, [todo.id, todo.status, updateTodo]);

  const handleDelete = useCallback(() => {
    deleteTodo(todo.id);
  }, [todo.id, deleteTodo]);

  const priorityVariant = useMemo(() => 
    todo.priority ? getPriorityVariant(todo.priority) : undefined
  , [todo.priority]);

  const formattedDueDate = useMemo(() => 
    todo.dueDate ? formatDate(todo.dueDate) : undefined
  , [todo.dueDate]);

  const priorityLabel = useMemo(() => {
    if (!todo.priority) return null;
    switch (todo.priority) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return null;
    }
  }, [todo.priority]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`kanban-card ${isDragging ? 'kanban-card--dragging' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className="kanban-card__header">
        <div className="kanban-card__title">
          <h4 className="kanban-card__title-text">{todo.text}</h4>
        </div>
        <div className="kanban-card__actions">
          <button
            className="kanban-card__action-button"
            onClick={handleToggleComplete}
            aria-label={todo.status === 'done' ? '完了を解除' : '完了にする'}
          >
            {todo.status === 'done' ? '✅' : '⭕'}
          </button>
          <button
            className="kanban-card__action-button"
            onClick={handleDelete}
            aria-label="削除"
          >
            🗑️
          </button>
        </div>
      </div>

      {todo.description && (
        <div className="kanban-card__description">
          <p className="kanban-card__description-text">{todo.description}</p>
        </div>
      )}

      <div className="kanban-card__footer">
        <div className="kanban-card__badges">
          {priorityVariant && priorityLabel && (
            <Badge variant={priorityVariant} size="small">
              {priorityLabel}
            </Badge>
          )}
          
          {formattedDueDate && (
            <Badge variant="secondary" size="small">
              {formattedDueDate}
            </Badge>
          )}
        </div>

        {todo.assignee && (
          <div className="kanban-card__assignee">
            <span className="kanban-card__assignee-label">担当:</span>
            <span className="kanban-card__assignee-name">{todo.assignee}</span>
          </div>
        )}
      </div>
    </div>
  );
});

KanbanCard.displayName = 'KanbanCard';

export default KanbanCard; 