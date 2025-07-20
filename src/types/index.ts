// Todoアイテムの型定義
export interface TodoItem {
  id: string; // 一意のID
  text: string; // タスクの内容
  description?: string; // タスクの詳細説明（オプション）
  status: TaskStatus; // タスクステータス
  createdAt: Date; // 作成日時
  updatedAt?: Date; // 更新日時（オプション）
  category?: string; // カテゴリ（オプション）
  priority?: Priority; // 優先度（オプション）
  dueDate?: Date; // 期限（オプション）
  assignee?: string; // 担当者（オプション）
  order: number; // 並び順（ドラッグ&ドロップ用）
}

// タスクステータスの列挙型
export enum TaskStatus {
  TODO = 'todo', // 未着手
  IN_PROGRESS = 'in_progress', // 進行中
  DONE = 'done', // 完了
}

// 優先度の列挙型
export enum Priority {
  LOW = 'low', // 低
  MEDIUM = 'medium', // 中
  HIGH = 'high', // 高
}

// フィルター状態の型定義
export interface FilterState {
  status: TaskStatus[]; // ステータスフィルター
  search: string; // 検索キーワード
  assignee?: string; // 担当者フィルター
  category?: string; // カテゴリフィルター
  priority?: Priority[]; // 優先度フィルター
}

// ソート設定の型定義
export interface SortConfig {
  field: keyof TodoItem; // ソート対象フィールド
  direction: 'asc' | 'desc'; // ソート方向
}

// アプリケーション全体の状態型定義
export interface AppState {
  todos: TodoItem[]; // Todoアイテムの配列
  filters: FilterState; // フィルター状態
  sort: SortConfig; // ソート設定
  loading: boolean; // ローディング状態
  error: string | null; // エラー状態
}

// Todoアクションタイプの列挙型
export enum TodoActionType {
  ADD_TODO = 'ADD_TODO',
  UPDATE_TODO = 'UPDATE_TODO',
  DELETE_TODO = 'DELETE_TODO',
  MOVE_TODO = 'MOVE_TODO',
  SET_FILTERS = 'SET_FILTERS',
  SET_SORT = 'SET_SORT',
  CLEAR_FILTERS = 'CLEAR_FILTERS',
  SET_LOADING = 'SET_LOADING',
  SET_ERROR = 'SET_ERROR',
  LOAD_TODOS = 'LOAD_TODOS',
}

// Todoアクションの型定義
export type TodoAction =
  | { type: TodoActionType.ADD_TODO; payload: Omit<TodoItem, 'id' | 'createdAt' | 'order'> }
  | { type: TodoActionType.UPDATE_TODO; payload: { id: string; updates: Partial<TodoItem> } }
  | { type: TodoActionType.DELETE_TODO; payload: string }
  | {
      type: TodoActionType.MOVE_TODO;
      payload: { id: string; newStatus: TaskStatus; newOrder: number };
    }
  | { type: TodoActionType.SET_FILTERS; payload: Partial<FilterState> }
  | { type: TodoActionType.SET_SORT; payload: SortConfig }
  | { type: TodoActionType.CLEAR_FILTERS }
  | { type: TodoActionType.SET_LOADING; payload: boolean }
  | { type: TodoActionType.SET_ERROR; payload: string | null }
  | { type: TodoActionType.LOAD_TODOS; payload: TodoItem[] }; 