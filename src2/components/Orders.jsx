import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderDetailsPopup from "./OrderDetailsPopup";
import "./Orders.css";

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
  const [pickupLocations] = useState(["SATVIK RASS", "Rohan Garima"]);
  const [selectedPickupLocation, setSelectedPickupLocation] =
    useState("SATVIK RASS");
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

        // Apply date filter
        // if (dateFilter === 'Newest') {
        //   filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        // } else if (dateFilter === 'Oldest') {
        //   filteredOrders.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        // }

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
        ? { ...order, status: "FORWARDED" }
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

  // Add this function inside the Orders component
  // const handleStatusFilter = (e) => {
  //   const selectedStatus = e.target.value;
  //   console.log(selectedStatus)

  //   // Set the status filter
  //   setStatusFilter(selectedStatus);

  //   // Filter the orders based on the selected status
  //   const filteredOrders = filterOrdersByStatus(selectedStatus);

  //   console.log(filteredOrders)

  //   // Update the orders state with filtered orders
  //   setOrders(filteredOrders);
  // };

  // const filterOrdersByStatus = (selectedStatus) => {
  //   // If no status is selected, return all orders
  //   if (!selectedStatus) {
  //     return orders;
  //   }

  //   // Filter orders based on the selected status
  //   return orders.filter(order => order.status === selectedStatus);
  // };

  return (
    <>
      <div className={`orders-container ${selectedOrder ? "blurred" : ""}`}>
        <div className="orders-section">
          <div className="orders-header">
            <h2 className="orders-title">Orders</h2>
            {/* <div className="filters">
              <select
                disabled
                className="select-filter"
                value={statusFilter}
                onChange={handleStatusFilterChange}
              >
                <option value="">All Status</option>
                <option value="CREATED">CREATED</option>
                <option value="PENDING">PAID</option>
                <option value="COMPLETED">Forwarded</option>
              </select>
              <select
                disabled
                className="select-filter"
                value={dateFilter}
                onChange={handleDateFilterChange}
              >
                <option value="">All Dates</option>
                <option value="Newest">Newest</option>
                <option value="Oldest">Oldest</option>
              </select>
            </div> */}
            <div className="name-dropdown-container">
              <h2 className="dropdown-title">Select Pickup Location</h2>
              <div className="dropdown-wrapper">
                <select
                  value={selectedPickupLocation}
                  onChange={handleNameChange}
                  className="name-select"
                >
                  <option value="" disabled>
                    Choose a location
                  </option>
                  {pickupLocations.map((pickupLocation, index) => (
                    <option key={index} value={pickupLocation}>
                      {pickupLocation}
                    </option>
                  ))}
                </select>
                {selectedPickupLocation && (
                  <p className="selected-name">
                    Pickup Location: {selectedPickupLocation}
                  </p>
                )}
              </div>
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
                  className={order.status !== "CREATED" ? "greenbg" : ""}
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
                          disabled={order.status !== "PAID"}
                          className={`forward-order-btn ${
                            order.status !== "PAID" ? "disabled" : ""
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
