document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".slider");
  const goodsCards = document.querySelectorAll(".card");
  const categories = [
    "category-ready-meal",
    "category-drinks",
    "category-fruit",
  ];

  const updateCatalog = (categoryIndex, searchTerm = "") => {
    goodsCards.forEach((card) => {
      const isInCategory = card.classList.contains(categories[categoryIndex]);
      const isMatchingSearch = card.innerText
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      if (isInCategory && isMatchingSearch) {
        card.classList.remove("hidden");
        setTimeout(() => {
          card.classList.add("active");
        }, 10); // Задержка для активации анимации
      } else {
        card.classList.remove("active");
        setTimeout(() => {
          card.classList.add("hidden");
        }, 100); // Задержка для скрытия элемента после завершения анимации
      }
    });
  };

  slider.addEventListener("input", (e) => {
    updateCatalog(e.target.value);
  });

  const searchInput = document.getElementById("searchInput");
  const searchForm = document.getElementById("searchForm");

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();
    let foundCategory = false;

    goodsCards.forEach((card) => {
      if (card.innerText.toLowerCase().includes(searchTerm.toLowerCase())) {
        const category = categories.find((cat) => card.classList.contains(cat));
        slider.value = categories.indexOf(category);
        updateCatalog(slider.value, searchTerm);
        foundCategory = true;
      }
    });

    if (!foundCategory) {
      // Если не найдено товаров в выбранной категории, переключаем на первую категорию
      slider.value = 0;
      updateCatalog(0, searchTerm);
    }
  });

  // Инициализация с первой категорией
  updateCatalog(slider.value);
});

// catalogue.js

document.addEventListener("DOMContentLoaded", () => {
  const addToCartButtons = document.querySelectorAll(".add_cart");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const card = event.target.closest(".card");
      const productId = card.dataset.id;
      const productName = card.dataset.name;
      const productPrice = parseInt(card.dataset.price, 10);

      const cartItem = {
        id: productId,
        name: productName,
        price: productPrice,
        quantity: 1,
      };

      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const existingItem = cart.find((item) => item.id === productId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push(cartItem);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      alert(`${productName} добавлен в корзину!`);
    });
  });
});
