import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Layout } from "antd";
import Products from "./pages/products/products";
import { Nav } from "./components/Nav";
import { AuthProvider } from "./providers/Auth";
import { Login } from "./pages/login/Login";
import { Register } from "./pages/register/Register";
import { RequireAuth } from "./components/RequireAuth";
import { VendingMachine } from "./pages/vending-machine/VendingMachine";

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
                path="/"
                element={
                  <RequireAuth>
                    <VendingMachine />
                  </RequireAuth>
                }
              />
              <Route
                path="/vending-machine"
                element={
                  <RequireAuth>
                    <VendingMachine />
                  </RequireAuth>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" Component={Products} />
            </Routes>
          </Content>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
