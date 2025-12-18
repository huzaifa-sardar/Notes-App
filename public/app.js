const API_URL = "/notes";

async function createNote() {
  const noteText = document.getElementById("noteInput").value;

  if (noteText.trim() === "") {
    alert("Note cannot be empty!");
    return;
  }

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: noteText })
  });

  document.getElementById("noteInput").value = "";
  displayNotes();
}

async function displayNotes() {
  const notesList = document.getElementById("notesList");
  notesList.innerHTML = "";

  const response = await fetch(API_URL);
  const notes = await response.json();

  notes.forEach(note => {
    const div = document.createElement("div");
    div.className = "note";
    div.innerHTML = `<strong>${note.createdAt}</strong><br>${note.text}`;
    notesList.appendChild(div);
  });
}

displayNotes();
