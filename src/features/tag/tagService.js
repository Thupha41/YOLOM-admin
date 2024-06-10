import axios from "axios";
import { base_url } from "../../utils/baseUrl";

const getTags = async () => {
  const response = await axios.get(`${base_url}admin/tags`);
  return response.data.metadata;
};

const createTag = async (tag) => {
  const response = await axios.post(`${base_url}admin/tags`, tag);
  return response.data.metadata;
};

const updateTag = async (tag) => {
  const { id, ...tagData } = tag;
  const response = await axios.put(`${base_url}admin/tags/${id}`, tagData);
  return response.data.metadata;
};

const deleteTag = async (id) => {
  const response = await axios.delete(`${base_url}admin/tags/${id}`);
  return response.data.metadata;
};

const tagService = {
  getTags,
  createTag,
  updateTag,
  deleteTag,
};

export default tagService;
