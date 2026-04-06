/**
 * Form Handler - Provides validation and submission handling for all forms
 */

// ===== CONTACT FORM HANDLING =====
document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", handleContactFormSubmit);
  }

  const newsletterButton = document.querySelector("#newsletter button");
  if (newsletterButton) {
    newsletterButton.addEventListener("click", function (event) {
      event.preventDefault();
      handleNewsletterSignup();
    });
  }
});

function handleContactFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const name = form.querySelector('input[name="name"]');
  const email = form.querySelector('input[name="email"]');
  const subject = form.querySelector('input[name="subject"]');
  const message = form.querySelector('textarea[name="message"]');

  // Validate form inputs
  if (!validateContactForm(name, email, subject, message)) {
    return;
  }

  // Store form data in localStorage (mock backend)
  const contactData = {
    name: name.value,
    email: email.value,
    subject: subject.value,
    message: message.value,
    timestamp: new Date().toLocaleString(),
  };

  // Get existing contact submissions
  let submissions = JSON.parse(
    localStorage.getItem("contactSubmissions") || "[]",
  );
  submissions.push(contactData);
  localStorage.setItem("contactSubmissions", JSON.stringify(submissions));

  // Show success message
  showMessage(
    "Thanks for reaching out! We'll get back to you soon.",
    "success",
  );

  // Reset form
  form.reset();
}

function validateContactForm(
  nameInput,
  emailInput,
  subjectInput,
  messageInput,
) {
  let isValid = true;

  // Validate name
  if (nameInput.value.trim().length < 2) {
    showInputError(nameInput, "Name must be at least 2 characters");
    isValid = false;
  }

  // Validate email
  if (!isValidEmail(emailInput.value)) {
    showInputError(emailInput, "Please enter a valid email address");
    isValid = false;
  }

  // Validate subject
  if (subjectInput.value.trim().length < 3) {
    showInputError(subjectInput, "Subject must be at least 3 characters");
    isValid = false;
  }

  // Validate message
  if (messageInput.value.trim().length < 10) {
    showInputError(messageInput, "Message must be at least 10 characters");
    isValid = false;
  }

  return isValid;
}

// ===== NEWSLETTER SIGNUP =====
function handleNewsletterSignup() {
  const emailInput = document.querySelector("#newsletter input[type='email']");

  if (!emailInput) {
    console.error("Newsletter email input not found");
    return;
  }

  const email = emailInput.value.trim();

  // Validate email
  if (!isValidEmail(email)) {
    showInputError(emailInput, "Please enter a valid email address");
    return;
  }

  // Get existing subscriptions
  let subscriptions = JSON.parse(
    localStorage.getItem("newsletterSubscriptions") || "[]",
  );

  // Check for duplicates
  if (subscriptions.includes(email)) {
    showInputError(emailInput, "This email is already subscribed");
    return;
  }

  // Add new subscription
  subscriptions.push(email);
  localStorage.setItem(
    "newsletterSubscriptions",
    JSON.stringify(subscriptions),
  );

  // Show success message
  showMessage("You've successfully subscribed to our newsletter!", "success");

  // Reset input
  emailInput.value = "";
}

// ===== UTILITY FUNCTIONS =====
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showInputError(input, message) {
  // Remove any existing error
  const existingError = input.parentElement.querySelector(".error-message");
  if (existingError) {
    existingError.remove();
  }

  // Add error styling
  input.style.borderColor = "#ff6b6b";

  // Show error message
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.style.color = "#ff6b6b";
  errorDiv.style.fontSize = "12px";
  errorDiv.style.marginTop = "5px";
  errorDiv.textContent = message;
  input.parentElement.appendChild(errorDiv);

  // Remove error after 3 seconds
  setTimeout(() => {
    input.style.borderColor = "";
    if (errorDiv.parentElement) {
      errorDiv.remove();
    }
  }, 3000);
}

function showMessage(message, type) {
  // Create message element
  const messageDiv = document.createElement("div");
  messageDiv.className = `notification ${type}`;
  messageDiv.textContent = message;

  // Style the message
  messageDiv.style.padding = "15px";
  messageDiv.style.marginBottom = "15px";
  messageDiv.style.borderRadius = "4px";
  messageDiv.style.backgroundColor = type === "success" ? "#d4edda" : "#f8d7da";
  messageDiv.style.color = type === "success" ? "#155724" : "#721c24";
  messageDiv.style.border = `1px solid ${type === "success" ? "#c3e6cb" : "#f5c6cb"}`;

  // Find form or newsletter section to insert message after
  const form = document.getElementById("contactForm");
  const newsletter = document.getElementById("newsletter");

  if (form) {
    form.parentElement.insertBefore(messageDiv, form);
  } else if (newsletter) {
    newsletter.parentElement.insertBefore(messageDiv, newsletter);
  }

  // Remove message after 5 seconds
  setTimeout(() => {
    if (messageDiv.parentElement) {
      messageDiv.remove();
    }
  }, 5000);
}
