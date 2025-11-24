import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console
    console.error('❌ ErrorBoundary caught an error:', error);
    console.error('Error Info:', errorInfo);

    // Log to window for debugging
    if (typeof window !== 'undefined') {
      (window as any).__ERROR_BOUNDARY_ERROR__ = {
        error: error.toString(),
        errorInfo: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
      };

      // Try to log to localStorage for persistence
      try {
        const errorLog = {
          error: error.toString(),
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        };
        localStorage.setItem(
          '__ERROR_LOG__',
          JSON.stringify(errorLog, null, 2)
        );
      } catch (e) {
        console.warn('Could not save error to localStorage:', e);
      }
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div
          style={{
            minHeight: '100vh',
            padding: '20px',
            backgroundColor: 'var(--bolt-elements-bg-depth-1, #FFFFFF)',
            color: 'var(--bolt-elements-textPrimary, #0A0A0A)',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          <div
            style={{
              maxWidth: '800px',
              margin: '0 auto',
              padding: '40px 20px',
            }}
          >
            <h1
              style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#DC2626',
              }}
            >
              ⚠️ Something went wrong
            </h1>

            <div
              style={{
                backgroundColor: '#FEF2F2',
                border: '2px solid #FECACA',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '20px',
              }}
            >
              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '10px',
                  color: '#DC2626',
                }}
              >
                Error Details:
              </h2>
              <pre
                style={{
                  fontSize: '0.875rem',
                  color: '#7F1D1D',
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {this.state.error?.toString()}
              </pre>
            </div>

            {this.state.errorInfo && (
              <div
                style={{
                  backgroundColor: '#F3F4F6',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  padding: '20px',
                  marginBottom: '20px',
                }}
              >
                <h3
                  style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    marginBottom: '10px',
                    color: '#374151',
                  }}
                >
                  Component Stack:
                </h3>
                <pre
                  style={{
                    fontSize: '0.75rem',
                    color: '#4B5563',
                    overflow: 'auto',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}

            <div
              style={{
                display: 'flex',
                gap: '10px',
                marginTop: '20px',
              }}
            >
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#8A5FFF',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#7645E8';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#8A5FFF';
                }}
              >
                Reload Page
              </button>

              <button
                onClick={() => {
                  try {
                    const errorLog = localStorage.getItem('__ERROR_LOG__');
                    if (errorLog) {
                      const blob = new Blob([errorLog], {
                        type: 'application/json',
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `error-log-${Date.now()}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }
                  } catch (e) {
                    console.error('Could not download error log:', e);
                  }
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6B7280',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                Download Error Log
              </button>
            </div>

            <div
              style={{
                marginTop: '30px',
                padding: '15px',
                backgroundColor: '#EFF6FF',
                border: '1px solid #93C5FD',
                borderRadius: '8px',
                fontSize: '0.875rem',
                color: '#1E40AF',
              }}
            >
              <strong>Troubleshooting Tips:</strong>
              <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                <li>Check browser console for detailed error messages</li>
                <li>Try reloading the page</li>
                <li>Clear browser cache and cookies</li>
                <li>Try using an incognito/private browsing window</li>
                <li>Check if you're using the latest version of your browser</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easy wrapping
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

// Hook for checking if we're in an error state
export function useErrorHandler() {
  return (error: Error, errorInfo?: string) => {
    console.error('Manual error capture:', error);
    if (errorInfo) {
      console.error('Error info:', errorInfo);
    }

    // Store in localStorage
    try {
      const errorLog = {
        error: error.toString(),
        stack: error.stack,
        info: errorInfo,
        timestamp: new Date().toISOString(),
        url: window.location.href,
      };
      localStorage.setItem('__ERROR_LOG__', JSON.stringify(errorLog, null, 2));
    } catch (e) {
      console.warn('Could not save error to localStorage:', e);
    }
  };
}
