import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Context/AuthProvider.jsx";
import CartProvider from "./Context/CartProvider.jsx";
import { ToastContainer, Bounce } from "react-toastify";
import { Auth0Provider } from "@auth0/auth0-react";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
        <Auth0Provider
          domain="dev-ghikicd2nqjkuz8a.us.auth0.com"
          clientId="SVfAQoENxmrs3YsVUMRbn005th3e47mU"
          authorizationParams={{
            redirect_uri: window.location.origin,
          }}
        >
          <App />
        </Auth0Provider>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);
