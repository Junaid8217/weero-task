import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import ProductForm from '../components/ProductForm';
import toast from 'react-hot-toast';
import './Home.css';

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Newest First',       order: 'desc' },
  { value: 'createdAt', label: 'Oldest First',        order: 'asc'  },
  { value: 'price',     label: 'Price: Low → High',   order: 'asc'  },
  { value: 'price',     label: 'Price: High → Low',   order: 'desc' },
  { value: 'name',      label: 'Name A–Z',             order: 'asc'  },
];

const CATEGORIES = ['', 'Electronics', 'Clothing', 'Books', 'Food & Drink', 'Home & Garden', 'Sports', 'Other'];

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { products, pagination, loading, error, fetchProducts, createProduct, updateProduct, deleteProduct } = useProducts();

  const [search, setSearch]         = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory]     = useState('');
  const [sortIdx, setSortIdx]       = useState(0);
  const [page, setPage]             = useState(1);
  const [showForm, setShowForm]     = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const sort = SORT_OPTIONS[sortIdx];

  const load = useCallback(() => {
    fetchProducts({ search, category, page, sortBy: sort.value, order: sort.order, limit: 9 });
  }, [search, category, page, sort.value, sort.order, fetchProducts]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleEdit = (product) => { setEditProduct(product); setShowForm(true); };
  const handleCloseForm = () => { setShowForm(false); setEditProduct(null); };

  const handleDelete = async (id) => {
    const result = await deleteProduct(id);
    if (result.success) { toast.success('Product deleted'); load(); }
    else toast.error(result.message);
  };

  const handleSubmitForm = async (formData) => {
    setFormLoading(true);
    const result = editProduct
      ? await updateProduct(editProduct._id, formData)
      : await createProduct(formData);
    setFormLoading(false);
    if (result.success) {
      toast.success(editProduct ? 'Product updated' : 'Product created');
      handleCloseForm();
      load();
    } else {
      toast.error(result.message);
    }
  };

  const openAddForm = () => { setEditProduct(null); setShowForm(true); };

  const renderPagination = () => {
    if (!pagination || pagination.pages <= 1) return null;
    const pages = [];
    for (let i = 1; i <= pagination.pages; i++) {
      pages.push(
        <button key={i} className={`page-btn ${i === pagination.page ? 'active' : ''}`} onClick={() => setPage(i)}>
          {i}
        </button>
      );
    }
    return (
      <div className="pagination">
        <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page <= 1}>←</button>
        {pages}
        <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page >= pagination.pages}>→</button>
      </div>
    );
  };

  return (
    <div className="home-page">

      {/* ── Hero ── */}
      <section className="hero">
        <div className="container">
          <div className="hero-inner">
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-dot" />
              <span className="hero-eyebrow-text">Product Catalogue</span>
            </div>

            <h1 className="hero-title">
              Discover &amp; Manage<br />
              <span className="hero-title-gradient">Amazing Products</span>
            </h1>

            <p className="hero-subtitle">
              Browse, organize, and manage your entire product inventory from one beautiful dashboard.
            </p>

            <div className="hero-cta">
              {isAuthenticated && (
                <button className="btn btn-primary" onClick={openAddForm}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Add Product
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
      </section>

      {/* ── Filters ── */}
      <section className="filters-section">
        <div className="container">
          <div className="filters-bar">
            <div className="search-wrap">
              <span className="search-icon"><SearchIcon /></span>
              <input
                type="text"
                className="form-input"
                placeholder="Search products…"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                aria-label="Search products"
              />
              {searchInput && (
                <button className="search-clear" onClick={() => setSearchInput('')} aria-label="Clear search">✕</button>
              )}
            </div>

            <select
              className="form-select filter-select"
              value={category}
              onChange={e => { setCategory(e.target.value); setPage(1); }}
              aria-label="Filter by category"
            >
              <option value="">All Categories</option>
              {CATEGORIES.filter(Boolean).map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select
              className="form-select filter-select"
              value={sortIdx}
              onChange={e => { setSortIdx(Number(e.target.value)); setPage(1); }}
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map((s, i) => <option key={i} value={i}>{s.label}</option>)}
            </select>

            {isAuthenticated && (
              <button className="btn btn-primary btn-sm" onClick={openAddForm} style={{ flexShrink: 0 }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Add
              </button>
            )}
          </div>

          {pagination?.total > 0 && (
            <p className="results-count">
              <strong>{pagination.total}</strong> product{pagination.total !== 1 ? 's' : ''} found
              {search && <> for "<em>{search}</em>"</>}
            </p>
          )}
        </div>
      </section>

      {/* ── Products ── */}
      <section className="products-section">
        <div className="container">

          {loading && (
            <div className="loading-grid">
              {[...Array(9)].map((_, i) => <div key={i} className="skeleton-card" />)}
            </div>
          )}

          {error && !loading && (
            <div className="empty-state">
              <div className="empty-state-icon">⚠️</div>
              <h3>Failed to load products</h3>
              <p>{error}</p>
              <button className="btn btn-outline" onClick={load}>Try Again</button>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">📦</div>
              <h3>{search ? 'No results found' : 'No products yet'}</h3>
              <p>{search ? `Nothing matched "${search}". Try a different search.` : 'Start building your catalogue by adding the first product.'}</p>
              {isAuthenticated && !search && (
                <button className="btn btn-primary" onClick={openAddForm}>
                  Add First Product
                </button>
              )}
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <>
              <div className="product-grid">
                {products.map((p, i) => (
                  <ProductCard
                    key={p._id}
                    product={p}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    index={i}
                  />
                ))}
              </div>
              {renderPagination()}
            </>
          )}

        </div>
      </section>

      {showForm && (
        <ProductForm
          product={editProduct}
          onSubmit={handleSubmitForm}
          onClose={handleCloseForm}
          loading={formLoading}
        />
      )}
    </div>
  );
};

export default Home;
