import { useState, useEffect, useCallback } from 'react';
import { useMessages } from '../hooks/useApi';
import { getLocalMessages, addLocalMessage } from '../hooks/useLocalStorage';
import LoadingSpinner from './LoadingSpinner';

const Guestbook = () => {
  const { data: apiMessages, loading, error, addMessage } = useMessages();
  const [localMessages, setLocalMessages] = useState(getLocalMessages());
  const [usingLocal, setUsingLocal] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (error) {
      setUsingLocal(true);
      setLocalMessages(getLocalMessages());
    }
  }, [error]);

  const messages = usingLocal ? localMessages : apiMessages;

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    try {
      if (usingLocal) {
        addLocalMessage(name.trim(), message.trim());
        setLocalMessages(getLocalMessages());
        setName('');
        setMessage('');
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 3000);
      } else {
        await addMessage(name.trim(), message.trim());
        setName('');
        setMessage('');
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 3000);
      }
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : '發生錯誤');
    } finally {
      setSubmitting(false);
    }
  }, [name, message, usingLocal, addMessage]);

  return (
    <div className="section guestbook">
      <h2>留言板</h2>
      {usingLocal && <p className="api-offline">💾 離線模式：留言儲存在瀏覽器本地</p>}

      <form className="guestbook-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="你的名字"
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={50}
          required
          disabled={submitting}
        />
        <textarea
          placeholder="寫下你想說的話..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          maxLength={500}
          required
          disabled={submitting}
          rows={3}
        />
        <button type="submit" disabled={submitting || !name.trim() || !message.trim()}>
          {submitting ? '送出中...' : '送出留言'}
        </button>
        {submitError && <p className="form-error">{submitError}</p>}
        {submitSuccess && <p className="form-success">✓ 留言成功！</p>}
      </form>

      <div className="guestbook-list">
        {loading && !usingLocal ? (
          <LoadingSpinner text="載入留言中..." />
        ) : messages && messages.length > 0 ? (
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
