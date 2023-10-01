import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Layout } from "antd";
import { Nav } from "./components/Nav";
import { RequireAuth } from "./components/RequireAuth";
import { AuthProvider } from "./providers/Auth";
import { LoginPage } from "./pages/login/Login";
import { RegisterPage } from "./pages/register/Register";
import { VendingMachinePage } from "./pages/vending-machine/VendingMachine";
import { ProductsPage } from "./pages/products/products";

const { Content, Header } = Layout;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout style={{ height: "100vh", overflow: "hidden", padding: 0 }}>
          <Header>
            <Nav />
          </Header>

          <Content style={{ padding: "0 50px", height: "100%" }}>
            <Routes>
              <Route
                path="/vending-machine"
                element={
                  <RequireAuth>
                    <VendingMachinePage />
                  </RequireAuth>
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/products" element={<ProductsPage />} />
            </Routes>
          </Content>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
