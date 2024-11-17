import type { ComponentType, ReactNode, ReactElement } from 'react';

declare module 'react' {
  interface SyntheticEvent<T = Element> {
    nativeEvent: Event;
    currentTarget: T;
    target: Element;
    preventDefault(): void;
    stopPropagation(): void;
  }

  export interface FormEvent<T = Element> extends SyntheticEvent<T> {}
  export interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
    target: T & { value: string };
  }

  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: readonly unknown[]): void;
  export function useRef<T>(initialValue: T | null): { current: T | null };
  export function useLayoutEffect(effect: () => void | (() => void), deps?: readonly unknown[]): void;
  
  export const StrictMode: ComponentType<{ children?: ReactNode }>;
  export type FunctionComponent<P = Record<string, never>> = ComponentType<P>;
  export type FC<P = Record<string, never>> = FunctionComponent<P>;
}

declare module 'react-router-dom' {
  export interface RouteProps {
    path?: string;
    element?: ReactElement;
    children?: ReactNode;
  }

  export interface LocationState {
    [key: string]: unknown;
  }

  export const BrowserRouter: ComponentType<{ children?: ReactNode }>;
  export const Routes: ComponentType<{ children: ReactNode }>;
  export const Route: ComponentType<RouteProps>;
  export const Link: ComponentType<{ 
    to: string; 
    className?: string; 
    state?: LocationState; 
    children?: ReactNode;
    replace?: boolean;
  }>;
  export const Navigate: ComponentType<{ 
    to: string; 
    replace?: boolean;
    state?: LocationState;
  }>;
  
  export function useNavigate(): (
    to: string, 
    options?: { replace?: boolean; state?: LocationState }
  ) => void;
  
  export function useLocation(): { 
    state: LocationState; 
    pathname: string;
    search: string;
    hash: string;
  };
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
      span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
      p: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
      h1: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h2: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h3: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      button: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
      input: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
      form: React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
      label: React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;
      select: React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
      option: React.DetailedHTMLProps<React.OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>;
      textarea: React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;
      nav: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      [elemName: string]: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }

    interface Element extends ReactElement<unknown, string | ComponentType<unknown>> {}
  }
}