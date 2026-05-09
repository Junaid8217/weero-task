import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import ProductForm from '../components/ProductForm';
import toast from 'react-hot-toast';
import './Home.css';

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Newest First', order: 'desc' },
  { value: 'createdAt', label: 'Oldest First', order: 'asc' },
  { value: 'price', label: 'Price: Low to High', order: 'asc' },
  { value: 'price', label: 'Price: High to Low', order: 'desc' },
  { value: 'name', label: 'Name A–Z', order: 'asc' },
];

const CATEGORIES = ['', 'Electronics', 'Clothing', 'Books', 'Food & Drink', 'Home & Garden', 'Sports', 'Other'];

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { products, pagination, loading, error, fetchProducts, createProduct, updateProduct, deleteProduct } = useProducts();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortIdx, setSortIdx] = useState(0);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const sort = SORT_OPTIONS[sortIdx];

  const load = useCallback(() => {
    fetchProducts({
      search,
      category,
      page,
      sortBy: sort.value,
      order: sort.order,
      limit: 9,
    });
  }, [search, category, page, sort.value, sort.order, fetchProducts]);

  useEffect(() => {
    load();
  }, [load]);

  // Debounce search
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSortIdx(Number(e.target.value));
    setPage(1);
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditProduct(null);
  };

  const handleDelete = async (id) => {
    const result = await deleteProduct(id);
    if (result.success) {
      toast.success('Product deleted');
      load();
    } else {
      toast.error(result.message);
    }
  };

  const handleSubmitForm = async (formData) => {
    setFormLoading(true);
    let result;
    if (editProduct) {
      result = await updateProduct(editProduct._id, formData);
    } else {
      result = await createProduct(formData);
    }
    setFormLoading(false);

    if (result.success) {
      toast.success(editProduct ? 'Product updated!' : 'Product created!');
      handleCloseForm();
      load();
    } else {
      toast.error(result.message);
    }
  };

  const renderPagination = () => {
    if (pagination.pages <= 1) return null;
    const pages = [];
    for (let i = 1; i <= pagination.pages; i++) {
      pages.push(
        <button
          key={i}
          className={`page-btn ${i === pagination.page ? 'active' : ''}`}
          onClick={() => setPage(i)}
        >
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
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-inner">
            <div className="hero-badge badge badge-accent">Product Catalogue</div>
            <h1 className="hero-title">
              Discover<br />
              <span className="hero-title-accent">Amazing Products</span>
            </h1>
            <p className="hero-subtitle">Browse, manage, and organize your product inventory with ease.</p>
            {isAuthenticated && (
              <button className="btn btn-primary" onClick={() => { setEditProduct(null); setShowForm(true); }}>
                <span>＋</span> Add Product
              </button>
            )}
          </div>
        </div>
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
      </section>

      {/* Filters */}
      <section className="filters-section">
        <div className="container">
          <div className="filters-bar">
            <div className="search-wrap">
              <span className="search-icon">⌕</span>
              <input
                type="text"
                className="form-input search-input"
                placeholder="Search products…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              {searchInput && (
                <button className="search-clear" onClick={() => setSearchInput('')}>✕</button>
              )}
            </div>

            <select className="form-select filter-select" value={category} onChange={handleCategoryChange}>
              <option value="">All Categories</option>
              {CATEGORIES.filter(Boolean).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select className="form-select filter-select" value={sortIdx} onChange={handleSortChange}>
              {SORT_OPTIONS.map((s, i) => (
                <option key={i} value={i}>{s.label}</option>
              ))}
            </select>
          </div>

          {pagination.total > 0 && (
            <p className="results-count">
              {pagination.total} product{pagination.total !== 1 ? 's' : ''} found
            </p>
          )}
        </div>
      </section>

      {/* Products */}
      <section className="products-section">
        <div className="container">
          {loading && (
            <div className="loading-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton-card" />
              ))}
            </div>
          )}

          {error && !loading && (
            <div className="empty-state">
              <div className="empty-state-icon">⚠</div>
              <h3>Failed to load products</h3>
              <p>{error}</p>
              <button className="btn btn-outline" onClick={load}>Try Again</button>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">📦</div>
              <h3>No products found</h3>
              <p>{search ? `No results for "${search}"` : 'Start by adding your first product.'}</p>
              {isAuthenticated && !search && (
                <button className="btn btn-primary" onClick={() => { setEditProduct(null); setShowForm(true); }}>
                  Add Product
                </button>
              )}
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <>
              <div className="product-grid">
                {products.map((p) => (
                  <ProductCard
                    key={p._id}
                    product={p}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
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
