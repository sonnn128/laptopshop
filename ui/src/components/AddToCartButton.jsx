import React, { useState } from 'react';
import { Button, InputNumber, message, Space } from 'antd';
import { ShoppingCartOutlined, PlusOutlined } from '@ant-design/icons';
import { useCart } from '../contexts/CartContext.jsx';

const AddToCartButton = ({ product, size = 'default', showQuantity = true, style = {} }) => {
  const { addToCart, loading } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!product) {
      message.error('Product not found');
      return;
    }

    if (quantity <= 0) {
      message.warning('Please select a valid quantity');
      return;
    }

    try {
      setAdding(true);
      const result = await addToCart(product, quantity);
      
      if (result.success) {
        message.success(`${product.name} added to cart!`);
        setQuantity(1); // Reset quantity after adding
      } else {
        message.error(result.error || 'Failed to add to cart');
      }
    } catch (error) {
      message.error('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  const handleQuantityChange = (value) => {
    if (value && value > 0) {
      setQuantity(value);
    }
  };

  if (showQuantity) {
    return (
      <Space.Compact style={style}>
        <InputNumber
          min={1}
          max={99}
          value={quantity}
          onChange={handleQuantityChange}
          disabled={adding || loading}
          style={{ width: 80 }}
        />
        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          onClick={handleAddToCart}
          loading={adding || loading}
          size={size}
        >
          Add to Cart
        </Button>
      </Space.Compact>
    );
  }

  return (
    <Button
      type="primary"
      icon={<PlusOutlined />}
      onClick={handleAddToCart}
      loading={adding || loading}
      size={size}
      style={style}
    >
      Add to Cart
    </Button>
  );
};

export default AddToCartButton;
