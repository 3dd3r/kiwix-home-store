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
    getBaButtons() {
        const buttons = [...document.querySelectorAll('.bag-btn')];
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
                    
                })
            }
        });
    }

}

// local Storage
class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();

    // get all products
    products.getProducts().then(products => {

        ui.displayProduct(products)
        Storage.saveProducts(products)
    }).then(() => {
        ui.getBaButtons()
    });
});
