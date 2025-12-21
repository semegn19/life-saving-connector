import { useEffect, useState } from 'react';
import { api } from '../api/client';

type Center = {
  _id: string;
  name: string;
  city?: string;
  address?: string;
  urgency?: string;
};

const BloodCentersPage = () => {
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/blood/centers');
        setCenters(data.centers || []);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load centers');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p>Loading centers...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h1>Blood Donation Centers</h1>
      <div className="list">
        {centers.map((c) => (
          <div key={c._id} className="card">
            <h3>{c.name}</h3>
            <p>{c.city}</p>
            <p>{c.address}</p>
            {c.urgency && <p>Urgency: {c.urgency}</p>}
          </div>
        ))}
        {centers.length === 0 && <p>No centers available.</p>}
      </div>
    </div>
  );
};

export default BloodCentersPage;

