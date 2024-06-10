import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  Select,
  Tag,
  Spin,
  Modal,
  notification,
} from "antd";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, updateOrderStatus } from "../../features/auth/authSlice";
import { toast } from "react-toastify";
import { DownloadOutlined, ReloadOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Search } = Input;

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

const Orders = () => {
  const dispatch = useDispatch();
  const [filteredData, setFilteredData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filterStatus, setFilterStatus] = useState(null);

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleEditClick = () => {
    if (selectedRowKeys.length === 0) {
      toast.error("No order is selected", {
        autoClose: 3000,
        position: "bottom-right",
      });
      notification.error({
        message: "No order is selected",
        description: "Please select an order to edit.",
      });
      return;
    }
    setEditingOrderId(selectedRowKeys[0]);
    setIsModalVisible(true);
  };

  const handleUpdateStatus = () => {
    const orderToUpdate = filteredData.find(
      (order) => order.order_id === editingOrderId
    );

    if (orderToUpdate) {
      if (orderToUpdate.order_status === "Cancelled") {
        toast.error("Cannot update the status that is Cancelled", {
          autoClose: 3000,
        });
      } else {
        dispatch(
          updateOrderStatus({
            order_id: editingOrderId,
            status: selectedStatus,
          })
        ).then(() => {
          toast.success(`Update order #${editingOrderId} successfully`, {
            autoClose: 3000,
          });
          setLoading(true);
          setSearchQuery("");
          setFilterStatus(null);
          dispatch(fetchOrders()).then(() => {
            setLoading(false);
            setIsModalVisible(false);
          });
        });
      }
    }
  };

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const orderState = useSelector((state) => state.auth.orders || []);

  useEffect(() => {
    setFilteredData(orderState);
    setLoading(false);
  }, [orderState]);

  const data = filteredData.map((order) => ({
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
  }));

  const handleSearch = (value) => {
    setSearchQuery(value);
    setLoading(true);
    setTimeout(() => {
      if (value) {
        const filtered = orderState.filter((item) => {
          const fullName =
            `${item.User.first_name} ${item.User.last_name}`.toLowerCase();
          return (
            fullName.includes(value.toLowerCase()) ||
            item.User.email.toLowerCase().includes(value.toLowerCase()) ||
            item.User.phone_number
              .toLowerCase()
              .includes(value.toLowerCase()) ||
            item.order_payment_status
              .toLowerCase()
              .includes(value.toLowerCase()) ||
            item.order_status.toLowerCase().includes(value.toLowerCase())
          );
        });
        setFilteredData(filtered);
      } else {
        setFilteredData(orderState);
      }
      setLoading(false);
    }, 1000);
  };

  const handleFilterStatus = (value) => {
    setFilterStatus(value);
    setLoading(true);
    setTimeout(() => {
      if (value) {
        const filtered = orderState.filter(
          (item) =>
            item.order_status === value || item.order_payment_status === value
        );
        setFilteredData(filtered);
      } else {
        setFilteredData(orderState);
      }
      setLoading(false);
    }, 1000);
  };

  const onSelectedRowKeysChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const handleRowClick = (record) => {
    const selectedKey = record.key;
    setSelectedRowKeys([selectedKey]);
  };

  const handleReload = () => {
    setLoading(true);
    setSearchQuery("");
    setFilterStatus(null);
    setSelectedRowKeys([]);
    dispatch(fetchOrders()).then(() => setLoading(false));
  };

  const handleExportCSV = () => {
    const headers = [
      "Order Id",
      "Customer",
      "Total Amount",
      "Payment Method",
      "Discount Amount",
      "Shipping Amount",
      "Payment Status",
      "Status",
      "Created At",
    ];
    const rows = filteredData.map((order) => [
      order.order_id,
      `${order.User.first_name} ${order.User.last_name}`,
      `${order.order_final_price.toLocaleString()}đ`,
      order.order_payment_method,
      `${order.order_discount_amount.toLocaleString()} đ`,
      `${order.order_shipping_price.toLocaleString()} đ`,
      order.order_payment_status,
      order.order_status,
      formatDate(order.createdAt),
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const rowSelection = {
    selectedRowKeys,
    type: "radio",
    onChange: onSelectedRowKeysChange,
  };

  return (
    <div>
      <h3 className="mb-4 title">Orders</h3>
      <div className="card-header">
        <div className="w-100 justify-content-between d-flex flex-wrap align-items-center gap-1">
          <div className="d-flex flex-wrap flex-md-nowrap align-items-center gap-1">
            {/* Edit */}
            <Select
              size="large"
              placeholder="Edit"
              style={{ width: 100 }}
              allowClear
              onSelect={handleEditClick}
            >
              <Option value="status">Status</Option>
            </Select>
            <Modal
              title="Edit Order Status"
              open={isModalVisible}
              onOk={handleUpdateStatus}
              onCancel={() => setIsModalVisible(false)}
              centered
            >
              <Select
                placeholder="Select New Status"
                onChange={(value) => setSelectedStatus(value)}
                value={selectedStatus || undefined}
                style={{ width: 150 }}
              >
                <Option value="Confirmed">Confirmed</Option>
                <Option value="Pending">Pending</Option>
                <Option value="Cancelled">Cancelled</Option>
              </Select>
            </Modal>
            {/* Filter */}
            <Select
              size="large"
              placeholder="Filter by Status"
              style={{ width: 150 }}
              allowClear
              value={filterStatus || undefined}
              onChange={handleFilterStatus}
            >
              <Option value="Confirmed">Confirmed</Option>
              <Option value="Pending">Pending</Option>
              <Option value="Cancelled">Cancelled</Option>
              <Option value="Unpaid">Unpaid</Option>
              <Option value="Paid">Paid</Option>
            </Select>
            {/* Search */}
            <Search
              size="large"
              placeholder="Search Orders"
              onSearch={handleSearch}
              style={{ width: 300 }}
              enterButton
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="d-flex align-items-center gap-1">
            <Button
              icon={<DownloadOutlined />}
              size="large"
              onClick={handleExportCSV}
            >
              Export
            </Button>
            <Button
              size="large"
              icon={<ReloadOutlined />}
              onClick={handleReload}
            >
              Reload
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "400px" }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          rowSelection={rowSelection}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Orders;
