import { formatDate, getPriorityVariant, storageUtils } from '../index';
import { Priority } from '../../types';

describe('formatDate', () => {
  beforeEach(() => {
    // 固定の日付を設定（2024年1月15日）
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('今日の日付を正しくフォーマットする', () => {
    const today = new Date('2024-01-15T12:00:00Z');
    expect(formatDate(today)).toBe('今日');
  });

  it('明日の日付を正しくフォーマットする', () => {
    const tomorrow = new Date('2024-01-16T12:00:00Z');
    expect(formatDate(tomorrow)).toBe('明日');
  });

  it('昨日の日付を正しくフォーマットする', () => {
    const yesterday = new Date('2024-01-14T12:00:00Z');
    expect(formatDate(yesterday)).toBe('昨日');
  });

  it('未来の日付を正しくフォーマットする', () => {
    const future = new Date('2024-01-20T12:00:00Z');
    expect(formatDate(future)).toBe('5日後');
  });

  it('過去の日付を正しくフォーマットする', () => {
    const past = new Date('2024-01-10T12:00:00Z');
    expect(formatDate(past)).toBe('5日前');
  });
});

describe('getPriorityVariant', () => {
  it('高優先度を正しくマッピングする', () => {
    expect(getPriorityVariant(Priority.HIGH)).toBe('danger');
  });

  it('中優先度を正しくマッピングする', () => {
    expect(getPriorityVariant(Priority.MEDIUM)).toBe('warning');
  });

  it('低優先度を正しくマッピングする', () => {
    expect(getPriorityVariant(Priority.LOW)).toBe('success');
  });

  it('未定義の優先度に対してデフォルト値を返す', () => {
    expect(getPriorityVariant('unknown' as Priority)).toBe('warning');
  });
});

describe('storageUtils', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('save', () => {
    it('データを正しく保存する', () => {
      const testData = { test: 'value' };
      storageUtils.save('test-key', testData);
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify(testData)
      );
    });

    it('エラーが発生した場合にコンソールにエラーを出力する', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const mockError = new Error('Storage error');
      
      (localStorage.setItem as jest.Mock).mockImplementation(() => {
        throw mockError;
      });

      storageUtils.save('test-key', { test: 'value' });
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to save to localStorage:',
        mockError
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('load', () => {
    it('保存されたデータを正しく読み込む', () => {
      const testData = { test: 'value' };
      (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(testData));
      
      const result = storageUtils.load('test-key', {});
      
      expect(localStorage.getItem).toHaveBeenCalledWith('test-key');
      expect(result).toEqual(testData);
    });

    it('データが存在しない場合にデフォルト値を返す', () => {
      const defaultValue = { default: 'value' };
      (localStorage.getItem as jest.Mock).mockReturnValue(null);
      
      const result = storageUtils.load('test-key', defaultValue);
      
      expect(result).toEqual(defaultValue);
    });

    it('無効なJSONの場合にデフォルト値を返す', () => {
      const defaultValue = { default: 'value' };
      (localStorage.getItem as jest.Mock).mockReturnValue('invalid-json');
      
      const result = storageUtils.load('test-key', defaultValue);
      
      expect(result).toEqual(defaultValue);
    });

    it('エラーが発生した場合にデフォルト値を返す', () => {
      const defaultValue = { default: 'value' };
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      (localStorage.getItem as jest.Mock).mockImplementation(() => {
        throw new Error('Storage error');
      });

      const result = storageUtils.load('test-key', defaultValue);
      
      expect(result).toEqual(defaultValue);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to load from localStorage:',
        expect.any(Error)
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('remove', () => {
    it('指定されたキーを正しく削除する', () => {
      storageUtils.remove('test-key');
      
      expect(localStorage.removeItem).toHaveBeenCalledWith('test-key');
    });

    it('エラーが発生した場合にコンソールにエラーを出力する', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const mockError = new Error('Storage error');
      
      (localStorage.removeItem as jest.Mock).mockImplementation(() => {
        throw mockError;
      });

      storageUtils.remove('test-key');
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to remove from localStorage:',
        mockError
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('clear', () => {
    it('すべてのデータを正しくクリアする', () => {
      storageUtils.clear();
      
      expect(localStorage.clear).toHaveBeenCalled();
    });

    it('エラーが発生した場合にコンソールにエラーを出力する', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const mockError = new Error('Storage error');
      
      (localStorage.clear as jest.Mock).mockImplementation(() => {
        throw mockError;
      });

      storageUtils.clear();
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to clear localStorage:',
        mockError
      );
      
      consoleSpy.mockRestore();
    });
  });
}); 