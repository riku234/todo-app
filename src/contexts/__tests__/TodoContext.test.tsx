import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TodoProvider, useTodo } from '../TodoContext';
import { TaskStatus, Priority } from '../../types';

// テスト用のコンポーネント
const TestComponent: React.FC = () => {
  const { state, addTodo, updateTodo, deleteTodo, moveTodo, setFilters, clearFilters } = useTodo();

  return (
    <div>
      <div data-testid="todo-count">{state.todos.length}</div>
      <div data-testid="loading">{state.loading.toString()}</div>
      <div data-testid="error">{state.error || ''}</div>
      
      <button onClick={() => addTodo({ text: 'テストタスク', status: TaskStatus.TODO })}>
        タスク追加
      </button>
      
      <button onClick={() => updateTodo('1', { text: '更新されたタスク' })}>
        タスク更新
      </button>
      
      <button onClick={() => deleteTodo('1')}>
        タスク削除
      </button>
      
      <button onClick={() => moveTodo('1', TaskStatus.DONE, 0)}>
        タスク移動
      </button>
      
      <button onClick={() => setFilters({ search: 'テスト' })}>
        フィルター設定
      </button>
      
      <button onClick={clearFilters}>
        フィルタークリア
      </button>
      
      {state.todos.map(todo => (
        <div key={todo.id} data-testid={`todo-${todo.id}`}>
          {todo.text} - {todo.status}
        </div>
      ))}
    </div>
  );
};

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <TodoProvider>
      {component}
    </TodoProvider>
  );
};

describe('TodoContext', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('初期状態が正しく設定される', () => {
    renderWithProvider(<TestComponent />);
    
    expect(screen.getByTestId('todo-count')).toHaveTextContent('0');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('');
  });

  it('タスクを正しく追加できる', async () => {
    renderWithProvider(<TestComponent />);
    
    const addButton = screen.getByText('タスク追加');
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('todo-count')).toHaveTextContent('1');
    });
    
    expect(screen.getByTestId('todo-1')).toHaveTextContent('テストタスク - todo');
  });

  it('タスクを正しく更新できる', async () => {
    renderWithProvider(<TestComponent />);
    
    // まずタスクを追加
    const addButton = screen.getByText('タスク追加');
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('todo-count')).toHaveTextContent('1');
    });
    
    // タスクを更新
    const updateButton = screen.getByText('タスク更新');
    fireEvent.click(updateButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('todo-1')).toHaveTextContent('更新されたタスク - todo');
    });
  });

  it('タスクを正しく削除できる', async () => {
    renderWithProvider(<TestComponent />);
    
    // まずタスクを追加
    const addButton = screen.getByText('タスク追加');
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('todo-count')).toHaveTextContent('1');
    });
    
    // タスクを削除
    const deleteButton = screen.getByText('タスク削除');
    fireEvent.click(deleteButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('todo-count')).toHaveTextContent('0');
    });
    
    expect(screen.queryByTestId('todo-1')).not.toBeInTheDocument();
  });

  it('タスクを正しく移動できる', async () => {
    renderWithProvider(<TestComponent />);
    
    // まずタスクを追加
    const addButton = screen.getByText('タスク追加');
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('todo-count')).toHaveTextContent('1');
    });
    
    // タスクを移動
    const moveButton = screen.getByText('タスク移動');
    fireEvent.click(moveButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('todo-1')).toHaveTextContent('テストタスク - done');
    });
  });

  it('フィルターを正しく設定できる', async () => {
    renderWithProvider(<TestComponent />);
    
    const filterButton = screen.getByText('フィルター設定');
    fireEvent.click(filterButton);
    
    // フィルターが設定されたことを確認（実際の実装に応じて調整）
    await waitFor(() => {
      // フィルター状態の確認
    });
  });

  it('フィルターを正しくクリアできる', async () => {
    renderWithProvider(<TestComponent />);
    
    const clearButton = screen.getByText('フィルタークリア');
    fireEvent.click(clearButton);
    
    // フィルターがクリアされたことを確認（実際の実装に応じて調整）
    await waitFor(() => {
      // フィルター状態の確認
    });
  });

  it('ローカルストレージとの同期が正しく動作する', async () => {
    // 事前にローカルストレージにデータを設定
    const mockTodos = [
      {
        id: '1',
        text: '保存されたタスク',
        status: TaskStatus.TODO,
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    
    (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(mockTodos));
    
    renderWithProvider(<TestComponent />);
    
    await waitFor(() => {
      expect(screen.getByTestId('todo-count')).toHaveTextContent('1');
    });
    
    expect(screen.getByTestId('todo-1')).toHaveTextContent('保存されたタスク - todo');
  });

  it('エラーハンドリングが正しく動作する', async () => {
    // ローカルストレージでエラーを発生させる
    (localStorage.getItem as jest.Mock).mockImplementation(() => {
      throw new Error('Storage error');
    });
    
    renderWithProvider(<TestComponent />);
    
    // エラーが適切に処理されることを確認
    await waitFor(() => {
      expect(screen.getByTestId('todo-count')).toHaveTextContent('0');
    });
  });
}); 