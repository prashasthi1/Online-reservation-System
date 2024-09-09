let cid = 0;
document.addEventListener("DOMContentLoaded", () => {
  // Fetch data periodically every 5 seconds
  setInterval(fetchAndUpdateTable, 5000); // Live update every 5 seconds
});

// Function to fetch and update table data
function fetchAndUpdateTable() {
  const cid = sessionStorage.getItem("cid");
  fetch("http://localhost:8080/api/restauranttablebook/view-all-tablebookings")
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.getElementById("userTableBody");

      // Clear existing rows before appending new data
      if (tableBody) {
        tableBody.innerHTML = ""; // Clear previous rows

        // Iterate through the data and append new rows
        data.map((t) => {
          let tr = document.createElement("tr");

          let bookId = document.createElement("td");
          bookId.textContent = t.bookId;

          let customerName = document.createElement("td");
          customerName.textContent = t.customerName;

          let email = document.createElement("td");
          email.textContent = t.email;

          let bookingCount = document.createElement("td");
          bookingCount.textContent = t.bookingCount;

          let dateTime = document.createElement("td");
          dateTime.textContent = t.dateTime;

          let specialRequest = document.createElement("td");
          specialRequest.textContent = t.specialRequest || "None";

          let bookingStatusCover = document.createElement("td");
          let bookStatus = document.createElement("span");
          bookStatus.className = t.status === "Verified" ? "verified-status" : "pending-status";
          bookStatus.textContent = t.status;
          bookingStatusCover.appendChild(bookStatus);

          let buttonCover = document.createElement("td");

          // Create the VERIFY button
          let verifyButton = document.createElement("button");
          verifyButton.className = "btn btn-success me-2"; // Bootstrap classes for styling
          verifyButton.textContent = "VERIFY";
          verifyButton.onclick = function () {
            updateBookStatus(
              t.bookId, // Correctly pass the bookId
              t.customerName,
              t.email,
              t.bookingCount,
              t.dateTime,
              t.specialRequest,
              "Verified" // Change status to "Verified"
            );
          };

          // Create the DELETE button
          let deleteButton = document.createElement("button");
          deleteButton.className = "btn btn-danger"; // Bootstrap classes for styling
          deleteButton.textContent = "DELETE";
          deleteButton.onclick = function () {
            deleteBookingById(t.bookId);
          };

          // Append both buttons to the button cover
          buttonCover.appendChild(verifyButton);
          buttonCover.appendChild(deleteButton);

          tr.appendChild(bookId);
          tr.appendChild(customerName);
          tr.appendChild(email);
          tr.appendChild(bookingCount);
          tr.appendChild(dateTime);
          tr.appendChild(specialRequest);
          tr.appendChild(bookingStatusCover);
          tr.appendChild(buttonCover);

          tableBody.appendChild(tr); // Append the row to the table body
        });
      }
    });
}

// Function to update the booking status
function updateBookStatus(
  bookId,
  customerName,
  email,
  bookingCount,
  dateTime,
  specialRequest,
  status
) {
  fetch(`http://localhost:8080/api/restauranttablebook/update-tablebooking/${bookId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customerName: customerName,
      email: email,
      bookingCount: bookingCount,
      dateTime: dateTime,
      specialRequest: specialRequest,
      status: status, // Pass the updated status
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        fetchAndUpdateTable(); // Manually refresh table after updating
      }
    });
}

// Function to delete a booking
function deleteBookingById(bookId) {
  Swal.fire({
    title: 'Are you sure?',
    text: "This action will permanently delete the booking and cannot be undone!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`http://localhost:8080/api/restauranttablebook/delete-tablebooking/${bookId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            Swal.fire({
              title: 'Deleted!',
              text: 'The booking has been deleted successfully.',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              fetchAndUpdateTable(); // Manually refresh table after deletion
            });
          } else {
            Swal.fire({
              title: 'Error!',
              text: 'Failed to delete the booking. Please try again.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        })
        .catch(() => {
          Swal.fire({
            title: 'Error!',
            text: 'An error occurred while deleting the booking. Please try again later.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        });
    }
  });
}
