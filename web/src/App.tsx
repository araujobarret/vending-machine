import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Layout } from "antd";
import { Nav } from "./components/Nav";
import { RequireAuth } from "./components/RequireAuth";
import { LoginPage } from "./pages/login/Login";
import { RegisterPage } from "./pages/register/Register";
import { VendingMachinePage } from "./pages/vending-machine/VendingMachine";
import { ProductsPage } from "./pages/products/products";
import { useAuthContext } from "./providers/Auth";
import { UserPage } from "./pages/user/User";

const { Content, Header } = Layout;

function App() {
  return (
    <Router>
      <Layout style={{ height: "100vh", overflow: "hidden", padding: 0 }}>
        <Header>
          <Nav />
        </Header>

        <Content style={{ padding: "0 50px", height: "100%" }}>
          <RoutesSwitcher />
        </Content>
      </Layout>
    </Router>
  );
}

const RoutesSwitcher: React.FC = () => {
  const { user } = useAuthContext();

  if (!user) {
    return <UnauthenticatedRoutes />;
  }

  if (user.role === "buyer") {
    return <BuyerRoutes />;
  }

  return <SellerRoutes />;
};

const UnauthenticatedRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" index element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
};

const BuyerRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        index
        element={
          <RequireAuth>
            <VendingMachinePage />
          </RequireAuth>
        }
      />
      <Route
        path="/vending-machine"
        index
        element={
          <RequireAuth>
            <VendingMachinePage />
          </RequireAuth>
        }
      />
      <Route
        path="/user"
        index
        element={
          <RequireAuth>
            <UserPage />
          </RequireAuth>
        }
      />
    </Routes>
  );
};

const SellerRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        index
        element={
          <RequireAuth>
            <ProductsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/products"
        index
        element={
          <RequireAuth>
            <ProductsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/user"
        index
        element={
          <RequireAuth>
            <UserPage />
          </RequireAuth>
        }
      />
    </Routes>
  );
};

export default App;
