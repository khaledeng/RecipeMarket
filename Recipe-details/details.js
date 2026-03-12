var nav = document.querySelector('nav');
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