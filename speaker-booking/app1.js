const API_BASE = "http://localhost:3001";

// Speaker profile setup
document.getElementById("speaker-setup-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const firstName = document.getElementById("first-name").value;
  const lastName = document.getElementById("last-name").value;
  const bio = document.getElementById("bio").value;
  const expertise = document.getElementById("expertise").value;
  const price = document.getElementById("price").value;

  try {
    const res = await fetch(`${API_BASE}/api/speakers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        bio,
        expertise,
        price_per_session: price,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Speaker profile created!");
    } else {
      alert(data.error || "Failed to create profile!");
    }
  } catch (error) {
    console.error("Speaker setup error:", error);
  }
});

// Fetch and display speakers
async function fetchSpeakers() {
  try {
    const res = await fetch(`${API_BASE}/api/speakers`);
    const speakers = await res.json();

    const list = document.getElementById("speakers-list");
    list.innerHTML = "";

    speakers.forEach((speaker) => {
      const div = document.createElement("div");
      div.innerHTML = `
        <h3>${speaker.first_name} ${speaker.last_name}</h3>
        <p>${speaker.bio}</p>
        <p>Expertise: ${speaker.expertise}</p>
        <p>Price: $${speaker.price_per_session}</p>
        <button onclick="fetchTimeSlots(${speaker.id})">View Time Slots</button>
      `;
      list.appendChild(div);
    });
  } catch (error) {
    console.error("Fetch speakers error:", error);
  }
}

// Fetch and display time slots for a speaker
async function fetchTimeSlots(speakerId) {
  try {
    const res = await fetch(`${API_BASE}/api/speakers/${speakerId}/time-slots`);
    const slots = await res.json();

    const list = document.getElementById("time-slots-list");
    list.innerHTML = "";

    slots.forEach((slot) => {
      const div = document.createElement("div");
      div.innerHTML = `
        <p>${new Date(slot.start_time).toLocaleString()} - ${new Date(slot.end_time).toLocaleString()}</p>
        <button onclick="bookSession(${speakerId}, ${slot.id})">Book</button>
      `;
      list.appendChild(div);
    });

    document.getElementById("time-slot-section").style.display = "block";
  } catch (error) {
    console.error("Fetch time slots error:", error);
  }
}

// Book a session
async function bookSession(speakerId, timeSlotId) {
  try {
    const res = await fetch(`${API_BASE}/api/appointments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ speaker_id: speakerId, time_slot_id: timeSlotId }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Session booked successfully!");
      fetchTimeSlots(speakerId); // Refresh slots
    } else {
      alert(data.error || "Failed to book session!");
    }
  } catch (error) {
    console.error("Book session error:", error);
  }
}

// Fetch speakers on load
fetchSpeakers();
