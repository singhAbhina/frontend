import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send } from 'lucide-react';

function ChatAi({problem}) {
    const [messages, setMessages] = useState([
        { role: 'model', parts:[{text: "Hi! I'm your DSA tutor. I can help you with hints, code review, and problem-solving strategies. What would you like help with today?"}]
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, reset, formState: {errors} } = useForm();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const onSubmit = async (data) => {
        if (!data.message.trim()) return;
        
        const userMessage = { role: 'user', parts:[{text: data.message.trim()}] };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        reset();

        try {
            console.log('🤖 Sending message to AI:', data.message);
            
            const response = await axiosClient.post("/ai/chat", {
                messages: [...messages, userMessage], // Include the new user message
                title: problem?.title || 'DSA Problem',
                description: problem?.description || 'No description provided',
                testCases: problem?.visibleTestCases || 'No test cases provided',
                startCode: problem?.startCode || 'No starting code provided'
            });

            console.log('✅ AI Response received:', response.data);
            
            if (response.data.success && response.data.response) {
                setMessages(prev => [...prev, { 
                    role: 'model', 
                    parts:[{text: response.data.response}] 
                }]);
            } else {
                throw new Error('Invalid response format from AI service');
            }
            
        } catch (error) {
            console.error("❌ AI Chat Error:", error);
            
            let errorMessage = "Sorry, I'm having trouble connecting to the AI service right now.";
            
            if (error.response?.data?.error) {
                errorMessage = `AI Service Error: ${error.response.data.error}`;
            } else if (error.message) {
                errorMessage = `Error: ${error.message}`;
            }
            
            setMessages(prev => [...prev, { 
                role: 'model', 
                parts:[{text: errorMessage}] 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen max-h-[80vh] min-h-[500px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}
                    >
                        <div className={`chat-bubble ${
                            msg.role === "user" 
                                ? "bg-primary text-primary-content" 
                                : "bg-base-200 text-base-content"
                        }`}>
                            {msg.parts[0].text}
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                    <div className="chat chat-start">
                        <div className="chat-bubble bg-base-200 text-base-content">
                            <div className="flex items-center space-x-2">
                                <div className="loading loading-dots loading-sm"></div>
                                <span>AI is thinking...</span>
                            </div>
                        </div>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>
            
            <form 
                onSubmit={handleSubmit(onSubmit)} 
                className="sticky bottom-0 p-4 bg-base-100 border-t"
            >
                <div className="flex items-center">
                    <input 
                        placeholder="Ask me anything about this DSA problem..." 
                        className="input input-bordered flex-1" 
                        {...register("message", { 
                            required: "Message is required", 
                            minLength: { value: 2, message: "Message must be at least 2 characters" }
                        })}
                        disabled={isLoading}
                    />
                    <button 
                        type="submit" 
                        className={`btn btn-primary ml-2 ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading || errors.message}
                    >
                        {!isLoading && <Send size={20} />}
                    </button>
                </div>
                {errors.message && (
                    <p className="text-error text-sm mt-1">{errors.message.message}</p>
                )}
            </form>
        </div>
    );
}

export default ChatAi;