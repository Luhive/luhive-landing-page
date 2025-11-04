// Smooth scroll to demo section
function scrollToDemo() {
    document.getElementById('contact').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Toast notification system
function showToast(message, type = 'info') {
    // Remove any existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-icon">
                ${type === 'success' ? '<i data-lucide="check-circle"></i>' : 
                  type === 'error' ? '<i data-lucide="x-circle"></i>' : 
                  '<i data-lucide="info"></i>'}
            </div>
            <span class="toast-message">${message}</span>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i data-lucide="x"></i>
        </button>
    `;

    // Add toast styles
    const style = document.createElement('style');
    style.textContent = `
        .toast {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 12px;
            padding: 16px 20px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            border-left: 4px solid;
            display: flex;
            align-items: center;
            justify-content: space-between;
            max-width: 400px;
            z-index: 10000;
            font-family: 'Manrope', sans-serif;
            animation: slideIn 0.3s ease-out;
        }

        .toast-success {
            border-left-color: #10b981;
        }

        .toast-error {
            border-left-color: #ef4444;
        }

        .toast-info {
            border-left-color: #3b82f6;
        }

        .toast-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .toast-icon {
            display: flex;
            align-items: center;
        }

        .toast-success .toast-icon {
            color: #10b981;
        }

        .toast-error .toast-icon {
            color: #ef4444;
        }

        .toast-info .toast-icon {
            color: #3b82f6;
        }

        .toast-message {
            color: #374151;
            font-size: 14px;
            line-height: 1.5;
        }

        .toast-close {
            background: none;
            border: none;
            color: #9ca3af;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            transition: color 0.2s;
        }

        .toast-close:hover {
            color: #6b7280;
        }

        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @media (max-width: 640px) {
            .toast {
                top: 20px;
                right: 20px;
                left: 20px;
                max-width: none;
            }
        }
    `;

    // Add styles to document if not already added
    if (!document.querySelector('#toast-styles')) {
        style.id = 'toast-styles';
        document.head.appendChild(style);
    }

    // Add toast to document
    document.body.appendChild(toast);

    // Initialize Lucide icons for the toast
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => toast.remove(), 300);
        }
    }, 5000);
}

// Form submission handler
document.addEventListener("DOMContentLoaded", function () {
  const demoForm = document.getElementById("demoForm");

  if (demoForm) {
    demoForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Get form values and validate
      const email = document.getElementById("email").value.trim();
      const organization = document
        .getElementById("communityName")
        .value.trim();

      // Basic validation
      if (!name || !email || !organization) {
        showToast("Please fill in all required fields.", "error");
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast("Please enter a valid email address.", "error");
        return;
      }

      // Prepare payload
      const payload = {
        email: email,
        communityName: organization,
      };

      // Disable submit button to prevent double submission
      const submitButton = demoForm.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      const originalStyle = submitButton.style.cssText;

      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
      submitButton.style.backgroundColor = "#9CA3AF";
      submitButton.style.color = "#6B7280";
      submitButton.style.cursor = "not-allowed";
      submitButton.style.opacity = "0.7";

      try {
        // Make API call
        const response = await fetch(
          "https://request-demo-endpoint.luhive.workers.dev",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (response.ok) {
          // Track successful submission in Google Analytics
          if (typeof gtag !== "undefined") {
            gtag("event", "submit", {
              event_category: "Form",
              event_label: "Demo Request Form - Success",
              value: 1,
            });
          }

          // Show success message
          showToast(
            "Thank you for your interest! We'll be in touch soon.",
            "success"
          );

          // Reset form
          demoForm.reset();
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error submitting demo request:", error);

        // Track failed submission in Google Analytics
        if (typeof gtag !== "undefined") {
          gtag("event", "exception", {
            description: "Demo form submission failed",
            fatal: false,
          });
        }

        // Show error message
        showToast(
          "Sorry, there was an error submitting your request. Please try again or contact us directly at hi@luhive.com",
          "error"
        );
      } finally {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        submitButton.style.cssText = originalStyle;
      }
    });
  }

  // Navbar scroll effect
  const navbar = document.querySelector(".navbar");
  let lastScroll = 0;

  window.addEventListener("scroll", function () {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      navbar.style.boxShadow = "var(--shadow-sm)";
    } else {
      navbar.style.boxShadow = "none";
    }

    lastScroll = currentScroll;
  });

  // Add animation on scroll for feature cards
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe feature cards
  const featureCards = document.querySelectorAll(".feature-card");
  featureCards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(card);
  });

  // Observe stat cards
  const statCards = document.querySelectorAll(".stat-card");
  statCards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(card);
  });
});

