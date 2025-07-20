import React, { useMemo } from 'react';
import { useTodo } from '../../contexts/TodoContext';
import { TaskStatus } from '../../types';
import './StatsPanel.css';

const StatsPanel: React.FC = () => {
  const { state } = useTodo();

  const stats = useMemo(() => {
    const todos = state.todos;
    const total = todos.length;
    const todo = todos.filter(t => t.status === TaskStatus.TODO).length;
    const inProgress = todos.filter(t => t.status === TaskStatus.IN_PROGRESS).length;
    const done = todos.filter(t => t.status === TaskStatus.DONE).length;
    const highPriority = todos.filter(t => t.priority === 'high').length;
    const mediumPriority = todos.filter(t => t.priority === 'medium').length;
    const lowPriority = todos.filter(t => t.priority === 'low').length;
    const progressRate = total > 0 ? Math.round((done / total) * 100) : 0;

    return {
      total,
      todo,
      inProgress,
      done,
      highPriority,
      mediumPriority,
      lowPriority,
      progressRate
    };
  }, [state.todos]);

  return (
    <div className="stats-panel">
      <div className="stats-panel__section">
        <h4 className="stats-panel__section-title">総タスク数</h4>
        <div className="stats-panel__stat">
          <span className="stats-panel__stat-number">{stats.total}</span>
          <span className="stats-panel__stat-label">タスク</span>
        </div>
      </div>

      <div className="stats-panel__section">
        <h4 className="stats-panel__section-title">ステータス別</h4>
        <div className="stats-panel__stats-grid">
          <div className="stats-panel__stat-item">
            <span className="stats-panel__stat-number stats-panel__stat-number--todo">{stats.todo}</span>
            <span className="stats-panel__stat-label">未着手</span>
          </div>
          <div className="stats-panel__stat-item">
            <span className="stats-panel__stat-number stats-panel__stat-number--in-progress">{stats.inProgress}</span>
            <span className="stats-panel__stat-label">進行中</span>
          </div>
          <div className="stats-panel__stat-item">
            <span className="stats-panel__stat-number stats-panel__stat-number--done">{stats.done}</span>
            <span className="stats-panel__stat-label">完了</span>
          </div>
        </div>
      </div>

      <div className="stats-panel__section">
        <h4 className="stats-panel__section-title">優先度別</h4>
        <div className="stats-panel__stats-grid">
          <div className="stats-panel__stat-item">
            <span className="stats-panel__stat-number stats-panel__stat-number--high">{stats.highPriority}</span>
            <span className="stats-panel__stat-label">高</span>
          </div>
          <div className="stats-panel__stat-item">
            <span className="stats-panel__stat-number stats-panel__stat-number--medium">{stats.mediumPriority}</span>
            <span className="stats-panel__stat-label">中</span>
          </div>
          <div className="stats-panel__stat-item">
            <span className="stats-panel__stat-number stats-panel__stat-number--low">{stats.lowPriority}</span>
            <span className="stats-panel__stat-label">低</span>
          </div>
        </div>
      </div>

      <div className="stats-panel__section">
        <h4 className="stats-panel__section-title">進捗率</h4>
        <div className="stats-panel__progress">
          <div className="stats-panel__progress-bar">
            <div 
              className="stats-panel__progress-fill"
              style={{ width: `${stats.progressRate}%` }}
            />
          </div>
          <span className="stats-panel__progress-text">{stats.progressRate}%</span>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel; 