console.log("libraryManager LOADED");

let library = [];
let editingId = null;

/* -----------------------------
   LOAD
------------------------------*/
function loadLibrary() {

    const saved = localStorage.getItem("clinicalLibrary");

    library = saved ? JSON.parse(saved) : [];

    refreshLibrary();
}

/* -----------------------------
   SAVE
------------------------------*/
function saveLibrary() {

    localStorage.setItem(
        "clinicalLibrary",
        JSON.stringify(library)
    );
}

/* -----------------------------
   SAVE / CREATE / UPDATE
------------------------------*/
function saveIntervention() {

    const intervention = {
        id: editingId ? editingId : Date.now(),

        title: document.getElementById("title").value,
        theory: document.getElementById("theory").value,
        category: document.getElementById("category").value,
        text: document.getElementById("text").value
    };

    if (editingId) {

        library = library.map(item =>
            item.id === editingId ? intervention : item
        );

        editingId = null;

    } else {
        library.push(intervention);
    }

    saveLibrary();
    refreshLibrary();
    clearForm();
    updateEditUI();
}

/* -----------------------------
   EDIT
------------------------------*/
function editIntervention(id) {

    const item = library.find(x => x.id === id);

    if (!item) return;

    document.getElementById("title").value = item.title;
    document.getElementById("theory").value = item.theory;
    document.getElementById("category").value = item.category;
    document.getElementById("text").value = item.text;

    editingId = id;

    updateEditUI(item.title);
}

/* -----------------------------
   DELETE
------------------------------*/
function deleteIntervention(id) {

    if (!confirm("Delete this intervention?")) return;

    library = library.filter(item => item.id !== id);

    saveLibrary();
    refreshLibrary();

    if (editingId === id) {
        cancelEdit();
    }
}

/* -----------------------------
   CANCEL EDIT
------------------------------*/
function cancelEdit() {

    editingId = null;

    clearForm();
    updateEditUI();
}

/* -----------------------------
   UI STATE (EDIT MODE)
------------------------------*/
function updateEditUI(title = "") {

    const banner = document.getElementById("editModeBanner");
    const label = document.getElementById("editingTitle");
    const cancelBtn = document.getElementById("cancelEditBtn");

    if (editingId) {

        banner.style.display = "block";
        cancelBtn.style.display = "inline-block";

        label.textContent = title || "Editing intervention";

    } else {

        banner.style.display = "none";
        cancelBtn.style.display = "none";
    }
}

/* -----------------------------
   RENDER
------------------------------*/
function refreshLibrary() {

    const div = document.getElementById("libraryList");

    div.innerHTML = "";

    library.forEach(item => {

        const row = document.createElement("div");
        row.className = "library-item";

        row.innerHTML = `
            <b>${item.title}</b><br>
            <small>${item.theory}</small><br>

            <button onclick="editIntervention(${item.id})">Edit</button>
            <button onclick="deleteIntervention(${item.id})">Delete</button>
        `;

        div.appendChild(row);
    });
}

/* -----------------------------
   CLEAR FORM
------------------------------*/
function clearForm() {

    document.getElementById("title").value = "";
    document.getElementById("category").value = "";
    document.getElementById("text").value = "";
}

/* -----------------------------
   INIT
------------------------------*/
window.onload = loadLibrary;