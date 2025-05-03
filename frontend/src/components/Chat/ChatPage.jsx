import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';

// ChatWindow Component
const ChatWindow = ({ chat, onChatDelete }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchMessages();
  }, [chat.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/chat/${chat.id}/messages`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessages(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:5000/api/chat/${chat.id}/messages`,
        { message: newMessage },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await axios.delete(`http://localhost:5000/api/chat/messages/${messageId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setMessages(messages.filter(m => m.id !== messageId));
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">
          {user.userType === 'customer' ? chat.garage_name : chat.customer_name}
        </h2>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this entire chat?')) {
              onChatDelete(chat.id);
            }
          }}
          className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_id === user.userId ? 'justify-end' : 'justify-start'} group`}
              >
                <div className="relative">
                  <div
                    className={`max-w-xs rounded-lg px-4 py-2 ${
                      message.sender_id === user.userId
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p>{message.message}</p>
                    <p className="text-xs mt-1 opacity-75">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  {message.sender_id === user.userId && (
                    <button
                      onClick={() => handleDeleteMessage(message.id)}
                      className="absolute -right-8 top-0 hidden group-hover:block text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

const ChatPage = () => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [loading, setLoading] = useState(true);
    const { chatId } = useParams();
    const { user } = useAuth();
  
    useEffect(() => {
      fetchChats();
    }, []);
  
    useEffect(() => {
      if (chatId && chats.length > 0) {
        const chat = chats.find(c => c.id === parseInt(chatId));
        if (chat) {
          setSelectedChat(chat);
        }
      }
    }, [chatId, chats]);
  
    const fetchChats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/chat', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setChats(response.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setLoading(false);
      }
    };
  
    const handleDeleteChat = async (chatId) => {
      try {
        await axios.delete(`http://localhost:5000/api/chat/${chatId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setChats(chats.filter(c => c.id !== chatId));
        setSelectedChat(null);
      } catch (error) {
        console.error('Error deleting chat:', error);
      }
    };
  
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white shadow-lg rounded-lg min-h-[600px] flex">
              {/* Chat List Sidebar */}
              <div className="w-1/3 border-r border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
                </div>
                <div className="overflow-y-auto h-[calc(600px-64px)]">
                  {loading ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  ) : chats.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {chats.map((chat) => (
                        <div key={chat.id} className="relative group">
                          <button
                            onClick={() => setSelectedChat(chat)}
                            className={`w-full text-left p-4 hover:bg-gray-50 transition-colors duration-150 ${
                              selectedChat?.id === chat.id ? 'bg-indigo-50' : ''
                            }`}
                          >
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                  <span className="text-indigo-600 font-medium">
                                    {(user.userType === 'customer' ? chat.garage_name : chat.customer_name)?.[0]}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">
                                  {user.userType === 'customer' ? chat.garage_name : chat.customer_name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {new Date(chat.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </button>
                          <button
                            onClick={() => handleDeleteChat(chat.id)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:block text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <svg 
                        className="h-12 w-12 text-gray-400 mb-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                        />
                      </svg>
                      <p className="text-sm">No messages yet</p>
                      <p className="text-xs mt-1">
                        Start a conversation from garage listings or bookings
                      </p>
                    </div>
                  )}
                </div>
              </div>
  
              {/* Chat Window */}
              <div className="flex-1">
                {selectedChat ? (
                  <ChatWindow 
                    chat={selectedChat} 
                    onChatDelete={handleDeleteChat}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <svg 
                        className="mx-auto h-12 w-12 text-gray-400" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                        />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Select a chat to start messaging</h3>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  };
  
  export default ChatPage;