import { getProduct } from "../api";
import { getCartItems, setCartItems } from "../localStorage";
import { parseRequestUrl, rerender } from "../utils";

const addToCart = (item, forceUpdate = false) => {
  let cartItems = getCartItems();

  const existItem = cartItems.find((x) => x.product_id === item.product_id);

  if (existItem) {
    // forceUpdate for using in increase quantity in the Cart Screen, ...
    if (forceUpdate) {
      cartItems = cartItems.map((x) =>
        x.product_id === existItem.product_id ? item : x
      );
    }
  } else {
    cartItems = [...cartItems, item];
  }

  setCartItems(cartItems);

  if (forceUpdate) {
    rerender(CartScreen);
  }
};

const removeFromCart = (id) => {
  const deletedCartItems = getCartItems().filter((x) => x.product_id !== id);
  setCartItems(deletedCartItems);

  if (id === parseRequestUrl().id) {
    document.location.hash = "/cart";
  } else {
    rerender(CartScreen);
  }
};

const calculateSubtotal = (cartItems) => {
  return cartItems.reduce((sum, cur) => sum + cur.qty, 0);
};

const calculateTotalPrice = (cartItems) => {
  return cartItems.reduce((sum, cur) => sum + cur.price * cur.qty, 0);
};

const CartScreen = {
  after_render: async () => {
    const qtySelects = document.querySelectorAll(".qty-select");
    const deleteButtons = document.querySelectorAll(".delete-button");
    const checkoutButton = document.querySelector('#checkout-button');

    Array.from(qtySelects).forEach((qtySelect) => {
      qtySelect.addEventListener("change", (e) => {
        const item = getCartItems().find((x) => x.product_id === qtySelect.id);
        addToCart({ ...item, qty: Number(e.target.value) }, true);
      });
    });

    Array.from(deleteButtons).forEach((deleteButton) => {
      deleteButton.addEventListener("click", (e) => {
        removeFromCart(deleteButton.id);
      });
    });

    checkoutButton.addEventListener('click', (e) => {
      window.location.hash = "/signin";
    })
  },
  render: async () => {
    const request = parseRequestUrl();

    if (request.id) {
      const product = await getProduct(request.id);

      addToCart({
        product_id: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        qty: 1,
      });
    }

    const cartItems = getCartItems();

    return `
      <div class="content cart">
        <div class="cart-list">
          <ul class="cart-list-container">
            <li>
              <h3>Shopping Cart</h3>
              <div>Price</div>
            </li>
            ${
              cartItems.length === 0
                ? `<div>Cart is empty. <a href="/#/">Go Shopping</a></div>`
                : cartItems
                    .map((item) => {
                      return `
                  <li>
                    <div class="cart-image">
                      <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-name">
                      <div>
                        <a href="${`/#/product/${item.product_id}`}">${
                        item.name
                      }</a>
                      </div>
                      <div>
                        Qty: <select class="qty-select" id="${item.product_id}">
                        ${
                          item.countInStock &&
                          [...Array(item.countInStock).keys()]
                            .map((x) =>
                              item.qty === x + 1
                                ? `<option value="${x + 1}" selected>${
                                    x + 1
                                  }</option>`
                                : `<option value="${x + 1}">${x + 1}</option>`
                            )
                            .join("\n")
                        }

                        ${
                          item.countInStock
                            ? ""
                            : `<option value="0">0</option>`
                        }
                        </select>
                        <button type="button" class="delete-button" id="${
                          item.product_id
                        }">Delete</button>
                      </div>
                    </div>
                    <div class="cart-price">
                      $${item.price}
                    </div>
                  </li>
                `;
                    })
                    .join("\n")
            }
          </ul>
        </div>
        <div class="cart-action">
            <h3>Subtotal ${calculateSubtotal(cartItems)} items
              :
              $${calculateTotalPrice(cartItems)} 
            </h3>
            <button id="checkout-button" class="primary fw">
              Proceed to Checkout
            </button>
        </div>
      </div>
    `;
  },
};

export default CartScreen;
