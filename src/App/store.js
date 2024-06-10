import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/product/productSlice";
import brandReducer from "../features/brand/brandSlice";
import catalogueReducer from "../features/catalogue/catalogueSlice";
import tagReducer from "../features/tag/tagSlice";
import authReducer from "../features/auth/authSlice";
export const store = configureStore({
  reducer: {
    product: productReducer,
    brand: brandReducer,
    catalogue: catalogueReducer,
    tag: tagReducer,
    auth: authReducer,
  },
});
