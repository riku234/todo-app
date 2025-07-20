import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button', () => {
  it('デフォルトのプロパティで正しくレンダリングされる', () => {
    render(<Button>テストボタン</Button>);
    
    const button = screen.getByRole('button', { name: 'テストボタン' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('button', 'button--primary', 'button--medium');
  });

  it('異なるバリアントで正しくレンダリングされる', () => {
    const { rerender } = render(<Button variant="secondary">セカンダリ</Button>);
    
    let button = screen.getByRole('button');
    expect(button).toHaveClass('button--secondary');

    rerender(<Button variant="danger">デンジャー</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('button--danger');

    rerender(<Button variant="ghost">ゴースト</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('button--ghost');
  });

  it('異なるサイズで正しくレンダリングされる', () => {
    const { rerender } = render(<Button size="small">小</Button>);
    
    let button = screen.getByRole('button');
    expect(button).toHaveClass('button--small');

    rerender(<Button size="large">大</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('button--large');
  });

  it('クリックイベントが正しく動作する', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>クリックテスト</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('無効状態で正しく動作する', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>無効ボタン</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('button--disabled');
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('カスタムクラス名が正しく適用される', () => {
    render(<Button className="custom-class">カスタム</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('aria-labelが正しく設定される', () => {
    render(<Button aria-label="アクセシブルボタン">ボタン</Button>);
    
    const button = screen.getByRole('button', { name: 'アクセシブルボタン' });
    expect(button).toBeInTheDocument();
  });

  it('異なるtype属性で正しく動作する', () => {
    const { rerender } = render(<Button type="submit">送信</Button>);
    
    let button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');

    rerender(<Button type="reset">リセット</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'reset');
  });

  it('フォーカス状態で正しく動作する', () => {
    render(<Button>フォーカステスト</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.focus(button);
    
    // CSSのフォーカススタイルが適用されることを確認
    expect(button).toHaveFocus();
  });

  it('キーボード操作で正しく動作する', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>キーボードテスト</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.keyDown(button, { key: 'Enter' });
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
}); 