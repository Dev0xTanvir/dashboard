import React from "react";
import Home from "./components/Dashboard/Home";
import { BrowserRouter, Routes, Route } from "react-router";
import { CreateBanner } from "./components/Dashboard/Banner/CreateBanner";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="/CreateBanner" element={<CreateBanner/> } />
          <Route path="/register" element={"<Register />"} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
