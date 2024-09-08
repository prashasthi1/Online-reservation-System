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
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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