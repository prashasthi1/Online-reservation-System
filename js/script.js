const header = document.querySelector("header");

window.addEventListener("scroll", function() {
    header.classList.toggle("sticky", window.scrollY > 80);    
});

let menu = document.querySelector('#menu-icon');
let navlist = document.querySelector('.navlist');

menu.onclick = () => {
    menu.classList.toggle('bx-x');
    navlist.classList.toggle('open');
};

window.onscroll = () => {
    menu.classList.remove('bx-x');
    navlist.classList.remove('open');
};

const sr = ScrollReveal({
    origin: 'top',
    distance: '85px',
    duration: 2500,
    reset: true
})

document.addEventListener("DOMContentLoaded", function() {
    var modal = document.getElementById("modal");
    var modalImg = document.getElementById("modal-img");
    var closeBtn = document.querySelector('.modal .close');
    var isZoomedIn = false;

    document.querySelectorAll('.gallery-row img').forEach(function(image) {
        image.addEventListener('click', function() {
            modal.style.display = "flex";
            modalImg.src = this.src;
            isZoomedIn = false;
            modalImg.style.transform = "scale(1)";
            modalImg.style.cursor = "zoom-in";
        });
    });

    // Close the modal when the user clicks on the close button
    closeBtn.addEventListener('click', function() {
        modal.style.display = "none";
    });

    // Zoom in/out when the modal image is clicked
    modalImg.addEventListener('click', function() {
        if (isZoomedIn) {
            modalImg.style.transform = "scale(1)";
            modalImg.style.cursor = "zoom-in";
        } else {
            modalImg.style.transform = "scale(2)";
            modalImg.style.cursor = "zoom-out";
        }
        isZoomedIn = !isZoomedIn;
    });

    // Close the modal if the user clicks outside of the image
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});
