import commonAPI from "./CommonAPI";
import { SERVER_URL } from "./SERVERURL";

// Fetch  from DummyJSON
export const fetchProductsAPI = async (limit = 30) => {
  return await commonAPI("GET", `https://dummyjson.com/products?limit=${limit}`);
};

// Save product to MongoDB
export const saveProductAPI = async (reqBody) => {
  const token = localStorage.getItem('token');
  return await commonAPI("POST", `${SERVER_URL}/api/products/save`, reqBody, {
    Authorization: `Bearer ${token}`
  });
};

// Get saved products
export const getSavedProductsAPI = async () => {
  const token = localStorage.getItem('token');
  return await commonAPI("GET", `${SERVER_URL}/api/products/saved`, "", {
    Authorization: `Bearer ${token}`
  });
};

// Remove saved product
export const removeSavedProductAPI = async (productId) => {
  const token = localStorage.getItem('token');
  return await commonAPI("DELETE", `${SERVER_URL}/api/products/saved/${productId}`, "", {
    Authorization: `Bearer ${token}`
  });
};
