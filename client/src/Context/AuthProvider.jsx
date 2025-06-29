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
  if (!state.token) {
    setUser({});
    return;
  }

  try {
    const response = await fetch("http://localhost:9000/api/auth/getUser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        const errorData = await response.json();
        if (errorData.msg === "Session expired. Please login again.") {
          dispatch({ type: "LOGOUT" });
        }
      }
      setUser({});
      return;
    }

    const data = await response.json();
    
    // ✅ Store token with user
    setUser({
      ...data.user,
      token: state.token,
    });

  } catch (error) {
    console.error("Error fetching user data:", error);
    setUser({});
  }
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
