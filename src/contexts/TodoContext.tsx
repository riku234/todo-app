import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { TodoItem, TaskStatus, FilterState, SortConfig, AppState } from '../types';
import { todoReducer, initialState } from '../reducers/todoReducer';
import { storageUtils } from '../utils';

// Context型定義
interface TodoContextType {
  state: AppState;
  addTodo: (todo: Omit<TodoItem, 'id' | 'createdAt' | 'order'>) => void;
  updateTodo: (id: string, updates: Partial<TodoItem>) => void;
  deleteTodo: (id: string) => void;
  moveTodo: (id: string, newStatus: TaskStatus, newOrder: number) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  setSort: (sort: SortConfig) => void;
  clearFilters: () => void;
  getFilteredTodos: () => TodoItem[];
  getTodosByStatus: (status: TaskStatus) => TodoItem[];
  getAvailableAssignees: () => string[];
  getAvailableCategories: () => string[];
}

// Context作成
const TodoContext = createContext<TodoContextType | undefined>(undefined);

// Provider Props型定義
interface TodoProviderProps {
  children: ReactNode;
}

// Providerコンポーネント
export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  // ローカルストレージからの読み込み
  useEffect(() => {
    const loadTodos = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const savedTodos = storageUtils.load('todos', []);
        if (savedTodos.length > 0) {
          dispatch({ type: 'LOAD_TODOS', payload: savedTodos });
        }
      } catch (error) {
        console.error('Failed to load todos:', error);
        dispatch({ type: 'SET_ERROR', payload: 'タスクの読み込みに失敗しました' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadTodos();
  }, []);

  // 状態変更時のローカルストレージ保存
  useEffect(() => {
    const saveTodos = async () => {
      try {
        storageUtils.save('todos', state.todos);
      } catch (error) {
        console.error('Failed to save todos:', error);
        dispatch({ type: 'SET_ERROR', payload: 'タスクの保存に失敗しました' });
      }
    };

    if (state.todos.length > 0 || state.todos.length === 0) {
      saveTodos();
    }
  }, [state.todos]);

  // アクション関数
  const addTodo = (todo: Omit<TodoItem, 'id' | 'createdAt' | 'order'>) => {
    dispatch({ type: 'ADD_TODO', payload: todo });
  };

  const updateTodo = (id: string, updates: Partial<TodoItem>) => {
    dispatch({ type: 'UPDATE_TODO', payload: { id, updates } });
  };

  const deleteTodo = (id: string) => {
    dispatch({ type: 'DELETE_TODO', payload: { id } });
  };

  const moveTodo = (id: string, newStatus: TaskStatus, newOrder: number) => {
    dispatch({ type: 'MOVE_TODO', payload: { id, newStatus, newOrder } });
  };

  const setFilters = (filters: Partial<FilterState>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const setSort = (sort: SortConfig) => {
    dispatch({ type: 'SET_SORT', payload: sort });
  };

  const clearFilters = () => {
    dispatch({ type: 'SET_FILTERS', payload: initialState.filters });
  };

  // フィルタリング・ソート済みのタスクを取得
  const getFilteredTodos = (): TodoItem[] => {
    let filteredTodos = state.todos;

    // フィルター適用
    if (state.filters.status.length > 0) {
      filteredTodos = filteredTodos.filter(todo => 
        state.filters.status.includes(todo.status)
      );
    }

    if (state.filters.search) {
      const searchTerm = state.filters.search.toLowerCase();
      filteredTodos = filteredTodos.filter(todo => {
        const matchesText = todo.text.toLowerCase().includes(searchTerm);
        const matchesDescription = todo.description?.toLowerCase().includes(searchTerm) || false;
        const matchesAssignee = todo.assignee?.toLowerCase().includes(searchTerm) || false;
        return matchesText || matchesDescription || matchesAssignee;
      });
    }

    if (state.filters.assignee) {
      filteredTodos = filteredTodos.filter(todo => todo.assignee === state.filters.assignee);
    }

    if (state.filters.category) {
      filteredTodos = filteredTodos.filter(todo => todo.category === state.filters.category);
    }

    if (state.filters.priority && state.filters.priority.length > 0) {
      filteredTodos = filteredTodos.filter(todo => 
        todo.priority && state.filters.priority!.includes(todo.priority)
      );
    }

    // ソート適用
    filteredTodos = [...filteredTodos].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (state.sort.field) {
        case 'createdAt':
          aValue = a.createdAt;
          bValue = b.createdAt;
          break;
        case 'updatedAt':
          aValue = a.updatedAt || a.createdAt;
          bValue = b.updatedAt || b.createdAt;
          break;
        case 'dueDate':
          aValue = a.dueDate || new Date(9999, 11, 31);
          bValue = b.dueDate || new Date(9999, 11, 31);
          break;
        case 'priority':
          const priorityOrder = { low: 1, medium: 2, high: 3 };
          aValue = a.priority ? priorityOrder[a.priority] : 0;
          bValue = b.priority ? priorityOrder[b.priority] : 0;
          break;
        case 'text':
          aValue = a.text.toLowerCase();
          bValue = b.text.toLowerCase();
          break;
        case 'assignee':
          aValue = a.assignee || '';
          bValue = b.assignee || '';
          break;
        case 'category':
          aValue = a.category || '';
          bValue = b.category || '';
          break;
        default:
          aValue = a.createdAt;
          bValue = b.createdAt;
      }

      if (aValue < bValue) {
        return state.sort.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return state.sort.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filteredTodos;
  };

  // ステータス別のタスクを取得
  const getTodosByStatus = (status: TaskStatus): TodoItem[] => {
    return state.todos
      .filter(todo => todo.status === status)
      .sort((a, b) => a.order - b.order);
  };

  // 利用可能な担当者リストを取得
  const getAvailableAssignees = (): string[] => {
    const assignees = new Set<string>();
    state.todos.forEach(todo => {
      if (todo.assignee) {
        assignees.add(todo.assignee);
      }
    });
    return Array.from(assignees).sort();
  };

  // 利用可能なカテゴリリストを取得
  const getAvailableCategories = (): string[] => {
    const categories = new Set<string>();
    state.todos.forEach(todo => {
      if (todo.category) {
        categories.add(todo.category);
      }
    });
    return Array.from(categories).sort();
  };

  const contextValue: TodoContextType = {
    state,
    addTodo,
    updateTodo,
    deleteTodo,
    moveTodo,
    setFilters,
    setSort,
    clearFilters,
    getFilteredTodos,
    getTodosByStatus,
    getAvailableAssignees,
    getAvailableCategories,
  };

  return (
    <TodoContext.Provider value={contextValue}>
      {children}
    </TodoContext.Provider>
  );
};

// カスタムフック
export const useTodo = (): TodoContextType => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
}; 