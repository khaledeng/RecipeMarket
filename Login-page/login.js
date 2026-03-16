
var username = document.getElementById("username");
var password = document.getElementById("password");
var loginBtn = document.getElementById("loginBtn");




loginBtn.onclick = function(){




var userValue = username.value;
var passValue = password.value;





var xhr = new XMLHttpRequest();

xhr.open("GET","https://raw.githubusercontent.com/khaledeng/RecipeMarket/refs/heads/main/data/Users.json");

xhr.responseType="json";

xhr.send();



xhr.onload=function(){


var users = xhr.response.users;



var found=false;




for(var u of users){



if(u.username == userValue && u.password == passValue){

found=true;



localStorage.setItem("role",u.role);




if(u.role == "admin"){

window.location.href="../Recipes-page/recipes.html";//الداشبورد

}




else{

window.location.href="../Home-page/Index.html";

}


break;

}


}





if(found==false){

alert("اسم المستخدم او كلمة المرور غير صحيحة");

}


}

}