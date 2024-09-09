let cid = 0;
document.addEventListener("DOMContentLoaded", () => {
  // Fetch data periodically every 5 seconds
  setInterval(fetchAndUpdateTable, 3000); // Live update every 5 seconds
});

fetch("http://localhost:8080/api/view-all-customers-by-role?roleType=USER")
  .then((response) => response.json())
  .then((data) => {
    data.map((customer) => {
      if (document.getElementById("customerTableBody") != null) {
        let tr = document.createElement("tr");

        // Customer ID
        let customerId = document.createElement("td");
        customerId.textContent = customer.customerId;

        // Customer Name
        let customerName = document.createElement("td");
        customerName.textContent = customer.customerName;

        // Email
        let email = document.createElement("td");
        email.textContent = customer.email;

        // Avatar (Customer Profile Image)
        let customerProfileCover = document.createElement("td");
        let customerProfile = document.createElement("img");
        customerProfile.src = `data:image/png;base64,${customer.customerProfile}`;
        customerProfile.style.width = "50px";
        customerProfile.style.height = "50px";
        customerProfileCover.appendChild(customerProfile);

        // Contact Number
        let contactNo = document.createElement("td");
        contactNo.textContent = customer.contactNo;

        // Customer Address
        let customerAddress = document.createElement("td");
        customerAddress.textContent = customer.customerAddress;

        // Action buttons (Separate Edit and Delete buttons)
        let buttonCover = document.createElement("td");

        // Edit Button
        let editButton = document.createElement("button");
        editButton.className = "btn btn-primary btn-sm me-2"; // Bootstrap classes for style
        editButton.textContent = "Edit";
        editButton.onclick = function () {
          openUpdateCustomerModal(
            customer.customerId,
            customer.customerName,
            customer.customerProfile,
            customer.contactNo,
            customer.email,
            customer.customerAddress
          );
        };

        // Delete Button
        let deleteButton = document.createElement("button");
        deleteButton.className = "btn btn-danger btn-sm"; // Bootstrap classes for style
        deleteButton.textContent = "Delete";
        deleteButton.onclick = function () {
          deleteCustomerById(customer.customerId);
        };

        // Append buttons to the buttonCover (actions)
        buttonCover.appendChild(editButton);
        buttonCover.appendChild(deleteButton);

        // Append all elements to the row
        tr.appendChild(customerId);
        tr.appendChild(customerName);
        tr.appendChild(email);
        tr.appendChild(customerProfileCover);
        tr.appendChild(contactNo);
        tr.appendChild(customerAddress);
        tr.appendChild(buttonCover);

        document.getElementById("customerTableBody").appendChild(tr);
      }
    });
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



// Function to open update customer modal
function openUpdateCustomerModal(
    customerIdU,
    customerNameU,
    customerProfileU,
    contactNoU,
    emailU,
    customerAddressU
  ) {
    cid = customerIdU;
    document.getElementById("updateUserName").value = customerNameU;
    document.getElementById("updateContactNumber").value = contactNoU;
    document.getElementById("updateEmail").value = emailU;
    document.getElementById("updateAddress").value = customerAddressU;
    document.getElementById("updateAvatar").dataset.profile = customerProfileU;
  
    // Open the update modal
    $("#updateUserModal").modal("show");
  }
  
  // Function to submit the updated form
  function submitUpdateUserForm() {
    const customerName = document.getElementById("updateUserName").value;
    const contactNo = document.getElementById("updateContactNumber").value;
    const email = document.getElementById("updateEmail").value;
    const customerAddress = document.getElementById("updateAddress").value;
    const customerProfileFile = document.getElementById("updateAvatar").files[0];
    const customerProfile = document.getElementById("updateAvatar").dataset.profile;
    const customerPassword = document.getElementById("updatePassword").value;
  
    const formData = new FormData();
    formData.append("customerName", customerName);
    formData.append("contactNo", contactNo);
    formData.append("email", email);
    formData.append("password", customerPassword);
    formData.append("customerAddress", customerAddress);
  
    if (customerProfileFile) {
      formData.append("customerProfile", customerProfileFile); // If a new image is uploaded
    } else {
      formData.append("customerProfile", customerProfile); // If no new image is uploaded, keep the old one
    }
  
    fetch(`http://localhost:8080/api/update-customer/${cid}`, {
      method: "PUT",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          Swal.fire({
            title: "Success!",
            text: "Update successful!",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => location.reload());
        } else {
          Swal.fire({
            title: "Error!",
            text: "Update failed!",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      })
      .catch(() => {
        Swal.fire({
          title: "Error!",
          text: "Update failed!",
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  
    $("#updateUserModal").modal("hide");
  }
  
  // Function to delete a customer by ID
  function deleteCustomerById(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the user and cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:8080/api/delete-customer/${id}`, {
          method: "DELETE",
        })
          .then((response) => {
            if (response.ok) {
              Swal.fire({
                title: "Deleted!",
                text: "The user has been deleted successfully.",
                icon: "success",
                confirmButtonText: "OK",
              }).then(() => location.reload());
            } else {
              Swal.fire({
                title: "Error!",
                text: "Failed to delete the user. Please try again.",
                icon: "error",
                confirmButtonText: "OK",
              });
            }
          })
          .catch(() => {
            Swal.fire({
              title: "Error!",
              text: "An error occurred while deleting the user. Please try again later.",
              icon: "error",
              confirmButtonText: "OK",
            });
          });
      }
    });
  }