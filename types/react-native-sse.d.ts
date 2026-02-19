declare module 'react-native-sse' {
  export default class EventSource {
    constructor(url: string);
    
    addEventListener(type: string, listener: (event: MessageEvent) => void): void;
    
    removeEventListener(type: string, listener: (event: MessageEvent) => void): void;
    
    close(): void;
    
    onopen: (() => void) | null;
    
    onerror: ((event: Event) => void) | null;
    
    onmessage: ((event: MessageEvent) => void) | null;
    
    readyState: number;
    
    url: string;
  }
}
