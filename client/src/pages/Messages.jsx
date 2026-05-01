import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await API.get('/messages/conversations');
        setConversations(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  const fetchMessages = async (userId) => {
    try {
      const { data } = await API.get(`/messages/${userId}`);
      setMessages(data);
      await API.put(`/messages/${userId}/read`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectUser = (conv) => {
    const otherId = conv.senderId._id === user._id ? conv.receiverId._id : conv.senderId._id;
    const otherUser = conv.senderId._id === user._id ? conv.receiverId : conv.senderId;
    setSelectedUser({ id: otherId, name: otherUser.name });
    fetchMessages(otherId);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      const { data } = await API.post('/messages', {
        receiverId: selectedUser.id,
        content: newMessage
      });
      setMessages([...messages, data]);
      setNewMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      <h1 className="page-title">Messages</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '20px', height: '600px' }}>
        <div className="card" style={{ overflow: 'auto', padding: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Conversations</h3>
          {conversations.length === 0 ? (
            <p style={{ color: '#6b7280', fontSize: '14px' }}>No conversations yet</p>
          ) : (
            conversations.map((conv) => {
              const other = conv.senderId._id === user._id ? conv.receiverId : conv.senderId;
              return (
                <div key={conv._id}
                  onClick={() => handleSelectUser(conv)}
                  style={{
                    padding: '10px', borderRadius: '8px', cursor: 'pointer',
                    background: selectedUser?.id === other._id ? '#eff6ff' : 'transparent',
                    marginBottom: '4px'
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: '#dbeafe', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontWeight: '600', color: '#1e40af', fontSize: '14px'
                    }}>
                      {other.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontWeight: '500', fontSize: '14px' }}>{other.name}</p>
                      <p style={{ color: '#9ca3af', fontSize: '12px' }}>
                        {conv.content?.substring(0, 30)}...
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: '16px' }}>
          {!selectedUser ? (
            <div className="empty-state">
              <h3>Select a conversation</h3>
              <p>Choose a conversation from the left to start messaging</p>
            </div>
          ) : (
            <>
              <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '12px', marginBottom: '16px' }}>
                <h3 style={{ fontWeight: '600' }}>{selectedUser.name}</h3>
              </div>
              <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {messages.map((msg) => (
                  <div key={msg._id} style={{
                    display: 'flex',
                    justifyContent: msg.senderId === user._id ? 'flex-end' : 'flex-start'
                  }}>
                    <div style={{
                      maxWidth: '70%', padding: '10px 14px', borderRadius: '12px',
                      background: msg.senderId === user._id ? '#2563eb' : '#f3f4f6',
                      color: msg.senderId === user._id ? 'white' : '#111827',
                      fontSize: '14px'
                    }}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  style={{ flex: 1, padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                />
                <button type="submit" className="btn btn-primary">Send</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;