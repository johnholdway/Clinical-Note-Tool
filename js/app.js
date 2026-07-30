console.log("APP LOADED");

let sessionHeader = "";

function addText(text) {

    const box = document.getElementById("interventionsLibrary");

    if (box.value.trim() !== "") {
        box.value += "\n";
    }

    box.value += text;
}


function updateSessionHeader() {

    const type = document.getElementById("sessionType").value;
    const pronoun = document.getElementById("pronoun").value;
    const start = document.getElementById("startTime").value;
    const end = document.getElementById("endTime").value;

    // Pronouns
    let possessive = "their";

    if (pronoun === "he") {
        possessive = "his";
    }

    if (pronoun === "she") {
        possessive = "her";
    }

    // Sentence 1
    let sentence1;

    if (type === "inperson") {

        sentence1 =
        `Client arrived promptly for ${possessive} in-person individual therapy session.`;

    } else {

        sentence1 =
        `Client arrived promptly for ${possessive} individual therapy session via SimplePractice's HIPAA-compliant video conferencing software.`;

    }

    // Calculate duration
    let minutes = "___";

    if (start && end) {

        const startDate = new Date("2000-01-01T" + start);
        const endDate = new Date("2000-01-01T" + end);

        if (endDate >= startDate) {
            minutes = Math.round((endDate - startDate) / 60000);
        }

    }

    // Sentence 2
    const sentence2 =
`${possessive.charAt(0).toUpperCase() + possessive.slice(1)} ${minutes}-minute therapy session lasted from ${start || "___"} until ${end || "___"}.`;
    // Save for copyNote()
    sessionHeader = sentence1 + "\n\n" + sentence2;

    // Optional preview
    const preview = document.getElementById("sessionHeaderPreview");

    if (preview) {
        preview.value = sessionHeader;
    }

}

/* GET ALL LIBRARIES (future-proofing) */
function getLibrary() {

    const saved = localStorage.getItem("clinicalLibrary");

    return saved ? JSON.parse(saved) : [];
}

/* BUILD LIBRARY UI */
function buildLibrary() {

    const container = document.getElementById("libraryList");
    container.innerHTML = "";

    const items = getLibrary();

    // Group interventions by theory
    const groups = {};

    items.forEach(item => {

        if (!groups[item.theory]) {
            groups[item.theory] = [];
        }

        groups[item.theory].push(item);

    });

    Object.keys(groups).sort().forEach(theory => {

        // Create heading button
        const heading = document.createElement("button");
        heading.className = "categoryButton";
        heading.textContent = "▼ " + theory;

        // Create collapsible section
        const section = document.createElement("div");
        section.className = "categorySection";
        section.style.display = "block";

        // Toggle open/closed
        heading.addEventListener("click", function () {

            if (section.style.display === "none") {

                section.style.display = "block";
                heading.textContent = "▼ " + theory;

            } else {

                section.style.display = "none";
                heading.textContent = "▶ " + theory;

            }

        });

        // Add intervention buttons
        groups[theory].forEach(item => {

            const btn = document.createElement("button");

            btn.textContent = item.title;

            btn.onclick = function () {
                addText(item.text);
            };

            section.appendChild(btn);

        });

        container.appendChild(heading);
        container.appendChild(section);

    });

}

/* COPY FINAL NOTE */
function updateRisk() {

document.getElementById("risk").value =
`Suicide Risk: ${document.getElementById("suicideRisk").value}

Self-harm Risk: ${document.getElementById("selfHarmRisk").value}

Homicidality Risk: ${document.getElementById("homicideRisk").value}

Substance Use Risk: ${document.getElementById("substanceRisk").value}`;

}

function updateMSE() {

document.getElementById("mse").value =
`Appearance: ${document.getElementById("appearance").value}

Behavior: ${document.getElementById("behavior").value}

Speech: ${document.getElementById("speech").value}

Mood: ${document.getElementById("mood").value}

Affect: ${document.getElementById("affect").value}

Thought Content: ${document.getElementById("thoughtContent").value}

Thought Process: ${document.getElementById("thoughtProcess").value}

Perception: ${document.getElementById("perception").value}

Cognition: ${document.getElementById("cognition").value}

Insight: ${document.getElementById("insight").value}

Judgment: ${document.getElementById("judgment").value}`;

}
function copyNote() {

    const note = `
SESSION SUMMARY:
${sessionHeader}

${document.getElementById("summary").value}

THERAPEUTIC INTERVENTIONS:
${document.getElementById("interventionsLibrary").value}

CLIENT RESPONSE:
${document.getElementById("response").value}

ASSESSMENT:
${document.getElementById("assessment").value}

RISK ASSESSMENT:
${document.getElementById("risk").value}

MSE:
${document.getElementById("mse").value}

PLAN:
${document.getElementById("plan").value}
`;

console.log(note);

    navigator.clipboard.writeText(note);
    alert("Note copied");
}

/* INIT */
window.addEventListener("DOMContentLoaded", function () {

    buildLibrary();

    updateRisk();
    updateMSE();

    updateSessionHeader();
});