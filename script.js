const form = document.getElementById("sendForm");
const channelInput = document.getElementById("channelId");
const tokenInput = document.getElementById("token");
const durationInput = document.getElementById("duration");
const responseDiv = document.getElementById("response");
const stopButton = document.getElementById("stopButton");

let typingInterval;
let typingTimeout;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  responseDiv.textContent = "";

  const channelId = channelInput.value.trim();
  const token = tokenInput.value.trim();
  const duration = parseInt(durationInput.value.trim(), 10);

  if (!channelId || !token || isNaN(duration) || duration < 1) {
    responseDiv.textContent = "Please fill in all fields and set a valid duration.";
    return;
  }

  startTyping(channelId, token, duration);
});

stopButton.addEventListener("click", () => {
  stopTyping();
});

function startTyping(channelId, token, duration) {
  // Stop any existing simulation
  stopTyping();

  // Trigger typing immediately
  triggerTyping(channelId, token);

  // Repeat typing every 7 seconds
  typingInterval = setInterval(() => {
    triggerTyping(channelId, token);
  }, 7000);

  // Automatically stop typing simulation after user-defined duration
  typingTimeout = setTimeout(() => {
    stopTyping();
    responseDiv.textContent += `\nTyping simulation stopped automatically after ${duration} seconds.`;
  }, duration * 1000);

  responseDiv.textContent = `Typing simulation started in channel ${channelId} for ${duration} seconds.`;
}

function stopTyping() {
  if (typingInterval) {
    clearInterval(typingInterval);
    typingInterval = null;
  }
  if (typingTimeout) {
    clearTimeout(typingTimeout);
    typingTimeout = null;
  }
  responseDiv.textContent += "\nTyping simulation stopped manually.";
}

async function triggerTyping(channelId, token) {
  try {
    const res = await fetch(`https://discord.com/api/v9/channels/${channelId}/typing`, {
      method: "POST",
      headers: {
        "Authorization": token,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      const data = await res.json();
      console.error("Error triggering typing:", data);
    }
  } catch (err) {
    console.error("Network/Fetch error:", err);
  }
}

// Stop typing simulation when leaving page
window.addEventListener("beforeunload", () => {
  stopTyping();
});
