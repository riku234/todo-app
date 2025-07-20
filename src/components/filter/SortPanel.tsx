import React, { useCallback } from 'react';
import { useTodo } from '../../contexts/TodoContext';
import { SortConfig, TodoItem } from '../../types';
import './SortPanel.css';

const SortPanel: React.FC = () => {
  const { state, setSort } = useTodo();

  const handleSortChange = useCallback((field: keyof TodoItem, direction: 'asc' | 'desc') => {
    const newSort: SortConfig = {
      field,
      direction
    };
    setSort(newSort);
  }, [setSort]);

  return (
    <div className="sort-panel">
      <div className="sort-panel__section">
        <h4 className="sort-panel__section-title">並び替え</h4>
        <div className="sort-panel__options">
          <div className="sort-panel__option">
            <label className="sort-panel__radio">
              <input
                type="radio"
                name="sort"
                checked={state.sort.field === 'createdAt' && state.sort.direction === 'desc'}
                onChange={() => handleSortChange('createdAt', 'desc')}
              />
              <span className="sort-panel__radio-label">作成日（新しい順）</span>
            </label>
          </div>
          <div className="sort-panel__option">
            <label className="sort-panel__radio">
              <input
                type="radio"
                name="sort"
                checked={state.sort.field === 'createdAt' && state.sort.direction === 'asc'}
                onChange={() => handleSortChange('createdAt', 'asc')}
              />
              <span className="sort-panel__radio-label">作成日（古い順）</span>
            </label>
          </div>
          <div className="sort-panel__option">
            <label className="sort-panel__radio">
              <input
                type="radio"
                name="sort"
                checked={state.sort.field === 'updatedAt' && state.sort.direction === 'desc'}
                onChange={() => handleSortChange('updatedAt', 'desc')}
              />
              <span className="sort-panel__radio-label">更新日（新しい順）</span>
            </label>
          </div>
          <div className="sort-panel__option">
            <label className="sort-panel__radio">
              <input
                type="radio"
                name="sort"
                checked={state.sort.field === 'updatedAt' && state.sort.direction === 'asc'}
                onChange={() => handleSortChange('updatedAt', 'asc')}
              />
              <span className="sort-panel__radio-label">更新日（古い順）</span>
            </label>
          </div>
          <div className="sort-panel__option">
            <label className="sort-panel__radio">
              <input
                type="radio"
                name="sort"
                checked={state.sort.field === 'priority' && state.sort.direction === 'desc'}
                onChange={() => handleSortChange('priority', 'desc')}
              />
              <span className="sort-panel__radio-label">優先度（高→低）</span>
            </label>
          </div>
          <div className="sort-panel__option">
            <label className="sort-panel__radio">
              <input
                type="radio"
                name="sort"
                checked={state.sort.field === 'priority' && state.sort.direction === 'asc'}
                onChange={() => handleSortChange('priority', 'asc')}
              />
              <span className="sort-panel__radio-label">優先度（低→高）</span>
            </label>
          </div>
          <div className="sort-panel__option">
            <label className="sort-panel__radio">
              <input
                type="radio"
                name="sort"
                checked={state.sort.field === 'text' && state.sort.direction === 'asc'}
                onChange={() => handleSortChange('text', 'asc')}
              />
              <span className="sort-panel__radio-label">タイトル（A→Z）</span>
            </label>
          </div>
          <div className="sort-panel__option">
            <label className="sort-panel__radio">
              <input
                type="radio"
                name="sort"
                checked={state.sort.field === 'text' && state.sort.direction === 'desc'}
                onChange={() => handleSortChange('text', 'desc')}
              />
              <span className="sort-panel__radio-label">タイトル（Z→A）</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortPanel; 