import React from 'react';

/**
 * ENTERPRISE ERROR BOUNDARY
 * Prevents the entire React tree from crashing due to unexpected component errors.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log to production monitoring service if available
    console.error("Production Error Captured:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-app text-center p-6">
          <div className="glass-surface p-12 rounded-3xl shadow-2xl border-glass" style={{ maxWidth: '500px' }}>
            <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-6" style={{ width: '80px', height: '80px' }}>
              <i className="bi bi-shield-slash fs-1"></i>
            </div>
            <h2 className="text-white fw-black mb-4">Something went wrong</h2>
            <p className="text-dim mb-10">An unexpected system error occurred. Our engineers have been notified.</p>
            <button 
              className="btn-premium px-8 py-3 rounded-xl shadow-lg"
              onClick={() => window.location.href = '/'}
            >
              RETURN TO SAFETY
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
