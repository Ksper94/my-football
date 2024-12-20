// components/ErrorBoundary.js
import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("Erreur capturée par ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-red-100 p-4">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Quelque chose s'est mal passé</h1>
          <p className="text-lg text-red-500 mb-4">
            {this.state.error && this.state.error.toString()}
          </p>
          {this.state.errorInfo && (
            <details className="mb-4 text-gray-700" style={{ whiteSpace: 'pre-wrap' }}>
              {this.state.errorInfo.componentStack}
            </details>
          )}
          <Link
            href="/"
            className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Retour à l'accueil
          </Link>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
