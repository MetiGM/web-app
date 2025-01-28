// Basic Frontend Form Validation
document.addEventListener("DOMContentLoaded", () => {
    const forms = document.querySelectorAll("form");
  
    forms.forEach((form) => {
      form.addEventListener("submit", (event) => {
        // Validate required inputs
        const inputs = form.querySelectorAll("input[required], textarea[required]");
        let isValid = true;
  
        inputs.forEach((input) => {
          if (!input.value.trim()) {
            isValid = false;
            showError(input, "This field is required");
          } else {
            clearError(input);
          }
  
          // Additional password confirmation check
          if (input.name === "confirmPassword") {
            const password = form.querySelector("input[name='password']");
            if (password && input.value !== password.value) {
              isValid = false;
              showError(input, "Passwords do not match");
            } else {
              clearError(input);
            }
          }
        });
  
        if (!isValid) {
          event.preventDefault();
        }
      });
    });
  
    // Input focus and blur effects
    const inputs = document.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
      input.addEventListener("focus", () => {
        input.style.borderColor = "#007bff";
      });
  
      input.addEventListener("blur", () => {
        input.style.borderColor = "#ccc";
      });
    });
  });
  
  // Show error message
  function showError(input, message) {
    let errorElement = input.nextElementSibling;
  
    if (!errorElement || !errorElement.classList.contains("error-message")) {
      errorElement = document.createElement("span");
      errorElement.className = "error-message";
      input.parentNode.appendChild(errorElement);
    }
  
    errorElement.textContent = message;
    input.style.borderColor = "#d9534f";
  }
  
  // Clear error message
  function clearError(input) {
    const errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains("error-message")) {
      errorElement.remove();
    }
    input.style.borderColor = "#ccc";
  }
  