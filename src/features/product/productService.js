// productService.js
import axios from "axios";
import { base_url } from "../../utils/baseUrl";

const getProducts = async () => {
  const response = await axios.get(
    `${base_url}web/products/?limit=170&offset=0`
  );
  return response.data.metadata;
};

const createProduct = async (formData) => {
  const response = await axios.post(`${base_url}admin/products`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.metadata;
};

const productService = {
  getProducts,
  createProduct,
};

export default productService;
