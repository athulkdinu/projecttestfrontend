import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchProductsAPI, saveProductAPI, getSavedProductsAPI } from '../services/api';
import { Container, Row, Col, Card, Button, Spinner, Form, Badge } from 'react-bootstrap';

function Inventory() {
  const [products, setProducts] = useState([]);
  const [savedProducts, setSavedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    loadProducts();
    loadSavedProducts();
  }, [navigate]);

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    const result = await fetchProductsAPI(30);
    
    if (result && result.status === 200) {
      setProducts(result.data.products);
    } else {
      setError('Failed to load products');
    }
    setLoading(false);
  };

  const loadSavedProducts = async () => {
    const result = await getSavedProductsAPI();
    if (result && result.status === 200) {
      setSavedProducts(result.data);
    }
  };

  const isProductSaved = (productId) => {
    return savedProducts.some(p => p.productId === productId);
  };

  const handleSave = async (product) => {
    if (!isAuthenticated()) {
      alert('Please login to save products');
      return;
    }

    if (isProductSaved(product.id)) {
      return;
    }

    const productData = {
      productId: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail
    };

    const result = await saveProductAPI(productData);
    
    if (result && result.status === 201) {
      loadSavedProducts();
    } else {
      alert(result?.data?.message || 'Failed to save product');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const userEmail = localStorage.getItem('userEmail') || 'admin@enterprise.io';

  return (
    <Container fluid className="d-flex min-vh-100 bg-dark text-white p-0">
      {/* Sidebar */}
      <div className="bg-black p-4 d-flex flex-column" style={{ width: '250px' }}>
        <div className="mb-5">
          <div className="bg-white text-dark px-3 py-2 fw-bold d-inline-block rounded">
            STORE.CO
          </div>
        </div>
        
        <nav className="flex-grow-1">
          <div className="d-flex align-items-center gap-3 p-3 mb-2 rounded bg-secondary fw-bold">
            <span>📦</span>
            <span>Inventory</span>
          </div>
          <Link to="/vault" className="d-flex align-items-center gap-3 p-3 mb-2 rounded text-white text-decoration-none">
            <span>🔒</span>
            <span>Vault [{savedProducts.length}]</span>
          </Link>
        </nav>

        <div className="mt-auto pt-4 border-top border-secondary">
          <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center fw-bold mb-3" style={{ width: '50px', height: '50px' }}>
            AD
          </div>
          <div className="mb-3">
            <div className="fw-bold mb-1">Admin User</div>
            <div className="text-secondary small">{userEmail}</div>
          </div>
          <Button variant="danger" className="w-100 fw-bold" onClick={handleLogout}>
            LOGOUT
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Container fluid className="flex-grow-1 p-4">
        <Row className="mb-4">
          <Col>
            <h1 className="fw-bold mb-2" style={{ fontSize: '36px' }}>INVENTORY</h1>
            <p className="text-secondary">Total items: {filteredProducts.length}</p>
          </Col>
          <Col xs="auto" className="d-flex align-items-center gap-3">
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control bg-dark text-white border-secondary"
              style={{ width: '250px' }}
            />
            <Badge bg="success" className="px-3 py-2">SYSTEM LIVE</Badge>
          </Col>
        </Row>

        <div style={{ minHeight: '400px' }}>
          {loading ? (
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '400px' }}>
              <Spinner animation="border" variant="light" className="mb-3" />
              <p className="text-secondary">Loading products...</p>
            </div>
          ) : error ? (
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '400px' }}>
              <p className="text-secondary">{error}</p>
              <Button variant="light" onClick={loadProducts} className="mt-3">
                Retry
              </Button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '400px' }}>
              <p className="text-secondary">No products found</p>
            </div>
          ) : (
            <Row>
              {filteredProducts.map((product) => (
                <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                  <Card className="bg-secondary text-white h-100">
                    <div className="position-relative" style={{ height: '200px', overflow: 'hidden' }}>
                      <Card.Img variant="top" src={product.thumbnail} alt={product.title} style={{ height: '100%', objectFit: 'cover' }} />
                      {isProductSaved(product.id) && (
                        <Badge bg="light" text="dark" className="position-absolute top-0 end-0 m-2">
                          Saved
                        </Badge>
                      )}
                    </div>
                    <Card.Body>
                      <Card.Title className="text-truncate">{product.title}</Card.Title>
                      <Card.Text className="fw-bold fs-5">${product.price.toFixed(2)}</Card.Text>
                      <Card.Text className="text-secondary small text-uppercase mb-3">{product.category}</Card.Text>
                      {!isProductSaved(product.id) && (
                        <Button
                          variant="dark"
                          className="w-100"
                          onClick={() => handleSave(product)}
                        >
                          Save
                        </Button>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </Container>
    </Container>
  );
}

export default Inventory;
