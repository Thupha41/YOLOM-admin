import React, { useState, useEffect } from "react";
import { Column } from "@ant-design/plots";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { BsBoxSeam } from "react-icons/bs";
import { FaUserFriends } from "react-icons/fa";
import { FiShoppingBag } from "react-icons/fi";
import { Table, Tag } from "antd";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../features/auth/authSlice";

const columns = [
  {
    title: "Order Id",
    dataIndex: "key",
  },
  {
    title: "Customer",
    dataIndex: "customer",
  },
  {
    title: "Total Amount",
    dataIndex: "amount",
  },
  {
    title: "Payment Method",
    dataIndex: "payment",
  },
  {
    title: "Discount Amount",
    dataIndex: "discountAmount",
  },
  {
    title: "Shipping Amount",
    dataIndex: "shippingAmount",
  },
  {
    title: "Payment Status",
    dataIndex: "paymentStatus",
    render: (paymentStatus) => {
      let color;
      if (paymentStatus === "Cancelled") {
        color = "volcano";
      } else if (paymentStatus === "Unpaid") {
        color = "gray";
      } else if (paymentStatus === "Paid") {
        color = "green";
      }
      return (
        <Tag color={color} key={paymentStatus}>
          {paymentStatus.toUpperCase()}
        </Tag>
      );
    },
  },
  {
    title: "Status",
    dataIndex: "status",
    sorter: (a, b) => a.status.length - b.status.length,
    render: (status) => {
      let color;
      if (status === "Cancelled") {
        color = "volcano";
      } else if (status === "Confirmed") {
        color = "green";
      } else if (status === "Pending") {
        color = "gray";
      }
      return (
        <Tag color={color} key={status}>
          {status.toUpperCase()}
        </Tag>
      );
    },
  },
  {
    title: "Created At",
    dataIndex: "date",
  },
  {
    title: "Operations",
    dataIndex: "action",
  },
];

const Dashboard = () => {
  const dispatch = useDispatch();
  const [filteredData, setFilteredData] = useState([]);

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const orderState = useSelector((state) => state.auth.orders || []);

  useEffect(() => {
    setFilteredData(orderState);
  }, [orderState]);

  const data =
    filteredData.length > 0
      ? filteredData.map((order) => ({
          key: order.order_id,
          customer: (
            <div>
              <div className="fw-bold">{`${order.User.first_name} ${order.User.last_name}`}</div>
              <div>{order.User.email}</div>
              <div>{order.User.phone_number}</div>
            </div>
          ),
          amount: `${order.order_final_price.toLocaleString()}đ`,
          payment: order.order_payment_method,
          discountAmount: `${order.order_discount_amount.toLocaleString()} đ`,
          shippingAmount: `${order.order_shipping_price.toLocaleString()} đ`,
          paymentStatus: order.order_payment_status,
          status: order.order_status,
          date: formatDate(order.createdAt),
          action: (
            <div className="d-flex flex-column">
              <Link
                to={`/admin/orders/${order.order_id}`}
                className="fs-3 text-primary"
              >
                <FaEye />
              </Link>
            </div>
          ),
        }))
      : [];

  const dataSale = [
    {
      type: "Jan",
      sales: 38,
    },
    {
      type: "Feb",
      sales: 52,
    },
    {
      type: "Mar",
      sales: 61,
    },
    {
      type: "Apr",
      sales: 145,
    },
    {
      type: "May",
      sales: 48,
    },
    {
      type: "Jun",
      sales: 38,
    },
    {
      type: "July",
      sales: 38,
    },
    {
      type: "Aug",
      sales: 38,
    },
    {
      type: "Sept",
      sales: 38,
    },
    {
      type: "Oct",
      sales: 38,
    },
    {
      type: "Nov",
      sales: 38,
    },
    {
      type: "Dec",
      sales: 38,
    },
  ];
  const config = {
    data: dataSale,
    xField: "type",
    yField: "sales",
    color: ({ type }) => {
      return "#ffd333";
    },
    label: {
      style: {
        fill: "#FFFFFF",
        opacity: 1,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: {
        alias: "Month",
      },
      sales: {
        alias: "Income",
      },
    },
  };

  return (
    <div>
      <h3 className="mb-4 title">Dashboard</h3>
      <h4 className="mb-4 title">Overview</h4>
      <div className="d-flex justify-content-between align-items-center gap-3 mb-4">
        <div className="text-white d-flex justify-content-between align-items-end flex-grow-1 p-3 rounded-3 bg-primary bg-gradient">
          <div>
            <p className="desc">Total Earnings</p>
            <h4 className="mb-0 sub-title">$1100</h4>
          </div>
          <div className="d-flex flex-column align-items-end">
            <h1>
              <RiMoneyDollarCircleFill />
            </h1>
          </div>
        </div>
        <div className="text-white d-flex justify-content-between align-items-end flex-grow-1 p-3 rounded-3 bg-danger bg-gradient">
          <div>
            <p className="desc">Total Orders</p>
            <h4 className="mb-0 sub-title">1100</h4>
          </div>
          <div className="d-flex flex-column align-items-end">
            <h1>
              <FiShoppingBag />
            </h1>
          </div>
        </div>
        <div className="text-white d-flex justify-content-between align-items-end flex-grow-1 bg-success bg-gradient p-3 rounded-3">
          <div>
            <p className="desc">Total Customers</p>
            <h4 className="mb-0 sub-title">1100</h4>
          </div>
          <div className="d-flex flex-column align-items-end">
            <h1>
              <FaUserFriends />
            </h1>
          </div>
        </div>
        <div className="text-white d-flex justify-content-between align-items-end flex-grow-1 bg-info bg-gradient p-3 rounded-3">
          <div>
            <p className="desc">Total Products</p>
            <h4 className="mb-0 sub-title">1100</h4>
          </div>
          <div className="d-flex flex-column align-items-end">
            <h1>
              <BsBoxSeam />
            </h1>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="mb-4 title">Income Statics</h4>
        <div>
          <Column {...config} />
        </div>
      </div>
      <div className="mt-4">
        <h3 className="mb-5 title">Recent Orders</h3>
        <div>
          <Table columns={columns} dataSource={data} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
