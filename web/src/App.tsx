import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Layout } from "antd";

import Products from "./pages/products/products";
import { Nav } from "./components/Nav";
import { AuthProvider } from "./providers/Auth";
import { RequireAuth } from "./components/RequireAuth";
import { Login } from "./pages/login/Login";

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
                    <div>Vending Machine</div>
                  </RequireAuth>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" Component={() => <div>Register</div>} />
              <Route path="/products/:id" Component={Products} />
              <Route path="/deposit" Component={Products} />
              <Route path="/buy" Component={Products} />
              <Route path="/reset-deposit" Component={Products} />
            </Routes>
          </Content>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
