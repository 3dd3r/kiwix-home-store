// Declaring Variables

const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDom = document.querySelector(".products-center");

// Cart Items
let cart = [];

// getting Products
class Products {
    async getProducts() {
        try {
            const result = await fetch("products.json");
            let data = await result.json();
            let products = data.items;
            products = products.map(item => {
                const {title, price} = item.fields;
                const {id} = item.sys;
                const {image} = item.fields.image.file.url;
                return {id, title, price, image}
            })
        } catch (error) {
            console.log(error);
        }
    }
}


// display Products
class UI { }

// local Storage
class Storage { }

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();

    // get all products
    products.getProducts().then((value) => {
        console.log(value);
    })
});
