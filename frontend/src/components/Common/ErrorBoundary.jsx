import { Component } from "react";
import { Link } from "react-router";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Uncaught error:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
          <p className="eyebrow mb-3">Something went wrong</p>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-ink mb-3">
            We hit a snag
          </h1>
          <p className="text-stone max-w-md mb-8">
            An unexpected error occurred. Please refresh the page or head back to
            the homepage.
          </p>
          <div className="flex gap-4">
            <button onClick={() => window.location.reload()} className="btn-primary">
              Refresh
            </button>
            <Link to="/" onClick={this.handleReset} className="btn-outline">
              Go Home
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
