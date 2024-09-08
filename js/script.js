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


//cart

document.querySelectorAll('.add-to-cart, .m-nav-icons1').forEach(button => {
    button.addEventListener('click', function() {
        addToCart(this.parentElement);
    });
});

function addToCart(foodItem) {
    const cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.classList.add('open');
    const cartItems = document.getElementById('cart-items');
    const itemName = foodItem.querySelector('h3').innerText;
    const itemPrice = foodItem.querySelector('.price').innerText;

    const cartItem = document.createElement('li');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `<span>(1x) ${itemName}</span><span>${itemPrice}</span><button class="remove-item">Delete</button>`;
    cartItems.appendChild(cartItem);

    console.log('Item added to cart:', cartItem);  

    const removeButton = cartItem.querySelector('.remove-item');
    removeButton.addEventListener('click', function() {
        console.log('Delete button clicked');
        cartItem.remove();
        updateTotal();
    });
}

function updateTotal() {
    const cartItems = document.querySelectorAll('.cart-item');
    let total = 0;
    cartItems.forEach(item => {
        const price = parseFloat(item.querySelector('span:last-child').innerText.substring(1));
        total += price;
    });
    document.getElementById('cart-total').innerText = `Total: $${total.toFixed(2)}`;
}

// Close cart sidebar
document.querySelector('.bx-x-circle').addEventListener('click', function() {
    document.getElementById('cart-sidebar').classList.remove('open');
});



//reservation

// document.getElementById('reservationForm').addEventListener('submit', function(event) {
//     // alert("prasha");
//     event.preventDefault();

//     // Get form values
//     const name = document.getElementById('name').value.trim();
//     const email = document.getElementById('email').value.trim();
//     const datetime = document.getElementById('datetime').value.trim();
//     const people = document.getElementById('people').value.trim();

//     // Validation
//     if (name === '') {
//         Swal.fire('Validation Error', 'Please enter your name.', 'error');
//         return;
//     }

//     if (email === '') {
//         Swal.fire('Validation Error', 'Please enter your email.', 'error');
//         return;
//     }

//     const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
//     if (!emailPattern.test(email)) {
//         Swal.fire('Validation Error', 'Please enter a valid email address.', 'error');
//         return;
//     }

//     if (datetime === '') {
//         Swal.fire('Validation Error', 'Please select a date and time.', 'error');
//         return;
//     }

//     if (people === '' || isNaN(people) || parseInt(people) <= 0) {
//         Swal.fire('Validation Error', 'Please enter a valid number of people.', 'error');
//         return;
//     }

//     // If all validation passes
//     Swal.fire('Success', 'Your reservation has been successfully submitted!', 'success');
// });

// login

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = form.querySelector('input[name="email"]').value;
        const password = form.querySelector('input[name="psw"]').value;
        const role = form.querySelector('select[name="role"]').value;

        // Simple validations
        if (!email || !password || role === 'Roll') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please fill in all fields correctly!',
            });
        } else {
            // If all fields are valid, you can submit the form here
            // For example, use AJAX to submit the form data
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Login successful!',
            });
        }
    });
});

// register

    document.addEventListener('DOMContentLoaded', function () {
        const form = document.querySelector('form');
        form.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent default form submission

            // Get form values
            const name = document.querySelector('input[name="name"]').value;
            const email = document.querySelector('input[name="email"]').value;
            const phone = document.querySelector('input[name="phone"]').value; // Fixed the name attribute
            const password = document.querySelector('input[name="psw"]').value;
            const confirmPassword = document.querySelector('input[name="pswcon"]').value;
            const role = document.querySelector('select[name="role"]').value;

            // Validation
            if (!name || !email || !phone || !password || !confirmPassword || role === 'Role') {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Please fill in all fields!',
                });
                return;
            }

            if (password !== confirmPassword) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Passwords do not match!',
                });
                return;
            }

            if (!validateEmail(email)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Invalid email address!',
                });
                return;
            }

            // If all validations pass
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Form submitted successfully!',
            });
        });

        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }
    });

    // contact us

    document.getElementById('contactForm').addEventListener('submit', function(event) {
        event.preventDefault();

       
        
        let name = document.getElementById('name').value.trim();
        let email = document.getElementById('email').value.trim();
        let message = document.getElementById('message').value.trim();
        
        if (!name) {
            Swal.fire('Oops...', 'Please enter your name.', 'error');
            return;
        }
        
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            Swal.fire('Oops...', 'Please enter a valid email address.', 'error');
            return;
        }
        
        if (!message) {
            Swal.fire('Oops...', 'Please enter your message.', 'error');
            return;
        }
        
        Swal.fire('Success!', 'Your message has been sent.', 'success');
        document.getElementById('contactForm').reset();
    });



    document.getElementById("btnBookTable").addEventListener("click", () => {
        alert("prasha");
            const customerName = document.getElementById("customer-name-table-booking").value;
            const email = document.getElementById("table-booking-email").value;
            const bookingCount = document.getElementById("table-booking-person-count").value;
            const dateTime = document.getElementById("table-booking-dateTime").value;
            const specialRequest = document.getElementById("table-booking-special-request").value;
    
          
        
            // Basic validation to ensure fields are not empty
            if (customerName != null && email != null && dateTime != null && bookingCount != null) {
                fetch("http://localhost:8080/api/restauranttablebook/add-tablebooking", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        customerName: customerName,
                        email: email,
                        bookingCount: bookingCount,
                        dateTime: dateTime,
                        specialRequest: specialRequest,
                        status: "PENDING",
                    }),
                })
                .then((response) => response.json())
                .then((data) => {
                    if (data) {
                        Swal.fire({
                            title: 'Reservation Successful!',
                            text: 'Your table has been booked.',
                            icon: 'success',
                            confirmButtonText: 'OK'
              
                        });
                    } else {
                        Swal.fire({
                            title: 'Reservation Failed',
                            text: 'We were unable to process your reservation. Please try again later.',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    }
                })
                .catch((error) => {
                    Swal.fire({
                        title: 'Error Occurred',
                        text: 'Something went wrong. Please try again.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                    console.error("Error:", error);
                });
            } else {
                Swal.fire({
                    title: 'Incomplete Form',
                    text: 'Please fill in all required fields.',
                    icon: 'warning',
                    confirmButtonText: 'OK'
                });
            }
        });
        
    
    

