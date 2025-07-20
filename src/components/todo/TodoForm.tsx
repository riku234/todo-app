import React, { useState } from 'react';
import { Priority } from '../../types';
import { Button, Input } from '../common';
import { validationUtils } from '../../utils';
import './TodoForm.css';

export interface TodoFormData {
  text: string;
  description: string | undefined;
  priority: Priority;
  dueDate: Date | undefined;
  assignee: string | undefined;
}

export interface TodoFormProps {
  onSubmit: (data: TodoFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<TodoFormData>;
  isLoading?: boolean;
  className?: string;
}

const TodoForm: React.FC<TodoFormProps> = ({
  onSubmit,
  onCancel,
  initialData = {},
  isLoading = false,
  className = '',
}) => {
  const [formData, setFormData] = useState<TodoFormData>({
    text: initialData.text || '',
    description: initialData.description,
    priority: initialData.priority || Priority.MEDIUM,
    dueDate: initialData.dueDate,
    assignee: initialData.assignee,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TodoFormData, string>>>({});

  const handleInputChange = (field: keyof TodoFormData, value: string | Date | Priority | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TodoFormData, string>> = {};

    // Validate text
    const textValidation = validationUtils.validateTodoText(formData.text);
    if (!textValidation.isValid) {
      newErrors.text = textValidation.error;
    }

    // Validate description
    const descriptionValidation = validationUtils.validateDescription(formData.description);
    if (!descriptionValidation.isValid) {
      newErrors.description = descriptionValidation.error;
    }

    // Validate due date
    const dueDateValidation = validationUtils.validateDueDate(formData.dueDate);
    if (!dueDateValidation.isValid) {
      newErrors.dueDate = dueDateValidation.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleCancel = () => {
    onCancel?.();
  };

  const formatDateForInput = (date?: Date): string => {
    if (!date) return '';
    return date.toISOString().slice(0, 16);
  };

  const parseDateFromInput = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? undefined : date;
  };

  return (
    <form className={`todo-form ${className}`} onSubmit={handleSubmit}>
      <div className="todo-form__header">
        <h2 className="todo-form__title">新しいタスク</h2>
      </div>

      <div className="todo-form__body">
        <div className="todo-form__field">
          <Input
            label="タスク名"
            placeholder="タスクのタイトルを入力してください"
            value={formData.text}
            onChange={(e) => handleInputChange('text', e.target.value)}
            state={errors.text ? 'error' : 'default'}
            errorText={errors.text || undefined}
            isRequired
            leftIcon={
              <svg viewBox="0 0 20 20" fill="currentColor" className="todo-form__icon">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
            }
          />
        </div>

        <div className="todo-form__field">
          <Input
            label="説明"
            placeholder="タスクの詳細説明を入力してください（オプション）"
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            state={errors.description ? 'error' : 'default'}
            errorText={errors.description || undefined}
            leftIcon={
              <svg viewBox="0 0 20 20" fill="currentColor" className="todo-form__icon">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            }
          />
        </div>

        <div className="todo-form__row">
          <div className="todo-form__field todo-form__field--half">
            <label className="todo-form__label">
              優先度
              <select
                className="todo-form__select"
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value as Priority)}
              >
                <option value={Priority.LOW}>低</option>
                <option value={Priority.MEDIUM}>中</option>
                <option value={Priority.HIGH}>高</option>
              </select>
            </label>
          </div>

          <div className="todo-form__field todo-form__field--half">
            <Input
              label="期限"
              type="datetime-local"
              value={formatDateForInput(formData.dueDate)}
              onChange={(e) => handleInputChange('dueDate', parseDateFromInput(e.target.value))}
              state={errors.dueDate ? 'error' : 'default'}
              errorText={errors.dueDate}
              leftIcon={
                <svg viewBox="0 0 20 20" fill="currentColor" className="todo-form__icon">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              }
            />
          </div>
        </div>

        <div className="todo-form__field">
          <Input
            label="担当者"
            placeholder="担当者名を入力してください（オプション）"
            value={formData.assignee || ''}
            onChange={(e) => handleInputChange('assignee', e.target.value)}
            leftIcon={
              <svg viewBox="0 0 20 20" fill="currentColor" className="todo-form__icon">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            }
          />
        </div>
      </div>

      <div className="todo-form__footer">
        <div className="todo-form__actions">
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={isLoading}
            >
              キャンセル
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={isLoading}
          >
            作成
          </Button>
        </div>
      </div>
    </form>
  );
};

export default TodoForm; 