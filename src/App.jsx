import React from "react";
import Home from "./components/Dashboard/Home";
import { BrowserRouter, Routes, Route } from "react-router";
import { CreateBanner } from "./components/Dashboard/Banner/CreateBanner";
import SignupPage from "./components/Dashboard/Auth/Registration";
import Login from "./components/Dashboard/Auth/Login";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import CreateCategory from "./components/Dashboard/Category/Category";
import CreateSubCategory from "./components/Dashboard/SubCategory/SubCategory";
import CreateBrand from "./components/Dashboard/Brand/Brand";
import CreateDiscount from "./components/Dashboard/Discount/Discount";
import CreateProduct from "./components/Dashboard/Product/Product";
import CreateVariant from "./components/Dashboard/Varient/Varient";
import CreateCoupon from "./components/Dashboard/Coupon/Coupon";
import CreateWarrenty from "./components/Dashboard/Warrenty/Warrenty";
import CreateShipinginfo from "./components/Dashboard/Shipinginfo/Shipinginfo";
import CreateWearhouse from "./components/Dashboard/Wearhouse/Wearhouse";
import CreateCart from "./components/Dashboard/Cart/Cart";
import CreateDeliverycharge from "./components/Dashboard/Deliverycharge/Deliverycharge";
import CreateOrder from "./components/Dashboard/Order/Order";
import CreateRole from "./components/Dashboard/Role/Role";
import CreatePermision from "./components/Dashboard/Permision/Permision";

const App = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route path="/CreateBanner" element={<CreateBanner />} />
            <Route path="/CreateCategory" element={<CreateCategory />} />
            <Route path="/CreateSubCategory" element={<CreateSubCategory />} />
            <Route path="/CreateBrand" element={<CreateBrand />} />
            <Route path="/CreateDiscount" element={<CreateDiscount />} />
            <Route path="/CreateProduct" element={<CreateProduct />} />
            <Route path="/CreateVariant" element={<CreateVariant />} />
            <Route path="/CreateCoupon" element={<CreateCoupon />} />
            <Route path="/CreateWarrenty" element={<CreateWarrenty />} />
            <Route path="/CreateShipinginfo" element={<CreateShipinginfo />} />
            <Route path="/CreateWearhouse" element={<CreateWearhouse />} />
            <Route path="/CreateCart" element={<CreateCart />} />
            <Route path="/CreateDeliverycharge" element={<CreateDeliverycharge />} />
            <Route path="/CreateOrder" element={<CreateOrder />} />
            <Route path="/CreateRole" element={<CreateRole />} />
            <Route path="/CreatePermision" element={<CreatePermision />} />
          </Route>
          <Route>
            <Route path="/singup" element={<SignupPage />} />
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
