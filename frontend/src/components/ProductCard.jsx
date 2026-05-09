import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './ProductCard.css';

const PLACEHOLDER = 'https://placehold.co/640x400/0d0d14/8b5cf6?text=No+Image';

const ProductCard = ({ product, onEdit, onDelete, index = 0 }) => {
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
    <div className="product-card fade-in" style={{ animationDelay: `${index * 0.06}s` }}>
      <div className="product-card-image">
        <img
          src={(!imgError && product.imageUrl) ? product.imageUrl : PLACEHOLDER}
          alt={product.name}
          onError={() => setImgError(true)}
          loading="lazy"
        />
        <div className="product-card-image-overlay" />
        <div className="product-card-badges">
          <span className="badge badge-accent">{product.category || 'General'}</span>
        </div>
      </div>

      <div className="product-card-body">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>

        <div className="product-card-footer">
          <div className="product-price-wrap">
            <span className="product-price-label">Price</span>
            <span className="product-price">{formattedPrice}</span>
          </div>

          {isAuthenticated && (
            <div className="product-actions">
              <button
                className="btn btn-ghost btn-icon btn-sm"
                onClick={() => onEdit(product)}
                title="Edit product"
                aria-label="Edit product"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M11.854.146a.5.5 0 0 0-.707 0l-1.5 1.5a.5.5 0 0 0 0 .707l2 2a.5.5 0 0 0 .707 0l1.5-1.5a.5.5 0 0 0 0-.707l-2-2zM9.5 2.5l-7 7V12h2.5l7-7-2.5-2.5z" fill="currentColor"/>
                </svg>
              </button>
              <button
                className="btn btn-danger btn-icon btn-sm"
                onClick={handleDelete}
                disabled={deleting}
                title="Delete product"
                aria-label="Delete product"
              >
                {deleting
                  ? <span className="spinner" style={{ width: 13, height: 13 }} />
                  : (
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <path d="M1 1l11 11M12 1L1 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  )
                }
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
