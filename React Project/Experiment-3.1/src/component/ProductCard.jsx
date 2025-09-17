import React from "react";
import "../App.css"; 

function ProductCard({ name, price, status }) {
  return (
    <div className="product-card">
      <div className="product-name">{name}</div>
      <div className="product-price"><strong>Price:</strong> ${price}</div>
      <div className="product-status"><strong>Status:</strong> {status}</div>
    </div>
  );
}

export default ProductCard;
