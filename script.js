script.js

const serviceType = document.getElementById("serviceType");
const dynamicFields = document.getElementById("dynamicFields");
const bookingForm = document.getElementById("bookingForm");
const reviewPanel = document.getElementById("reviewPanel");
const reviewDetails = document.getElementById("reviewDetails");
const formMessage = document.getElementById("formMessage");

const BUSINESS_WHATSAPP = "2348026265351";

document.getElementById("year").textContent = new Date().getFullYear();

const serviceNames = {
  motorcycle: "Motorcycle Ride",
  delivery: "Package Delivery",
  tricycle: "Tricycle (Keke)"
};

function field(label, name, placeholder, type = "text", required = true) {
  const requiredMark = required ? " " : "";
  const requiredAttribute = required ? "required" : "";

  return `
    <div class="form-group">
      <label for="${name}">${label}${requiredMark}</label>
      <input
        id="${name}"
        name="${name}"
        type="${type}"
        placeholder="${placeholder}"
        ${requiredAttribute}
      >
    </div>
  `;
}

function textareaField(label, name, placeholder, required = true) {
  return `
    <div class="form-group">
      <label for="${name}">${label}${required ? " " : ""}</label>
      <textarea
        id="${name}"
        name="${name}"
        rows="3"
        placeholder="${placeholder}"
        ${required ? "required" : ""}
      ></textarea>
    </div>
  `;
}

function updateDynamicFields() {
  const service = serviceType.value;
  reviewPanel.hidden = true;
  formMessage.textContent = "";

  if (!service) {
    dynamicFields.innerHTML = "";
    return;
  }

  let html = `
    ${field("Your full name", "customerName", "Enter your name")}
    ${field("Your phone number", "customerPhone", "Phone number", "tel")}
    ${field("Pickup location", "pickup", "Where should we meet?")}
    ${field("Destination", "destination", "Where are you going?")}
  `;

  if (service === "motorcycle") {
    html += `
      <div class="form-group">
        <label for="passengers">Number of passengers </label>
        <select id="passengers" name="passengers" required>
          <option value="">Choose passenger count</option>
          <option value="1">1 passenger</option>
          <option value="2">2 passengers — separate motorcycles may be needed</option>
          <option value="3">3 passengers — separate motorcycles may be needed</option>
          <option value="4">4 passengers — separate motorcycles may be needed</option>
        </select>
        <small>
          Each motorcycle must follow safe passenger limits. Groups may require
          separate motorcycles.
        </small>
      </div>
    `;
  }

  if (service === "delivery") {
    html += `
      ${field("Recipient's full name", "recipientName", "Who will receive the item?")}
      ${field("Recipient's phone number", "recipientPhone", "Recipient contact", "tel")}
      ${textareaField("Package description", "packageDescription",
        "Describe the item and any handling needs")}
    `;
  }

  if (service === "tricycle") {
    html += `
      <div class="form-group">
        <label for="tricyclePurpose">What do you need transported? </label>
        <select id="tricyclePurpose" name="tricyclePurpose" required>
          <option value="">Choose one</option>
          <option value="Passengers">Passengers</option>
          <option value="Load or items">Load or items</option>
          <option value="Passengers and load">Passengers and load</option>
        </select>
      </div>
      ${textareaField("Passenger or load details", "tricycleDetails",
        "Number of passengers or description of the load")}
    `;
  }

  dynamicFields.innerHTML = html;
  document.getElementById("step1").classList.add("active");
  document.getElementById("step2").classList.add("active");
}

serviceType.addEventListener("change", updateDynamicFields);

document.querySelectorAll("[data-service]").forEach((button) => {
  button.addEventListener("click", () => {
    serviceType.value = button.dataset.service;
    updateDynamicFields();
    document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
  });
});

function collectBooking() {
  const formData = new FormData(bookingForm);
  const result = {};

  for (const [key, value] of formData.entries()) {
    result[key] = String(value).trim();
  }

  result.serviceName = serviceNames[result.serviceType] || "Service";
  return result;
}

function addReviewRow(label, value) {
  if (!value) return "";

  const row = document.createElement("div");
  row.className = "review-row";

  const strong = document.createElement("strong");
  strong.textContent = `${label}: `;

  const span = document.createElement("span");
  span.textContent = value;

  row.append(strong, span);
  return row;
}

function showReview(data) {
  reviewDetails.replaceChildren();

  const labels = {
    serviceName: "Service",
    customerName: "Customer",
    customerPhone: "Phone",
    pickup: "Pickup",
    destination: "Destination",
    passengers: "Passengers",
    recipientName: "Recipient",
    recipientPhone: "Recipient phone",
    packageDescription: "Package details",
    tricyclePurpose: "Tricycle service",
    tricycleDetails: "Passenger/load details",
    preferredDate: "Preferred date",
    preferredTime: "Preferred time",
    directions: "Extra directions",
    referencePrice: "Reference price"
  };

  Object.keys(labels).forEach((key) => {
    const row = addReviewRow(labels[key], data[key]);
    if (row) reviewDetails.appendChild(row);
  });

  reviewPanel.hidden = false;
  document.getElementById("step3").classList.add("active");
  reviewPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!bookingForm.reportValidity()) return;

  const data = collectBooking();
  showReview(data);
  formMessage.textContent = "Review your details before continuing to WhatsApp.";
});

document.getElementById("editBooking").addEventListener("click", () => {
  reviewPanel.hidden = true;
  document.getElementById("step3").classList.remove("active");
  bookingForm.scrollIntoView({ behavior: "smooth", block: "start" });
});

document.getElementById("sendWhatsApp").addEventListener("click", () => {
  if (!bookingForm.reportValidity()) {
    reviewPanel.hidden = true;
    bookingForm.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const data = collectBooking();

  const messageLines = [
    "EARTHMASS LOGISTICS — BOOKING REQUEST",
    "",
    `Service: ${data.serviceName}`,
    `Customer: ${data.customerName}`,
    `Phone: ${data.customerPhone}`,
    `Pickup: ${data.pickup}`,
    `Destination: ${data.destination}`,
    data.passengers ? `Passengers: ${data.passengers}` : "",
    data.recipientName ? `Recipient: ${data.recipientName}` : "",
    data.recipientPhone ? `Recipient phone: ${data.recipientPhone}` : "",
    data.packageDescription ? `Package: ${data.packageDescription}` : "",
    data.tricyclePurpose ? `Tricycle request: ${data.tricyclePurpose}` : "",
    data.tricycleDetails ? `Passenger/load details: ${data.tricycleDetails}` : "",
    `Preferred date: ${data.preferredDate}`,
    `Preferred time: ${data.preferredTime}`,
    data.directions ? `Extra directions: ${data.directions}` : "",
    data.referencePrice ? `Reference price selected: ${data.referencePrice}` : "",
    "",
    "Please confirm fare, payment arrangements and availability.",
    "I understand this request is not confirmed until management approves it."
  ].filter(Boolean);

  const whatsappURL =
    `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(messageLines.join("\n"))}`;

  window.open(whatsappURL, "_blank", "noopener,noreferrer");
});