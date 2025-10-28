import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import "./components/Components.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import routes from "./routes/Routes";
import Login from "./view/Login";
import Layout from "./routes/LayOut";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import { ToastContainer } from "react-toastify";

const ProtectedRoute = ({ children }) => {
  const user = sessionStorage.getItem("user");
  try {
    JSON.parse(user);
    return user ? children : <Navigate to="/" replace />;
  } catch (e) {
    return <Navigate to="/" replace />;
  }
};

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={
                <ProtectedRoute>
                  <Layout>{route.element}</Layout>
                </ProtectedRoute>
              }
            />
          ))}
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          className="toast-container-custom"
        />
      </Router>
    </div>
  );
}

export default App;
