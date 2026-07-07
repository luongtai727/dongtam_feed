import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Trash2, CheckCircle, Clock, Eye } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ManageContacts() {
  const { token } = useAuth();
  const [contacts, setContacts] = useState([]);

  const loadContacts = () => {
    fetch(`${API}/api/contacts`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setContacts)
      .catch(() => {});
  };

  useEffect(() => { loadContacts(); }, [token]);

  const updateStatus = async (id, status) => {
    try {
      await fetch(`${API}/api/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      loadContacts();
    } catch {
      alert('Lỗi khi cập nhật trạng thái');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Xóa liên hệ này?')) return;
    try {
      await fetch(`${API}/api/contacts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      loadContacts();
    } catch {
      alert('Lỗi khi xóa liên hệ');
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Quản lý Liên hệ</h1>
          <p>Xem và xử lý các yêu cầu liên hệ từ khách hàng</p>
        </div>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Trạng thái</th>
              <th>Họ tên</th>
              <th>SĐT</th>
              <th>Email</th>
              <th>Công ty</th>
              <th>Nội dung</th>
              <th>Ngày gửi</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(c => (
              <tr key={c.id} className={c.status === 'new' ? 'row-highlight' : ''}>
                <td>
                  {c.status === 'new' ? (
                    <span className="badge badge-gold"><Clock size={12} /> Mới</span>
                  ) : (
                    <span className="badge badge-green"><CheckCircle size={12} /> Đã xử lý</span>
                  )}
                </td>
                <td><strong>{c.name}</strong></td>
                <td>{c.phone}</td>
                <td>{c.email || '-'}</td>
                <td>{c.company || '-'}</td>
                <td className="message-cell" title={c.message}>{c.message}</td>
                <td>{new Date(c.createdAt).toLocaleDateString('vi-VN')}</td>
                <td>
                  <div className="action-btns">
                    {c.status === 'new' ? (
                      <button className="btn btn-sm btn-primary" onClick={() => updateStatus(c.id, 'processed')}>
                        <CheckCircle size={14} /> Đã xử lý
                      </button>
                    ) : (
                      <button className="btn btn-sm btn-outline" onClick={() => updateStatus(c.id, 'new')}>
                        <Clock size={14} /> Đánh dấu mới
                      </button>
                    )}
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {contacts.length === 0 && <div className="admin-empty">Chưa có yêu cầu liên hệ nào</div>}
      </div>
    </div>
  );
}
