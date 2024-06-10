// CatalogueList.js
import React, { useEffect, useState } from "react";
import { Table, Button, Select, Input, Spin } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCatalogue,
  getCatalogues,
  resetState,
} from "../features/catalogue/catalogueSlice";
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

const CatalogueList = () => {
  const [open, setOpen] = useState(false);
  const [catalogueId, setCatalogueId] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const showModal = (id) => {
    setOpen(true);
    setCatalogueId(id);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const dispatch = useDispatch();
  const catalogueState = useSelector(
    (state) => state.catalogue.catalogues || []
  );
  useEffect(() => {
    dispatch(resetState());
    dispatch(getCatalogues());
  }, [dispatch]);

  useEffect(() => {
    setFilteredData(catalogueState);
    setLoading(false);
  }, [catalogueState]);

  const handleSearch = (value) => {
    setSearchQuery(value);
    setLoading(true);
    setTimeout(() => {
      if (value) {
        const filtered = catalogueState.filter((cat) =>
          cat.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
      } else {
        setFilteredData(catalogueState);
      }
      setLoading(false);
    }, 1000);
  };

  const handleReload = () => {
    setLoading(true);
    setSearchQuery("");
    dispatch(getCatalogues()).then(() => setLoading(false));
  };

  const onSelectedRowKeysChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectedRowKeysChange,
  };

  const data1 = filteredData.map((cat, index) => ({
    key: index + 1,
    logo: cat.logo || "https://via.placeholder.com/50",
    name: cat.name,
    action: (
      <>
        <Link
          to={`/admin/brand/${cat.catalogue_id}`}
          className="fs-3 text-primary"
        >
          <BiEdit />
        </Link>
        <button
          className="ms-3 fs-3 text-danger bg-transparent border-0"
          onClick={() => showModal(cat.catalogue_id)}
        >
          <AiFillDelete />
        </button>
      </>
    ),
  }));

  const deleteCatalogueHandler = (id) => {
    dispatch(deleteCatalogue(id));
    setOpen(false);
    setTimeout(() => {
      dispatch(getCatalogues());
    }, 100);
  };

  return (
    <div>
      <h3 className="mb-4 title">Catalogues</h3>
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
              onClick={() => (window.location.href = "/create-catalogue")}
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
        performAction={() => deleteCatalogueHandler(catalogueId)}
        title="Are you sure you want to delete this catalogue?"
      />
    </div>
  );
};

export default CatalogueList;
