// Variables
let productCart = [];
let quantity = 1;

const primaryNav = document.querySelector('.primary-nav-bar');
const navToggle = document.querySelector('.mobile-nav-toggle');
const navOverlay = document.querySelector('.primary-nav-bar-overlay');

const cartOverlay = document.querySelector('.cart-overlay');
const cartItem = document.querySelector('.cart-items');
const totalPrice = document.querySelector('.cart-checkout-amt');

const addToCartBtn = document.querySelectorAll('.add-to-cart');
const openCartBtn = document.querySelector('.shopping-cart-btn');
const closeCartBtn = document.querySelector('.close-cart-btn');
const products = document.querySelectorAll('.product');

// functions
const showCart = () => {
    cartOverlay.classList.remove('hide');
}

const hideCart = () => {
    cartOverlay.classList.add('hide');
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach ((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show');
        }
    });
});
const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((element) => observer.observe(element));


const findIndex = (itemId) => {
    let targetIndex = -1;
    for (i = 0 ; i < productCart.length ; i ++) {
        if (productCart[i].id == itemId) {
            targetIndex = i;
        }
    }
    return targetIndex;
}

const isProductAlreadyExist = (productCartArray, productName) => {
    return productCartArray.some(product => product.name === productName);
}

const fetchFromLocalStorage = () => {
    const localStorageData = localStorage.getItem('products');
    const localStoragePrice = localStorage.getItem('price');
    if (localStorageData) {
        productCart = JSON.parse(localStorageData);
        productCart.forEach (product => {
            renderCart(product)
        })
    }
    updateCheckoutPrice();
}

const updateCheckoutPrice = () => {
    let checkoutPrice = 0;
    let totalCheckoutPrice = 0;
    const totalCheckoutPriceText = document.querySelector('.cart-checkout-amt');
    productCart.forEach((product, index) => {
        checkoutPrice = parseFloat(product.price) * product.quantity;
        totalCheckoutPrice += checkoutPrice;
        totalCheckoutPrice.toFixed(2);
    });
    totalCheckoutPriceText.textContent = totalCheckoutPrice.toFixed(2);
    localStorage.setItem('price', JSON.stringify(totalCheckoutPrice));
}

const increaseCartAmount = (itemId) => {
    const index = findIndex(itemId);
    let productQuantityText = document.querySelectorAll('.product-quantity');
    let quantity;
    productCart[index].quantity += 1;
    productQuantityText[index].textContent = productCart[index].quantity;
    updateCheckoutPrice();
}

const decreaseCartAmount = (itemId) => {
    const index = findIndex(itemId);
    let productQuantityText = document.querySelectorAll('.product-quantity');
    productCart[index].quantity -= 1;
    productQuantityText[index].textContent = productCart[index].quantity;
    updateCheckoutPrice();
}

const handleClicks = (e) => {
    if (e.target.classList.contains('increase-amt-btn')) {
        const itemId = e.target.parentElement.parentElement.id;
        increaseCartAmount(itemId);
    } if (e.target.classList.contains('decrease-amt-btn')) {
        const itemId = e.target.parentElement.parentElement.id;
        decreaseCartAmount(itemId);
    } if (e.target.classList.contains('remove-item-btn')) {
        const itemId = e.target.parentElement.parentElement.id;
        removeFromCart(itemId);
    }
}

const product = (productName, productPrice, productImage) => {
    if (isProductAlreadyExist(productCart, productName)) {
        alert(`product ${productName} is already in cart`);
        return
    }

    const product = {
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: 1,
        id: Date.now()
    };

    productCart.push(product);
    localStorage.setItem('products', JSON.stringify(productCart));
    updateCheckoutPrice();
    renderCart(product);
}


const addToCart = (index) => {
    const productName = products[index].querySelector('.product-name').textContent;
    const productPrice = products[index].querySelector('.price').textContent;
    const productImage = products[index].querySelector('.item-image').getAttribute('src');

    product(productName, productPrice, productImage);
}

const renderCart = (product) => {
    const cartItems = document.querySelector('.cart-items');
    const newItem = document.createElement('div');

    newItem.classList.add('cart-item');
    newItem.setAttribute('id', `${product.id}`)
    newItem.innerHTML = `
        <div class="cart-product-image">
            <img src="${product.image}" alt="" class="cart-item-image">
        </div>
        <div class="product-details">
            <h4 class="product-name">${product.name}</h4>
            <p class="product-price">$${product.price}</p>
            <button class="remove-item-btn">remove</button>
        </div>
        <div class="cart-ctrls">
            <button class="ctrl increase-amt-btn" id="${product.id}">&and;</button>
            <span class="product-quantity">1</span>
            <button class="ctrl decrease-amt-btn" id="${product.id}">&or;</button>
        </div>
    `;
    cartItems.appendChild(newItem);
}

const removeFromCart = (itemId) => {
    const itemToRemove = document.getElementById(`${itemId}`);
    const index = findIndex(itemId);
    for (let i= 0; index < productCart.length; i++) {
        if(index > -1 && index < productCart.length) {
            productCart.splice(index, 1);
            itemToRemove.remove();
        } else {
            alert("invalid index specified")
        }
    }
}


// event listeners
addToCartBtn.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        addToCart(index);
    })
});
window.addEventListener("scroll", () => {
    const navbar = document.querySelector("header");
    if (this.window.scrollY > 0) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});
navToggle.addEventListener('click', () => {
    const visibility = primaryNav.getAttribute('data-visible');
    if (visibility === 'false') {
        primaryNav.setAttribute('data-visible', 'true');
        navOverlay.setAttribute('data-visible', 'true');
        navToggle.setAttribute('aria-expanded', true);
    } else {
        primaryNav.setAttribute('data-visible', 'false');
        navOverlay.setAttribute('data-visible', 'false');
        navToggle.setAttribute('aria-expanded', false);
    }
});
openCartBtn.addEventListener('click', showCart);
closeCartBtn.addEventListener('click', hideCart);
cartItem.addEventListener('click', handleClicks);
document.addEventListener('DOMContentLoaded', fetchFromLocalStorage);