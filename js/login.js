document.getElementById("btnlog").addEventListener("click", () => {
    fetch(
      `http://localhost:8080/api/customer-login?email=${encodeURIComponent(document.getElementById("email").value)}&password=${encodeURIComponent(document.getElementById("password").value)}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
      
        if (data) { 
          sessionStorage.setItem("cid", data.customerId);
       
          if (data.roleType === "ADMIN") {
            Swal.fire({
              icon: "success",
              title: "Login Successful",
              text: "Welcome, Admin Dashboard!..",
            }).then(() => {
              window.location.href = "admin/admindashboard.html";
            });
          } else if (data.roleType === "STAFF") {
            Swal.fire({
              icon: "success",
              title: "Login Successful",
              text: "Welcome, Staff Dashboard!..",
            }).then(() => {
              window.location.href = "staff/DashBoard.html";
            });
        }else if (data.roleType === "USER") {
            Swal.fire({
              icon: "success",
              title: "Login Successful",
              text: "Welcome, ABC Restaurant!..",
        })
            // .then(() => {
            //   window.location.href = "staff/DashBoard.html";
            // });
            
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: data.message || "Invalid credentials",
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Login Unsuccessful",
          text: "Incorrect Password or Email. Please try again later.",
        });
      });
  });