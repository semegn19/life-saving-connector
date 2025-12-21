import { useEffect, useState } from 'react';
import { api } from '../api/client';

type Opportunity = {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  urgency?: string;
  location?: string;
};

const OpportunitiesPage = () => {
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOpps = async (q?: string) => {
    setLoading(true);
    try {
      const { data } = await api.get('/volunteers/opportunities', {
        params: q ? { search: q } : undefined,
      });
      setOpps(data.opportunities || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpps();
  }, []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOpps(search);
  };

  const [applying, setApplying] = useState<string | null>(null);
  const [applyForm, setApplyForm] = useState({ motivation: '', availability: '' });

  const apply = async (oppId: string) => {
    if (!applyForm.motivation.trim()) {
      alert('Please provide a motivation');
      return;
    }
    try {
      setApplying(oppId);
      await api.post('/volunteers/apply', {
        opportunityId: oppId,
        motivation: applyForm.motivation,
        availability: applyForm.availability,
      });
      alert('Application submitted successfully');
      setApplyForm({ motivation: '', availability: '' });
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(null);
    }
  };

  return (
    <div className="page">
      <h1>Volunteer Opportunities</h1>
      <form onSubmit={onSearch} className="card" style={{ marginBottom: '1rem' }}>
        <input
          placeholder="Search by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%' }}
        />
        <button type="submit" className="btn">
          Search
        </button>
      </form>
      {loading && <div className="page">Loading...</div>}
      {error && <div className="page error">{error}</div>}
      {!loading && !error && opps.length === 0 && <div className="empty-state">No opportunities found</div>}
      <div className="list">
        {opps.map((o) => (
          <div key={o._id} className="card">
            <div className="card-header">
              <h3>{o.title}</h3>
              {o.urgency && <span className={`badge badge-${o.urgency}`}>{o.urgency}</span>}
            </div>
            <p>{o.description}</p>
            <p>
              {o.category && <span>Category: {o.category}</span>}
              {o.location && <span> • Location: {o.location}</span>}
            </p>
            <div>
              <textarea
                placeholder="Why do you want to volunteer? (required)"
                value={applyForm.motivation}
                onChange={(e) => setApplyForm({ ...applyForm, motivation: e.target.value })}
                rows={3}
                style={{ width: '100%', marginBottom: '8px' }}
              />
              <input
                placeholder="Availability (optional)"
                value={applyForm.availability}
                onChange={(e) => setApplyForm({ ...applyForm, availability: e.target.value })}
                style={{ width: '100%', marginBottom: '8px' }}
              />
              <button
                onClick={() => apply(o._id)}
                className="btn"
                disabled={applying === o._id || !applyForm.motivation.trim()}
              >
                {applying === o._id ? 'Applying...' : 'Apply'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OpportunitiesPage;

