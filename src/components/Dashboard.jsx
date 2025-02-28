import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import satvikLogo from "../images/satvikLogo.png";
import {
  LayoutDashboard,
  LayoutList,
  GalleryHorizontalEnd,
} from "lucide-react";
import AdminPP from "./AdminPP.jsx";
import axios from "axios";
import Orders from "./Orders.jsx";

import userIcon from "../images/user-3296.png";
const api = axios.create({
  baseURL: "https://api.satvikraas.com",

  withCredentials: true,
  validateStatus: (status) => {
    return (status >= 200 && status < 300) || status === 302;
  },
});
const Logout = () => {
  sessionStorage.removeItem("accessToken"); //
};
const DashboardCard = ({ title, value, percentage, period }) => (
  <div className="cardd">
    <h3 className="card-title">{title}</h3>
    {value === 0 ? (
      <div className="loading">Loading...</div>
    ) : (
      <h3 className="card-value">{value}</h3>
    )}
  </div>
);

const ProductList = ({ products }) => (
  <div className="products-section">
    <h2 className="section-title">All Products</h2>
    <div className="products-grid">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
          />
          <div className="product-details">
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">₹{product.price}</p>
            <p className="product-stock">Stock: {product.stock}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const totalSale = (recentOrders) => {
  let totalSales = 0;

  // Filter orders with status PAID or FORWARDED and sum their total amounts
  totalSales = recentOrders
    .filter((order) => order.status === "PAID" || order.status === "COD" && order.deliveryStatus !== "CANCELED")
    .reduce((sum, order) => sum + order.totalAmount, 0);

  return totalSales;
};

const getAccessToken = () => {
  return sessionStorage.getItem("accessToken");
};
const handleShipment = async (razorpayOrderId) => {
  try {
    const accessToken = getAccessToken();

    if (!accessToken) {
      console.error("No access token found");
      return;
    }

    const response = await api.post(`/api/admin/createdelhiveryorder`, null, {
      params: {
        razorpayOrderId: razorpayOrderId,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log(response);
  } catch (error) {
    console.error("Pickup order error:", error);
    // Optional: Add error handling logic
  }
};


const CompleatedOrder = (recentOrders) => {
  let compleated = 0;

  compleated = recentOrders
    .filter((order) => order.status === "PAID" || order.status === "COD")
    ;

  return compleated;
};

const DashboardView = ({
  isLoading,
  recentOrders,
  totalCustomers,
  totalProductSold,
}) => (
  <>
    <div className="dashboard-cards">
      <DashboardCard
        title="Product Sold"
        value={totalProductSold}
        // percentage={50}
        // period="this week"
      />
      <DashboardCard
        title="Completed Order"
        value={CompleatedOrder(recentOrders).length}
        // percentage={80}
        // period="this week"
      />
      <DashboardCard
        title="Total Customer"
        value={totalCustomers.length}
        // percentage={50}
        // period="this week"
      />
     <DashboardCard 
  title="Total Sales" 
  value={(Math.round(totalSale(recentOrders) * 100) / 100).toFixed(2)} 
  // percentage={80} 
  // period="this week" 
/>

    </div>

    <div className="orders-section">
      <div className="orders-header">
        <h2 className="orders-title">Recent Orders</h2>
        <div className="filters">
          <select className="select-filter">
            <option>Select</option>
            <option>CREATED</option>
            <option>Pending</option>
            <option>Completed</option>
          </select>
          <select className="select-filter">
            <option>Date</option>
            <option>Newest</option>
            <option>Oldest</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>RazorpayOrderId</th>
              <th>Customer Name</th>
              <th>Order Date</th>
              <th>Location</th>
              <th>Total Amount</th>
              <th>Total Weight</th>
              <th>Status</th>
              {/* <th>ACTION</th> */}
            </tr>
          </thead>
          {/* {isLoading && <div>Loading.........</div>} */}
          {!isLoading && (
            <tbody>
              {isLoading
                ? [...Array(5)].map((_, index) => (
                    <tr key={index} className="skeleton-row">
                      <td>
                        <div className="skeleton-box"></div>
                      </td>
                      <td>
                        <div className="skeleton-box"></div>
                      </td>
                      <td>
                        <div className="skeleton-box"></div>
                      </td>
                      <td>
                        <div className="skeleton-box"></div>
                      </td>
                      <td>
                        <div className="skeleton-box"></div>
                      </td>
                      <td>
                        <div className="skeleton-box"></div>
                      </td>
                      <td>
                        <div className="skeleton-box"></div>
                      </td>
                    </tr>
                  ))
                : recentOrders.length > 0
                ? recentOrders.map((order, index) => (
                    <tr
                      key={index}
                      className={order.status !== "CREATED" ? "greenbg" : ""}
                    >
                      <td>{order.razorpayOrderId}</td>
                      <td>{order.userName}</td>
                      <td>{order.createdAt}</td>
                      <td>
                        {order.address.city}-{order.address.country}
                      </td>
                      <td>{order.totalAmount}</td>
                      <td>{order.totalWeight}</td>
                      <td>{order.status}</td>
                    </tr>
                  ))
                : [...Array(5)].map((_, index) => (
                    <tr key={index} className="skeleton-row">
                      <td>
                        <div className="skeleton-box"></div>
                      </td>
                      <td>
                        <div className="skeleton-box"></div>
                      </td>
                      <td>
                        <div className="skeleton-box"></div>
                      </td>
                      <td>
                        <div className="skeleton-box"></div>
                      </td>
                      <td>
                        <div className="skeleton-box"></div>
                      </td>
                      <td>
                        <div className="skeleton-box"></div>
                      </td>
                      <td>
                        <div className="skeleton-box"></div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
    {/* {selectedOrder && (
      <OrderDetailsPopup 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
      />
    )} */}
  </>
);

const Dashboard = () => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState([]);
  const [totalProductSold, setTotalProductSold] = useState(0);
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const navigate = useNavigate();
  const [CompletedOrders, serCompleatedOrders] = useState(0);

  const getAccessToken = () => {
    return sessionStorage.getItem("accessToken");
  };

  const fetchAllOrders = async () => {
    try {
      setIsLoading(true);
      const accessToken = getAccessToken();

      if (!accessToken) {
        console.error("No access token found");
        navigate("/");
      }

      const response = await api.get("/api/admin/getAllOrders", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      // console.log(response);

      if (response.data?.data) {
        setRecentOrders(response.data.data);
      } else {
        setRecentOrders([]);
      }
    } catch (error) {
      console.error("Error fetching Orders:", error);
      setRecentOrders([]);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchAllCustomers = async () => {
    try {
      setIsLoading(true);
      const accessToken = getAccessToken();

      if (!accessToken) {
        console.error("No access token found");
        return;
      }

      const response = await api.get("/api/admin/getAllUsers", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      // console.log(response);

      if (response.data?.data) {
        setTotalCustomers(response.data.data);
      } else {
        setTotalCustomers([]);
      }
    } catch (error) {
      console.error("Error fetching Orders:", error);
      setRecentOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchItemSold = async () => {
    try {
      setIsLoading(true);
      const accessToken = getAccessToken();

      if (!accessToken) {
        console.error("No access token found");
        return;
      }

      const response = await api.get("/api/admin/getTotalItemSold", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log(response);

      if (response) {
        setTotalProductSold(response.data);
      } else {
        setTotalProductSold(0);
      }
    } catch (error) {
      console.error("Error fetching Orders:", error);
      setRecentOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getProfile = async () => {
    try {
      setIsLoading(true);
      const accessToken = getAccessToken();

      if (!accessToken) {
        console.error("No access token found");
        return;
      }

      const response = await api.get("/api/admin/getprofile", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response) {
        setProfileName(response.data.data.name);
        setProfileEmail(response.data.data.email);
      } else {
        setProfileName("");
        setProfileEmail("");
      }
    } catch (error) {
      console.error("Error fetching Orders:", error);
      setProfileName("");
      setProfileEmail("");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  // Use useEffect to fetch orders when dashboard view is selected
  useEffect(() => {
    if (currentView === "dashboard") {
      fetchAllOrders();
      fetchAllCustomers();
      fetchItemSold();
    }
  }, [currentView]);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <img src={satvikLogo} alt="Satvik Logo" className="logo" />
        </div>
        <nav className="nav-menu">
          <a
            onClick={() => setCurrentView("dashboard")}
            className={`nav-item ${
              currentView === "dashboard" ? "active" : ""
            }`}
            aria-label="User Account"
          >
            <LayoutDashboard
              className={`nav-item ${
                currentView === "dashboard" ? "active" : ""
              }`}
            />{" "}
            <p>Dashboard</p>
          </a>

          <a
            href="#"
            className={`nav-item ${
              currentView === "All-Products" ? "active" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              setCurrentView("All-Products");
            }}
          >
            <GalleryHorizontalEnd
              className={`nav-item ${
                currentView === "All-Products" ? "active" : ""
              }`}
            />
            All Products
          </a>
          <a
            href="#"
            className={`nav-item ${currentView === "Orders" ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              setCurrentView("Orders");
            }}
          >
            {" "}
            <LayoutList
              className={`nav-item ${currentView === "Orders" ? "active" : ""}`}
            />
            Orders
          </a>
          {/* <a href="#" className="nav-item">
             Draft
          </a> */}
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <h1 className="page-title">
            {currentView === "dashboard"
              ? "Dashboard"
              : currentView === "All-Products"
              ? "All Products"
              : currentView === "Orders"
              ? "Orders"
              : ""}
          </h1>
          <div className="user-section">
            <img src={userIcon} alt="User Icon" />
            <div className="user-info">
              <span>{profileName}</span>
              <br />
              {/* <span>({profileEmail})</span> */}
              <div className="profileDiv">
                <ul>
                  <li>Profile</li>
                  <li onClick={Logout}>
                    <a href="/">Log-out</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {currentView === "dashboard" && (
              <DashboardView
                recentOrders={recentOrders}
                totalCustomers={totalCustomers}
                totalProductSold={totalProductSold}
              />
            )}
            {currentView === "All-Products" && <AdminPP />}
            {currentView === "Orders" && <Orders />}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
