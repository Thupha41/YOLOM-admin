import React, { useEffect } from "react";
import CustomInput from "../Components/CustomInput";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik, FieldArray, FormikProvider } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { getBrands } from "../features/brand/brandSlice";
import { getCatalogues } from "../features/catalogue/catalogueSlice";
import { getTags } from "../features/tag/tagSlice";
import { IoIosRefresh } from "react-icons/io";
import {
  createProduct,
  resetState,
  getProducts,
} from "../features/product/productSlice";
import { Select, Button, Table, Input, Row, Col, Card, Space } from "antd";
import {
  PlusOutlined,
  MinusCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import Dropzone from "react-dropzone";
import "./AddProduct.css";

const { Option } = Select;
const MAX_FILE_SIZE = 860 * 1024; // 800KB

let schema = yup.object().shape({
  title: yup.string().required("Title is Required"),
  description: yup.string().required("Description is Required"),
  price: yup.number().required("Price is Required"),
  brand: yup.string().required("Brand is Required"),
  catalogue: yup.string().required("Catalogue is Required"),
  tags: yup.string().required("Tag is Required"),
  items: yup
    .array()
    .of(
      yup.object().shape({
        color: yup.string().required("Color is Required"),
        size: yup.string().required("Size is Required"),
        quantity: yup.number().required("Quantity is Required"),
        images: yup.array().min(1, "At least one image is required"),
      })
    )
    .required("Must have items")
    .min(1, "Minimum of 1 item"),
});

const AddProduct = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBrands());
    dispatch(getCatalogues());
    dispatch(getTags());
    dispatch(getProducts()); // Fetch existing products
  }, [dispatch]);

  const brandState = useSelector((state) => state.brand.brands);
  const catState = useSelector((state) => state.catalogue.catalogues);
  const tagState = useSelector((state) => state.tag.tags);
  const productState = useSelector((state) => state.product.products);
  const newProduct = useSelector((state) => state.product);
  const { isSuccess, isError, createdProduct } = newProduct;

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      price: "",
      brand: "",
      catalogue: "",
      tags: "",
      items: [
        {
          color: "",
          size: "",
          quantity: "",
          images: [],
        },
      ],
    },
    validationSchema: schema,
    onSubmit: (values) => {
      const isDuplicate = productState.some(
        (product) =>
          product.Product && product.Product.product_name === values.title
      );

      if (isDuplicate) {
        toast.error("Duplicate product name!", { autoClose: 3000 });
        return;
      } else {
        toast.success("Product Added Successfully!", { autoClose: 3000 });
      }

      const formData = new FormData();
      formData.append("product_name", values.title);
      formData.append("product_desc", values.description);
      formData.append("product_price", values.price);
      formData.append("brand_id", values.brand);
      formData.append("catalogue_id", values.catalogue);
      formData.append("tag_id", values.tags);

      values.items.forEach((item, itemIndex) => {
        formData.append(`items[${itemIndex}][sku_color]`, item.color);
        formData.append(`items[${itemIndex}][sku_size]`, item.size);
        formData.append(`items[${itemIndex}][sku_quantity]`, item.quantity);
        item.images.forEach((file) => {
          formData.append(`files_${itemIndex}`, file);
        });
      });

      dispatch(createProduct(formData));
    },
  });

  useEffect(() => {
    if (isSuccess && createdProduct) {
      toast.success("Product Added Successfully!", { autoClose: 3000 });
      formik.resetForm();
      dispatch(resetState());
    }
    if (isError) {
      toast.error("Something Went Wrong!", { autoClose: 3000 });
      dispatch(resetState());
    }
  }, [isSuccess, isError, createdProduct, dispatch]);

  const handleSave = async (event) => {
    event.preventDefault(); // Prevent default form submission
    const errors = await formik.validateForm();
    if (Object.keys(errors).length === 0) {
      formik.handleSubmit();
    } else {
      toast.error("All fields are required!", { autoClose: 3000 });
    }
  };

  const handleRefresh = () => {
    formik.resetForm();
  };

  const availableSizes = ["S", "M", "L", "XL"];

  const getAvailableSizes = (index) => {
    const selectedColors = formik.values.items.map((item, idx) => {
      if (idx !== index) {
        return { color: item.color, size: item.size };
      }
      return null;
    });

    const sizesForCurrentColor = selectedColors
      .filter(
        (item) =>
          item !== null && item.color === formik.values.items[index].color
      )
      .map((item) => item.size);

    return availableSizes.filter(
      (size) => !sizesForCurrentColor.includes(size)
    );
  };

  const columns = [
    {
      title: "Color",
      dataIndex: "color",
      render: (_, record, index) => (
        <Select
          placeholder="Select color"
          onChange={(value) => {
            formik.setFieldValue(`items[${index}].color`, value);
            formik.setFieldValue(`items[${index}].size`, "");
          }}
          value={formik.values.items[index].color}
          className="w-100"
        >
          <Option value="">Select Color</Option>
          <Option value="Black">Black</Option>
          <Option value="White">White</Option>
          <Option value="Red">Red</Option>
          <Option value="Blue">Blue</Option>
          <Option value="Pink">Pink</Option>
          <Option value="Beige">Beige</Option>
          <Option value="Green">Green</Option>
          <Option value="Purple">Purple</Option>
        </Select>
      ),
    },
    {
      title: "Size",
      dataIndex: "size",
      render: (_, record, index) => (
        <Select
          placeholder="Select size"
          onChange={(value) =>
            formik.setFieldValue(`items[${index}].size`, value)
          }
          value={formik.values.items[index].size}
          className="w-100"
        >
          <Option value="">Select Size</Option>
          {getAvailableSizes(index).map((size) => (
            <Option key={size} value={size}>
              {size}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      render: (_, record, index) => (
        <Input
          type="number"
          placeholder="Enter Quantity"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.items[index].quantity}
          name={`items[${index}].quantity`}
        />
      ),
    },
    {
      title: "Images",
      dataIndex: "images",
      render: (_, record, index) => (
        <div>
          <Dropzone
            onDrop={(acceptedFiles) => {
              const currentFiles = formik.values.items[index].images || [];
              const newFiles = [...currentFiles, ...acceptedFiles];
              const totalSize = newFiles.reduce(
                (acc, file) => acc + file.size,
                0
              );

              if (totalSize > MAX_FILE_SIZE) {
                toast.error(
                  "Total file size exceeds the maximum limit of 860KB",
                  { autoClose: 3000 }
                );
              } else {
                formik.setFieldValue(`items[${index}].images`, newFiles);
              }
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                <Button icon={<UploadOutlined />}>Upload</Button>
              </div>
            )}
          </Dropzone>
          <div className="showimages d-flex flex-column gap-1 mt-2">
            {formik.values.items[index].images.map((file, fileIndex) => (
              <div key={fileIndex} className="d-flex align-items-center">
                <span>{file.name}</span>
                <Button
                  type="text"
                  icon={<MinusCircleOutlined />}
                  onClick={() => {
                    const newImages = formik.values.items[index].images.filter(
                      (_, i) => i !== fileIndex
                    );
                    formik.setFieldValue(`items[${index}].images`, newImages);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record, index) => (
        <Space>
          {index === formik.values.items.length - 1 ? (
            <Button
              onClick={() =>
                formik.setFieldValue("items", [
                  ...formik.values.items,
                  { color: "", size: "", quantity: "", images: [] },
                ])
              }
              icon={<PlusOutlined />}
            >
              Add
            </Button>
          ) : (
            <Button
              type="dashed"
              onClick={() =>
                formik.setFieldValue(
                  "items",
                  formik.values.items.filter((_, i) => i !== index)
                )
              }
              icon={<MinusCircleOutlined />}
            >
              Remove
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h3 className="mb-4 title">Add Product</h3>
      <div className="container-xl">
        <FormikProvider value={formik}>
          <form onSubmit={handleSave} className="d-flex gap-3 flex-column">
            <div className="row">
              {/* General Product Details */}
              <div className="col-md-9 gap-3">
                <Card className="mb-3">
                  <div>
                    <Row gutter={16} className="mb-3">
                      <Col span={12}>
                        <label htmlFor="name" className="form-label required">
                          Product Name
                        </label>
                        <CustomInput
                          type="text"
                          label="Enter Product Name"
                          name="title"
                          onChng={formik.handleChange}
                          onBlr={formik.handleBlur}
                          val={formik.values.title}
                        />
                        <div className="error">
                          {formik.touched.title && formik.errors.title}
                        </div>
                      </Col>
                    </Row>
                    {/* Description */}
                    <div className="mb-4">
                      <label htmlFor="desc" className="form-label required">
                        Description
                      </label>
                      <textarea
                        name="description"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.description}
                        className="form-control"
                        rows="4"
                      />
                      <div className="error">
                        {formik.touched.description &&
                          formik.errors.description}
                      </div>
                    </div>

                    <Row gutter={16} className="my-12">
                      {/* Price */}
                      <Col span={12}>
                        <label htmlFor="price" className="form-label required">
                          Price
                        </label>
                        <CustomInput
                          type="number"
                          label="Enter Product Price"
                          name="price"
                          onChng={formik.handleChange}
                          onBlr={formik.handleBlur}
                          val={formik.values.price}
                        />
                        <div className="error">
                          {formik.touched.price && formik.errors.price}
                        </div>
                      </Col>
                      {/* Tag */}
                      <Col span={12}>
                        <label htmlFor="tag" className="form-label required">
                          Tag
                        </label>
                        <select
                          name="tags"
                          onChange={formik.handleChange("tags")}
                          onBlur={formik.handleBlur("tags")}
                          value={formik.values.tags}
                          className="form-control form-select py-3 mb-3"
                        >
                          <option value="">Select Tag</option>
                          {tagState.map((tag, index) => (
                            <option key={index} value={tag.tag_id}>
                              {tag.name}
                            </option>
                          ))}
                        </select>
                        <div className="error">
                          {formik.touched.tags && formik.errors.tags}
                        </div>
                      </Col>
                    </Row>
                    <Row gutter={16} className="my-12">
                      {/* Catalogue */}
                      <Col span={12}>
                        <label
                          htmlFor="catalogue"
                          className="form-label required"
                        >
                          Catalogue
                        </label>
                        <select
                          name="catalogue"
                          onChange={formik.handleChange("catalogue")}
                          onBlur={formik.handleBlur("catalogue")}
                          value={formik.values.catalogue}
                          className="form-control form-select py-3 mb-3"
                        >
                          <option value="">Select Catalogue</option>
                          {catState.map((catalogue, index) => (
                            <option key={index} value={catalogue.Catalogue_id}>
                              {catalogue.name}
                            </option>
                          ))}
                        </select>
                        <div className="error">
                          {formik.touched.catalogue && formik.errors.catalogue}
                        </div>
                      </Col>

                      {/* Brand */}
                      <Col span={12}>
                        <label htmlFor="brand" className="form-label required">
                          Brand
                        </label>
                        <select
                          name="brand"
                          onChange={formik.handleChange("brand")}
                          onBlur={formik.handleBlur("brand")}
                          value={formik.values.brand}
                          className="form-control form-select py-3 mb-3"
                        >
                          <option value="">Select Brand</option>
                          {brandState.map((brand, index) => (
                            <option key={index} value={brand.brand_id}>
                              {brand.name}
                            </option>
                          ))}
                        </select>
                        <div className="error">
                          {formik.touched.brand && formik.errors.brand}
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Card>

                {/* Dynamic Fields for Colors, Sizes, Quantities, and Images */}
                <FieldArray name="items">
                  {({ remove, push }) => (
                    <Table
                      columns={columns}
                      dataSource={formik.values.items}
                      pagination={false}
                      rowKey={(record, index) => index}
                    />
                  )}
                </FieldArray>
              </div>

              {/* Side Panel for Static Fields */}
              <div className="col-md-3 gap-3 d-flex flex-column-reverse flex-md-column mb-md-0 mb-5">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title">Publish</h5>
                  </div>
                  <div className="card-body">
                    <div className="btn-list">
                      <button
                        className="btn btn-lg btn-primary border-0 rounded-3"
                        type="submit"
                        style={{ marginLeft: "10px" }}
                        onClick={handleSave}
                      >
                        <svg
                          className="icon icon-left"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path
                            stroke="none"
                            d="M0 0h24v24H0z"
                            fill="none"
                          ></path>
                          <path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2"></path>
                          <path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                          <path d="M14 4l0 4l-6 0l0 -4"></path>
                        </svg>
                        Save
                      </button>
                      {/* Refresh */}
                      <button
                        className="btn btn-lg btn-success border-0 rounded-3"
                        type="button"
                        style={{ marginLeft: "10px" }}
                        onClick={handleRefresh}
                      >
                        <IoIosRefresh />
                        Refresh
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </FormikProvider>
      </div>
    </div>
  );
};

export default AddProduct;
