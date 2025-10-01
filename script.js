const form = document.getElementById("sendForm");
const channelInput = document.getElementById("channelId");
const tokenInput = document.getElementById("token");
const responseDiv = document.getElementById("response");

let typingInterval; // interval ID
let typingTimeout;  // timeout ID

form.addEventListener("submit", (e) => {
  e.preventDefault();
  responseDiv.textContent = "";

  const channelId = channelInput.value.trim();
  const token = tokenInput.value.trim();

  if (!channelId || !token) {
    responseDiv.textContent = "Please fill in all fields.";
    return;
  }

  // Stop any existing simulation
  if (typingInterval) clearInterval(typingInterval);
  if (typingTimeout) clearTimeout(typingTimeout);

  // Trigger typing immediately
  triggerTyping(channelId, token);

  // Repeat typing every 7 seconds
  typingInterval = setInterval(() => {
    triggerTyping(channelId, token);
  }, 7000);

  // Automatically stop typing simulation after 30 seconds
  typingTimeout = setTimeout(() => {
    clearInterval(typingInterval);
    typingInterval = null;
    responseDiv.textContent += "\nTyping simulation stopped automatically after 30 seconds.";
  }, 30000); // 30 seconds

  responseDiv.textContent = `Typing simulation started in channel ${channelId} for 30 seconds.`;
});

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
  if (typingInterval) clearInterval(typingInterval);
  if (typingTimeout) clearTimeout(typingTimeout);
});
