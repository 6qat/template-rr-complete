/* eslint-disable no-unused-vars */
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';

// Define the shape of the context value
interface WebSocketContextType {
  connectionStatuses: Record<string, boolean>;
  sendMessage: (url: string, message: string) => void;
  addMessageListener: (
    url: string,
    listener: (message: string) => void
  ) => void;
  removeMessageListener: (
    url: string,
    listener: (message: string) => void
  ) => void;
  ensureConnection: (url: string) => void;
}

// Create the context
const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

// Props for the provider
interface WebSocketProviderProps {
  children: ReactNode;
}

// WebSocket Provider component
export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  // State to track connection status for each URL
  const [connectionStatuses, setConnectionStatuses] = useState<
    Record<string, boolean>
  >({});

  // Ref to store WebSocket instances
  const wsInstances = useRef<Record<string, WebSocket>>({});

  // Ref to store message listeners for each URL
  const messageListeners = useRef<
    Record<string, ((message: string) => void)[]>
  >({});

  // Ensure a WebSocket connection exists for a given URL
  const ensureConnection = useCallback((url: string) => {
    if (!wsInstances.current[url]) {
      const socket = new WebSocket(url);
      wsInstances.current[url] = socket;
      messageListeners.current[url] = [];
      setConnectionStatuses((prev) => ({ ...prev, [url]: false }));

      socket.onopen = () => {
        setConnectionStatuses((prev) => ({ ...prev, [url]: true }));
      };

      socket.onmessage = (event) => {
        const message = event.data;
        messageListeners.current[url]?.forEach((listener) => listener(message));
      };

      socket.onclose = () => {
        setConnectionStatuses((prev) => ({ ...prev, [url]: false }));
        // Optionally, clean up or attempt to reconnect
      };

      socket.onerror = (error) => {
        console.error(`WebSocket error for ${url}:`, error);
      };
    }
  }, []);

  // Send a message to a specific WebSocket connection
  const sendMessage = useCallback((url: string, message: string) => {
    const socket = wsInstances.current[url];
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    }
  }, []);

  // Add a message listener for a specific URL
  const addMessageListener = useCallback(
    (url: string, listener: (message: string) => void) => {
      if (!messageListeners.current[url]) {
        ensureConnection(url);
      }
      messageListeners.current[url].push(listener);
    },
    [ensureConnection]
  );

  // Remove a message listener for a specific URL
  const removeMessageListener = useCallback(
    (url: string, listener: (message: string) => void) => {
      if (messageListeners.current[url]) {
        messageListeners.current[url] = messageListeners.current[url].filter(
          (l) => l !== listener
        );
      }
    },
    []
  );

  // Context value to be provided to consumers
  const value: WebSocketContextType = {
    connectionStatuses,
    sendMessage,
    addMessageListener,
    removeMessageListener,
    ensureConnection,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook to access a WebSocket connection for a specific URL
export const useWebSocket = (url: string) => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }

  const {
    connectionStatuses,
    sendMessage,
    addMessageListener,
    removeMessageListener,
    ensureConnection,
  } = context;

  // Ensure the connection is established when the hook is used
  useEffect(() => {
    ensureConnection(url);
  }, [url, ensureConnection]);

  const isConnected = connectionStatuses[url] || false;

  const send = useCallback(
    (message: string) => {
      sendMessage(url, message);
    },
    [url, sendMessage]
  );

  const addListener = useCallback(
    (listener: (message: string) => void) => {
      addMessageListener(url, listener);
    },
    [url, addMessageListener]
  );

  const removeListener = useCallback(
    (listener: (message: string) => void) => {
      removeMessageListener(url, listener);
    },
    [url, removeMessageListener]
  );

  // Memoize the returned object to prevent unnecessary re-renders
  return useMemo(
    () => ({
      isConnected,
      sendMessage: send,
      addMessageListener: addListener,
      removeMessageListener: removeListener,
    }),
    [isConnected, send, addListener, removeListener]
  );
};

const ChatComponent = ({ url }: { url: string }) => {
  const {
    isConnected,
    sendMessage,
    addMessageListener,
    removeMessageListener,
  } = useWebSocket(url);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const handleMessage = (message: string) => {
      setMessages((prev) => [...prev, message]);
    };

    addMessageListener(handleMessage);

    // Cleanup listener when component unmounts
    return () => {
      removeMessageListener(handleMessage);
    };
  }, [addMessageListener, removeMessageListener]);

  const handleSend = () => {
    sendMessage('Hello from ' + url);
  };

  return (
    <div>
      <h3>Connection: {url}</h3>
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      <button onClick={handleSend} disabled={!isConnected}>
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
