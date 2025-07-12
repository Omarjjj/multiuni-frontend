import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import type { UniversitySlug } from '../store';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Define message structure
interface ChatMessage {
  id: string;
  sender: 'user' | 'alex';
  text: string;
  sources?: { title: string; url: string }[];
}

interface AskPayload {
  session_id: string;
  university: UniversitySlug;
  query: string;
}

interface AskResponse {
  response: string;
  sources: { title: string; url: string }[];
}

// Define context type for optimistic updates
interface OptimisticUpdateContext {
    optimisticMessageId: string;
}

const postChatMessage = async (payload: AskPayload): Promise<AskResponse> => {
  const response = await fetch(`${API_BASE_URL}/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("API Error sending message:", response.status, errorData);
    // Throw specific error messages based on prompt requirements
    if (response.status === 500) {
        throw new Error("Alex lost connection, try again"); // Specific message for 500
    }
    throw new Error(errorData.detail || 'Failed to send message');
  }

  return response.json();
};

const useChat = (sessionId: string, university: UniversitySlug | null) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const mutation = useMutation<AskResponse, Error, string, OptimisticUpdateContext | undefined>({
    mutationFn: (userQuery: string) => {
      if (!university) {
        return Promise.reject(new Error("University not selected"));
      }
      return postChatMessage({ session_id: sessionId, university, query: userQuery });
    },
    onMutate: async (userQuery: string) => {
        // Optimistically add user message
        const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            sender: 'user', 
            text: userQuery
        };
        setMessages(prev => [...prev, userMessage]);
        // Optional: Add placeholder typing indicator for Alex
        // Return context for rollback
        return { optimisticMessageId: userMessage.id }; 
    },
    onSuccess: (data, _variables, _context) => {
      // Replace placeholder or add Alex's response
      const alexMessage: ChatMessage = {
        id: crypto.randomUUID(),
        sender: 'alex',
        text: data.response,
        sources: data.sources,
      };
       // TODO: Potentially remove typing indicator here
      setMessages(prev => [...prev, alexMessage]);
      // Optionally invalidate queries if needed
      // queryClient.invalidateQueries({ queryKey: ['chatHistory', sessionId] });
    },
    onError: (error, _variables, context) => {
      console.error("Error sending message:", error);
      toast.error(error.message || "Couldn't send message. Please try again.");
      // Rollback optimistic update
      if (context?.optimisticMessageId) {
          setMessages(prev => prev.filter(msg => msg.id !== context.optimisticMessageId));
      }
      // TODO: Potentially remove typing indicator here
    },
    onSettled: () => {
       // Runs after onSuccess or onError
       // TODO: Remove typing indicator if it was added in onMutate
    }
  });

  const sendMessage = (query: string) => {
    if (!query.trim()) return;
    if (!university) {
      toast.error("Please select a university first.");
      return;
    }
    mutation.mutate(query);
  };

  return {
    messages,
    sendMessage,
    isLoading: mutation.isPending, // Use isPending for loading state
    error: mutation.error,
  };
};

export default useChat;
export type { ChatMessage }; // Export type for use in components 