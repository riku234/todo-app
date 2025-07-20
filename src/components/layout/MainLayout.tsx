import React, { useState, Suspense, lazy } from 'react';
import { useTodo } from '../../contexts/TodoContext';
import { Button } from '../common';
import './MainLayout.css';

// 遅延読み込みコンポーネント
const KanbanBoard = lazy(() => import('../kanban/KanbanBoard'));
const FilterPanel = lazy(() => import('../filter/FilterPanel'));
const SortPanel = lazy(() => import('../filter/SortPanel'));
const StatsPanel = lazy(() => import('../stats/StatsPanel'));
const TodoForm = lazy(() => import('../todo/TodoForm'));

// ローディングコンポーネント
const LoadingSpinner: React.FC = () => (
  <div className="loading-spinner">
    <div className="loading-spinner__content">
      <div className="loading-spinner__spinner"></div>
      <p>読み込み中...</p>
    </div>
  </div>
);

const MainLayout: React.FC = () => {
  const { state, addTodo, clearFilters } = useTodo();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddTodo = (todoData: any) => {
    addTodo(todoData);
    setShowAddForm(false);
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
  };

  return (
    <div className="main-layout">
      {/* Header */}
      <header className="main-layout__header">
        <div className="main-layout__header-content">
          <div className="main-layout__header-left">
            <button
              className="main-layout__sidebar-toggle"
              onClick={toggleSidebar}
              aria-label="サイドバーを開く"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="main-layout__menu-icon">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
              </svg>
            </button>
            <h1 className="main-layout__title">タスク管理アプリ</h1>
          </div>
          
          <div className="main-layout__header-right">
            <Button
              variant="primary"
              onClick={toggleAddForm}
              className="main-layout__add-button"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="main-layout__add-icon">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
              タスク追加
            </Button>
          </div>
        </div>
      </header>

      <div className="main-layout__container">
        {/* Sidebar */}
        <aside className={`main-layout__sidebar ${showSidebar ? 'main-layout__sidebar--open' : ''}`}>
          <div className="main-layout__sidebar-content">
            <div className="main-layout__sidebar-header">
              <h2 className="main-layout__sidebar-title">フィルター & 統計</h2>
              <button
                className="main-layout__sidebar-close"
                onClick={toggleSidebar}
                aria-label="サイドバーを閉じる"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>

            <div className="main-layout__sidebar-sections">
              {/* Stats Panel */}
              <section className="main-layout__sidebar-section">
                <h3 className="main-layout__section-title">統計</h3>
                <Suspense fallback={<LoadingSpinner />}>
                  <StatsPanel />
                </Suspense>
              </section>

              {/* Filter Panel */}
              <section className="main-layout__sidebar-section">
                <h3 className="main-layout__section-title">フィルター</h3>
                <Suspense fallback={<LoadingSpinner />}>
                  <FilterPanel />
                </Suspense>
              </section>

              {/* Sort Panel */}
              <section className="main-layout__sidebar-section">
                <h3 className="main-layout__section-title">ソート</h3>
                <Suspense fallback={<LoadingSpinner />}>
                  <SortPanel />
                </Suspense>
              </section>

              {/* Clear Filters */}
              <section className="main-layout__sidebar-section">
                <Button
                  variant="secondary"
                  onClick={handleClearFilters}
                  className="main-layout__clear-filters"
                >
                  フィルターをクリア
                </Button>
              </section>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-layout__main">
          <div className="main-layout__main-content">
            {/* Add Todo Form */}
            {showAddForm && (
              <div className="main-layout__add-form-overlay">
                <div className="main-layout__add-form-container">
                  <div className="main-layout__add-form-header">
                    <h2>新しいタスクを追加</h2>
                    <button
                      className="main-layout__add-form-close"
                      onClick={toggleAddForm}
                      aria-label="フォームを閉じる"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                      </svg>
                    </button>
                  </div>
                  <Suspense fallback={<LoadingSpinner />}>
                    <TodoForm onSubmit={handleAddTodo} onCancel={toggleAddForm} />
                  </Suspense>
                </div>
              </div>
            )}

            {/* Loading State */}
            {state.loading && (
              <div className="main-layout__loading">
                <div className="main-layout__loading-spinner"></div>
                <p>読み込み中...</p>
              </div>
            )}

            {/* Error State */}
            {state.error && (
              <div className="main-layout__error">
                <p className="main-layout__error-message">{state.error}</p>
                <Button variant="secondary" onClick={() => window.location.reload()}>
                  再読み込み
                </Button>
              </div>
            )}

            {/* Kanban Board */}
            {!state.loading && !state.error && (
              <Suspense fallback={<LoadingSpinner />}>
                <KanbanBoard />
              </Suspense>
            )}
          </div>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {showSidebar && (
        <div
          className="main-layout__sidebar-overlay"
          onClick={toggleSidebar}
          aria-label="サイドバーを閉じる"
        />
      )}
    </div>
  );
};

export default MainLayout; 