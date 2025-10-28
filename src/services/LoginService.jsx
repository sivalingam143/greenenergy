import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../config/API";
const USERS_ENDPOINT = "/login/login.php";

const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (Credential, thunkAPI) => {
    try {
      const response = await axiosInstance.post(USERS_ENDPOINT, {
        login_id: Credential.login_id,
        password: Credential.password,
      });
      console.log("API Response:", response.data);

      if (response.data.status === "Success") {
        const user = response.data.data;
        console.log("Login successful for:", Credential.login_id);
        sessionStorage.setItem("user", JSON.stringify(user));
        return user;
      } else {
        return thunkAPI.rejectWithValue(
          response.data.msg || "Invalid login_id or password"
        );
      }
    } catch (error) {
      console.log("Error:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.msg || error.message
      );
    }
  }
);

const logoutUser = createAsyncThunk("auth/logoutUser", async (_, thunkAPI) => {
  sessionStorage.removeItem("user");
  return {};
});

export { loginUser, logoutUser };
