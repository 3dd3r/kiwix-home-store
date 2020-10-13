// const contentful = require("contentful");
const client = contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: "i3jkzk6o0xbg",
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: "d-QfXSoNwjXwPV09gPTh8z0_-b2KZQ-3VsPwW32i-0I"
});

// This API call will request an entry with the specified ID from the space defined at the top, using a space-specific access token.
// client
//   .getEntry("5PeGS2SoZGSa4GuiQsigQu")
//   .then(entry => console.log(entry))
//   .catch(err => console.log(err));


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


const showMenu = () => {
    const toggleNav = document.querySelector(".toggle-nav");
    const iconMenu = document.querySelector(".icon-menu");
    iconMenu.addEventListener('click', () => {
        toggleNav.classList.toggle('nav-active');
    });
}

showMenu ();


// Cart Items
let cart = [];

let buttonsDOM = [];

// getting Products
class Products {
    async getProducts() {
        try {
            let contentful = await client.getEntries({
                content_type: "kiwixHomeProducts"
            });
            
            // let result = await fetch("products.json");
            // let data = await result.json();

            let products = contentful.items;
            products = products.map(item => {
                const { title, price } = item.fields;
                const { id } = item.sys;
                const image = item.fields.image.fields.file.url;
                return { title, price, id, image }
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
        buttonsDOM = buttons;
        buttons.forEach((button) => {
            let id = button.dataset.id;

            let inCart = cart.find((item) => item.id === id);
            if (inCart) {
                button.innerText = "In Cart";
                button.disabled = true;
            } else {

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
            }
            
        });
    }
    setCartValues(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        })
        cartTotal.innerText = parseFloat(tempTotal).toFixed(2)
        cartItems.innerText = itemsTotal;

    }
    addCartItem(item) {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
        <img src=${item.image} alt=${item.title}>
          <div>
            <h4>${item.title}</h4>
            <h5>$${item.price}</h5>
  
            <i class="fas fa-trash-alt" data-id=${item.id}> </i>

          </div>
          <div>
            <i class="fas fa-chevron-up" data-id=${item.id}></i>
            <p class="item-amount">${item.amount}</p>
            <i class="fas fa-chevron-down" data-id=${item.id}></i>
          </div>
        `;
        cartContent.appendChild(div);
    }

    showCart() {
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart');
    }
    setupApp() {
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener('click', this.showCart);
        closeCartBtn.addEventListener('click', this.hideCart)
    }
    populateCart(cart) {
        cart.forEach(item => this.addCartItem(item));
    }
    hideCart() {
        cartOverlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('showCart');
    }
    cartLogic() {
        // clear cart button
        clearCartBtn.addEventListener('click', () => {
            this.clearCart();
        });
        // cart functionality
        cartContent.addEventListener('click', e => {
            if (e.target.classList.contains('fa-trash-alt')) {

                let removeItem = e.target;
                let id = removeItem.dataset.id;
                console.log(removeItem.parentElement.parentElement);
                cartContent.removeChild(removeItem.parentElement.parentElement);
                this.removeItem(id);

            } else if (e.target.classList.contains('fa-chevron-up')) {
                let addAmount = e.target;
                let id = addAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount + 1;
                Storage.saveCart(cart);
                this.setCartValues(cart);
                addAmount.nextElementSibling.innerText = tempItem.amount;

            } else if (e.target.classList.contains('fa-chevron-down')) {
                let lowerAmount = e.target;
                let id = lowerAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);

                tempItem.amount = tempItem.amount - 1;

                if (tempItem.amount > 0) {
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    lowerAmount.previousElementSibling.innerText = tempItem.amount;
                } else {
                    cartContent.removeChild(lowerAmount.parentElement.parentElement);
                    this.removeItem(id)
                }
            }
        })
    }

    clearCart() {
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));

        while(cartContent.children.length > 0) {
            cartContent.removeChild(cartContent.children[0])
        }
        this.hideCart();
    }
    removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to cart`;
    }
    getSingleButton(id) {
        return buttonsDOM.find(button => button.dataset.id === id);
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
    static getCart() {
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();

    // Setup APP
    ui.setupApp();
    // get all products
    products
        .getProducts()
        .then(products => {
            ui.displayProduct(products)
            Storage.saveProducts(products)
    })
        .then(() => {
            ui.getBagButtons();
            ui.cartLogic()
    });
});
