import { useState } from 'react';
import { getLocalMessages, addLocalMessage } from '../hooks/useLocalStorage';

const Guestbook = () => {
  const [messages, setMessages] = useState(getLocalMessages);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    addLocalMessage(name.trim(), message.trim());
    setMessages(getLocalMessages());
    setName('');
    setMessage('');
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  return (
    <div className="section guestbook">
      <h2>留言板</h2>

      <form className="guestbook-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="你的名字"
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={50}
          required
        />
        <textarea
          placeholder="寫下你想說的話..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          maxLength={500}
          required
          rows={3}
        />
        <button type="submit" disabled={!name.trim() || !message.trim()}>
          送出留言
        </button>
        {submitSuccess && <p className="form-success">✓ 留言成功！</p>}
      </form>

      <div className="guestbook-list">
        {messages.length > 0 ? (
          messages.map(msg => (
            <div key={msg.id} className="message-card">
              <div className="message-header">
                <strong>{msg.name}</strong>
                <span className="message-date">
                  {new Date(msg.created_at).toLocaleDateString('zh-TW')}
                </span>
              </div>
              <p>{msg.message}</p>
            </div>
          ))
        ) : (
          <p className="no-messages">尚無留言，成為第一個留言的人吧！</p>
        )}
      </div>
    </div>
  );
};

export default Guestbook;
