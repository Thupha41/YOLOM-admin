import React, { useEffect, useState } from "react";
import { Table, Button, Select, Input, Spin } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteTag, getTags, resetState } from "../../features/tag/tagSlice";
import CustomModal from "../../Components/CustomModal";
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
    title: "Label",
    dataIndex: "label",
    render: (label) => (
      <img src={label} alt="Brand" style={{ width: 50, height: 50 }} />
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

const TagList = () => {
  const [open, setOpen] = useState(false);
  const [tagId, setTagId] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const showModal = (id) => {
    setOpen(true);
    setTagId(id);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const dispatch = useDispatch();
  const tagState = useSelector((state) => state.tag.tags || []);
  useEffect(() => {
    dispatch(resetState());
    dispatch(getTags());
  }, [dispatch]);

  useEffect(() => {
    setFilteredData(tagState);
    setLoading(false);
  }, [tagState]);

  const handleSearch = (value) => {
    setSearchQuery(value);
    setLoading(true);
    setTimeout(() => {
      if (value) {
        const filtered = tagState.filter((tag) =>
          tag.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
      } else {
        setFilteredData(tagState);
      }
      setLoading(false);
    }, 1000);
  };

  const handleReload = () => {
    setLoading(true);
    setSearchQuery("");
    dispatch(getTags()).then(() => setLoading(false));
  };

  const onSelectedRowKeysChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectedRowKeysChange,
  };

  const data1 = filteredData.map((tag, index) => ({
    key: index + 1,
    name: tag.name,
    label: tag.label,
    action: (
      <>
        <Link to={`/admin/tag/${tag.id}`} className="fs-3 text-primary">
          <BiEdit />
        </Link>
        <button
          className="ms-3 fs-3 text-danger bg-transparent border-0"
          onClick={() => showModal(tag.id)}
        >
          <AiFillDelete />
        </button>
      </>
    ),
  }));

  const deleteTagAction = (id) => {
    dispatch(deleteTag(id));
    setOpen(false);
    setTimeout(() => {
      dispatch(getTags());
    }, 100);
  };

  return (
    <div>
      <h3 className="mb-4 title">Tags</h3>
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
              placeholder="Search Tags"
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
              onClick={() => (window.location.href = "/create-tag")}
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
        performAction={() => deleteTagAction(tagId)}
        title="Are you sure you want to delete this tag?"
      />
    </div>
  );
};

export default TagList;
