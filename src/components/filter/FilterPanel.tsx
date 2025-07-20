import React, { useState, useCallback } from 'react';
import { useTodo } from '../../contexts/TodoContext';
import { TaskStatus, Priority } from '../../types';
import './FilterPanel.css';

const FilterPanel: React.FC = () => {
  const { state, setFilters } = useTodo();
  
  const [searchTerm, setSearchTerm] = useState(state.filters.search || '');
  const [statusFilter, setStatusFilter] = useState<TaskStatus[]>(state.filters.status || []);
  const [priorityFilter, setPriorityFilter] = useState<Priority[]>(state.filters.priority || []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilters({
      ...state.filters,
      search: value
    });
  }, [state.filters, setFilters]);

  const handleStatusChange = useCallback((status: TaskStatus) => {
    const newStatusFilter = statusFilter.includes(status)
      ? statusFilter.filter(s => s !== status)
      : [...statusFilter, status];
    
    setStatusFilter(newStatusFilter);
    setFilters({
      ...state.filters,
      status: newStatusFilter
    });
  }, [statusFilter, state.filters, setFilters]);

  const handlePriorityChange = useCallback((priority: Priority) => {
    const newPriorityFilter = priorityFilter.includes(priority)
      ? priorityFilter.filter(p => p !== priority)
      : [...priorityFilter, priority];
    
    setPriorityFilter(newPriorityFilter);
    setFilters({
      ...state.filters,
      priority: newPriorityFilter
    });
  }, [priorityFilter, state.filters, setFilters]);

  return (
    <div className="filter-panel">
      <div className="filter-panel__section">
        <h4 className="filter-panel__section-title">検索</h4>
        <input
          type="text"
          placeholder="タスクを検索..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="filter-panel__search-input"
        />
      </div>

      <div className="filter-panel__section">
        <h4 className="filter-panel__section-title">ステータス</h4>
        <div className="filter-panel__checkbox-group">
          <label className="filter-panel__checkbox">
            <input
              type="checkbox"
              checked={statusFilter.includes(TaskStatus.TODO)}
              onChange={() => handleStatusChange(TaskStatus.TODO)}
            />
            <span className="filter-panel__checkbox-label">未着手</span>
          </label>
          <label className="filter-panel__checkbox">
            <input
              type="checkbox"
              checked={statusFilter.includes(TaskStatus.IN_PROGRESS)}
              onChange={() => handleStatusChange(TaskStatus.IN_PROGRESS)}
            />
            <span className="filter-panel__checkbox-label">進行中</span>
          </label>
          <label className="filter-panel__checkbox">
            <input
              type="checkbox"
              checked={statusFilter.includes(TaskStatus.DONE)}
              onChange={() => handleStatusChange(TaskStatus.DONE)}
            />
            <span className="filter-panel__checkbox-label">完了</span>
          </label>
        </div>
      </div>

      <div className="filter-panel__section">
        <h4 className="filter-panel__section-title">優先度</h4>
        <div className="filter-panel__checkbox-group">
          <label className="filter-panel__checkbox">
            <input
              type="checkbox"
              checked={priorityFilter.includes(Priority.HIGH)}
              onChange={() => handlePriorityChange(Priority.HIGH)}
            />
            <span className="filter-panel__checkbox-label filter-panel__checkbox-label--high">高</span>
          </label>
          <label className="filter-panel__checkbox">
            <input
              type="checkbox"
              checked={priorityFilter.includes(Priority.MEDIUM)}
              onChange={() => handlePriorityChange(Priority.MEDIUM)}
            />
            <span className="filter-panel__checkbox-label filter-panel__checkbox-label--medium">中</span>
          </label>
          <label className="filter-panel__checkbox">
            <input
              type="checkbox"
              checked={priorityFilter.includes(Priority.LOW)}
              onChange={() => handlePriorityChange(Priority.LOW)}
            />
            <span className="filter-panel__checkbox-label filter-panel__checkbox-label--low">低</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel; 