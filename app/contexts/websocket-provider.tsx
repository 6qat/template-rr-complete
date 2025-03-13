import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

type WebsocketContextType = {
  messages: string[];
  error: string | null;
  isConnected: boolean;

  sendMessage: ((_message: string) => Promise<void>) | null;
};

const WebsocketContext = createContext<WebsocketContextType | null>(null);

export const useWebsocket = () => {
  const context = useContext(WebsocketContext);
  if (!context) {
    throw new Error('useWebsocket must be used within a WebsocketProvider');
  }
  return context;
};

type WebsocketProviderProps = {
  children: ReactNode;
  url: string;
};

export const WebsocketProvider = ({
  children,
  url,
}: WebsocketProviderProps) => {
  // Define state types
  const [messages, setMessages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [sendMessage, setSendMessage] = useState<
    ((_message: string) => Promise<void>) | null
  >(null);

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // if (isConnected) return;
    // Create WebSocket connection
    wsRef.current = new WebSocket(url);

    wsRef.current.onopen = () => {
      console.log('Connected to WebSocket');
      setIsConnected(true);
    };

    wsRef.current.onmessage = (event: MessageEvent) => {
      setMessages((prevMessages) => [...prevMessages, event.data as string]);
    };

    wsRef.current.onclose = () => {
      console.log('Disconnected from WebSocket');
      setIsConnected(false);
      // Reconnect after 5 seconds
      setTimeout(() => {
        // Reconnect logic can be implemented here
      }, 5000);
    };

    wsRef.current.onerror = (event: Event) => {
      console.log('Error:', event);
      setError('WebSocket connection error');
      setIsConnected(false);
    };

    // Set up send message function
    setSendMessage(() => (message: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(message);
          resolve();
        } else {
          const errorMsg = 'Socket is not open';
          console.log(errorMsg);
          reject(new Error(errorMsg));
        }
      });
    });

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        console.log(isConnected);
        wsRef.current.close();
      }
    };
  }, [url]);

  return (
    <WebsocketContext.Provider
      value={{ messages, error, isConnected, sendMessage }}
    >
      {children}
    </WebsocketContext.Provider>
  );
};
