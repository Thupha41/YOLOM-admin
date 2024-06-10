import axios from "axios";
import { base_url } from "../../utils/baseUrl";

const getCatalogues = async () => {
  const response = await axios.get(`${base_url}admin/catalogues`);
  return response.data.metadata;
};

const createCatalogue = async (cat) => {
  const response = await axios.post(`${base_url}admin/catalogues`, cat);
  return response.data.metadata;
};

const updateCatalogue = async (cat) => {
  const { id, ...CatalogueData } = cat;
  const response = await axios.put(
    `${base_url}admin/catalogues/${id}`,
    CatalogueData
  );
  return response.data.metadata;
};

const deleteCatalogue = async (id) => {
  const response = await axios.delete(`${base_url}admin/catalogues/${id}`);
  return response.data.metadata;
};

const catalogueService = {
  getCatalogues,
  createCatalogue,
  updateCatalogue,
  deleteCatalogue,
};

export default catalogueService;
