import React from 'react';
import { TodoItem as Todo, Priority, TaskStatus } from '../../types';
import { Button, Badge } from '../common';
import { dateUtils } from '../../utils';
import './TodoItem.css';

export interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, status: TaskStatus) => void;
  className?: string;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onEdit,
  onDelete,
  onMove,
  className = '',
}) => {
  const handleToggle = () => {
    onToggle(todo.id);
  };

  const handleEdit = () => {
    onEdit(todo);
  };

  const handleDelete = () => {
    onDelete(todo.id);
  };

  const handleMove = (newStatus: TaskStatus) => {
    onMove(todo.id, newStatus);
  };

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && todo.status !== TaskStatus.DONE;

  return (
    <div className={`todo-item ${className}`}>
      <div className="todo-item__header">
        <div className="todo-item__checkbox-wrapper">
          <input
            type="checkbox"
            className="todo-item__checkbox"
            checked={todo.status === TaskStatus.DONE}
            onChange={handleToggle}
            aria-label={`タスク「${todo.text}」を${todo.status === TaskStatus.DONE ? '未完了' : '完了'}にする`}
          />
          <span className="todo-item__checkmark"></span>
        </div>
        
        <div className="todo-item__title-wrapper">
          <h3 
            className={`todo-item__title ${todo.status === TaskStatus.DONE ? 'todo-item__title--completed' : ''}`}
          >
            {todo.text}
          </h3>
          {todo.description && (
            <p className={`todo-item__description ${todo.status === TaskStatus.DONE ? 'todo-item__description--completed' : ''}`}>
              {todo.description}
            </p>
          )}
        </div>
      </div>

      <div className="todo-item__meta">
        <div className="todo-item__badges">
          {todo.priority && (
            <Badge 
              variant={dateUtils.getPriorityColor(todo.priority)}
              size="small"
            >
              {dateUtils.getPriorityLabel(todo.priority)}
            </Badge>
          )}
          
          {todo.dueDate && (
            <Badge 
              variant={isOverdue ? 'danger' : 'info'}
              size="small"
            >
              {isOverdue ? '期限切れ' : '期限'} {dateUtils.formatDate(todo.dueDate)}
            </Badge>
          )}
        </div>

        <div className="todo-item__actions">
          <Button
            variant="ghost"
            size="small"
            onClick={handleEdit}
            aria-label="編集"
          >
            <svg className="todo-item__icon" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </Button>
          
          <Button
            variant="ghost"
            size="small"
            onClick={handleDelete}
            aria-label="削除"
          >
            <svg className="todo-item__icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </Button>
        </div>
      </div>

      {todo.status !== TaskStatus.DONE && (
        <div className="todo-item__move-actions">
          <span className="todo-item__move-label">移動:</span>
          <div className="todo-item__move-buttons">
            {todo.status !== TaskStatus.TODO && (
              <Button
                variant="secondary"
                size="small"
                onClick={() => handleMove(TaskStatus.TODO)}
              >
                未着手
              </Button>
            )}
            {todo.status !== TaskStatus.IN_PROGRESS && (
              <Button
                variant="secondary"
                size="small"
                onClick={() => handleMove(TaskStatus.IN_PROGRESS)}
              >
                進行中
              </Button>
            )}
            <Button
              variant="success"
              size="small"
              onClick={() => handleMove(TaskStatus.DONE)}
            >
              完了
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoItem; 