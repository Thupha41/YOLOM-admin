import axios from "axios";
import { config } from "../../utils/axiosConfig";
import { base_url } from "../../utils/baseUrl";

const getOrders = async () => {
  const responseOrderList = await axios.get(`${base_url}admin/orders`, config);
  return responseOrderList.data.metadata;
};
const getOrderByUser = async (order_id) => {
  const response = await axios.get(
    `${base_url}admin/orders/${order_id}`,
    "",
    config
  );

  return response.data.metadata;
};

const updateOrder = async (order_id, status) => {
  const response = await axios.put(`${base_url}admin/orders/${order_id}`, {
    status,
  });
  return response.data.metadata;
};
const authService = {
  getOrders,
  getOrderByUser,
  updateOrder,
};

export default authService;
