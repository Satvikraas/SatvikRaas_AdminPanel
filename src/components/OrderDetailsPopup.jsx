import React from 'react';
import { X, Package, User, Calendar, MapPin, DollarSign, Weight } from 'lucide-react';
import './OrderDetailsPopup.css';

const OrderDetailsPopup = ({ order, onClose }) => {
  if (!order) return null;

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="order-popup-overlay">
      <div className="order-popup-container">
        <button className="popup-close-btn" onClick={onClose} aria-label="Close popup">
          <X size={24} />
        </button>
        
        <div className="popup-header">
          <div className="header-content">
            <Package size={32} className="header-icon" />
            <div>
              <h2>Order Details</h2>
              <p className="order-id">Order ID: {order.razorpayOrderId}</p>
            </div>
          </div>
        </div>
        
        <div className="popup-content">
          <div className="order-info-grid">
            {/* Customer Information Section */}
            <div className="info-section customer-info">
              <h3>
                <User size={20} className="section-icon" /> 
                Customer Information
              </h3>
              <div className="info-detail">
                <strong>Name:</strong> 
                <span>{order.userName}</span>
              </div>
              <div className="info-detail">
                <strong>Address:</strong>
                <address className="full-address">
                  {order.address.landmark && (
                    <div>{order.address.landmark},</div>
                  )}
                  {order.address.street && (
                    <div>{order.address.street},</div>
                  )}
                  <div>
                    {order.address.city}, {order.address.state},
                  </div>
                  <div>{order.address.country},</div>
                  {order.address.postalCode && (
                    <div>PIN: {order.address.postalCode}</div>
                  )}
                </address>
              </div>
            </div>
            
            {/* Order Summary Section */}
            <div className="info-section order-summary">
              <h3>
                <DollarSign size={20} className="section-icon" /> 
                Order Summary
              </h3>
              <div className="summary-grid">
                <div className="info-detail">
                  <Calendar size={16} />
                  <strong>Created At:</strong>
                  <span>{new Date(order.createdAt).toLocaleString()}</span>
                </div>
                <div className="info-detail">
                  <MapPin size={16} />
                  <strong>Delivery Location:</strong>
                  <span>{order.address.city}, {order.address.country}</span>
                </div>
                <div className="info-detail">
                  <Weight size={16} />
                  <strong>Total Weight:</strong>
                  <span>{order.totalWeight} kg</span>
                </div>
                <div className="info-detail">
                  <DollarSign size={16} />
                  <strong>Total Amount:</strong>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
                <div className="info-detail">
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Ordered Items Section */}
          <div className="order-items-section">
            <h3>
              <Package size={20} className="section-icon" /> 
              Ordered Items
            </h3>
            <table className="order-items-table">
              <thead>
                <tr>
                  <th>Sr.no</th>
                  <th>Product</th>
                  <th>Weight</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Discount</th>
                  <th>Final Price</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems.map((item, index) => (
                  <tr key={index}>
                     <th>{index+1}</th>
                    <td>{item.productVariant.productName}</td>
                    <td>{item.productVariant.weight}</td>
                    <td>{item.quantity}</td>
                    <td>{formatCurrency(item.priceAtOrder)}</td>
                    <td>{item.discountAtOrder}%</td>
                    <td>{formatCurrency(item.finalPrice)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="6" className="total-label">Total Items:</td>
                  <td className="total-value">{order.orderItems.length}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPopup;