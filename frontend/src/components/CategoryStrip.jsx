import React, { useEffect, useState } from 'react';
import { Tag, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../config/api.js';

const CategoryStrip = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get('/categories');
        const data = res.data.data || res.data;
        if (!mounted) return;
        setCategories(Array.isArray(data) ? data : (data.content || []));
      } catch (e) {
        console.error('Failed to load categories', e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div style={{ padding: '8px 24px' }}><Spin size="small" /></div>;

  return (
    <div style={{ padding: '8px 24px', background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <Tag
            key={cat.id}
            color="blue"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/products?category=${cat.id}`)}
          >
            {cat.name}
          </Tag>
        ))}
      </div>
    </div>
  );
};

export default CategoryStrip;
