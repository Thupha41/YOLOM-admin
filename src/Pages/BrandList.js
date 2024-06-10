import React, { useEffect, useState } from "react";
import { Table, Button, Select, Input, Spin } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteABrand,
  getBrands,
  resetState,
} from "../features/brand/brandSlice";
import CustomModal from "../Components/CustomModal";
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
    title: "Logo",
    dataIndex: "logo",
    render: (logo) => (
      <img src={logo} alt="Brand" style={{ width: 50, height: 50 }} />
    ),
  },
  {
    title: "Name",
    dataIndex: "name",
    sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const BrandList = () => {
  const [open, setOpen] = useState(false);
  const [brandId, setBrandId] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const showModal = (id) => {
    setOpen(true);
    setBrandId(id);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const dispatch = useDispatch();
  const brandState = useSelector((state) => state.brand.brands || []);
  useEffect(() => {
    dispatch(resetState());
    dispatch(getBrands());
  }, [dispatch]);

  useEffect(() => {
    setFilteredData(brandState);
    setLoading(false);
  }, [brandState]);

  const handleSearch = (value) => {
    setSearchQuery(value);
    setLoading(true);
    setTimeout(() => {
      if (value) {
        const filtered = brandState.filter((brand) =>
          brand.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
      } else {
        setFilteredData(brandState);
      }
      setLoading(false);
    }, 1000);
  };

  const handleReload = () => {
    setLoading(true);
    setSearchQuery("");
    dispatch(getBrands()).then(() => setLoading(false));
  };

  const onSelectedRowKeysChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectedRowKeysChange,
  };

  const data1 = filteredData.map((brand, index) => ({
    key: index + 1,
    logo: brand.logo || "https://via.placeholder.com/50",
    name: brand.name,
    action: (
      <>
        <Link
          to={`/admin/brand/${brand.brand_id}`}
          className="fs-3 text-primary"
        >
          <BiEdit />
        </Link>
        <button
          className="ms-3 fs-3 text-danger bg-transparent border-0"
          onClick={() => showModal(brand.brand_id)}
        >
          <AiFillDelete />
        </button>
      </>
    ),
  }));

  const deleteBrand = (id) => {
    dispatch(deleteABrand(id));
    setOpen(false);
    setTimeout(() => {
      dispatch(getBrands());
    }, 100);
  };

  return (
    <div>
      <h3 className="mb-4 title">Brands</h3>
      <div className="card-header">
        <div className="w-100 justify-content-between d-flex flex-wrap align-items-center gap-1">
          <div className="d-flex flex-wrap flex-md-nowrap align-items-center gap-1">
            <Select
              size="large"
              placeholder="Filter by Status"
              style={{ width: 200 }}
              allowClear
            >
              <Option value="Completed">Completed</Option>
              <Option value="Pending">Pending</Option>
            </Select>
            <Search
              size="large"
              placeholder="Search Brands"
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
              onClick={() => (window.location.href = "/create-order")}
              style={{ width: 100 }}
              icon={<PlusOutlined />}
            >
              Create
            </Button>
            <Button
              icon={<DownloadOutlined />}
              size="large"
              onClick={() => console.log("Export to CSV")}
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
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => deleteBrand(brandId)}
        title="Are you sure you want to delete this brand?"
      />
    </div>
  );
};

export default BrandList;
