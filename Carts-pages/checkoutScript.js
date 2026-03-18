// ── تحميل السلة وحساب الأسعار ──
const cart = JSON.parse(localStorage.getItem("cart")) || [];

function calcTotals() {
  let sub = 0;

  cart.forEach(function(recipe) {
    // بيتعامل مع الصيغتين القديمة والجديدة
    const items = recipe.items || recipe.recipeIngredients || [];
    items.forEach(function(item) {
      const price = item.price || 0;
      const qty   = item.qty || 1;
      sub += price * qty;
    });
  });

  const tax   = Math.round(sub * 0.15);
  const total = sub + tax;

  document.getElementById("products-total").textContent = sub + " ر.س";
  document.getElementById("tax-total").textContent      = tax + " ر.س";
  document.getElementById("final-total").textContent    = total;
}
// ── اختيار طريقة الدفع ──
function selectPay(el) {
  document.querySelectorAll(".pay-option").forEach(function(opt) {
    opt.classList.remove("active");
  });
  el.classList.add("active");

  // إخفاء أو إظهار حقول البطاقة
  const isCard = el.querySelector(".pay-name").textContent.includes("بطاقة");
  document.getElementById("card-fields").style.display = isCard ? "flex" : "none";
}

// ── تنسيق رقم البطاقة ──
document.getElementById("card-num").addEventListener("input", function() {
  let val = this.value.replace(/\D/g, "");
  val = val.match(/.{1,4}/g)?.join(" ") || val;
  this.value = val;
});

// ── تأكيد الطلب ──
function confirmOrder() {
  const city    = document.querySelectorAll(".field input")[0].value;
  const area    = document.querySelectorAll(".field input")[1].value;
  const details = document.querySelectorAll(".field input")[2].value;

  if (!city || !area || !details) {
    toast("⚠️ من فضلك أكمل عنوان التوصيل");
    return;
  }

  toast("✅ تم تأكيد طلبك بنجاح!");
  setTimeout(function() {
    localStorage.removeItem("cart");
    updateCartBadge();
  }, 1500);
}

function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.length;
  
  const badge = document.getElementById("cart-count");
  if (badge) badge.textContent = count;
}

// ── إشعار ──
function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(function() { el.classList.remove("show"); }, 2500);
}

// ── تشغيل ──
calcTotals();
updateCartBadge();