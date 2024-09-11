document.getElementById("btnBookTable").addEventListener("click", async () => {

    clearErrors();

    const customerName = document.getElementById("customer-name-table-booking").value.trim();
    const email = document.getElementById("table-booking-email").value.trim();
    const bookingCount = document.getElementById("table-booking-person-count").value.trim();
    const dateTime = document.getElementById("table-booking-dateTime").value.trim();
    const specialRequest = document.getElementById("table-booking-special-request").value.trim();

    let isValid = true;

    // Validation
    if (!customerName) {
        showError('name-error', 'Your name is required.');
        isValid = false;
    }

    if (!email || !validateEmail(email)) {
        showError('email-error', 'Please enter a valid email address.');
        isValid = false;
    }

    if (!bookingCount || isNaN(bookingCount) || bookingCount <= 0) {
        showError('people-error', 'Please enter a valid number of people.');
        isValid = false;
    }

    if (!dateTime) {
        showError('datetime-error', 'Date and time are required.');
        isValid = false;
    }

    if (!specialRequest) {
        showError('request-error', 'Special request is optional, but you can leave a note if needed.');
    }

    if (!isValid) {
        return; 
    }

    try {
        const response = await fetch("http://localhost:8080/api/restauranttablebook/add-tablebooking", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                customerName,
                email,
                bookingCount,
                dateTime,
                specialRequest,
                status: "PENDING",
            }),
        });

        const data = await response.json();

        if (data) {
            Swal.fire({
                title: 'Reservation Successful!',
                text: 'Your table has been booked.',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                location.reload();
            });
        } else {
            Swal.fire({
                title: 'Reservation Failed',
                text: 'We were unable to process your reservation. Please try again later.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    } catch (error) {
        Swal.fire({
            title: 'Error Occurred',
            text: 'Something went wrong. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        console.error("Error:", error);
    }
});


function validateEmail(email) {
    const emailPattern = /^[^\s@]+@(gmail\.com|hotmail\.com)$/;
    return emailPattern.test(email);
}


function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.color = 'red';
    }
}


function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => {
        el.textContent = '';
    });
}





document.getElementById("contactForm").addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent form from submitting the default way

    fetch("http://localhost:8080/api/feedback/set-customer-feedback", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            customerName: document.getElementById("name").value,
            email: document.getElementById("email").value,
            message: document.getElementById("message").value,
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        if (data) {
            Swal.fire({
                title: 'Success!',
                text: 'Your feedback has been submitted successfully!',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                location.reload(); // Reload page on success
            });
        } else {
            Swal.fire({
                title: 'Unsuccessful!',
                text: 'Something went wrong, please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    })
    .catch(() => {
        Swal.fire({
            title: 'Error!',
            text: 'Failed to submit the form, please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    });
});

  
  
// document.addEventListener("DOMContentLoaded", () => {
//     // Fetch the feedback data from the API
//     fetch("http://localhost:8080/api/feedback/view-all-customer-feedback")
//         .then((response) => response.json())
//         .then((data) => {
//             // Get the review content container
//             const reviewContent = document.getElementById("reviewContent");

//             // Check if data exists
//             if (data.length > 0) {
//                 // Loop through the feedback data
//                 data.forEach((feedback) => {
//                     // Create a new div element for each feedback
//                     const reviewBox = document.createElement("div");
//                     reviewBox.classList.add("box");

//                     // Populate the review box with the feedback data
//                     reviewBox.innerHTML = `
//                         <p>${feedback.message}</p>
//                         <div class="in-box">
//                             <div class="bx-img">
//                                 <img src="${feedback.image}" alt="Customer image">
//                             </div>
//                             <div class="bxx-text">
//                                 <h4>${feedback.customerName}</h4>
//                                 <h5>${feedback.profession}</h5>
//                                 <div class="ratings">
//                                     ${generateStars(feedback.rating)}
//                                 </div>
//                             </div>
//                         </div>
//                     `;
//                     // Append the review box to the review content container
//                     reviewContent.appendChild(reviewBox);
//                 });
//             } else {
//                 // If no feedback is available, show a message
//                 reviewContent.innerHTML = "<p>No feedback available at the moment.</p>";
//             }
//         })
//         .catch((error) => {
//             console.error("Error fetching feedback:", error);
//             document.getElementById("reviewContent").innerHTML = "<p>Failed to load feedback.</p>";
//         });
// });

// // Function to generate star ratings based on customer rating
// function generateStars(rating) {
//     let stars = "";
//     for (let i = 1; i <= 5; i++) {
//         if (i <= rating) {
//             stars += `<i class='bx bxs-star'></i>`; // Filled star
//         } else {
//             stars += `<i class='bx bx-star'></i>`; // Unfilled star
//         }
//     }
//     return stars;
// }
  