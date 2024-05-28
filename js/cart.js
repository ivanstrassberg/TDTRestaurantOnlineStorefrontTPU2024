document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cart-items");
  const totalPriceElement = document.getElementById("total");
  const emptyCartMessage = document.getElementById("emptyCartMessage");
  const clearCartButton = document.getElementById("clear-cart");
  const checkoutButton = document.getElementById("checkout");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const renderCart = () => {
    cartItemsContainer.innerHTML = "";
    if (cart.length === 0) {
      emptyCartMessage.style.display = "block";
      cartItemsContainer.style.display = "none";
      totalPriceElement.parentElement.style.display = "none";
      clearCartButton.style.display = "none";
      checkoutButton.style.display = "none";
    } else {
      emptyCartMessage.style.display = "none";
      cartItemsContainer.style.display = "block";
      totalPriceElement.parentElement.style.display = "block";
      clearCartButton.style.display = "block";
      checkoutButton.style.display = "block";

      let total = 0;

      cart.forEach((item) => {
        const itemElement = document.createElement("div");
        itemElement.classList.add("cart-item");
        itemElement.innerHTML = `
                <div class="cart-item-info">
                  <p class="cart-item-name">${item.name}</p>
                  <div>
                    <p class="cart-item-quantity">
                      <input type="number" class="item-quantity-input" value="${
                        item.quantity
                      }" min="1" data-id="${item.id}">
                      x ${
                        item.price * item.quantity
                      } ₽ <!-- Изменение цены в зависимости от количества -->
                    </p>
                  </div>
                </div>
                <button class="remove-item" data-id="${
                  item.id
                }">Удалить</button>
              `;
        cartItemsContainer.appendChild(itemElement);
        total += item.price * item.quantity;
      });

      totalPriceElement.textContent = total;
    }
  };

  const updateLocalStorage = () => {
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const handleQuantityChange = (event) => {
    const id = event.target.dataset.id;
    const newQuantity = parseInt(event.target.value);
    const item = cart.find((item) => item.id === id);
    item.quantity = newQuantity;
    updateLocalStorage();
    renderCart();
  };

  const handleRemoveItem = (event) => {
    const id = event.target.dataset.id;
    cart = cart.filter((item) => item.id !== id);
    updateLocalStorage();
    renderCart();
  };

  clearCartButton.addEventListener("click", () => {
    cart = [];
    updateLocalStorage();
    renderCart();
  });

  checkoutButton.addEventListener("click", () => {
    alert("Оформление заказа!");
  });

  document.addEventListener("input", (event) => {
    if (event.target.classList.contains("item-quantity-input")) {
      handleQuantityChange(event);
    }
  });

  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-item")) {
      handleRemoveItem(event);
    }
  });

  renderCart();
});
