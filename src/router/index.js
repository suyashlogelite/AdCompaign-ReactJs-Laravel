import { Routes, Route } from "react-router-dom";
import BannerCreate from "../pages/BannerCreate";
import BannerList from "../pages/BannerList";
import Home from "../pages/Home";
import { Imagelist } from "../pages/Imagelist";
import BannerEdit from "../pages/BannerEdit";

function MyRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/createBanner" element={<BannerCreate />} />
      <Route path="/compaignDetail" element={<BannerList />} />
      <Route path={`/images/:id/show`} element={<Imagelist />} />
      <Route path={`/images/:id/edit`} element={<BannerEdit />} />
    </Routes>
  );
}

export default MyRouter;
