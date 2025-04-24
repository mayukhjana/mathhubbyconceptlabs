
/// <reference types="vite/client" />

// Declare the custom elevenlabs-convai element
declare namespace JSX {
  interface IntrinsicElements {
    'elevenlabs-convai': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        'agent-id': string;
      },
      HTMLElement
    >;
  }
}
