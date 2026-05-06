/*****************************************************
 * INITIAL DATA (for demonstration)
 *****************************************************/
if (!localStorage.getItem('products')) {
    const initialProducts = [
      {
        id: 1,
        name: 'Warm Vanilla',
        price: 50,
        image: 'images/product1.jpg'
      },
      {
        id: 2,
        name: 'Amber Bloom',
        price: 60,
        image: 'images/product2.jpg'
      },
      {
        id: 3,
        name: 'Golden Rose',
        price: 70,
        image: 'images/product3.jpg'
      },
      {
        id: 4,
        name: 'Fresh Rice',
        price: 50,
        image: 'images/product4.jpg'
      },
      {
        id: 5,
        name: 'Macha Tea',
        price: 60,
        image: 'images/product5.jpg'
      },
      {
        id: 6,
        name: 'Rain Pour',
        price: 70,
        image: 'images/product6.jpg'
      }
    ];
    localStorage.setItem('products', JSON.stringify(initialProducts));
  }
  
  
  if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
  }
  
  
  function getCurrentUser() {
    return localStorage.getItem('currentUser') 
      ? JSON.parse(localStorage.getItem('currentUser')) 
      : null;
  }
  
  function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
  
  function logoutUser() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html'; 
  }
  
  function isAdmin() {
    const user = getCurrentUser();
    return user && user.username === 'admin';
  }
  
  
  document.addEventListener('DOMContentLoaded', () => {
    updateLoginLink();
    handleIndexPage();
    handleAdminPage();
    handleCartPage();
    handleLoginPage();
  });
  
 
  function updateLoginLink() {
    const loginLink = document.getElementById('loginLink');
    const loginBtn = document.getElementById('loginBtn');
    if (!loginLink || !loginBtn) return;
  
    const user = getCurrentUser();
    if (user) {
      
      loginBtn.textContent = 'Logout';
      loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        logoutUser();
      });
    } else {
      // User is not logged in
      loginBtn.textContent = 'Login';
      loginBtn.href = 'login.html';
    }
  }
  
  
  function handleLoginPage() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;
  
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
  
      
      if (username === 'admin' && password === 'admin123') {
        setCurrentUser({ username: 'admin' });
        window.location.href = 'admin.html';
      } else {
        
        setCurrentUser({ username: username });
        window.location.href = 'index.html';
      }
    });
  }
  
  
  function handleIndexPage() {
    const productList = document.getElementById('productList');
    if (!productList) return; 
  
    
    displayProducts();
  
    
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
  
    if (searchBtn && searchInput) {
      searchBtn.addEventListener('click', () => {
        const searchTerm = searchInput.value.toLowerCase();
        displayProducts(searchTerm);
      });
    }
  }
  
  function displayProducts(searchTerm = '') {
    const productList = document.getElementById('productList');
    const products = JSON.parse(localStorage.getItem('products')) || [];
  
    
    const filteredProducts = products.filter(prod =>
      prod.name.toLowerCase().includes(searchTerm)
    );
  
    
    productList.innerHTML = '';
  
    
    filteredProducts.forEach(product => {
      const card = document.createElement('div');
      card.classList.add('product-card');
  
      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>Price: $${product.price}</p>
        <button data-id="${product.id}">Add to Cart</button>
      `;
      productList.appendChild(card);
  
      
      const btn = card.querySelector('button');
      btn.addEventListener('click', () => {
        addToCart(product.id);
      });
    });
  }
  
  
  function addToCart(productId) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    const product = products.find(p => p.id === productId);
    if (product) {
      cart.push(product);
      localStorage.setItem('cart', JSON.stringify(cart));
      alert(`${product.name} added to cart!`);
    }
  }
  
 
  function handleCartPage() {
    const cartItemsContainer = document.getElementById('cartItems');
    if (!cartItemsContainer) return; 
  
    const cartTotal = document.getElementById('cartTotal');
  
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartItemsContainer.innerHTML = '';
  
    let total = 0;
  
    cart.forEach((item, index) => {
      total += item.price;
      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      cartItem.innerHTML = `
        <span>${item.name}</span>
        <span>$${item.price}</span>
        <button data-index="${index}">Remove</button>
      `;
      cartItemsContainer.appendChild(cartItem);
  
      
      const removeBtn = cartItem.querySelector('button');
      removeBtn.addEventListener('click', () => {
        removeCartItem(index);
      });
    });
  
    cartTotal.textContent = `Total: $${total}`;
  }
  
  function removeCartItem(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    window.location.reload();
  }
  
  
  function handleAdminPage() {
    const adminSection = document.querySelector('.admin-section');
    if (!adminSection) return; 
  
    const user = getCurrentUser();
    const adminMessage = document.getElementById('adminMessage');
    const addProductForm = document.getElementById('addProductForm');
    const adminProductList = document.getElementById('adminProductList');
  
    
    if (!isAdmin()) {
      adminMessage.textContent = 'Access Denied. Admins only.';
      addProductForm.style.display = 'none';
      return;
    }
  
    
    displayAdminProducts();
  
    
    addProductForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const productName = document.getElementById('productName').value;
      const productPrice = parseFloat(document.getElementById('productPrice').value);
      const productImage = document.getElementById('productImage').value;
  
      const products = JSON.parse(localStorage.getItem('products')) || [];
      const newId = products.length ? products[products.length - 1].id + 1 : 1;
      const newProduct = {
        id: newId,
        name: productName,
        price: productPrice,
        image: productImage
      };
  
      products.push(newProduct);
      localStorage.setItem('products', JSON.stringify(products));
  
      
      addProductForm.reset();
  
      
      displayAdminProducts();
    });
  
    function displayAdminProducts() {
      const products = JSON.parse(localStorage.getItem('products')) || [];
      adminProductList.innerHTML = '';
  
      products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product-card');
        productDiv.style.width = '100%';
        productDiv.innerHTML = `
          <h3>${product.name}</h3>
          <p>Price: $${product.price}</p>
          <img src="${product.image}" alt="${product.name}" style="max-width: 100px;">
          <button data-id="${product.id}" class="delete-product">Delete</button>
        `;
        adminProductList.appendChild(productDiv);
  
        
        const deleteBtn = productDiv.querySelector('.delete-product');
        deleteBtn.addEventListener('click', () => {
          deleteProduct(product.id);
        });
      });
    }
  
    function deleteProduct(id) {
      let products = JSON.parse(localStorage.getItem('products')) || [];
      products = products.filter(prod => prod.id !== id);
      localStorage.setItem('products', JSON.stringify(products));
      displayAdminProducts();
    }
  }
  

  let slideIndex = 0;

function showSlides() {
  let slides = document.querySelectorAll(".slide");
  
  slides.forEach(slide => slide.style.display = "none");

  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }

  slides[slideIndex - 1].style.display = "block";
  setTimeout(showSlides, 3000); 
}


document.addEventListener("DOMContentLoaded", showSlides);
