import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Select,
  Input,
  Tag,
  Spin,
  Modal,
  notification,
} from "antd";
import CustomInput from "../Components/CustomInput";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../features/product/productSlice";
import { Link } from "react-router-dom";
import formatCurrency from "../utils/formatCurrency";
import { toast } from "react-toastify";
import {
  DownloadOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

const { Option } = Select;
const { Search } = Input;

const columns = [
  {
    title: "No",
    dataIndex: "key",
  },
  {
    title: "Image",
    dataIndex: "image",
    render: (image) => (
      <img src={image} alt="Product" style={{ width: 50, height: 50 }} />
    ),
  },
  {
    title: "Brand",
    dataIndex: "brand",
    sorter: (a, b) => a.brand.length - b.brand.length,
  },
  {
    title: "Title",
    dataIndex: "title",
    sorter: (a, b) => a.title.length - b.title.length,
  },
  {
    title: "SKU",
    dataIndex: "sku",
  },
  {
    title: "Status",
    dataIndex: "status",
    sorter: (a, b) => a.status.length - b.status.length,
    render: (status) => {
      let color = "green";
      if (status === "Out of stock") {
        color = "volcano";
      }
      return (
        <Tag color={color} key={status}>
          {status.toUpperCase()}
        </Tag>
      );
    },
  },
  {
    title: "Category",
    dataIndex: "category",
    sorter: (a, b) => a.category.length - b.category.length,
  },
  {
    title: "Color",
    dataIndex: "color",
    render: (color) => (
      <span
        style={{
          display: "inline-block",
          width: 20,
          height: 20,
          borderRadius: "50%",
          backgroundColor: color,
          border: color.toLowerCase() === "white" ? "2px solid black" : "none",
        }}
      ></span>
    ),
  },
  {
    title: "Size",
    dataIndex: "size",
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
  },
  {
    title: "Price",
    dataIndex: "price",
    sorter: (a, b) => a.price - b.price,
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const ProductList = () => {
  const dispatch = useDispatch();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [importProductId, setImportProductId] = useState(null);
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const productState = useSelector((state) => state.product?.products || []);

  useEffect(() => {
    setFilteredData(productState);
    setLoading(false);
  }, [productState]);

  const handleSearch = (value) => {
    setSearchQuery(value);
    filterData(value, statusFilter);
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
    setImportProductId(selectedRowKeys[0]);
    setIsModalVisible(true);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    filterData(searchQuery, value);
  };

  const filterData = (search, brand) => {
    setLoading(true);
    setTimeout(() => {
      let filtered = productState;
      if (search) {
        filtered = filtered.filter(
          (product) =>
            product.Product.product_name
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            product.sku_no.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (brand) {
        filtered = filtered.filter(
          (product) => product.Product.Brand.name === brand
        );
      }
      setFilteredData(filtered);
      setLoading(false);
    }, 1000);
  };

  const handleReload = () => {
    setLoading(true);
    setSearchQuery("");
    setStatusFilter("");
    dispatch(getProducts()).then(() => setLoading(false));
  };

  const handleExportCSV = () => {
    const headers = [
      "No",
      "Image",
      "SKU",
      "Brand",
      "Title",
      "Status",
      "Category",
      "Color",
      "Size",
      "Quantity",
      "Price",
    ];
    const rows = filteredData.map((product, index) => [
      index + 1,
      product.sku_image?.[0] || "N/A",
      product.sku_no,
      product.Product?.Brand?.name || "N/A",
      product.Product?.product_name || "N/A",
      product.Product?.product_status || "Out of stock",
      product.Product?.Catalogue?.name || "N/A",
      product.sku_color || "N/A",
      product.sku_size,
      product.Product?.product_quantity !== undefined
        ? product.Product.product_quantity === 0
          ? product.sku_quantity || 0
          : product.Product.product_quantity
        : product.sku_quantity || 0,
      `${formatCurrency(product.Product?.product_price) || 0}đ`,
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "products.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onSelectedRowKeysChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectedRowKeysChange,
  };

  const data1 = filteredData.map((product, index) => ({
    key: index + 1,
    image: product.sku_image?.[0] || "N/A",
    sku: product.sku_no,
    brand: product.Product?.Brand?.name || "N/A",
    title: product.Product?.product_name || "N/A",
    status: product.Product?.product_status || "Out of stock",
    category: product.Product?.Catalogue?.name || "N/A",
    color: product.sku_color || "N/A",
    size: product.sku_size,
    // quantity:
    //   product.Product?.product_quantity !== undefined
    //     ? product.Product.product_quantity === 0
    //       ? product.sku_quantity || 0
    //       : product.Product.product_quantity
    //     : product.sku_quantity || 0,
    quantity: product.sku_quantity || 0,
    price: `${formatCurrency(product.Product?.product_price) || 0}đ`,
    action: (
      <div className="d-flex flex-column">
        <Link className=" fs-3 text-danger" to="/">
          <AiFillDelete />
        </Link>
      </div>
    ),
  }));

  return (
    <div>
      <h3 className="mb-4 title">Products</h3>
      <div className="card-header">
        <div className="w-100 justify-content-between d-flex flex-wrap align-items-center gap-1">
          <div className="d-flex flex-wrap flex-md-nowrap align-items-center gap-1">
            {/* Edit */}
            <Select
              size="large"
              placeholder="Bulk action"
              style={{ width: 120 }}
              allowClear
              onSelect={handleEditClick}
            >
              <Option value="status">Import</Option>
            </Select>
            <Modal
              title="Import Product"
              visible={isModalVisible}
              // onOk={handleUpdateStatus}
              onCancel={() => setIsModalVisible(false)}
              centered
            >
              <CustomInput
                type="text"
                label="Enter Quantity"
                name="title"
                // onChng={formik.handleChange}
                // onBlr={formik.handleBlur}
                // val={formik.values.title}
              />
              <CustomInput
                type="text"
                label="Enter Product Name"
                name="title"
                // onChng={formik.handleChange}
                // onBlr={formik.handleBlur}
                // val={formik.values.title}
              />
            </Modal>
            <Select
              size="large"
              placeholder="Filter by Brand"
              style={{ width: 200 }}
              allowClear
              value={statusFilter || undefined}
              onChange={handleStatusChange}
            >
              <Option value="BANANA_REPUBLIC">Banana Republic</Option>
              <Option value="FILA">FILA</Option>
              <Option value="MANGO">Mango</Option>
              <Option value="O21_CTTT">O21 CTTT</Option>
              <Option value="GAP">GAP</Option>
              <Option value="COTTON ON">Cotton On</Option>
              <Option value="LEVI'S">Levi's</Option>
              <Option value="MLB">MLB</Option>
            </Select>
            <Search
              size="large"
              placeholder="Search Products"
              onSearch={handleSearch}
              style={{ width: 300 }}
              enterButton
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="d-flex align-items-center gap-1">
            <Button
              type="primary"
              size="large"
              onClick={() => (window.location.href = "/admin/add-product")}
              style={{ width: 100 }}
              icon={<PlusOutlined />}
            >
              Create
            </Button>
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

      <div>
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
            dataSource={data1}
            rowSelection={rowSelection}
          />
        )}
      </div>
    </div>
  );
};

export default ProductList;
