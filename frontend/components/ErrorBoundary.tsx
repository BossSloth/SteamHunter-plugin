import React, { Component, ErrorInfo, JSX, ReactNode } from 'react';
import { ErrorDisplay } from './ErrorDisplay';

interface Props {
  readonly children: ReactNode;
}

interface State {
  readonly error: Error | null;
  readonly hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static shouldComponentUpdate(): boolean {
    return true;
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error:', error, errorInfo, this.props);
  }

  public render(): JSX.Element | ReactNode {
    const { hasError, error } = this.state;
    const { children } = this.props;

    if (hasError && error) {
      return <ErrorDisplay errors={[error]} />;
    }

    return children;
  }
}
