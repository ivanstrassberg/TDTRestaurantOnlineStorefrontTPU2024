import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ProductDetail() {
  const { id } = useParams(); // Get the dynamic route parameter
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/product/${id}`) // Fetch the product details by ID
      .then((response) => response.json())
      .then((data) => {
        setProduct(data[0]);
        console.log(data)
      })
      .catch((error) => {
        console.error('Error fetching product:', error);
      });
  }, [id]);
  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <p>Description: {product.description}</p>
      <p>Price: ${product.price}</p>
      <p>Stock: {product.stock}</p>
      <p>Rating: {product.rating}</p>
    </div>
  );
}

export default ProductDetail;
