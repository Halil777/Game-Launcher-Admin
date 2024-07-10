import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../../layout/Layout";
import Home from "../../../pages/home/Home";

// import Dashboard from "../../../pages/Dashboard";

const RouteList = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default RouteList;
