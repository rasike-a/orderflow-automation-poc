// Auto-detect API URL based on environment
const API = window.location.hostname === 'localhost' 
  ? "http://localhost:4000" 
  : `${window.location.origin}/api`;

// DOM Elements
const form = document.getElementById("orderForm");
const tokenInput = document.getElementById("token");
const emailInput = document.getElementById("email");
const productInput = document.getElementById("product");
const submitBtn = document.getElementById("submitBtn");
const getTokenBtn = document.getElementById("getToken");
const clearTokenBtn = document.getElementById("clearToken");
const loading = document.getElementById("loading");
const response = document.getElementById("response");
const responseContent = document.getElementById("responseContent");
const statusBadge = document.getElementById("statusBadge");

// Get JWT Token
getTokenBtn.addEventListener("click", async () => {
  const email = prompt("Enter your email address:", "test@example.com");
  if (!email) return;

  getTokenBtn.disabled = true;
  getTokenBtn.textContent = "⏳ Requesting...";

  try {
    // Request magic link
    const magicLinkRes = await fetch(`${API}/auth/magic-link`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!magicLinkRes.ok) {
      throw new Error("Failed to request magic link");
    }

    const magicLink = await magicLinkRes.json();
    const token = new URL(magicLink.url).searchParams.get("token");

    // Verify magic link
    const verifyRes = await fetch(`${API}/auth/magic-link/verify?token=${token}`);
    if (!verifyRes.ok) {
      throw new Error("Failed to verify magic link");
    }

    const verifyHtml = await verifyRes.text();
    const jwtMatch = verifyHtml.match(/<pre>([^<]+)<\/pre>/);

    if (jwtMatch) {
      const jwtToken = jwtMatch[1].trim();
      tokenInput.value = jwtToken;
      showResponse("success", "✅ JWT Token obtained successfully!", {
        message: "Token has been automatically filled in the form.",
        token: jwtToken.substring(0, 50) + "..."
      });
    } else {
      throw new Error("Could not extract JWT token");
    }
  } catch (error) {
    showResponse("error", "❌ Failed to get JWT token", {
      error: error.message
    });
  } finally {
    getTokenBtn.disabled = false;
    getTokenBtn.textContent = "🔑 Get JWT Token";
  }
});

// Clear token
clearTokenBtn.addEventListener("click", () => {
  tokenInput.value = "";
  response.classList.remove("show");
});

// Form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = tokenInput.value.trim();
  const customerEmail = emailInput.value.trim();
  const productName = productInput.value.trim();

  if (!token || !customerEmail || !productName) {
    showResponse("error", "❌ Validation Error", {
      error: "Please fill in all fields"
    });
    return;
  }

  // Show loading state
  loading.classList.add("show");
  response.classList.remove("show");
  submitBtn.disabled = true;

  try {
    const res = await fetch(`${API}/orders`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ customerEmail, productName }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to create order");
    }

    // Success response
    showResponse("success", "✅ Order Created Successfully!", {
      orderId: data.orderId,
      status: data.status,
      aiSummary: data.aiSummary,
      fullResponse: data
    });

    // Clear form (optional - you can remove this if you want to keep the values)
    // form.reset();
  } catch (error) {
    showResponse("error", "❌ Order Creation Failed", {
      error: error.message,
      details: error.toString()
    });
  } finally {
    loading.classList.remove("show");
    submitBtn.disabled = false;
  }
});

// Show response helper
function showResponse(type, title, data) {
  response.className = `response show ${type}`;
  statusBadge.textContent = type === "success" ? "Success" : "Error";
  statusBadge.className = `response-status ${type}`;

  let content = `<strong>${title}</strong><br><br>`;

  if (type === "success") {
    if (data.orderId) {
      content += `
        <div style="margin-bottom: 12px;">
          <strong>Order ID:</strong> <code style="background: #e0e7ff; padding: 2px 6px; border-radius: 4px;">${data.orderId}</code><br>
          <strong>Status:</strong> <span style="color: #10b981; font-weight: 600;">${data.status}</span>
        </div>
      `;
    }

    if (data.aiSummary) {
      content += `
        <div class="ai-summary">
          <h4>🤖 AI Summary</h4>
          <div class="ai-summary-content">${escapeHtml(data.aiSummary)}</div>
        </div>
      `;
    }

    if (data.fullResponse) {
      content += `
        <details style="margin-top: 12px;">
          <summary style="cursor: pointer; color: #667eea; font-weight: 600;">View Full Response</summary>
          <pre>${JSON.stringify(data.fullResponse, null, 2)}</pre>
        </details>
      `;
    }
  } else {
    content += `
      <div style="color: #ef4444;">
        <strong>Error:</strong> ${escapeHtml(data.error || "Unknown error")}<br>
        ${data.details ? `<small>${escapeHtml(data.details)}</small>` : ""}
      </div>
    `;
  }

  responseContent.innerHTML = content;
}

// Escape HTML helper
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Auto-focus first empty input
window.addEventListener("load", () => {
  if (!tokenInput.value) {
    tokenInput.focus();
  } else if (!emailInput.value) {
    emailInput.focus();
  } else {
    productInput.focus();
  }
});
