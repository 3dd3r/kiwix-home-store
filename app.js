// Declaring Variables

const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");

// Cart Items
let cart = [];

// getting Products
class Products {
    async getProducts() {
        try {
            let result = await fetch("products.json");
            let data = await result.json();

            let products = data.items;
            products = products.map(item => {
                const { id } = item.sys;
                const { title, price } = item.fields;
                const image = item.fields.image.fields.file.url;
                return { id, title, price, image }
            })
            return products
        } catch (error) {
            console.log(error);
        }
    }
}
// display Products
class UI {
    displayProduct(products) {
        let result = '';
        products.forEach(product => {
            result += `
            <!-- Single Product -->
      <article class="product">
        <div class="img-container">
          <img class="product-img" src=${product.image} alt="">
          <button class="bag-btn" data-id=${product.id}>
            <i class="fas fa-cart-plus"></i>
            Add to Cart
          </button>
        </div>
        <h3>${product.title}</h3>
        <h4>$${product.price}</h4>
      </article>
      <!-- End of single product -->
            `;
        });
        productsDOM.innerHTML = result;
    }
    getBagButtons() {
        const buttons = [...document.querySelectorAll('.bag-btn')];
        // buttonsDOM = buttons;
        buttons.forEach((button) => {
            let id = button.dataset.id;
            let inCart = cart.find((item) => item.id === id);
            if (inCart) {
                button.innerText = "In Cart";
                button.disabled = true;
            }  
                button.addEventListener('click', e => {
                    e.target.innerText = "In Cart";
                    e.target.disabled = true;
                    // Get Product from Products
                    let cartItem = {...Storage.getProduct(id), amount: 1 };
                    // Add product to Cart
                    cart = [...cart, cartItem];
                    // Save Cart in local storage
                    Storage.saveCart(cart);
                    // set Cart values
                    this.setCartValues(cart);
                    // display cart items
                    this.addCartItem(cartItem);
                    // show the Cart
                    this.showCart();
                });
            
        });
    }
    setCartValues(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        })
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2))
        cartItems.innerText = itemsTotal;
    }
    addCartItem(item) {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
        <img src=${item.image} alt="product">
          <div>
            <h4>${item.title}</h4>
            <h5>$${item.price}</h5>
            <span class="remove-item" data-id=${item.id}>Remove</span>
          </div>
          <div>
            <i class="fas fa-chevron-up" data-id=${item.id}></i>
            <p class="item-amount">${item.amount}</p>
            <i class="fas fa-chevron-down data-id=${item.id}"></i>
          </div>
        `;
        cartContent.appendChild(div);
    }

    showCart() {
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart');
    }
}

// local Storage
class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id);
    }
    static saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();

    // get all products
    products
        .getProducts()
        .then(products => {
            ui.displayProduct(products)
            Storage.saveProducts(products)
    })
        .then(() => {
            ui.getBagButtons()
    });
});
