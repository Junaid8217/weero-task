import { useState, useEffect } from 'react';
import './ProductForm.css';

const CATEGORIES = ['General', 'Electronics', 'Clothing', 'Books', 'Food & Drink', 'Home & Garden', 'Sports', 'Other'];
const emptyForm = { name: '', price: '', description: '', imageUrl: '', category: 'General' };

const ProductForm = ({ product, onSubmit, onClose, loading }) => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(product ? {
      name: product.name || '',
      price: product.price || '',
      description: product.description || '',
      imageUrl: product.imageUrl || '',
      category: product.category || 'General',
    } : emptyForm);
    setErrors({});
  }, [product]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!form.price || isNaN(form.price) || Number(form.price) < 0) errs.price = 'Enter a valid price (≥ 0)';
    if (!form.description.trim() || form.description.trim().length < 10) errs.description = 'Description must be at least 10 characters';
    if (form.imageUrl && !/^https?:\/\/.+/.test(form.imageUrl)) errs.imageUrl = 'Must be a valid URL (http/https)';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    await onSubmit({ ...form, price: Number(form.price) });
  };

  const isEdit = !!product;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 36, height: 36,
              background: 'var(--accent-subtle)',
              border: '1px solid var(--border-accent)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem'
            }}>
              {isEdit ? '✎' : '＋'}
            </div>
            <h2 className="modal-title">{isEdit ? 'Edit Product' : 'New Product'}</h2>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            <div className="form-grid">

              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  className={`form-input ${errors.name ? 'is-error' : ''}`}
                  placeholder="e.g. Wireless Headphones Pro"
                  value={form.name}
                  onChange={handleChange}
                  maxLength={100}
                  autoFocus
                />
                {errors.name && <span className="form-error">⚠ {errors.name}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Price (USD) *</label>
                  <input
                    type="number"
                    name="price"
                    className={`form-input ${errors.price ? 'is-error' : ''}`}
                    placeholder="0.00"
                    value={form.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                  />
                  {errors.price && <span className="form-error">⚠ {errors.price}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select name="category" className="form-select" value={form.category} onChange={handleChange}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  className={`form-input ${errors.imageUrl ? 'is-error' : ''}`}
                  placeholder="https://example.com/image.jpg"
                  value={form.imageUrl}
                  onChange={handleChange}
                />
                {errors.imageUrl && <span className="form-error">⚠ {errors.imageUrl}</span>}
                {form.imageUrl && !errors.imageUrl && (
                  <div className="image-preview">
                    <img src={form.imageUrl} alt="Preview" onError={e => e.target.style.display = 'none'} />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  name="description"
                  className={`form-textarea ${errors.description ? 'is-error' : ''}`}
                  placeholder="Describe your product in detail…"
                  value={form.description}
                  onChange={handleChange}
                  maxLength={1000}
                  rows={4}
                />
                <div className="char-count">{form.description.length} / 1000</div>
                {errors.description && <span className="form-error">⚠ {errors.description}</span>}
              </div>

            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading
                ? <><span className="spinner" style={{ width: 15, height: 15 }} /> Saving…</>
                : isEdit ? 'Save Changes' : 'Create Product'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
