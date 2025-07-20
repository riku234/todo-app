import { TodoItem, TaskStatus, Priority, FilterState, SortConfig, TodoAction, AppState } from '../types';

// 初期状態
export const initialState: AppState = {
  todos: [],
  filters: {
    status: [],
    search: '',
  },
  sort: {
    field: 'createdAt',
    direction: 'desc',
  },
  loading: false,
  error: null,
};

// ユーティリティ関数
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const getNextOrder = (todos: TodoItem[], status: TaskStatus): number => {
  const statusTodos = todos.filter(todo => todo.status === status);
  return statusTodos.length;
};

// Reducer関数
export const todoReducer = (state: AppState, action: TodoAction): AppState => {
  switch (action.type) {
    case 'ADD_TODO': {
      const newTodo: TodoItem = {
        id: generateId(),
        text: action.payload.text,
        status: action.payload.status,
        createdAt: new Date(),
        order: getNextOrder(state.todos, action.payload.status),
        ...(action.payload.description && { description: action.payload.description }),
        ...(action.payload.priority && { priority: action.payload.priority }),
        ...(action.payload.dueDate && { dueDate: action.payload.dueDate }),
        ...(action.payload.assignee && { assignee: action.payload.assignee }),
        ...(action.payload.category && { category: action.payload.category }),
      };

      return {
        ...state,
        todos: [...state.todos, newTodo],
      };
    }

    case 'UPDATE_TODO': {
      const { id, updates } = action.payload;
      const newTodos = state.todos.map(todo =>
        todo.id === id
          ? {
              ...todo,
              ...updates,
              updatedAt: new Date(),
            }
          : todo
      );

      return {
        ...state,
        todos: newTodos,
      };
    }

    case 'DELETE_TODO': {
      const { id } = action.payload;
      const newTodos = state.todos.filter(todo => todo.id !== id);

      // 削除後にorderを再計算
      const reorderedTodos = newTodos.map(todo => ({
        ...todo,
        order: getNextOrder(newTodos, todo.status),
      }));

      return {
        ...state,
        todos: reorderedTodos,
      };
    }

    case 'MOVE_TODO': {
      const { id, newStatus, newOrder } = action.payload;
      const todo = state.todos.find(t => t.id === id);
      
      if (!todo) return state;

      const updatedTodo = {
        ...todo,
        status: newStatus,
        order: newOrder,
        updatedAt: new Date(),
      };

      const newTodos = state.todos.map(t => t.id === id ? updatedTodo : t);

      // 移動後にorderを再計算
      const reorderedTodos = newTodos.map(t => ({
        ...t,
        order: getNextOrder(newTodos, t.status),
      }));

      return {
        ...state,
        todos: reorderedTodos,
      };
    }

    case 'SET_FILTERS': {
      const newFilters = { ...state.filters, ...action.payload };
      return {
        ...state,
        filters: newFilters,
      };
    }

    case 'SET_SORT': {
      return {
        ...state,
        sort: action.payload,
      };
    }

    case 'SET_LOADING': {
      return {
        ...state,
        loading: action.payload,
      };
    }

    case 'SET_ERROR': {
      return {
        ...state,
        error: action.payload,
      };
    }

    case 'LOAD_TODOS': {
      return {
        ...state,
        todos: action.payload,
        loading: false,
        error: null,
      };
    }

    default:
      return state;
  }
}; 