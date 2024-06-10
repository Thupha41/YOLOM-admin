import React, { useEffect, useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import {
  AiOutlineDashboard,
  AiOutlineShoppingCart,
  AiOutlineUser,
  AiOutlineBgColors,
} from "react-icons/ai";
import { RiCouponLine } from "react-icons/ri";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import { ImBlog } from "react-icons/im";
import { IoIosNotifications } from "react-icons/io";
import { FaClipboardList, FaBloggerB } from "react-icons/fa";
import { SiBrandfolder } from "react-icons/si";
import { BiCategoryAlt } from "react-icons/bi";
import { FaProductHunt } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { Layout, Menu, Breadcrumb, theme } from "antd";
import { IoIosPricetags } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("");
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  // Use effect to set the selected key from local storage when the component mounts
  useEffect(() => {
    const storedKey = localStorage.getItem("selectedKey") || "";
    setSelectedKey(storedKey);
  }, []);

  const handleMenuClick = ({ key }) => {
    setSelectedKey(key);
    localStorage.setItem("selectedKey", key);
    navigate(key);
  };

  // Define breadcrumb name map
  const breadcrumbNameMap = {
    "/admin": "Dashboard",
    "/admin/customers": "Customers",
    "/admin/add-product": "Add Product",
    "/admin/list-product": "Product List",
    "/admin/tag": "Add Tag",
    "/admin/list-tag": "Tag List",
    "/admin/brand": "Brand",
    "/admin/list-brand": "Brand List",
    "/admin/catalogue": "Catalogue",
    "/admin/list-catalogue": "Catalogue List",
    "/admin/color": "Color",
    "/admin/list-color": "Color List",
    "/admin/orders": "Orders",
    "/admin/orders/:id": "Order Details",
    "/admin/marketing": "Marketing",
    "/admin/coupon": "Add Discount",
    "/admin/coupon-list": "Discount List",
    "/admin/blogs": "Blogs",
    "/admin/blog": "Add Blog",
    "/admin/blog-list": "Blog List",
    "/admin/blog-category": "Add Blog Category",
    "/admin/blog-category-list": "Blog Category List",
    "/admin/enquiries": "Enquiries",
  };

  // Generate breadcrumb items based on location
  const pathSnippets = location.pathname.split("/").filter((i) => i);
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    const routeName =
      breadcrumbNameMap[url] || breadcrumbNameMap["/admin/orders/:id"];
    const breadcrumbLabel = routeName.includes(":id")
      ? routeName.replace(":id", id)
      : routeName;

    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>{breadcrumbLabel}</Link>
      </Breadcrumb.Item>
    );
  });

  const breadcrumbItems = [].concat(extraBreadcrumbItems);

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
          <h2 className="text-black fs-5 text-center py-3 mb-0">
            <span className="sm-logo">YO</span>
            <span className="lg-logo">YOLOM</span>
          </h2>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          items={[
            {
              key: "",
              icon: <AiOutlineDashboard className="fs-4" />,
              label: "Dashboard",
            },
            {
              key: "customers",
              icon: <AiOutlineUser className="fs-4" />,
              label: "Customers",
            },
            {
              key: "e-commerce",
              icon: <AiOutlineShoppingCart className="fs-4" />,
              label: "E-commerce",
              children: [
                {
                  key: "add-product",
                  icon: <IoIosAddCircle className="fs-4" />,
                  label: "Add Product",
                },
                {
                  key: "list-product",
                  icon: <FaProductHunt className="fs-4" />,
                  label: "Product List",
                },
                {
                  key: "tag",
                  icon: <AiOutlineShoppingCart className="fs-4" />,
                  label: "Add Tag",
                },
                {
                  key: "list-tag",
                  icon: <IoIosPricetags className="fs-4" />,
                  label: "Tag List",
                },
                {
                  key: "brand",
                  icon: <SiBrandfolder className="fs-4" />,
                  label: "Brand",
                },
                {
                  key: "list-brand",
                  icon: <SiBrandfolder className="fs-4" />,
                  label: "Brand List",
                },
                {
                  key: "catalogue",
                  icon: <BiCategoryAlt className="fs-4" />,
                  label: "Catalogue",
                },
                {
                  key: "list-catalogue",
                  icon: <BiCategoryAlt className="fs-4" />,
                  label: "Catalogue List",
                },
                {
                  key: "color",
                  icon: <AiOutlineBgColors className="fs-4" />,
                  label: "Color",
                },
                {
                  key: "list-color",
                  icon: <AiOutlineBgColors className="fs-4" />,
                  label: "Color List",
                },
                {
                  key: "orders",
                  icon: <FaClipboardList className="fs-4" />,
                  label: "Orders",
                },
              ],
            },
            {
              key: "marketing",
              icon: <RiCouponLine className="fs-4" />,
              label: "Marketing",
              children: [
                {
                  key: "coupon",
                  icon: <ImBlog className="fs-4" />,
                  label: "Add Discount",
                },
                {
                  key: "coupon-list",
                  icon: <RiCouponLine className="fs-4" />,
                  label: "Discount List",
                },
              ],
            },
            {
              key: "blogs",
              icon: <FaBloggerB className="fs-4" />,
              label: "Blogs",
              children: [
                {
                  key: "blog",
                  icon: <ImBlog className="fs-4" />,
                  label: "Add Blog",
                },
                {
                  key: "blog-list",
                  icon: <FaBloggerB className="fs-4" />,
                  label: "Blog List",
                },
                {
                  key: "blog-category",
                  icon: <ImBlog className="fs-4" />,
                  label: "Add Blog Category",
                },
                {
                  key: "blog-category-list",
                  icon: <FaBloggerB className="fs-4" />,
                  label: "Blog Category List",
                },
              ],
            },
            {
              key: "enquiries",
              icon: <FaClipboardList className="fs-4" />,
              label: "Enquiries",
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="d-flex justify-content-between ps-1 pe-5"
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
            }
          )}
          <div className="d-flex gap-4 align-items-center">
            <div className="position-relative">
              <IoIosNotifications className="fs-4" />
              <span className="badge bg-danger rounded-circle position-absolute">
                3
              </span>
            </div>

            <div className="d-flex gap-3 align-items-center dropdown">
              <div>
                <img
                  width={32}
                  height={32}
                  src="https://stroyka-admin.html.themeforest.scompiler.ru/variants/ltr/images/customers/customer-4-64x64.jpg"
                  alt=""
                />
              </div>
              <div
                role="button"
                id="dropdownMenuLink"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <h5 className="mb-0">Admin</h5>
                <p className="mb-0">Admin@gmail.com</p>
              </div>
              <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <li>
                  <Link
                    className="dropdown-item py-1 mb-1"
                    style={{ height: "auto", lineHeight: "20px" }}
                    to="/"
                  >
                    View Profile
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item py-1 mb-1"
                    style={{ height: "auto", lineHeight: "20px" }}
                    to="/"
                  >
                    Signout
                  </Link>
                </li>
              </div>
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <Breadcrumb>{breadcrumbItems}</Breadcrumb>
          <ToastContainer
            position="top-right"
            autoClose={250}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            theme="light"
          />
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
