import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Trash2, CheckCircle, Clock, Eye, Phone, Mail, Building, Search, X, MessageSquare, AlertCircle } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ManageContacts() {
  const { token } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('all'); // all, unread, processed
  const [search, setSearch] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);

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
      if (selectedContact && selectedContact.id === id) {
        setSelectedContact(prev => ({ ...prev, status }));
      }
    } catch {
      alert('Lỗi khi cập nhật trạng thái');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa yêu cầu liên hệ này?')) return;
    try {
      await fetch(`${API}/api/contacts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      loadContacts();
      if (selectedContact && selectedContact.id === id) {
        setSelectedContact(null);
      }
    } catch {
      alert('Lỗi khi xóa liên hệ');
    }
  };

  // Filtered contacts
  const filteredContacts = contacts.filter(c => {
    const isUnread = c.status === 'unread' || c.status === 'new';
    if (filter === 'unread' && !isUnread) return false;
    if (filter === 'processed' && isUnread) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.name?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.company?.toLowerCase().includes(q) ||
        c.subject?.toLowerCase().includes(q) ||
        c.message?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const unreadCount = contacts.filter(c => c.status === 'unread' || c.status === 'new').length;
  const processedCount = contacts.length - unreadCount;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Quản lý Yêu cầu Liên hệ</h1>
          <p>Xem, quản lý và phản hồi tất cả các yêu cầu tư vấn báo giá từ khách hàng gửi qua Website</p>
        </div>
      </div>

      {/* Summary Filter Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div
          className={`dash-stat-card ${filter === 'all' ? 'green' : ''}`}
          style={{ cursor: 'pointer', border: filter === 'all' ? '2px solid var(--green-500)' : undefined }}
          onClick={() => setFilter('all')}
        >
          <div className="dsc-icon" style={{ background: 'var(--gradient-primary)' }}>
            <MessageSquare size={22} />
          </div>
          <div>
            <div className="dsc-value">{contacts.length}</div>
            <div className="dsc-label">Tất cả yêu cầu</div>
          </div>
        </div>

        <div
          className={`dash-stat-card ${filter === 'unread' ? 'green' : ''}`}
          style={{ cursor: 'pointer', border: filter === 'unread' ? '2px solid var(--green-500)' : undefined }}
          onClick={() => setFilter('unread')}
        >
          <div className="dsc-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            <AlertCircle size={22} />
          </div>
          <div>
            <div className="dsc-value" style={{ color: '#d97706' }}>{unreadCount}</div>
            <div className="dsc-label">Yêu cầu mới (Chưa xử lý)</div>
          </div>
        </div>

        <div
          className={`dash-stat-card ${filter === 'processed' ? 'green' : ''}`}
          style={{ cursor: 'pointer', border: filter === 'processed' ? '2px solid var(--green-500)' : undefined }}
          onClick={() => setFilter('processed')}
        >
          <div className="dsc-icon" style={{ background: 'var(--gradient-secondary)' }}>
            <CheckCircle size={22} />
          </div>
          <div>
            <div className="dsc-value">{processedCount}</div>
            <div className="dsc-label">Đã liên hệ xử lý</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
        <div className="filter-search" style={{ background: 'var(--surface-card)', border: '1px solid var(--border-light)', padding: '0 1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, maxWidth: '400px' }}>
          <Search size={18} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ border: 'none', background: 'transparent', padding: '0.6rem 0' }}
            placeholder="Tìm theo Tên, SĐT, Email, Công ty..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Contacts Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '120px' }}>Trạng thái</th>
              <th>Họ tên</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>Công ty</th>
              <th>Chủ đề</th>
              <th>Thời gian</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map(c => {
              const isUnread = c.status === 'unread' || c.status === 'new';
              return (
                <tr key={c.id} style={{ background: isUnread ? 'rgba(245, 158, 11, 0.05)' : undefined }}>
                  <td>
                    {isUnread ? (
                      <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={12} /> Mới
                      </span>
                    ) : (
                      <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <CheckCircle size={12} /> Đã xử lý
                      </span>
                    )}
                  </td>
                  <td><strong>{c.name}</strong></td>
                  <td>
                    <a href={`tel:${c.phone}`} style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
                      {c.phone}
                    </a>
                  </td>
                  <td>{c.email || '—'}</td>
                  <td>{c.company || '—'}</td>
                  <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.subject || 'Liên hệ tư vấn'}
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {new Date(c.createdAt).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="btn btn-sm btn-outline" title="Xem nội dung chi tiết" onClick={() => setSelectedContact(c)}>
                        <Eye size={14} /> Xem
                      </button>
                      {isUnread ? (
                        <button className="btn btn-sm btn-primary" title="Đánh dấu đã liên hệ" onClick={() => updateStatus(c.id, 'processed')}>
                          <CheckCircle size={14} /> Xử lý
                        </button>
                      ) : (
                        <button className="btn btn-sm btn-outline" title="Đánh dấu chưa xử lý" onClick={() => updateStatus(c.id, 'unread')}>
                          <Clock size={14} /> Đánh dấu mới
                        </button>
                      )}
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredContacts.length === 0 && (
          <div className="admin-empty">Không tìm thấy yêu cầu liên hệ nào</div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedContact && (
        <div className="admin-modal-overlay" onClick={() => setSelectedContact(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <div className="admin-modal-header">
              <h2>Chi tiết Yêu cầu Liên hệ</h2>
              <button className="modal-close" onClick={() => setSelectedContact(null)}><X size={20} /></button>
            </div>
            <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
                <div>
                  <span className={`badge ${selectedContact.status === 'processed' ? 'badge-green' : 'badge-gold'}`}>
                    {selectedContact.status === 'processed' ? 'Đã xử lý liên hệ' : 'Yêu cầu mới'}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '1rem' }}>
                    Thời gian: {new Date(selectedContact.createdAt).toLocaleString('vi-VN')}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Họ và tên</label>
                  <p style={{ margin: '0.25rem 0 0', fontWeight: '700', fontSize: '1.1rem' }}>{selectedContact.name}</p>
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Số điện thoại</label>
                  <p style={{ margin: '0.25rem 0 0' }}>
                    <a href={`tel:${selectedContact.phone}`} className="btn btn-sm btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <Phone size={14} /> Gọi ngay: {selectedContact.phone}
                    </a>
                  </p>
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email</label>
                  <p style={{ margin: '0.25rem 0 0', fontWeight: '500' }}>{selectedContact.email || 'Chưa cung cấp'}</p>
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tên công ty</label>
                  <p style={{ margin: '0.25rem 0 0', fontWeight: '500' }}>{selectedContact.company || 'Khách hàng cá nhân'}</p>
                </div>
              </div>

              {selectedContact.subject && (
                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Chủ đề</label>
                  <p style={{ margin: '0.25rem 0 0', fontWeight: '600' }}>{selectedContact.subject}</p>
                </div>
              )}

              <div>
                <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Nội dung chi tiết yêu cầu</label>
                <div style={{ margin: '0.5rem 0 0', padding: '1rem', background: 'var(--surface-muted)', borderRadius: 'var(--radius-md)', whiteSpace: 'pre-line', lineHeight: '1.6', fontSize: '0.95rem' }}>
                  {selectedContact.message}
                </div>
              </div>
            </div>

            <div className="admin-modal-footer" style={{ marginTop: '1.5rem', justifyContent: 'space-between' }}>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => handleDelete(selectedContact.id)}
              >
                <Trash2 size={16} /> Xóa yêu cầu
              </button>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {(selectedContact.status === 'unread' || selectedContact.status === 'new') ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => updateStatus(selectedContact.id, 'processed')}
                  >
                    <CheckCircle size={16} /> Đánh dấu đã liên hệ xử lý
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => updateStatus(selectedContact.id, 'unread')}
                  >
                    <Clock size={16} /> Đánh dấu chưa xử lý
                  </button>
                )}
                <button type="button" className="btn btn-outline" onClick={() => setSelectedContact(null)}>Đóng</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
