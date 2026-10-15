
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bookingForm");
  const serviceType = document.getElementById("serviceType");
  const motorcycleFields = document.getElementById("motorcycleFields");
  const packageFields = document.getElementById("packageFields");
  const kekeFields = document.getElementById("kekeFields");
  const passengers = document.getElementById("passengers");
  const luggage = document.getElementById("luggage");
  const estimate = document.getElementById("motorcycleEstimate");
  const fareExplanation = document.getElementById("fareExplanation");
  const status = document.getElementById("formStatus");
  const dateInput = document.getElementById("preferredDate");

  document.getElementById("currentYear").textContent = new Date().getFullYear();

  // Prevent customers from choosing a date and time in the past.
  const localNow = new Date();
  localNow.setMinutes(localNow.getMinutes() - localNow.getTimezoneOffset());
  dateInput.min = localNow.toISOString().slice(0, 16);

  const conditionalFields = [
    motorcycleFields,
    packageFields,
    kekeFields
  ];

  function setRequired(container, required) {
    container.querySelectorAll("input, select, textarea").forEach((field) => {
      field.required = required;
    });
  }

  function updateServiceFields() {
    conditionalFields.forEach((section) => {
      section.hidden = true;
      setRequired(section, false);
    });

    if (serviceType.value === "Motorcycle Ride") {
      motorcycleFields.hidden = false;
      setRequired(motorcycleFields, true);
    } else if (serviceType.value === "Package Delivery") {
      packageFields.hidden = false;
      setRequired(packageFields, true);
    } else if (serviceType.value === "Tricycle (Keke)") {
      kekeFields.hidden = false;
      setRequired(kekeFields, true);
    }

    status.textContent = "";
    updateMotorcycleEstimate();
  }

  function updateMotorcycleEstimate() {
    const count = Number(passengers.value || 1);
    const baseFare = count * 1000;

    estimate.textContent = baseFare.toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0
    });

    fareExplanation.textContent =
      `₦1,000 × ${count} passenger${count === 1 ? "" : "s"}. ` +
      (luggage.value === "With luggage"
        ? "Management will review any additional luggage charge. "
        : "No luggage charge requested. ") +
      "This is a base estimate only; management must confirm the final fare.";
  }

  serviceType.addEventListener("change", updateServiceFields);
  passengers.addEventListener("change", updateMotorcycleEstimate);
  luggage.addEventListener("change", updateMotorcycleEstimate);

  function value(name) {
    const field = form.elements.namedItem(name);
    return field ? field.value.trim() : "";
  }

  function addLine(lines, label, fieldName) {
    const content = value(fieldName);
    if (content) lines.push(`${label}: ${content}`);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = "";

    if (!form.reportValidity()) return;

    const service = value("serviceType");
    const lines = [
      "EARTHMASS LOGISTICS — BOOKING REQUEST",
      "",
      `Service: ${service}`,
      `Customer name: ${value("customerName")}`,
      `Customer phone: ${value("customerPhone")}`,
      `Pickup: ${value("pickup")}`,
      `Destination: ${value("destination")}`,
      `Preferred date and time: ${value("preferredDate").replace("T", " ")}`,
      `Extra directions/landmarks: ${value("directions") || "Not provided"}`,
      ""
    ];

    if (service === "Motorcycle Ride") {
      const count = Number(value("passengers") || 1);
      lines.push(
        "MOTORCYCLE DETAILS",
        `Number of passengers: ${count}`,
        `Luggage: ${value("luggage")}`,
        `Estimated base fare: ₦${(count * 1000).toLocaleString("en-NG")}`,
        "Final fare and any luggage charge: To be confirmed by management",
        ""
      );
    }

    if (service === "Package Delivery") {
      lines.push("PACKAGE DELIVERY DETAILS");
      addLine(lines, "Sender's name", "senderName");
      addLine(lines, "Sender's phone", "senderPhone");
      addLine(lines, "Recipient's name", "recipientName");
      addLine(lines, "Recipient's phone", "recipientPhone");
      addLine(lines, "Package description", "packageDescription");
      lines.push("Delivery fare: To be confirmed by management", "");
    }

    if (service === "Tricycle (Keke)") {
      lines.push("KEKE DETAILS");
      addLine(lines, "Number of passengers", "kekePassengers");
      addLine(lines, "Load details", "loadDetails");
      lines.push("Fare: To be confirmed by management", "");
    }

    lines.push(
      "PLEASE CONFIRM:",
      "1. Final fare",
      "2. Driver and vehicle availability",
      "3. Payment arrangements",
      "",
      "I understand that this is a booking request only. My booking is not confirmed until management contacts me and approves the arrangements."
    );

    const message = lines.join("\n");
    const whatsappURL =
      "https://wa.me/2348026265351?text=" + encodeURIComponent(message);

    status.textContent =
      "Your booking message is ready. WhatsApp will open so you can review it and press Send.";

    window.open(whatsappURL, "_blank", "noopener,noreferrer");
  });

  updateServiceFields();
});
    });
