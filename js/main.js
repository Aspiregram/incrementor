// Getting the necessary DOM elements
const counterDisplay = document.querySelector(".counter-display");
const counterButton = document.querySelectorAll(".counter-button");
const counterIncrement = document.getElementById("counter-increment");
const counterDecrement = document.getElementById("counter-decrement");
const colorOption = document.getElementById("color-option");
const resetToggle = document.getElementById("reset-toggle");

let counter = "0"; // Setting up a default counter

// Creating a function to initialize the counter and colors
function initializedState() {
  let currentCount = localStorage.getItem("currentCount") || "0";
  let currentColor = localStorage.getItem("currentColor") || "#005a34";

  if (currentCount) {
    counter = currentCount;
    counterDisplay.textContent = counter;
  }

  if (currentColor) {
    pickColor(currentColor);
  }
}

// Creating a function to update the counter
function updateCounter(isIncrement) {
  counter = isIncrement ? ++counter : --counter;
  counterDisplay.textContent = counter;

  localStorage.setItem("currentCount", counter);
}

// Creating a function to toggle an "active" class for a button
function toggleButtonClass(buttonId) {
  buttonId.classList.add("active-button");
  setTimeout(() => {
    buttonId.classList.remove("active-button");
  }, 200);
}

// Creating a function to pick a color
function pickColor(pickedColor) {
  const isBright = colorBrightness(pickedColor);
  const secondaryColor = isBright ? "#000000" : "#ffffff";

  colorOption.value = pickedColor;

  Object.assign(counterDisplay.style, {
    border: `1px solid ${secondaryColor}`,
    backgroundColor: pickedColor,
    color: secondaryColor,
  });
  counterButton.forEach((button) => {
    Object.assign(button.style, {
      border: `1px solid ${secondaryColor}`,
      backgroundColor: pickedColor,
      color: secondaryColor,
    });
  });

  if (screen.width <= 1024) {
    const iconBrightness = isBright ? "dark" : "light";

    colorOption.style.setProperty(
      "content",
      `url(../assets/icons/edit-${iconBrightness}.svg)`
    );
    resetToggle.style.setProperty(
      "content",
      `url(../assets/icons/reset-${iconBrightness}.svg)`
    );
  }

  localStorage.setItem("currentColor", pickedColor);
}

// Creating a function to update the SVGs' state
function updateIconState() {
  if (screen.width > 1024) {
    colorOption.style.setProperty(
      "content",
      "url(../assets/icons/edit-light.svg)"
    );
    resetToggle.style.setProperty(
      "content",
      "url(../assets/icons/reset-light.svg)"
    );
  } else if (screen.width <= 1024 && pickColor(colorOption.value) >= 128) {
    colorOption.style.setProperty(
      "content",
      "url(../assets/icons/edit-dark.svg)"
    );
    resetToggle.style.setProperty(
      "content",
      "url(../assets/icons/reset-dark.svg)"
    );
  }
}

// Creating a function to calculate a color brightness based on its RGB value
function colorBrightness(hexCode) {
  const r = parseInt(hexCode.slice(1, 3), 16);
  const g = parseInt(hexCode.slice(3, 5), 16);
  const b = parseInt(hexCode.slice(5, 7), 16);

  const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return brightness >= 128;
}

// Creating a function to reset the counter
function resetCounter() {
  counter = "0";
  counterDisplay.textContent = counter;

  localStorage.setItem("currentCount", counter);
}

// Creating a function to update the resetToggle's state
function updateResetState() {
  if (localStorage.getItem("currentCount") !== "0") {
    resetToggle.classList.remove("inactive-reset");
  } else {
    resetToggle.classList.add("inactive-reset");
  }
}

window.addEventListener("DOMContentLoaded", initializedState); // Creating an event listener for initializing the counter and colors

// Creating an event listener for updating the counter with button clicks
counterButton.forEach((button) => {
  button.addEventListener("click", () => {
    updateCounter(button.id === "counter-increment");
  });
});

// Creating an event listener for updating and resetting the counter with key inputs
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "+":
      updateCounter(true);
      toggleButtonClass(counterIncrement);
      break;

    case "-":
      updateCounter(false);
      toggleButtonClass(counterDecrement);
      break;

    case "Backspace":
      resetCounter();
      break;

    default:
      break;
  }
});

// Creating an event listener for picking a color
colorOption.addEventListener("input", (event) => {
  pickColor(event.target.value);
});

resetToggle.addEventListener("click", resetCounter); // Creating an event listener for resetting the counter

// Setting up a interval every 100 milliseconds
setInterval(() => {
  updateIconState();
  updateResetState();
}, 100);
