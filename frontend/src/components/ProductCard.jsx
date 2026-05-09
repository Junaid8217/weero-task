import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ProductCard.css';

const PLACEHOLDER = 'https://placehold.co/400x250/12121a/7c6af7?text=No+Image';

const ProductCard = ({ product, onEdit, onDelete }) => {
  const { isAuthenticated } = useAuth();
  const [imgError, setImgError] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${product.name}"?`)) return;
    setDeleting(true);
    await onDelete(product._id);
    setDeleting(false);
  };

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price);

  return (
    <div className="product-card card fade-in">
      <div className="product-card-image">
        <img
          src={(!imgError && product.imageUrl) ? product.imageUrl : PLACEHOLDER}
          alt={product.name}
          onError={() => setImgError(true)}
          loading="lazy"
        />
        <div className="product-card-overlay">
          <span className="badge badge-accent">{product.category || 'General'}</span>
        </div>
      </div>

      <div className="product-card-body">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-card-footer">
          <span className="product-price">{formattedPrice}</span>
          {isAuthenticated && (
            <div className="product-actions">
              <button
                className="btn btn-outline btn-sm btn-icon"
                onClick={() => onEdit(product)}
                title="Edit"
              >
                ✎
              </button>
              <button
                className="btn btn-danger btn-sm btn-icon"
                onClick={handleDelete}
                disabled={deleting}
                title="Delete"
              >
                {deleting ? <span className="spinner" style={{width:14,height:14}} /> : '✕'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
