import {
  getFirestore,
  collection,
  doc,
  getDoc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import { app } from "../FIREBASECONFIG.js";

const auth = getAuth(app);
const db = getFirestore(app);

const userColRef = collection(db, "users");
const greetingEl = document.getElementById("greeting");
const logoutBtnEl = document.getElementById("logoutBtn");
const cartItemsEl = document.getElementById("cart-items");
const badgeEl = document.getElementById("badge")

let userCurrentId;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    userCurrentId = user.uid;
    try {
      const docRef = doc(userColRef, user.uid);
      const userCredential = await getDoc(docRef);

      if (userCredential.exists()) {
        const currentUser = userCredential.data();
        greetingEl.innerHTML = `Hi <span class="username"><b>${currentUser.username}</b></span>`;
        greetingEl.classList.add("show-greeting");

        await fetchCartItems();
        displayMenuItems();
      } else {
        window.location.href = "../index.html";
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  } 
});

logoutBtnEl.addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "../index.html";
  } catch (error) {
    console.error("Logout error:", error);
  }
});

const products = [
  {
    id: 1,
    name: "Italian Shell Pasta with Zucchini, Mushrooms & Tomato Sauce",
    price: 25000,
    description: "Veggie pasta shells in rich tomato sauce, tossed with seasoned mushrooms.",
    imageUrl: "../media/italian-pasta-shells-with-mushrooms-zucchini-tomato-sauce.jpg",
    category: "pasta"
  },
  {
    id: 2,
    name: "Penne-pasta-tomato-sauce-with-chicken-tomatoes",
    price: 17500,
    description: "Tender penne pasta in tomato sauce, topped with grilled chicken and fresh tomatoes.",
     imageUrl: "../media/penne-pasta-tomato-sauce-with-chicken-tomatoes-wooden-table.jpg",
    category: "pasta"
  },
  {
    id: 3,
      name: "Pasta-spaghetti-with-shrimps-tomato-sauce",
    price: 30000,
    description: "Spaghetti tossed in zesty tomato sauce, topped with tender shrimp and fresh herbs for a bold, savory bite..",
    imageUrl: "../media/pasta-spaghetti-with-shrimps-tomato-sauce-served-plate-dark-surface-closeup.jpg",
    category: "pasta"
  },
  {
    id: 4,
     name: "Rigatoni-pasta-with-chicken-meat-eggplant-tomato-sauce",
    price: 50000,
    description: "Rigatoni pasta served in a rich tomato sauce with juicy chicken, tender eggplant.",
    imageUrl: "../media/rigatoni-pasta-with-chicken-meat-eggplant-tomato-sauce-bowl.jpg",
    category: "pasta"
  },
  {
    id: 5,
    name: "Baked-chicken",
    price: 30000,
    description: "Oven-roasted chicken thighs seasoned with garlic and rosemary.",
    imageUrl: "../media/tasty-appetizing-baked-chicken-served-table-with-deco-closeup.jpg",
    category: "protein"
  },
  {
    id: 6,
    name: "Spicy peppered gizard",
    price: 12500,
    description: "Tender gizzard stir-fried in rich pepper sauce with onions and hot spices.",
      imageUrl: "../media/peppered gizard.jpg",
    category: "protein"
  },
  {
    id: 7,
    name: "Peppered turkey",
    price: 25000,
    description: "Juicy turkey pieces coated in spicy pepper sauce and sautéed with onions.",
    imageUrl: "../media/peppered turkey.jpg",
    category: "protein"
  },
  {
    id: 8,
    name: "River Fire Fish",
    price: 30000,
    description: "Fresh fish grilled and simmered in a hot, spicy pepper sauce with bold local spices.",
    imageUrl: "../media/sour-curry-with-snakehead-fish-spicy-garden-hot-pot-thai-food.jpg",
    category: "protein"
  },
  {
    id: 9,
    name: "Amala Ewedu with gbegiri",
    price: 7900,
    description: "Amala with rich ewedu and creamy gbegiri.",
    imageUrl: "../media/amala.png",
    category: "swallow"
  },
  {
    id: 10,
    name: "Semovita and Egusi Soup",
    price: 7900,
    description: "Semovita with richly seasoned egusi soup.",
    imageUrl: "../media/Semo.jpg",
    category: "swallow"
  },
  {
    id: 11,
    name: "Pounded Yam and vegetable soup",
    price: 15000,
    description: "Smooth pounded yam with rich Nigerian vegetable soup.",
    imageUrl: "../media/Pounded yam.jpg",
    category: "swallow"
  },
  {
    id: 12,
    name: "Semo and vegetable soup",
    price: 15000,
    description: "Stretchy semo with egusi, ogbono, or vegetable.",
    imageUrl: "../media/Semo.jpg",
    category: "swallow"
  },
  
];

const displayMenuItems = ()=>{
    products.forEach((product)=>{
        const sectionId = {
      pasta: "pastaSection",
      protein: "proteinSection",
      swallow: "swallowSection",
      pastry: "pastrySection"
    }[product.category];
 const section = document.getElementById(sectionId)
 if (section) {
    section.innerHTML += `
     <div class="col-md-3 mb-4">
          <div class="card h-100 bg-dark text-white">
            <img src="${product.imageUrl}" class="card-img-top" style="height: 150px; object-fit: cover;">
            <div class="card-body">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text">${product.description}</p>
              <div class="d-flex justify-content-between align-items-center">
                <span class="fw-bold text-warning" >₦${product.price.toLocaleString()}</span>
                <button style="border: white thin solid;"  class="btn btn-dark  btn-outline-warning  fw-bold   btn-sm add-to-cart" 
                data-id="${product.id}" 
                data-name="${product.name}"   
                data-price="${product.price}"  
                 data-img="${product.imageUrl}">Order</button>
              </div>
            </div>
          </div>
        </div>
      `;
 }
    })
    setupCartButtons()
};
const setupCartButtons = () => {
const addToCartButtons = document.querySelectorAll(".add-to-cart");
addToCartButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const getId = btn.getAttribute("data-id");
    const getName = btn.getAttribute("data-name");
    const getPrice = parseInt(btn.getAttribute("data-price"));
    const imageUrlEl = btn.getAttribute("data-img");

    const food = {
      id: getId,
      name: getName,
      price: getPrice,
      imageUrl: imageUrlEl,
    };

    AddFoodToCart(food);
  });
});
}
const AddFoodToCart = async (food) => {
  try {
    const orderColRef = collection(userColRef, userCurrentId, "Cart");

    await addDoc(orderColRef, {
      Id: food.id,
      Name: food.name,
      Price: food.price,
      imageUrl: food.imageUrl,
        Quantity: 1
    });

    console.log(" Item saved to Firestore:", food.name);
    await fetchCartItems();
  } catch (error) {
    console.error(" Error saving to cart:", error);
  }
};


const deleteProduct = async(delId,dels)=>{
  try {
     const cartRef = doc(db, "users", userCurrentId, "Cart" , delId);

     const deleteEach = await getDoc(cartRef)
     if(deleteEach){
      await deleteDoc(cartRef)
     }
     fetchCartItems()
     
  } catch (error) {
    console.log(error);
    
  }
}

const fetchCartItems = async () => {
  try {
    const cartRef = collection(db, "users", userCurrentId, "Cart");
    const cartSnapshot = await getDocs(cartRef);
     badgeEl.textContent = cartSnapshot.size;
    cartItemsEl.innerHTML = "";
     let totalAmount = 0;
    if (cartSnapshot.empty) {
      cartItemsEl.innerHTML = "<p>Your cart is empty.</p>";
      return;
    }
    cartSnapshot.forEach((docSnap) => {
          const item = docSnap.data();
          const foodId = docSnap.id
  const quantity = item.Quantity || 1;
  totalAmount += item.Price * quantity
  const itemId = docSnap.id;
      cartItemsEl.innerHTML += `
        <div class="cart-item mb-3 border-bottom pb-2">
          <div class="d-flex align-items-center">
            <img src="${item.imageUrl}" class="me-2 rounded" style="width: 60px; height: 60px; object-fit: cover;">
            <div>
              <h6 class="mb-0">${item.Name}</h6>
              <small>₦${item.Price.toLocaleString()}</small>
            </div>
          </div>
             <div class="d-flex align-items-center gap-1">
          <button class="btn btn-sm btn-light decrease-btn" data-id="${itemId}">−</button>
          <span class="mx-1">${quantity}</span>
          <button class="btn btn-sm btn-light increase-btn" data-id="${itemId}">+</button>
              <button class="btn btn-danger delBtnss" food="${foodId}">Remove</button>
          </div>
          </div>
          </div>
        
      `;
    });
    
        cartItemsEl.innerHTML += `
      <div class="cart-summary mt-4 text-end border-top pt-3">
        <h5>Total: ₦${totalAmount.toLocaleString()}</h5>
        <button id="checkoutBtn" class="btn btn-success mt-2">Checkout</button>
      </div>
    `;
    setupQuantityButtons()

    const deleteCart = document.querySelectorAll(".delBtnss")
    deleteCart.forEach((dels)=>{
      dels.addEventListener("click",()=>{     
        const delId = dels.getAttribute("food")
        deleteProduct(delId,dels)
      })
    })
  } catch (error) {
    console.error("Failed to fetch cart:", error);
    cartItemsEl.innerHTML = "<p>Error loading cart.</p>";
  }
};


const setupQuantityButtons = () => {
  const increaseBtns = document.querySelectorAll(".increase-btn");
  const decreaseBtns = document.querySelectorAll(".decrease-btn");

  increaseBtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const itemId = btn.getAttribute("data-id");
      const cartItemRef = doc(db, "users", userCurrentId, "Cart", itemId);
      const itemSnap = await getDoc(cartItemRef);

      if (itemSnap.exists()) {
        const currentQty = itemSnap.data().Quantity || 1;
        await updateDoc(cartItemRef, {
          Quantity: currentQty + 1,
        });
        await fetchCartItems(); 
        setupQuantityButtons(); 
      }
    });
  });

  decreaseBtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const itemId = btn.getAttribute("data-id");
      const cartItemRef = doc(db, "users", userCurrentId, "Cart", itemId);
      const itemSnap = await getDoc(cartItemRef);

      if (itemSnap.exists()) {
        const currentQty = itemSnap.data().Quantity || 1;

        if (currentQty > 1) {
          await updateDoc(cartItemRef, {
            Quantity: currentQty - 1,
          });
        } else {
          await deleteDoc(cartItemRef);
        }

        await fetchCartItems(); 
        setupQuantityButtons(); 
      }
    });
  });
};
setupQuantityButtons();


let latestCartSnapshot = null;
let totalAmountGlobal = 0;
let latestItemsList = [];

document.addEventListener("click", async (e) => {
  if (e.target && e.target.id === "checkoutBtn") {
    const cartRef = collection(db, "users", userCurrentId, "Cart");
    const cartSnapshot = await getDocs(cartRef);

    if (cartSnapshot.empty) {
      alert("Your cart is empty!");
      return;
    }

    let totalAmount = 0;
    let items = [];
    let htmlItems = "";

    cartSnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const qty = data.Quantity || 1;
      const subtotal = qty * data.Price;
      totalAmount += subtotal;

      items.push({
        Name: data.Name,
        Quantity: qty,
        Price: data.Price,
        Subtotal: subtotal,
        imageUrl: data.imageUrl,
      });

      htmlItems += `
        <div class="d-flex justify-content-between align-items-center border-bottom py-2">
          <div class="d-flex align-items-center">
            <img src="${data.imageUrl}" alt="${data.Name}" class="rounded me-2" style="width: 50px; height: 50px; object-fit: cover;">
            <div>
              <div class="fw-bold">${data.Name}</div>
              <small>${qty} x ₦${data.Price.toLocaleString()}</small>
            </div>
          </div>
          <div class="fw-semibold">₦${subtotal.toLocaleString()}</div>
        </div>
      `;
    });

    latestCartSnapshot = cartSnapshot;
    totalAmountGlobal = totalAmount;
    latestItemsList = items;

    document.getElementById("checkoutTotal").innerText = `₦${totalAmount.toLocaleString()}`;

    const modal = new bootstrap.Modal(document.getElementById("checkoutModal"));
    modal.show();
  }
});


document.getElementById("confirmCheckoutBtn").addEventListener("click", async () => {
  const fullName = document.getElementById("fullName").value.trim();
  const phoneNumber = document.getElementById("phoneNumber").value.trim();
  const address = document.getElementById("deliveryAddress").value.trim();
  const paymentMethod = document.getElementById("paymentMethod").value;

  if (!fullName || !phoneNumber || !address || !paymentMethod) {
    alert("Please fill in all required delivery and payment details.");
    return;
  }

  if (!latestCartSnapshot) {
    alert("Your cart is empty.");
    return;
  }

  try {
    await addDoc(collection(db, "users", userCurrentId, "ConfirmedOrders"), {
      items: latestItemsList,
      totalAmount: totalAmountGlobal,
      fullName,
      phoneNumber,
      address,
      paymentMethod,
      createdAt: new Date().toISOString()
    });

    for (const docSnap of latestCartSnapshot.docs) {
      await deleteDoc(doc(db, "users", userCurrentId, "Cart", docSnap.id));
    }

    const modal = bootstrap.Modal.getInstance(document.getElementById("checkoutModal"));
    modal.hide();

    const successModal = new bootstrap.Modal(document.getElementById("successModal"));
    successModal.show();

    await fetchCartItems();
  } catch (error) {
    console.error("Error confirming order:", error);
    alert("Something went wrong. Please try again.");
  }
});


const orderHistoryList = document.getElementById("orderHistoryList");


document.getElementById("orderHistoryBtn").addEventListener("click", async () => {
  if (!userCurrentId) return;

  orderHistoryList.innerHTML = `<li class="list-group-item">Loading...</li>`;

  try {
    const ordersRef = collection(db, "users", userCurrentId, "ConfirmedOrders");
    const ordersSnapshot = await getDocs(ordersRef);

    if (ordersSnapshot.empty) {
      orderHistoryList.innerHTML = `<li class="list-group-item text-center">No previous orders.</li>`;
      return;
    }

  let ordersHTML = "";
ordersSnapshot.forEach((doc) => {
  const order = doc.data();
  const date = new Date(order.createdAt).toLocaleString();

  let itemsHTML = "";
  order.items.forEach((item) => {
    itemsHTML += `<div>${item.Quantity} × ${item.Name} – ₦${item.Subtotal.toLocaleString()}</div>`;
  });

 ordersHTML += `
  <li class="list-group-item">
    <strong>${date}</strong><br>
    <div class="mb-2 ps-3">${itemsHTML}</div>
    <span class="fw-bold">Total: ₦${order.totalAmount.toLocaleString()}</span>
  </li>
`;
});

orderHistoryList.innerHTML = ordersHTML;

  } catch (error) {
    console.error("Failed to fetch order history:", error);
    orderHistoryList.innerHTML = `<li class="list-group-item text-danger">Error loading order history.</li>`;
  }
});
































































































