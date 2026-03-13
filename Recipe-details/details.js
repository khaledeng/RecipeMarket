var detailsRow = document.getElementById("detailsRow");
var nav = document.querySelector('nav');

var params = new URLSearchParams(window.location.search);
var id = params.get('id');

document.addEventListener('scroll', function () {
    if (window.scrollY > 10) {
        nav.classList.add('scrolled-bg');
        nav.style.backgroundColor = "rgba(255, 255, 255, 0.7)"

    }
    else {
        nav.classList.remove('scrolled-bg');
        nav.style.backgroundColor = "#F8F6F6"
    }
})


var xhr = new XMLHttpRequest();
xhr.open('Get',`../data/recipes.json`);
xhr.send();
xhr.responseType = "json";
xhr.onload = function(){
    var recipes = xhr.response.recipes;
    var recipe = recipes.find(r => r.id == id);
    displayRecipeDetails(recipe);
}

function displayRecipeDetails(recipe){
     console.log(recipe)
     detailsRow.innerHTML = `
      <div class="col right-side">
                    <div class="recipe-nav">
                        <a href="">الرئيسية</a>
                        <i class="fa-solid fa-chevron-left"></i>
                        <a href="">وصفات رئيسية</a>
                        <i class="fa-solid fa-chevron-left"></i>
                        <span>${recipe.name}</span>
                    </div>
                    <div class="recipe-img">
                        <img src="${recipe.image}"
                            alt="">
                    </div>
                    <div class="nutrition">
                        <div class="card">
                            <p>سعرات حرارية</p>
                            <h3>${recipe.calories}</h3>
                        </div>
                        <div class="card">
                            <p>بروتين</p>
                            <h3>${recipe.protein} جم</h3>
                        </div>
                        <div class="card">
                            <p>كربوهيدرات</p>
                            <h3>${recipe.carbs} جم</h3>
                        </div>
                    </div>
                    <div class="add-to-cart">
                        <div class="price">
                            <span>السعر الإجمالي</span>
                            <p>${recipe.price} ر.س</p>
                        </div>
                        <div class="add-btn">
                            <button><i class="fa-solid fa-cart-arrow-down"></i> أضف المكونات للسلة</button>
                        </div>
                        <div class="paragraph">
                            <p>سيتم إضافة جميع المكونات المختارة إلى سلة التسوق الخاصة بك</p>
                        </div>
                    </div>
                </div>

                <div class="col left-side">
                    <div class="category-rating">
                        <span class="cat-title">وجبة رئيسية</span>
                        <span class="rate">
                            <i class="fa-regular fa-star"></i> 4.9
                        </span>
                        <span class="rate-number">
                            (120 تقييم)
                        </span>
                    </div>
                    <div class="title">
                        <h2>دجاج مشوي بالزعتر والليمون</h2>
                    </div>
                    <div class="description">
                        <p>وجبة صحية وسهلة التحضير لمحبي النكهات العربية الأصيلة، تجمع بين حموضة الليمون المنعشة ورائحة
                            الزعتر الجبلي المميزة.</p>
                    </div>
                    <div class="serving-size">
                        <h3><i class="fa-solid fa-users"></i> عدد الأشخاص</h3>
                        <div class="serving-options">
                            <button class="serving-btn active">2 أشخاص</button>
                            <button class="serving-btn ">4 أشخاص</button>
                            <button class="serving-btn ">6 أشخاص</button>
                        </div>
                    </div>
                    <div class="ingredients">
                        <div class="title">
                            <h3><i class="fa-solid fa-box-archive"></i> المكونات المطلوبة</h3>
                            <span>تحديد الكل</span>
                        </div>
                        <div class="ingredient-card">
                            <label class="ingredient">
                                <div class="check">
                                    <input type="checkbox" name="" id="" checked>
                                    <div class="ingredient-text">
                                        <p>صدر دجاج طازج</p>
                                        <p class="quantity">500 جرام</p>
                                    </div>
                                </div>
                                <span class="price">35 ر.س</span>
                            </label>
                            <label class="ingredient">
                                <div class="check">
                                    <input type="checkbox" name="" id="" checked>
                                    <div class="ingredient-text">
                                        <p>زعتر بري مجفف</p>
                                        <p class="quantity">50 جرام</p>
                                    </div>
                                </div>
                                <span class="price">12 ر.س</span>
                            </label>
                            <label class="ingredient">
                                <div class="check">
                                    <input type="checkbox" name="" id="" checked>
                                    <div class="ingredient-text">
                                        <p>زيت زيتون بكر</p>
                                        <p class="quantity">100 مل</p>
                                    </div>
                                </div>
                                <span class="price">18 ر.س</span>
                            </label>
                            <label class="ingredient">
                                <div class="check">
                                    <input type="checkbox" name="" id="" checked>
                                    <div class="ingredient-text">
                                        <p>ليمون طازج</p>
                                        <p class="quantity">3 حبات</p>
                                    </div>
                                </div>
                                <span class="price">10 ر.س</span>
                            </label>
                        </div>
                        <div class="steps">
                            <h3><i class="fa-solid fa-list-ol"></i> خطوات التحضير</h3>
                            <div class="step">
                                <div class="count">
                                    <div class="number">1</div>
                                    <div class="line"></div>
                                </div>
                                <div class="step-text">
                                    <h4>تتبيل الدجاج</h4>
                                    <p>اخلط الزعتر مع زيت الزيتون، عصير الليمون، والملح والفلفل في وعاء كبير. أضف قطع
                                        الدجاج واتركها تتبل لمدة 30 دقيقة على الأقل.</p>
                                </div>
                            </div>
                            <div class="step">
                                <div class="count">
                                    <div class="number">2</div>
                                    <div class="line"></div>
                                </div>
                                <div class="step-text">
                                    <h4>تسخين الفرن</h4>
                                    <p>قم بتسخين الفرن مسبقاً على درجة حرارة 200 مئوية. جهز صينية الفرن بدهنها بالقليل
                                        من زيت الزيتون.
                                    </p>
                                </div>
                            </div>
                            <div class="step">
                                <div class="count">
                                    <div class="number">3</div>
                                </div>
                                <div class="step-text">
                                    <h4>الشوي والتقديم</h4>
                                    <p>ضع الدجاج في الفرن لمدة 25-30 دقيقة حتى ينضج ويتحمر الوجه. قدمه ساخناً مع الأرز
                                        أو السلطة.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
     `
     
}

