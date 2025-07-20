import React, { Suspense, lazy } from 'react';
import { TodoProvider } from './contexts/TodoContext';
import { ErrorBoundary } from './components/common';
import './App.css';

// 遅延読み込みコンポーネント
const MainLayout = lazy(() => import('./components/layout/MainLayout'));

// ローディングコンポーネント
const LoadingSpinner: React.FC = () => (
  <div className="app-loading">
    <div className="app-loading__content">
      <div className="app-loading__spinner"></div>
      <p>アプリケーションを読み込み中...</p>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <TodoProvider>
        <div className="app">
          <Suspense fallback={<LoadingSpinner />}>
            <MainLayout />
          </Suspense>
        </div>
      </TodoProvider>
    </ErrorBoundary>
  );
};

export default App;
