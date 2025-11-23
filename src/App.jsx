import React from "react";
import Home from "./components/Dashboard/Home";
import { BrowserRouter, Routes, Route } from "react-router";
import { CreateBanner } from "./components/Dashboard/Banner/CreateBanner";
import SignupPage from "./components/Dashboard/Auth/Registration";
import Login from "./components/Dashboard/Auth/Login";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="/CreateBanner" element={<CreateBanner/> } />
        </Route>
        <Route>
          <Route path="/singup" element={<SignupPage />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
