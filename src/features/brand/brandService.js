import axios from "axios";
import { base_url } from "../../utils/baseUrl";

const getBrands = async () => {
  const response = await axios.get(`${base_url}admin/brands`);
  return response.data.metadata;
};

const getBrand = async (id) => {
  const response = await axios.get(`${base_url}admin/brands/${id}`);
  return response.data.metadata;
};

const createBrand = async (brand) => {
  const response = await axios.post(`${base_url}admin/brands`, brand);
  return response.data.metadata;
};

const updateBrand = async (brand) => {
  const { id, ...brandData } = brand;
  const response = await axios.put(`${base_url}admin/brands/${id}`, brandData);
  return response.data.metadata;
};

const deleteBrand = async (id) => {
  const response = await axios.delete(`${base_url}admin/brands/${id}`);
  return response.data.metadata;
};

const brandService = {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
};

export default brandService;
