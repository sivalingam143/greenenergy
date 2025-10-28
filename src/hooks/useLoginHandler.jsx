import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/LoginService";
import FormHandle from "./FormHandlehelper";
import NotifyData from "../components/NotifyData";

const useLoginHandlers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = { login_id: "", password: "" };
  const [formData, handleChange] = FormHandle(initialValues);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

const handleLogin = (e) => {
  e.preventDefault();
  dispatch(loginUser(formData)).then((result) => {
    if (result.meta.requestStatus === "fulfilled") {
      const userRole = result.payload?.role_name?.trim(); // Safely access and trim the role name

      NotifyData("Login Success", "success");

      if (userRole === "Engineer") {
        navigate("/dashboard");
      } else {
        navigate("/csr");
      }
    } else {
      NotifyData(result.payload || "Login Failed", "error");
    }
  });
};

  return {
    formData,
    handleChange,
    handleLogin,
    showPassword,
    togglePasswordVisibility,
  };
};

export default useLoginHandlers;
