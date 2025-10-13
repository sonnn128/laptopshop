import React from 'react';
import { List, Card, Button, Empty, Typography, Row, Col, message, Tag } from 'antd';
import { useWishlist } from '../contexts/WishlistContext.jsx';
import { useCart } from '../contexts/CartContext.jsx';
import { Link } from 'react-router-dom';

const { Title } = Typography;

const WishlistPage = () => {
  const { items, remove, clear } = useWishlist();
  const { addToCart, loading: cartLoading } = useCart();

  if (!items || items.length === 0) {
    return (
      <div style={{ padding: 24 }}>
        <Title level={2}>Your Wishlist</Title>
        <Empty description="Your wishlist is empty" />
      </div>
    );
  }

  const handleRemove = (id) => {
    remove(id);
    message.success('Removed from wishlist');
  };

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={2}>Your Wishlist</Title>
        </Col>
        <Col>
          <Button danger onClick={() => { clear(); message.success('Cleared wishlist'); }}>Clear</Button>
        </Col>
      </Row>

      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={items}
        renderItem={item => (
          <List.Item>
            <Card
              hoverable
              cover={
                <img
                  alt={item.name}
                  src={item.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                  style={{ height: 160, objectFit: 'cover' }}
                />
              }
              title={item.name}
              extra={<Link to={`/products/${item.id}`}>View</Link>}
            >
              <div style={{ minHeight: 60 }}>
                <div style={{ marginBottom: 8 }}>{item.description}</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Tag color="blue">{item.price ? `$${Number(item.price).toLocaleString()}` : ''}</Tag>
                  {item.factory && <Tag>{item.factory}</Tag>}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                <div>
                  <Button type="link" onClick={() => handleRemove(item.id)}>Remove</Button>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button
                    onClick={async () => {
                      const res = await addToCart(item, 1);
                      if (res.success) {
                        message.success('Added to cart');
                      } else {
                        message.error(res.error || 'Failed to add to cart');
                      }
                    }}
                    loading={cartLoading}
                    type="primary"
                  >
                    Add to Cart
                  </Button>
                  <Link to={`/products/${item.id}`}><Button>Buy</Button></Link>
                </div>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default WishlistPage;
