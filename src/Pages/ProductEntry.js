import React, { useEffect, useState } from "react";
import { Table, Space, Button, Select, Input } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
// import { getProducts } from "../features/product/productSlice";

const { Option } = Select;
const { Search } = Input;

const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Title",
    dataIndex: "title",
    sorter: (a, b) => a.title.length - b.title.length,
  },
  {
    title: "Brand",
    dataIndex: "brand",
    sorter: (a, b) => a.brand.length - b.brand.length,
  },
  {
    title: "Category",
    dataIndex: "category",
    sorter: (a, b) => a.category.length - b.category.length,
  },
  {
    title: "Color",
    dataIndex: "color",
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

const ProductEntry = () => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // dispatch(getProducts());
  }, [dispatch]);

  // Mock data for illustration purposes
  const productState = [
    {
      title: "Product 1",
      brand: "Brand A",
      category: "Category 1",
      color: "Red",
      price: 100,
    },
    {
      title: "Product 2",
      brand: "Brand B",
      category: "Category 2",
      color: "Blue",
      price: 200,
    },
    // Add more mock products here
  ];

  const handleFilterChange = (value) => {
    setFilter(value);
  };

  const handleSearch = (value) => {
    setSearch(value);
  };

  const data1 = productState
    .filter((item) => {
      if (!filter) return true;
      // Implement your filter logic here
      return true;
    })
    .filter((item) => {
      if (!search) return true;
      return item.title.toLowerCase().includes(search.toLowerCase());
    })
    .map((product, index) => ({
      key: index + 1,
      title: product.title,
      brand: product.brand,
      category: product.category,
      color: product.color,
      price: `${product.price}`,
      action: (
        <>
          <Link to="/" className="fs-3 text-danger">
            <BiEdit />
          </Link>
          <Link className="ms-3 fs-3 text-danger" to="/">
            <AiFillDelete />
          </Link>
        </>
      ),
    }));

  return (
    <div>
      <h3 className="mb-4 title">Product Entry</h3>
      <Space style={{ marginBottom: 16 }}>
        <Select
          placeholder="Filter by Status"
          style={{ width: 200 }}
          onChange={handleFilterChange}
          allowClear
        >
          <Option value="Completed">Completed</Option>
          <Option value="Pending">Pending</Option>
        </Select>
        <Search
          placeholder="Search Customer"
          onSearch={handleSearch}
          style={{ width: 200 }}
          enterButton
        />
        <Button
          type="primary"
          onClick={() => (window.location.href = "/create-order")}
        >
          Create
        </Button>
        <Button onClick={() => window.location.reload()}>Reload</Button>
        <Button onClick={() => console.log("Export to CSV")}>Export</Button>
      </Space>
      <Table columns={columns} dataSource={data1} />
    </div>
  );
};

export default ProductEntry;
