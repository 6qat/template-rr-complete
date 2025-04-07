/* eslint-disable no-unused-vars */
// websocket.context.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

// Define the context type
interface WebSocketContextType {
  isConnected: boolean;
  errorMessage: string;
  sendMessage: (message: string) => void;
  addMessageListener: (listener: (message: string) => void) => void;
  removeMessageListener: (listener: (message: string) => void) => void;
}

// Create the context
const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

// Props for the provider
interface WebSocketProviderProps {
  url: string;
  children: ReactNode;
}

// WebSocket Provider component
export const WebSocketProvider = ({
  url,
  children,
}: WebSocketProviderProps) => {
  const wsRef = useRef<WebSocket | null>(null);
  const messageListenersRef = useRef<((message: string) => void)[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Stable function to add a message listener
  const addMessageListener = useCallback(
    (listener: (message: string) => void) => {
      messageListenersRef.current.push(listener);
    },
    []
  );

  // Stable function to remove a message listener
  const removeMessageListener = useCallback(
    (listener: (message: string) => void) => {
      messageListenersRef.current = messageListenersRef.current.filter(
        (l) => l !== listener
      );
    },
    []
  );

  // Stable function to send a message
  const sendMessage = useCallback((message: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(message);
    }
  }, []);

  // Effect to manage WebSocket connection
  useEffect(() => {
    const connect = () => {
      const socket = new WebSocket(url);
      wsRef.current = socket;

      socket.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setErrorMessage(''); // Clear any previous error messages on successful connection
      };

      socket.onmessage = (event) => {
        const message = event.data;
        // Call all registered listeners without updating state
        for (const listener of messageListenersRef.current) {
          listener(message);
        }
      };

      socket.onclose = (event: CloseEvent) => {
        console.log('WebSocket disconnected', event);
        setIsConnected(false);

        // Check if the close was clean or due to an error
        if (!event.wasClean) {
          setErrorMessage(
            `Connection error: Code ${event.code} - ${event.reason || 'Unknown error'}`
          );
        }

        // Reconnect after a delay
        setTimeout(connect, 1000);
      };

      socket.onerror = (event: Event) => {
        console.error('WebSocket error:', event);
        // Try to extract more detailed error information
        // In some browsers, this might be an ErrorEvent
        const errorEvent = event as ErrorEvent;
        if (errorEvent.message) {
          setErrorMessage(errorEvent.message);
        } else {
          setErrorMessage('WebSocket connection error occurred');
        }
      };
    };

    connect();

    // Cleanup on unmount or URL change
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url]);

  // Context value
  const value: WebSocketContextType = {
    isConnected,
    errorMessage,
    sendMessage,
    addMessageListener,
    removeMessageListener,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook to access the WebSocket context
export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ChatComponent = () => {
  const {
    isConnected,
    errorMessage,
    sendMessage,
    addMessageListener,
    removeMessageListener,
  } = useWebSocket();
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // Define the message handler
    const handleMessage = (message: string) => {
      setMessages((prev) => [...prev, message]); // Update local state
    };

    // Subscribe to messages
    addMessageListener(handleMessage);

    // Cleanup: remove the listener on unmount
    return () => {
      removeMessageListener(handleMessage);
    };
  }, [addMessageListener, removeMessageListener]); // Stable dependencies

  const handleSend = () => {
    sendMessage('Hello, WebSocket!');
  };

  return (
    <div>
      <p>Connected: {isConnected ? 'Yes' : 'No'}</p>
      {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
      <button type='button' onClick={handleSend} disabled={!isConnected}>
        Send Message
      </button>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};
