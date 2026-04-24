import { Component, type ReactNode } from "react";

interface Props { children: ReactNode }
interface State { hasError: boolean; message?: string }

export class ErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false };

  static getDerivedStateFromError(e: unknown): State {
    return { hasError: true, message: e instanceof Error ? e.message : String(e) };
  }

  override componentDidCatch(error: unknown, info: unknown) {
    // eslint-disable-next-line no-console
    console.error("[ErrorBoundary]", error, info);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen grid place-items-center px-4 py-8 bg-gradient-to-b from-rose-950/30 to-black">
          <div className="max-w-md w-full card-elevated p-6 text-center">
            <div className="text-[48px] mb-3">💥</div>
            <div className="text-title mb-2">Что-то пошло не так</div>
            <div className="text-caption text-white/60 mb-4 break-words">{this.state.message ?? "Неизвестная ошибка"}</div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => this.setState({ hasError: false, message: undefined })}
                className="btn-secondary px-4 py-2 rounded-lg"
              >
                Попробовать снова
              </button>
              <button
                onClick={() => { try { localStorage.removeItem("ton-abyss-save"); } catch {} location.reload(); }}
                className="btn-primary px-4 py-2 rounded-lg"
              >
                Сбросить сохранение
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
