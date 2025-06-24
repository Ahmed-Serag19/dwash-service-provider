import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Client, type Frame, type IMessage } from "@stomp/stompjs";
import { API_BASE_URL } from "@/constants/endPoints";

export interface ChatMessage {
  messageId?: number;
  messageSender: "CONSUMER" | "FREELANCER";
  message: string;
  chatId?: number;
  createdOn?: string;
}

export type ConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "error";

export function useServiceProviderChat(requestId: number, enabled = true) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [error, setError] = useState<string | null>(null);
  const [subscribed, setSubscribed] = useState(false);

  const clientRef = useRef<Client>();
  const subscriptionRef = useRef<any>();

  // Get token from sessionStorage (service provider uses sessionStorage)
  const token = sessionStorage.getItem("accessToken");

  // Build the WebSocket URL once per requestId/token
  const wsUrl = useMemo(() => {
    if (!token || !requestId || requestId <= 0 || !enabled) return "";
    const protocolUrl = API_BASE_URL.replace(/^http/, "ws");
    const authParam = encodeURIComponent(`Bearer ${token}`);
    return `${protocolUrl}/ws-chat?requestId=${requestId}&Authorization=${authParam}`;
  }, [requestId, token, enabled]);

  // Load the REST chat history
  const fetchHistory = useCallback(async () => {
    if (!enabled || !requestId || requestId <= 0 || !token) {
      console.log(
        "Skipping chat history fetch - not enabled or invalid requestId:",
        {
          enabled,
          requestId,
          hasToken: !!token,
        }
      );
      return;
    }

    try {
      console.log("Fetching chat history for requestId:", requestId);
      const res = await fetch(`${API_BASE_URL}/chat/?requestID=${requestId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.messageEn || res.statusText);
      }
      const data = await res.json();
      setMessages(data.content?.messages || []);
    } catch (e: any) {
      console.error("Fetch history error:", e);
      setError("Failed to load chat history");
    }
  }, [requestId, token, enabled]);

  // (Re)connect STOMP over WebSocket
  const connect = useCallback(() => {
    if (!wsUrl || !enabled) {
      console.log("Skipping WebSocket connection - no URL or not enabled:", {
        hasUrl: !!wsUrl,
        enabled,
      });
      return;
    }

    console.log("Connecting to WebSocket for requestId:", requestId);

    // Tear down previous client if any
    clientRef.current?.deactivate();
    setStatus("connecting");
    setError(null);
    setSubscribed(false);

    const client = new Client({
      brokerURL: wsUrl,
      reconnectDelay: 5000,
      heartbeatIncoming: 0,
      heartbeatOutgoing: 0,

      // on successful STOMP CONNECT
      onConnect: (_frame: Frame) => {
        console.log("WebSocket connected for requestId:", requestId);
        subscriptionRef.current = client.subscribe(
          `/topic/chat/${requestId}`,
          (msg: IMessage) => {
            try {
              const { messageSender, content } = JSON.parse(msg.body);
              setMessages((prev) => [
                ...prev,
                {
                  messageSender,
                  message: content,
                  createdOn: new Date().toISOString(),
                },
              ]);
            } catch (e) {
              console.error("Message parse error:", e);
            }
          }
        );
        setSubscribed(true);
        setStatus("connected");
      },

      onStompError: (frame) => {
        console.error("STOMP error:", frame.headers.message);
        setError(frame.headers.message || "STOMP protocol error");
        setStatus("error");
      },

      onWebSocketError: (evt) => {
        console.error("WebSocket error:", evt);
        setError("WebSocket connection failed");
        setStatus("error");
      },

      onWebSocketClose: () => {
        console.log("WebSocket closed for requestId:", requestId);
        setStatus("disconnected");
      },
    });

    clientRef.current = client;
    client.activate();

    return () => {
      client.deactivate();
    };
  }, [wsUrl, requestId, enabled]);

  // Send a new chat message
  const sendMessage = useCallback(
    (text: string) => {
      if (!enabled || !requestId || requestId <= 0) {
        console.warn(
          "Cannot send message - not enabled or invalid requestId:",
          { enabled, requestId }
        );
        return;
      }

      const content = text.trim();
      if (!content || status !== "connected" || !subscribed) {
        setError("Not ready to send");
        return;
      }
      // optimistic UI update
      setMessages((prev) => [
        ...prev,
        {
          messageSender: "FREELANCER",
          message: content,
          createdOn: new Date().toISOString(),
        },
      ]);
      try {
        clientRef.current?.publish({
          destination: "/app/chat",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ content, requestId }),
        });
      } catch (e) {
        console.error("Send failed:", e);
        setError("Failed to send message");
        // rollback
        setMessages((prev) => prev.slice(0, -1));
      }
    },
    [requestId, status, subscribed, enabled]
  );

  // Initialize on mount and whenever dependencies change
  useEffect(() => {
    if (!enabled || !requestId || requestId <= 0) {
      console.log("Chat hook disabled or invalid requestId:", {
        enabled,
        requestId,
      });
      // Reset state when disabled
      setMessages([]);
      setStatus("disconnected");
      setError(null);
      setSubscribed(false);
      return;
    }

    fetchHistory();
    const cleanup = connect();
    return () => {
      cleanup?.();
    };
  }, [fetchHistory, connect, enabled, requestId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, []);

  return {
    messages,
    status,
    error,
    subscribed,
    sendMessage,
    retry: connect,
  };
}
