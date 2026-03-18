// ── تحميل السلة من localStorage أو بيانات تجريبية ──
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ── تحويل البيانات القديمة (recipeIngredients) للصيغة الجديدة (items) ──
cart = cart.map(function(recipe) {
  return {
    name: recipe.name || recipe.recipeName || "وصفة",
    items: (recipe.items || recipe.recipeIngredients || []).map(function(item) {
      return {
        name: item.name || "مكون",
        gram: item.gram || item.quantity || 0,
        price: item.price || 0,
        qty: item.qty || 1
      };
    })
  };
});

// ── إيموجي للمكونات ──
function getEmoji(name) {
  const map = { "دجاج":"🍗","لحم":"🥩","جبن":"🧀","طماطم":"🍅","ثوم":"🧄","ليمون":"🍋","بيض":"🥚","خيار":"🥒" };
  for (const key in map) {
    if (name.includes(key)) return map[key];
  }
  return "🛒";
}

// ── حساب الأسعار ──
function updateTotals() {
  let sub = 0, count = 0;

  cart.forEach(function(recipe) {
    recipe.items.forEach(function(item) {
      sub += item.price * item.qty;
      count++;
    });
  });

  const delivery =0
  const tax = Math.round(sub * 0.15);

  document.getElementById("sub").textContent         = sub + " ر.س";
  var dell= document.getElementById("del")
  document.getElementById("del").textContent         = " مجاني";
  document.getElementById("tax").textContent         = tax + " ر.س";
  document.getElementById("tot").textContent         = (sub + delivery + tax) + " ر.س";
  document.getElementById("count-badge").textContent = count + " أصناف";
  document.getElementById("buy-btn").disabled        = count === 0;
  dell.style.color="green"
}

// ── رسم السلة ──
function render() {
  const cartEl = document.getElementById("cart");
  cartEl.innerHTML = "";

  // فلتر الوصفات الفارغة
  const filled = cart.filter(function(r) { return r.items.length > 0; });

  // لو السلة فارغة
  if (filled.length === 0) {
    cartEl.innerHTML = `
      <div class="empty">
        <span class="icon">🛒</span>
        <h3>سلتك فارغة!</h3>
        <p>أضف مكونات وصفاتك المفضلة</p>
      </div>`;
    updateTotals();
    return;
  }

  // رسم كل وصفة
  cart.forEach(function(recipe, ri) {
    if (!recipe.items.length) return;

    const card = document.createElement("div");
    card.className = "recipe-card";

    card.innerHTML = `
      <div class="recipe-title">
        🍽️ ${recipe.name}
        <span style="color:#8a93a8;font-size:12px;font-weight:500">${recipe.items.length} مكونات</span>
      </div>`;

    recipe.items.forEach(function(item, ii) {
      const div = document.createElement("div");
      div.className = "item";
      div.innerHTML = `
        <div class="item-icon">${getEmoji(item.name)}</div>
        <div class="item-info">
          <div class="name">${item.name}</div>
          <div class="sub">${item.gram} جرام · ${item.price} ر.س للوحدة</div>
        </div>
        <div class="qty">
        <button data-r="${ri}" data-i="${ii}" data-act="plus">+</button>
        <span>${item.qty}</span>
        <button data-r="${ri}" data-i="${ii}" data-act="minus">−</button>
        </div>
        <div class="price">${item.price * item.qty} ج.م</div>
        <button class="del-btn" data-r="${ri}" data-i="${ii}" data-act="del">🗑</button>`;

      card.appendChild(div);
    });

    cartEl.appendChild(card);
  });

  updateTotals();
}

// ── الأحداث ──
document.getElementById("cart").addEventListener("click", function(e) {
  const btn = e.target
  if (!btn.dataset.act) return; 

  const r   = +btn.dataset.r;
  const i   = +btn.dataset.i;
  const act = btn.dataset.act;

  if (act === "plus")  cart[r].items[i].qty++;
  if (act === "minus" && cart[r].items[i].qty > 1) cart[r].items[i].qty--;
  if (act === "del") {
    cart[r].items.splice(i, 1);
    if (!cart[r].items.length) cart.splice(r, 1);
    toast("تم الحذف 🗑️");
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  render();
});

document.getElementById("buy-btn").addEventListener("click", function() {
  window.location.href = "checkout.html";
  toast("✅ تم إرسال طلبك!");
});

// document.getElementById("btn-back").addEventListener("click",function(){
//   window.location.href="../Recipes-page/recipes.html";
// })

// ── إشعار ──
function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(function() { el.classList.remove("show"); }, 2000);
}

function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.length;
  
  const badge = document.getElementById("cart-count");
  if (badge) badge.textContent = count;
}

// استدعيها في أول تشغيل الصفحة
updateCartBadge();




// ── تشغيل ──
render();