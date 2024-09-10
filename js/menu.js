let isEditMode = false;
let cid = 0; // Global variable to store the mealId for editing

document.addEventListener("DOMContentLoaded", () => {
  const cid = sessionStorage.getItem("cid");

  // Fetch and display menu items
  fetch("http://localhost:8080/api/menu/view-all-menu")
    .then((response) => response.json())
    .then((data) => {
      data.map((t) => {
        if (document.getElementById("menuTableBody") != null) {
          let tr = document.createElement("tr");

          let mealid = document.createElement("td");
          mealid.textContent = t.mealId;

          let mealName = document.createElement("td");
          mealName.textContent = t.mealName;

          let mealPrice = document.createElement("td");
          mealPrice.textContent = t.mealPrice;

          let mealImageCover = document.createElement("td");
          let mealImage = document.createElement("img");
          mealImage.src = `data:image/png;base64,${t.mealImage}`;
          mealImage.style.width = "50px";
          mealImage.style.height = "50px";
          mealImageCover.appendChild(mealImage);

          let mealType = document.createElement("td");
          mealType.textContent = t.mealType;

          let buttonCover = document.createElement("td");

          // Create Edit Button
          let editButton = document.createElement("button");
          editButton.className = "btn btn-primary me-2";
          editButton.textContent = "Edit";
          editButton.onclick = function () {
            openMenuModal('edit', t);
          };

          // Create Delete Button
          let deleteButton = document.createElement("button");
          deleteButton.className = "btn btn-danger";
          deleteButton.textContent = "Delete";
          deleteButton.onclick = function () {
            deleteMenuById(t.mealId);
          };

          // Append the buttons to the button cover
          buttonCover.appendChild(editButton);
          buttonCover.appendChild(deleteButton);

          // Append all table data cells to the row
          tr.appendChild(mealid);
          tr.appendChild(mealName);
          tr.appendChild(mealPrice);
          tr.appendChild(mealImageCover);
          tr.appendChild(mealType);
          tr.appendChild(buttonCover);

          // Append the row to the table body
          document.getElementById("menuTableBody").append(tr);
        }
      });
    });
});

// Function to open modal for Add/Edit
function openMenuModal(mode, data = null) {
  const modalTitle = document.getElementById("menuModalLabel");
  const submitBtn = document.getElementById("menuFormSubmitBtn");

  document.getElementById("menuForm").reset(); // Clear the form

  if (mode === 'edit' && data) {
    isEditMode = true;
    cid = data.mealId; // Set mealId for editing

    modalTitle.textContent = "Edit Menu Item";
    submitBtn.textContent = "Update";

    // Populate form fields with existing data
    document.getElementById("mealName").value = data.mealName;
    document.getElementById("mealPrice").value = data.mealPrice;
    document.getElementById("mealType").value = data.mealType;
  } else {
    isEditMode = false;
    modalTitle.textContent = "Add New Menu Item";
    submitBtn.textContent = "Add";
  }

  $("#menuModal").modal("show");
}

// Handle Add/Edit form submission
document.getElementById("menuForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const mealName = document.getElementById("mealName").value;
  const mealPrice = document.getElementById("mealPrice").value;
  const mealImage = document.getElementById("formFile").files[0];
  const mealType = document.getElementById("mealType").value;

  if (!mealName || !mealPrice || !mealImage || mealType === "select") {
    Swal.fire({
      title: 'Error!',
      text: 'Please fill all fields correctly.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
    return;
  }

  const formData = new FormData();
  formData.append("mealName", mealName);
  formData.append("mealPrice", mealPrice);
  formData.append("mealImage", mealImage);
  formData.append("mealType", mealType);

  let apiUrl;
  let method;

  if (isEditMode) {
    apiUrl = `http://localhost:8080/api/menu/update-menu/${cid}`;
    method = "PUT";
  } else {
    apiUrl = "http://localhost:8080/api/menu/add-menu";
    method = "POST";
  }

  fetch(apiUrl, {
    method: method,
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        Swal.fire({
          title: 'Success!',
          text: isEditMode ? 'Menu item updated successfully!' : 'Menu item added successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          location.reload(); // Reload the page after confirmation
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'An error occurred. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    })
    .catch(() => {
      Swal.fire({
        title: 'Error!',
        text: 'An error occurred while processing the request. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    });

  $('#menuModal').modal('hide'); // Close the modal after submission
});

// Function to delete a menu item
function deleteMenuById(id) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`http://localhost:8080/api/menu/delete-menu/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            Swal.fire({
              title: 'Deleted!',
              text: 'The menu item has been deleted.',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              location.reload(); // Reload the page after confirmation
            });
          } else {
            Swal.fire({
              title: 'Error!',
              text: 'Failed to delete the menu item.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        })
        .catch(() => {
          Swal.fire({
            title: 'Error!',
            text: 'An error occurred. Please try again later.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        });
    }
  });
}



// document.addEventListener("DOMContentLoaded", () => {
//     // Fetch menu items from your API
//     fetch("http://localhost:8080/api/menu/view-all-menu")
//       .then((response) => response.json())
//       .then((data) => {
//         const menuContainer = document.getElementById("menuContainer");
//         menuContainer.innerHTML = ''; // Clear existing content
  
//         data.forEach((item) => {
//           // Create a div for the food item
//           const foodItemDiv = document.createElement("div");
//           foodItemDiv.className = "food-item";
          
//           // Create the image element
//           const img = document.createElement("img");
//           img.src = `data:image/png;base64,${item.mealImage}`;
//           foodItemDiv.appendChild(img);
  
//           // Create the food name element
//           const foodName = document.createElement("h3");
//           foodName.textContent = item.mealName;
//           foodItemDiv.appendChild(foodName);
         
//           // Create the price element
//           const price = document.createElement("h6");
//           price.className = "price";
//           price.textContent = `$${item.mealPrice}`;
//           foodItemDiv.appendChild(price);
         
//           // Create the "Add to Cart" button
//           const addToCartDiv = document.createElement("div");
//           addToCartDiv.className = "add-to-cart";
//           const addToCartLink = document.createElement("a");
//           addToCartLink.href = "#";
//           addToCartLink.innerHTML = "<i class='bx bx-plus-circle'></i>";
//           addToCartDiv.appendChild(addToCartLink);
//           foodItemDiv.appendChild(addToCartDiv);
          
//           // Append the food item to the menu container
//           menuContainer.appendChild(foodItemDiv);
          
//           // Log the food item to check
//           console.log(foodItemDiv);
//         });
//       })
//       .catch((error) => {
//         console.error("Error fetching menu data:", error);
//         alert("Error fetching menu data.");
//       });
// });

// document.addEventListener("DOMContentLoaded", () => {
//     // Fetch menu items from your API
//     fetch("http://localhost:8080/api/menu/view-all-menu")
//       .then((response) => response.json())
//       .then((data) => {
//         const menuContainer = document.getElementById("menuContainer");
//         menuContainer.innerHTML = ''; // Clear existing content
  
//         data.forEach((item) => {
//           // Create a div for the food item
//           const foodItemDiv = document.createElement("div");
//           foodItemDiv.className = "food-item";
          
//           // Create the image element
//           const img = document.createElement("img");
//           img.src = `data:image/png;base64,${item.mealImage}`;
//           foodItemDiv.appendChild(img);
  
//           // Create the food name element
//           const foodName = document.createElement("h3");
//           foodName.textContent = item.mealName;
//           foodItemDiv.appendChild(foodName);
         
//           // Create the price element
//           const price = document.createElement("h6");
//           price.className = "price";
//           price.textContent = `$${(item.mealPrice / 100).toFixed(2)}`; // Convert price to a dollar format
//           foodItemDiv.appendChild(price);
         
//           // Create the "Add to Cart" button
//           const addToCartDiv = document.createElement("div");
//           addToCartDiv.className = "add-to-cart";
//           const addToCartLink = document.createElement("a");
//           addToCartLink.href = "#";
//           addToCartLink.innerHTML = "<i class='bx bx-plus-circle'></i>";
//           addToCartDiv.appendChild(addToCartLink);
//           foodItemDiv.appendChild(addToCartDiv);
          
//           // Append the food item to the menu container
//           menuContainer.appendChild(foodItemDiv);
//         });
//       })
//       .catch((error) => {
//         console.error("Error fetching menu data:", error);
//         alert("Error fetching menu data.");
//       });
// });