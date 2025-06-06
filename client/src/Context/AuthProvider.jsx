import { createContext, useEffect, useReducer, useState } from "react";
export const AuthContext = createContext();

const initialState = {
  token: localStorage.getItem("my-token") || null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("my-token", action.payload);
      return { token: action.payload };
    case "LOGOUT":
      localStorage.removeItem("my-token");
      return { token: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [user, setUser] = useState({});
  const getUser = async () => {
    let response = await fetch("http://localhost:9000/api/auth/getUser", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${state.token}`,
        "Content-Type": "application/json",
      },
    });

    // If token is expired or unauthorized
    if (response.status === 401) {
      const errorData = await response.json();
      if (errorData.msg === "Session expired. Please login again.") {
        dispatch({ type: "LOGOUT" });
        setUser({});
        return;
      }
    }

    response = await response.json();
    // console.log(response);
    setUser(response.user);
  };
  useEffect(() => {
    getUser();
  }, [state.token]);

  return (
    <AuthContext.Provider value={{ state, dispatch, user }}>
      {children}
    </AuthContext.Provider>
  );
};
