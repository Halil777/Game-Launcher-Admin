import { Suspense, lazy, FC } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../../layout/Layout";

const Server = lazy(() => import("../../../pages/server/Server"));
const AddGlobalServer = lazy(
  () => import("../../../pages/server/global/AddGlobalServer")
);
const AddLocalServer = lazy(
  () => import("../../../pages/server/local/AddLocalServer")
);
const TeamSpeak = lazy(() => import("../../../pages/teamspeak/TeamSpeak"));
const Pricing = lazy(() => import("../../../pages/pricing/Pricing"));
const AddPlan = lazy(() => import("../../../pages/pricing/AddPlan"));
const Login = lazy(() => import("../../../pages/login/Login"));
const News = lazy(() => import("../../../pages/news/News"));
const AddNews = lazy(() => import("../../../pages/news/AddNews"));
const EditNews = lazy(() => import("../../../pages/news/EditNews"));
const Game = lazy(() => import("../../../pages/game/Game"));
const AddGame = lazy(() => import("../../../pages/game/AddGame"));
const EditGame = lazy(() => import("../../../pages/game/EditGame"));

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

const ProtectedRoute: FC<{ element: JSX.Element }> = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

const RouteList = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
        {isAuthenticated() && (
          <Layout>
            <Routes>
              <Route
                path="/servers"
                element={<ProtectedRoute element={<Server />} />}
              />
              <Route
                path="/pricing"
                element={<ProtectedRoute element={<Pricing />} />}
              />
              <Route
                path="/add-plan"
                element={<ProtectedRoute element={<AddPlan />} />}
              />
              <Route
                path="/add-global-server"
                element={<ProtectedRoute element={<AddGlobalServer />} />}
              />
              <Route
                path="/add-local-server"
                element={<ProtectedRoute element={<AddLocalServer />} />}
              />

              <Route
                path="/team-speak"
                element={<ProtectedRoute element={<TeamSpeak />} />}
              />

              <Route
                path="/news"
                element={<ProtectedRoute element={<News />} />}
              />
              <Route
                path="/add-news"
                element={<ProtectedRoute element={<AddNews />} />}
              />
              <Route
                path="/edit-news/:id"
                element={<ProtectedRoute element={<EditNews />} />}
              />
              <Route
                path="/games"
                element={<ProtectedRoute element={<Game />} />}
              />
              <Route
                path="/add-game"
                element={<ProtectedRoute element={<AddGame />} />}
              />
              <Route
                path="/edit-game/:id"
                element={<ProtectedRoute element={<EditGame />} />}
              />
            </Routes>
          </Layout>
        )}
      </Suspense>
    </BrowserRouter>
  );
};

export default RouteList;
