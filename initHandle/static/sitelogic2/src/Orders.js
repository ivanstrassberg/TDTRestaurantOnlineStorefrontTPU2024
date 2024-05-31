
import React, { useEffect, useState } from 'react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/orders', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': localStorage.getItem('X-Authorization'),
        'email': localStorage.getItem('email'),
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        return response.json();
      })
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="orders-container">
      <h1>Your Orders</h1>
      {orders.length === 0 ? (
        <p>You have no orders.</p>
      ) : (
        <ul>
          {orders.map(order => (
            <li key={order.id}>
              <h3>Order #{order.id}</h3>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
              <p>Total: {order.total.toFixed(2)} руб.</p>
              <ul>
                {order.items.map(item => (
                  <li key={item.id}>
                    {item.name} - {item.quantity} x {item.price.toFixed(2)} руб.
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Orders;
