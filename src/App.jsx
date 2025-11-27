import React from "react";
import Home from "./components/Dashboard/Home";
import { BrowserRouter, Routes, Route } from "react-router";
import { CreateBanner } from "./components/Dashboard/Banner/CreateBanner";
import SignupPage from "./components/Dashboard/Auth/Registration";
import Login from "./components/Dashboard/Auth/Login";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import CreateCategory from "./components/Dashboard/Category/Category";
import CreateSubCategory from "./components/Dashboard/SubCategory/SubCategory";

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
