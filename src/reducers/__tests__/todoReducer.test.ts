import { todoReducer, initialState } from '../todoReducer';
import { TodoAction, TodoActionType, TaskStatus, Priority } from '../../types';

describe('todoReducer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ADD_TODO', () => {
    it('新しいTodoを正しく追加する', () => {
      const newTodo = {
        text: 'テストタスク',
        description: 'テスト説明',
        priority: Priority.HIGH,
        dueDate: new Date('2024-12-31'),
        assignee: 'テストユーザー',
        category: 'テストカテゴリ',
      };

      const action: TodoAction = {
        type: TodoActionType.ADD_TODO,
        payload: newTodo,
      };

      const newState = todoReducer(initialState, action);

      expect(newState.todos).toHaveLength(1);
      expect(newState.todos[0]).toMatchObject({
        ...newTodo,
        status: TaskStatus.TODO,
        order: 0,
      });
      expect(newState.todos[0].id).toBeDefined();
      expect(newState.todos[0].createdAt).toBeInstanceOf(Date);
      expect(newState.todos[0].updatedAt).toBeInstanceOf(Date);
    });

    it('最小限のデータでTodoを追加する', () => {
      const newTodo = {
        text: 'テストタスク',
      };

      const action: TodoAction = {
        type: TodoActionType.ADD_TODO,
        payload: newTodo,
      };

      const newState = todoReducer(initialState, action);

      expect(newState.todos).toHaveLength(1);
      expect(newState.todos[0]).toMatchObject({
        text: 'テストタスク',
        status: TaskStatus.TODO,
        order: 0,
      });
    });
  });

  describe('UPDATE_TODO', () => {
    it('既存のTodoを正しく更新する', () => {
      const existingState = {
        ...initialState,
        todos: [
          {
            id: '1',
            text: '元のタスク',
            status: TaskStatus.TODO,
            order: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      };

      const updates = {
        text: '更新されたタスク',
        status: TaskStatus.IN_PROGRESS,
      };

      const action: TodoAction = {
        type: TodoActionType.UPDATE_TODO,
        payload: { id: '1', updates },
      };

      const newState = todoReducer(existingState, action);

      expect(newState.todos[0]).toMatchObject({
        id: '1',
        text: '更新されたタスク',
        status: TaskStatus.IN_PROGRESS,
      });
      expect(newState.todos[0].updatedAt.getTime()).toBeGreaterThan(
        existingState.todos[0].updatedAt.getTime()
      );
    });

    it('存在しないTodoの更新を無視する', () => {
      const action: TodoAction = {
        type: TodoActionType.UPDATE_TODO,
        payload: { id: 'nonexistent', updates: { text: '更新' } },
      };

      const newState = todoReducer(initialState, action);

      expect(newState).toEqual(initialState);
    });
  });

  describe('DELETE_TODO', () => {
    it('指定されたTodoを正しく削除する', () => {
      const existingState = {
        ...initialState,
        todos: [
          {
            id: '1',
            text: '削除対象',
            status: TaskStatus.TODO,
            order: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '2',
            text: '残るタスク',
            status: TaskStatus.TODO,
            order: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      };

      const action: TodoAction = {
        type: TodoActionType.DELETE_TODO,
        payload: '1',
      };

      const newState = todoReducer(existingState, action);

      expect(newState.todos).toHaveLength(1);
      expect(newState.todos[0].id).toBe('2');
    });

    it('存在しないTodoの削除を無視する', () => {
      const action: TodoAction = {
        type: TodoActionType.DELETE_TODO,
        payload: 'nonexistent',
      };

      const newState = todoReducer(initialState, action);

      expect(newState).toEqual(initialState);
    });
  });

  describe('MOVE_TODO', () => {
    it('Todoを正しく移動する', () => {
      const existingState = {
        ...initialState,
        todos: [
          {
            id: '1',
            text: '移動対象',
            status: TaskStatus.TODO,
            order: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      };

      const action: TodoAction = {
        type: TodoActionType.MOVE_TODO,
        payload: { id: '1', newStatus: TaskStatus.DONE, newOrder: 0 },
      };

      const newState = todoReducer(existingState, action);

      expect(newState.todos[0]).toMatchObject({
        id: '1',
        status: TaskStatus.DONE,
        order: 0,
      });
    });
  });

  describe('SET_FILTERS', () => {
    it('フィルターを正しく設定する', () => {
      const filters = {
        search: 'テスト',
        status: [TaskStatus.TODO],
        assignee: 'テストユーザー',
        category: 'テストカテゴリ',
        priority: [Priority.HIGH],
      };

      const action: TodoAction = {
        type: TodoActionType.SET_FILTERS,
        payload: filters,
      };

      const newState = todoReducer(initialState, action);

      expect(newState.filters).toEqual(filters);
    });
  });

  describe('SET_SORT', () => {
    it('ソート設定を正しく設定する', () => {
      const sort = {
        field: 'createdAt',
        direction: 'desc',
      };

      const action: TodoAction = {
        type: TodoActionType.SET_SORT,
        payload: sort,
      };

      const newState = todoReducer(initialState, action);

      expect(newState.sort).toEqual(sort);
    });
  });

  describe('CLEAR_FILTERS', () => {
    it('フィルターを正しくクリアする', () => {
      const existingState = {
        ...initialState,
        filters: {
          search: 'テスト',
          status: [TaskStatus.TODO],
          assignee: 'テストユーザー',
          category: 'テストカテゴリ',
          priority: [Priority.HIGH],
        },
      };

      const action: TodoAction = {
        type: TodoActionType.CLEAR_FILTERS,
      };

      const newState = todoReducer(existingState, action);

      expect(newState.filters).toEqual(initialState.filters);
    });
  });

  describe('SET_LOADING', () => {
    it('ローディング状態を正しく設定する', () => {
      const action: TodoAction = {
        type: TodoActionType.SET_LOADING,
        payload: true,
      };

      const newState = todoReducer(initialState, action);

      expect(newState.loading).toBe(true);
    });
  });

  describe('SET_ERROR', () => {
    it('エラー状態を正しく設定する', () => {
      const error = 'テストエラー';

      const action: TodoAction = {
        type: TodoActionType.SET_ERROR,
        payload: error,
      };

      const newState = todoReducer(initialState, action);

      expect(newState.error).toBe(error);
    });
  });

  describe('LOAD_TODOS', () => {
    it('Todoリストを正しく読み込む', () => {
      const todos = [
        {
          id: '1',
          text: 'テストタスク1',
          status: TaskStatus.TODO,
          order: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          text: 'テストタスク2',
          status: TaskStatus.IN_PROGRESS,
          order: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const action: TodoAction = {
        type: TodoActionType.LOAD_TODOS,
        payload: todos,
      };

      const newState = todoReducer(initialState, action);

      expect(newState.todos).toEqual(todos);
      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(null);
    });
  });

  describe('不明なアクション', () => {
    it('不明なアクションタイプに対して現在の状態を返す', () => {
      const action = {
        type: 'UNKNOWN_ACTION',
        payload: {},
      } as TodoAction;

      const newState = todoReducer(initialState, action);

      expect(newState).toEqual(initialState);
    });
  });
}); 