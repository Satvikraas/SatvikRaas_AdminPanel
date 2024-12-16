import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import LoginPage from "./components/LoginPage.jsx";
import Dashboard from "./components/Dashboard.jsx";
import EditProduct from "./components/EditProduct.jsx";

function App() {
  return (
    <div className="App">
      <Router>
        <div className="app-container">
          <main className="main-content">
            <Routes>
              <Route path="/" element={<LoginPage />} />

              {/* <Route path="/" element={<Dashboard/>}/> */}
              <Route path="/adminDashBoard" element={<Dashboard />} />
              <Route path="/EditProduct" element={<EditProduct />} />
            </Routes>
          </main>
        </div>
      </Router>
    </div>
  );
}

export default App;
