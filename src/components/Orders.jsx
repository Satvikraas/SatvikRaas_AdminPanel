import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderDetailsPopup from "./OrderDetailsPopup";
import "./Orders.css";
import "./logistics-animations.css";

const api = axios.create({
  baseURL: "https://api.satvikraas.com",
  
  withCredentials: true,
  validateStatus: (status) => {
    return (status >= 200 && status < 300) || status === 302;
  },
});

function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const logisticsData = {
    "Delhivery One": ["SATVIK RASS", "Rohan Garima", "RA BREWING VENTURE LLP"],
    ShipRocket: ["Primary - RA BREWING VENTURE LLP", "Home - ROHAN GARIMA"],
  };

  const [selectedLogistics, setSelectedLogistics] = useState("Delhivery One");
  const [selectedPickupLocation, setSelectedPickupLocation] =
    useState("SATVIK RASS");

  const [shakeAnimation, setShakeAnimation] = useState(false);
  const [animateFlip, setAnimateFlip] = useState(false);

  const handleLogisticsChange = (e) => {
    const newLogistics = e.target.value;
    setSelectedLogistics(newLogistics);
    setSelectedPickupLocation(logisticsData[newLogistics][0]);// Reset pickup location when logistics changes

    // Trigger shake animation
    setShakeAnimation(true);
    setTimeout(() => setShakeAnimation(false), 500); // Remove the animation class after the duration

    // Trigger flip animation
    setAnimateFlip(true);
    setTimeout(() => setAnimateFlip(false), 500); // Remove the animation class after the duration
  };

  const handlePickupLocationChange = (e) => {
    setSelectedPickupLocation(e.target.value);
  };

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const getAccessToken = () => {
    return sessionStorage.getItem("accessToken");
  };

  const fetchAllOrders = async () => {
    try {
      setIsLoading(true);
      const accessToken = getAccessToken();

      if (!accessToken) {
        console.error("No access token found");
        return;
      }

      const response = await api.get("/api/admin/getAllOrders", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data?.data) {
        let filteredOrders = response.data.data;

        // Apply status filter
        if (statusFilter) {
          if (statusFilter !== "All Status")
            filteredOrders = filteredOrders.filter(
              (order) => order.status === statusFilter
            );
        }

        setOrders(filteredOrders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching Orders:", error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameChange = (event) => {
    setSelectedPickupLocation(event.target.value);
  };

  const updateOrderStatus = (razorpayOrderId) => {
    const updatedOrders = orders.map((order) =>
      order.razorpayOrderId === razorpayOrderId
        ? { ...order, status: "FORWORDED TO LOGISTICS" }
        : order
    );
    setOrders(updatedOrders);
  };

  const handleShipment = async (razorpayOrderId) => {
    try {
      const accessToken = getAccessToken();

      if (!accessToken) {
        console.error("No access token found");
        return false;
      }

      if(selectedLogistics==="Delhivery One"){

        const response = await api.post(`/api/admin/createdelhiveryorder`, null, {
          params: {
            razorpayOrderId: razorpayOrderId,
            pickupLocation: selectedPickupLocation,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        alert("Forward order has been created for Delhivery One")

      }
      else {

        console.log("in shiprocket")
       

        const response = await api.post(`/api/admin/shiprocketorder`, null, {
          params: {
            razorpayOrderId: razorpayOrderId,
            pickupLocation: selectedPickupLocation,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        alert("Forward order has been created for shiprocket")

      }

      

      return true;
    } catch (error) {
      console.error("Pickup order error:", error);
      return false;
    }
  };

  const handleStatusFilterChange = (event) => {
    console.log("handleStatusFilterChange");
    console.log("event.target.value");
    setStatusFilter(event.target.value);
    fetchAllOrders();
  };

  const handleDateFilterChange = (event) => {
    setDateFilter(event.target.value);
    fetchAllOrders();
  };

  return (
    <>
      <div className={`orders-container ${selectedOrder ? "blurred" : ""}`}>
        <div className="orders-section">
          <div className="orders-header">
            <h2 className="orders-title">Orders</h2>

            <div className="logistics-div">
              <div
                className={`name-dropdown-container`}
              >
                <h2 className="dropdown-title">Select Logistics</h2>
                <div className="dropdown-wrapper">
                  <select
                    value={selectedLogistics}
                    onChange={handleLogisticsChange}
                    className={`name-select ${
                      shakeAnimation ? "shake-animation" : ""
                    }`}
                  >
                    <option value="" disabled>
                      Choose a logistics provider
                    </option>
                    {Object.keys(logisticsData).map((logistic, index) => (
                      <option key={index} value={logistic}>
                        {logistic}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedLogistics && (
                <div
                  className={`name-dropdown-container ${
                    animateFlip ? "flip-animation" : "" 
                  }`}
                >
                  <h2 className="dropdown-title">Select Pickup Location</h2>
                  <div className="dropdown-wrapper">
                    <select
                      value={selectedPickupLocation}
                      onChange={handlePickupLocationChange}
                      className="name-select"
                    >
                      <option value="" disabled>
                        Choose a pickup location
                      </option>
                      {logisticsData[selectedLogistics].map(
                        (location, index) => (
                          <option key={index} value={location}>
                            {location}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Name</th>
                  <th>Order Date</th>
                  <th>Location</th>
                  <th>Total Amount</th>
                  <th>Total Weight</th>
                  <th>Status</th>
                  <th>Type</th>
                  <th>View</th>
                  <th>Action</th>
                </tr>
              </thead>
              {isLoading ? (
                <tbody>
                  <tr>
                    <td colSpan="9" className="loading-cell">
                      Loading...
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {orders.map((order, index) => (
                    <tr
                      key={index}
                      className={order.status == "PAID" || order.status == "COD" || order.status == "FORWORDED TO LOGISTICS"? "greenbg" : ""}
                    >
                      <td>{order.razorpayOrderId}</td>
                      <td>{order.userName}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>
                        {order.address.city}-{order.address.country}
                      </td>
                      <td>{order.totalAmount.toFixed(2)} RS</td>
                      <td>{order.totalWeight} kg</td>
                      <td>{order.status}</td>
                      <th>{order.type}</th>
                      <td>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="view-details-btn"
                        >
                          View Details
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={async (event) => {
                            const res = await handleShipment(
                              order.razorpayOrderId
                            );
                            if (res) {
                              updateOrderStatus(order.razorpayOrderId);
                            }
                          }}
                          disabled={order.status !== "PAID" || order.status !== "COD"}
                          className={`forward-order-btn ${
                            order.status !== "PAID" && order.status !== "COD"  ? "disabled" : ""
                          }`}
                        >
                          Make Forward Order
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>
      {selectedOrder && (
        <OrderDetailsPopup
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
}

export default Orders;
