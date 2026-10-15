
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bookingForm");
  if (!form) return;

  const serviceType = document.getElementById("serviceType");
  const status = document.getElementById("formStatus");
  const motorcycleFields = document.getElementById("motorcycleFields");
  const packageFields = document.getElementById("packageFields");
  const kekeFields = document.getElementById("kekeFields");
  const dateInput = document.getElementById("preferredDate");

  const sections = [motorcycleFields, packageFields, kekeFields];

  document.getElementById("currentYear").textContent =
    String(new Date().getFullYear());

  if (dateInput) {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    dateInput.min = now.toISOString().slice(0, 16);
  }

  function fieldValue(name) {
    const field = form.elements.namedItem(name);
    return field ? String(field.value).trim() : "";
  }

  function addField(lines, label, name) {
    const value = fieldValue(name);
    if (value) lines.push(`${label}: ${value}`);
  }

  function updateServiceFields() {
    sections.forEach((section) => {
      if (!section) return;

      section.hidden = true;
      section.querySelectorAll("input, select, textarea").forEach((field) => {
        field.required = false;
      });
    });

    let activeSection = null;

    if (serviceType.value === "Motorcycle Ride") {
      activeSection = motorcycleFields;
    } else if (serviceType.value === "Package Delivery") {
      activeSection = packageFields;
    } else if (serviceType.value === "Tricycle (Keke)") {
      activeSection = kekeFields;
    }

    if (activeSection) {
      activeSection.hidden = false;
      activeSection.querySelectorAll("input, select, textarea").forEach((field) => {
        field.required = true;
      });

      const loadDetails = document.getElementById("loadDetails");
      if (loadDetails) loadDetails.required = false;
    }

    if (status) status.textContent = "";
  }

  serviceType.addEventListener("change", updateServiceFields);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (status) status.textContent = "";

    if (!form.reportValidity()) return;

    const service = fieldValue("serviceType");

    const lines = [
      "EARTHMASS LOGISTICS — BOOKING REQUEST",
      "",
      `Service: ${service}`,
      `Customer name: ${fieldValue("customerName")}`,
      `Customer phone: ${fieldValue("customerPhone")}`,
      `Pickup location: ${fieldValue("pickup")}`,
      `Destination: ${fieldValue("destination")}`,
      `Preferred date/time: ${fieldValue("preferredDate").replace("T", " ")}`,
      `Extra directions/landmarks: ${fieldValue("directions") || "Not provided"}`,
      ""
    ];

    if (service === "Motorcycle Ride") {
      lines.push("MOTORCYCLE RIDE DETAILS");
      addField(lines, "Number of passengers", "passengers");
      addField(lines, "Luggage", "luggage");
      lines.push("Fare: Please review and confirm manually.", "");
    }

    if (service === "Package Delivery") {
      lines.push("PACKAGE DELIVERY DETAILS");
      addField(lines, "Sender's name", "senderName");
      addField(lines, "Sender's phone", "senderPhone");
      addField(lines, "Recipient's name", "recipientName");
      addField(lines, "Recipient's phone", "recipientPhone");
      addField(lines, "Package description", "packageDescription");
      lines.push("Delivery fee: Please review and confirm manually.", "");
    }

    if (service === "Tricycle (Keke)") {
      lines.push("KEKE TRANSPORT DETAILS");
      addField(lines, "Number of passengers", "kekePassengers");
      addField(lines, "Load details", "loadDetails");
      lines.push("Fare: Please review and confirm manually.", "");
    }

    lines.push(
      "Please confirm the fare, vehicle/driver availability and payment arrangements.",
      "",
      "I understand this is a booking request only. My booking is not confirmed until management contacts me and approves the arrangements."
    );

    const message = lines.join("\n");
    const whatsappURL =
      "https://wa.me/2348026265351?text=" + encodeURIComponent(message);

    if (status) {
      status.textContent = "Opening WhatsApp. Please review the message and press Send.";
    }

    // Navigate in the current tab to avoid popup blockers.
    window.location.assign(whatsappURL);
  });

  updateServiceFields();
});
    
