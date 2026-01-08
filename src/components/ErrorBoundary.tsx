import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full text-center space-y-4">
            <div className="text-6xl">🤕</div>
            <h1 className="text-2xl font-bold text-gray-900">
              Bir şeyler ters gitti
            </h1>
            <p className="text-gray-600">
              Beklenmedik bir hata oluştu. Lütfen sayfayı yenilemeyi deneyin.
            </p>
            {import.meta.env.DEV && this.state.error && (
               <div className="bg-red-50 p-4 rounded text-left overflow-auto max-h-48 text-xs text-red-600 font-mono">
                   {this.state.error.toString()}
               </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Sayfayı Yenile
            </button>
            <button
              onClick={() => {
                  localStorage.clear();
                  window.location.href = "/";
              }}
              className="block w-full text-sm text-gray-500 hover:text-gray-700 underline mt-2"
            >
              Önbelleği Temizle ve Ana Sayfaya Dön
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

