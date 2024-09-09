let cid = 0;
document.addEventListener("DOMContentLoaded", () => {
  // Fetch data periodically every 5 seconds
  setInterval(fetchAndUpdateTable, 2000); // Live update every 5 seconds
});

fetch("http://localhost:8080/api/view-all-customers-by-role?roleType=STAFF")
.then((response) => response.json())
.then((data) => {
  const staffTableBody = document.getElementById("staffTableBody");
  data.forEach((s) => {
    let tr = document.createElement("tr");

    // Customer ID
    let customerId = document.createElement("td");
    customerId.textContent = s.customerId;

    // Staff Name
    let customerName = document.createElement("td");
    customerName.textContent = s.customerName;

    // Email
    let email = document.createElement("td");
    email.textContent = s.email;

    // Avatar
    let customerProfileCover = document.createElement("td");
    let customerProfile = document.createElement("img");
    customerProfile.src = `data:image/png;base64,${s.customerProfile}`;
    customerProfile.style.width = "50px";
    customerProfile.style.height = "50px";
    customerProfileCover.appendChild(customerProfile);

    // Contact Number
    let contactNo = document.createElement("td");
    contactNo.textContent = s.contactNo;

    // Address
    let customerAddress = document.createElement("td");
    customerAddress.textContent = s.customerAddress;

    // Role Type
    let roleType = document.createElement("td");
    roleType.textContent = s.roleType;

    // Action buttons (Edit and Delete as two separate buttons)
    let buttonCover = document.createElement("td");

    // Edit Button
    let editButton = document.createElement("button");
    editButton.className = "btn btn-warning btn-sm me-2"; // Small button with margin
    editButton.textContent = "Edit";
    editButton.onclick = () => openUpdateStaffModal(s.customerId, s.customerName, s.customerProfile, s.contactNo, s.email, s.customerAddress);

    // Delete Button
    let deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-danger btn-sm"; // Small red button
    deleteButton.textContent = "Delete";
    deleteButton.onclick = () => deleteStaffById(s.customerId);

    // Append both buttons to the button cover
    buttonCover.appendChild(editButton);
    buttonCover.appendChild(deleteButton);

    // Append everything to the row
    tr.appendChild(customerId);
    tr.appendChild(customerProfileCover);
    tr.appendChild(customerName);
    tr.appendChild(contactNo);
    tr.appendChild(email);
    tr.appendChild(customerAddress);
    tr.appendChild(roleType);
    tr.appendChild(buttonCover);

    staffTableBody.appendChild(tr);
  });
});


// Fetch customers and display in the tabl

// Fetch customers and display in the table
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
    // Populate form fields with existing customer data
    document.getElementById("updateCustomerId").value = customerIdU;
    document.getElementById("updateUserName").value = customerNameU;
    document.getElementById("updateContactNumber").value = contactNoU;
    document.getElementById("updateEmail").value = emailU;
    document.getElementById("updateAddress").value = customerAddressU;
    
    // Set the current profile image in a data attribute (used later when saving)
    document.getElementById("updateAvatar").dataset.profile = customerProfileU;
  
    // Open the update modal
    $("#updateUserModal").modal("show");
  }
  
  // Function to submit the updated form
  function submitUpdateUserForm() {
   
    const customerId = document.getElementById("updateCustomerId").value;
    const customerName = document.getElementById("updateUserName").value;
    const contactNo = document.getElementById("updateContactNumber").value;
    const email = document.getElementById("updateEmail").value;
    const customerAddress = document.getElementById("updateAddress").value;
    const customerProfileFile = document.getElementById("updateAvatar").files[0];
    const customerProfile = document.getElementById("updateAvatar").dataset.profile; // Existing profile image
  
    const formData = new FormData();
    formData.append("customerName", customerName);
    formData.append("contactNo", contactNo);
    formData.append("email", email);
    formData.append("customerAddress", customerAddress);
  
    // If a new image is uploaded, append it; otherwise, keep the existing image
    if (customerProfileFile) {
      formData.append("customerProfile", customerProfileFile);
    } else {
      formData.append("customerProfile", customerProfile);
    }
    
    // Send the updated customer data
    fetch(`http://localhost:8080/api/update-customer/${customerId}`, {
      method: "PUT",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
            alert("data");
          Swal.fire({
            title: "Success!",
            text: "Customer details updated successfully!",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => location.reload()); // Reload the page after successful update
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
      text: "This action will permanently delete the customer and cannot be undone!",
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
                text: "Customer has been deleted.",
                icon: "success",
                confirmButtonText: "OK",
              }).then(() => location.reload()); // Reload the page after deletion
            } else {
              Swal.fire({
                title: "Error!",
                text: "Failed to delete the customer. Please try again.",
                icon: "error",
                confirmButtonText: "OK",
              });
            }
          })
          .catch(() => {
            Swal.fire({
              title: "Error!",
              text: "An error occurred while deleting the customer. Please try again later.",
              icon: "error",
              confirmButtonText: "OK",
            });
          });
      }
    });
  }



  //staff add-update-delete


// Open the Update Modal
function openUpdateStaffModal(customerIdU, customerNameU, customerProfileU, contactNoU, emailU, customerAddressU) {
    cid = customerIdU;
    document.getElementById("staffName").value = customerNameU;
    document.getElementById("staffContact").value = contactNoU;
    document.getElementById("staffEmail").value = emailU;
    document.getElementById("staffAddress").value = customerAddressU;
    // Open the modal
    $("#staffModal").modal("show");
  }
  
  // Handle Submit for Add/Edit Staff
  function submitStaffForm(event) {
    event.preventDefault();
  
    const formData = new FormData();
    formData.append("customerName", document.getElementById("staffName").value);
    formData.append("email", document.getElementById("staffEmail").value);
    formData.append("password", document.getElementById("staffPassword").value);
    formData.append("customerProfile", document.getElementById("image").files[0]);
    formData.append("contactNo", document.getElementById("staffContact").value);
    formData.append("customerAddress", document.getElementById("staffAddress").value);
    formData.append("roleType", "STAFF");
  
    const url = cid ? `http://localhost:8080/api/update-customer/${cid}` : `http://localhost:8080/api/create-customers`;
    const method = cid ? "PUT" : "POST";
  
    fetch(url, {
      method: method,
      body: formData,
    })
    .then((response) => response.json())
    .then((data) => {
      Swal.fire({
        title: 'Success!',
        text: 'Staff member has been saved successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => location.reload());
    })
    .catch(() => {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to save the staff member. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    });
  
    // Close the modal
    $('#staffModal').modal('hide');
  }
  
  // Delete Staff Member
  function deleteStaffById(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: "This action will permanently delete the staff member!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:8080/api/delete-customer/${id}`, {
          method: "DELETE",
        })
        .then((response) => {
          if (response.ok) {
            Swal.fire({
              title: 'Deleted!',
              text: 'The staff member has been deleted successfully.',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => location.reload());
          } else {
            Swal.fire({
              title: 'Error!',
              text: 'Failed to delete the staff member.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        })
        .catch(() => {
          Swal.fire({
            title: 'Error!',
            text: 'An error occurred. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        });
      }
    });
  }
  







  document.addEventListener("DOMContentLoaded", fetchFeedback);

  function fetchFeedback() {
      fetch("http://localhost:8080/api/feedback/view-all-customer-feedback")
          .then(response => response.json())
          .then(data => {
              const tableBody = document.getElementById("customerFeedbackBody");
  
              if (tableBody) {
                  tableBody.innerHTML = ""; // Clear previous rows
  
                  data.forEach(t => {
                      let tr = document.createElement("tr");
  
                      // Feedback ID column
                      let feedbackId = document.createElement("td");
                      feedbackId.textContent = t.feedbackId;
  
                      // Customer Name column
                      let customerName = document.createElement("td");
                      customerName.textContent = t.customerName;
  
                      // Email column
                      let email = document.createElement("td");
                      email.textContent = t.email;
  
                      // Message column
                      let message = document.createElement("td");
                      message.textContent = t.message;
  
                      // Status column
                      let status = document.createElement("td");
                      let statusSpan = document.createElement("span");
                      statusSpan.className = t.status === "Verified" ? "verified-status" : "pending-status";
                      statusSpan.textContent = t.status;
                      status.appendChild(statusSpan);
  
                      // Action column
                      let action = document.createElement("td");
  
                      // Verify button
                      let verifyButton = document.createElement("button");
                      verifyButton.className = "btn btn-success me-2";
                      verifyButton.textContent = "VERIFY";
                      verifyButton.onclick = function () {
                          updateFeedbackStatus(t.feedbackId, "Verified");
                      };
  
                      // Delete button
                      let deleteButton = document.createElement("button");
                      deleteButton.className = "btn btn-danger";
                      deleteButton.textContent = "DELETE";
                      deleteButton.onclick = function () {
                          deleteFeedbackById(t.feedbackId, tr);
                      };
  
                      // Append buttons to action column
                      action.appendChild(verifyButton);
                      action.appendChild(deleteButton);
  
                      // Append all columns to the row
                      tr.appendChild(feedbackId);
                      tr.appendChild(customerName);
                      tr.appendChild(email);
                      tr.appendChild(message);
                      tr.appendChild(status);
                      tr.appendChild(action);
  
                      // Append the row to the table body
                      tableBody.appendChild(tr);
                  });
              }
          })
          .catch(error => {
              console.error("Error fetching feedback:", error);
          });
  }
  
  // Function to delete feedback by ID using SweetAlert
  function deleteFeedbackById(feedbackId, row) {
      Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
          if (result.isConfirmed) {
              fetch(`http://localhost:8080/api/feedback/delete-customer/${feedbackId}`, {
                  method: "DELETE"
              })
              .then(response => {
                  if (response.ok) {
                      // Remove the row from the table after successful deletion
                      row.remove();
                      Swal.fire(
                          'Deleted!',
                          'Feedback has been deleted.',
                          'success'
                      );
                  } else {
                      Swal.fire(
                          'Error!',
                          'Failed to delete feedback.',
                          'error'
                      );
                  }
              })
              .catch(error => {
                  console.error("Error deleting feedback:", error);
                  Swal.fire(
                      'Error!',
                      'An error occurred while deleting feedback.',
                      'error'
                  );
              });
          }
      });
  }