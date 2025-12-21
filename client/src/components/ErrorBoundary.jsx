import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Spline/Component Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (
                <div className="w-full h-full flex items-center justify-center bg-slate-900/50 rounded-xl border border-white/10 p-4">
                    <div className="text-center">
                        <p className="text-red-400 font-bold mb-2">Failed to load content</p>
                        <p className="text-slate-500 text-xs text-left overflow-hidden max-w-xs">{this.state.error?.message}</p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
