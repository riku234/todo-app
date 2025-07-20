import React, { Component, ErrorInfo, ReactNode } from 'react';
import Button from './Button';
import './ErrorBoundary.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // エラーが発生した場合の状態を更新
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // エラー情報をログに記録
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  handleReportError = () => {
    // エラーレポート機能（将来的に実装）
    console.log('Error report:', {
      error: this.state.error,
      errorInfo: this.state.errorInfo,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    });
  };

  override render() {
    if (this.state.hasError) {
      // カスタムフォールバックUIが提供されている場合
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // デフォルトのエラーUI
      return (
        <div className="error-boundary">
          <div className="error-boundary__content">
            <div className="error-boundary__icon">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            
            <h1 className="error-boundary__title">エラーが発生しました</h1>
            
            <p className="error-boundary__description">
              申し訳ございませんが、予期しないエラーが発生しました。
              ページを再読み込みするか、しばらく時間をおいてから再度お試しください。
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-boundary__details">
                <summary className="error-boundary__summary">エラー詳細（開発モード）</summary>
                <div className="error-boundary__error-info">
                  <h3>エラーメッセージ:</h3>
                  <pre>{this.state.error.message}</pre>
                  
                  {this.state.errorInfo && (
                    <>
                      <h3>スタックトレース:</h3>
                      <pre>{this.state.errorInfo.componentStack}</pre>
                    </>
                  )}
                </div>
              </details>
            )}

            <div className="error-boundary__actions">
              <Button
                variant="primary"
                onClick={this.handleRetry}
                className="error-boundary__retry-button"
              >
                再試行
              </Button>
              
              <Button
                variant="secondary"
                onClick={() => window.location.reload()}
                className="error-boundary__reload-button"
              >
                ページを再読み込み
              </Button>
              
              <Button
                variant="ghost"
                onClick={this.handleReportError}
                className="error-boundary__report-button"
              >
                エラーを報告
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 