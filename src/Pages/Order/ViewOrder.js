import React, { useEffect } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { fetchOrderByUser, reset } from "../../features/auth/authSlice";
import formatCurrency from "../../utils/formatCurrency";
import "./ViewOrder.css";

const ViewOrder = () => {
  const location = useLocation();
  const orderId = location.pathname.split("/")[3];
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrderByUser(orderId));

    return () => {
      dispatch(reset());
    };
  }, [dispatch, orderId]);

  const { order, isLoading, isError, message } = useSelector(
    (state) => state.auth
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error: {message}</p>;
  }

  const getOrderStatusClass = (status) => {
    switch (status) {
      case "Cancelled":
        return "badge-status cancelled";
      case "Pending":
        return "badge-status pending";
      case "Confirmed":
        return "badge-status confirmed";
      case "Shipping":
        return "badge-status shipping";
      default:
        return "badge-status";
    }
  };

  const data1 =
    order?.orderDetails?.map((detail, index) => ({
      key: index + 1,
      image: (
        <img
          src={detail.ProductDetail.sku_image[0]}
          alt="Product"
          style={{ width: "100px", height: "100px" }}
        />
      ),
      name: detail.ProductDetail.Product.product_name,
      brand: detail.ProductDetail.Product.Brand.name,
      count: detail.order_detail_quantity,
      amount: (
        <span>
          {formatCurrency(
            detail.order_detail_quantity * detail.order_detail_price
          )}
          đ
        </span>
      ),
      color: detail.ProductDetail.sku_color,
      date: detail.createdAt,
    })) || [];

  const columns = [
    { title: "", dataIndex: "image", key: "image" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Brand", dataIndex: "brand", key: "brand" },
    { title: "Qty", dataIndex: "count", key: "count" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
      render: (color) => (
        <span
          style={{
            display: "inline-block",
            width: 20,
            height: 20,
            borderRadius: "50%",
            backgroundColor: color,
            border:
              color.toLowerCase() === "white" ? "2px solid black" : "none",
          }}
        ></span>
      ),
    },
  ];

  return (
    <div className="container-fluid">
      <div className="container">
        <div className="card-header">
          <h2 className="h5 mb-0">Order #{order?.order?.order_code}</h2>
        </div>

        <div className="row">
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-body">
                <div className="mb-3 d-flex justify-content-between">
                  <div>
                    <span className="me-3">{order?.order?.createdAt}</span>
                    <span className="me-3">
                      Order Id: #{order?.order?.order_id.slice(0, 7)}
                    </span>
                    <span
                      className={getOrderStatusClass(
                        order?.order?.order_status
                      )}
                    >
                      {order?.order?.order_status}
                    </span>
                  </div>
                </div>
                <Table
                  columns={columns}
                  dataSource={data1}
                  pagination={false}
                />
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-6">
                    <h3 className="h6">Summary</h3>
                    <div className="summary-item">
                      <span>Payment method:</span>
                      <span>{order?.order?.order_payment_method}</span>
                    </div>
                    <div className="summary-item">
                      <span className="fw-semibold">Payment Status:</span>
                      <span>{order?.order?.order_payment_status}</span>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <h3 className="h6">Billing</h3>
                    <div className="summary-item">
                      <span>Shipping Price:</span>
                      <span>
                        {formatCurrency(order?.order?.order_shipping_price)}đ
                      </span>
                    </div>
                    <div className="summary-item">
                      <span>Subtotal:</span>
                      <span>
                        {formatCurrency(order?.order?.order_total_price)}đ
                      </span>
                    </div>
                    <div className="summary-item total">
                      <span>Final Total:</span>
                      <span>
                        {formatCurrency(order?.order?.order_final_price)}đ
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card mb-4">
              <div className="card-body">
                <h3 className="h6">Customer Notes</h3>
                <p>
                  Sed enim, faucibus litora velit vestibulum habitasse. Cras
                  lobortis cum sem aliquet mauris rutrum. Sollicitudin. Morbi,
                  sem tellus vestibulum porttitor.
                </p>
              </div>
            </div>
            <div className="card mb-4">
              <div className="card-body">
                <h3 className="h6">Shipping Information</h3>
                <hr />
                <h3 className="h6">Address</h3>
                <address>
                  {order?.order?.order_street}
                  <br />
                  {order?.order?.order_ward}, {order?.order?.order_district}
                  <br />
                  {order?.order?.order_province_city}
                  <br />
                </address>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOrder;
