let students = JSON.parse(localStorage.getItem("students")) || [];
const nameInput = document.getElementById("studentName");
const rollInput = document.getElementById("rollNo");
const dateInput = document.getElementById("date");
const searchInput = document.getElementById("search");
const tableBody = document.getElementById("tableBody");
const emptyMsg = document.getElementById("emptyMsg");
dateInput.value = new Date().toISOString().split("T")[0]; // default: today
function save() {
 localStorage.setItem("students", JSON.stringify(students));
}
function addStudent() {
 const name = nameInput.value.trim();
 const roll = rollInput.value.trim();
 if (!name || !roll) { alert("Please enter name and roll number."); return; }
 if (students.some(s => s.roll === roll)) { alert("Roll number already exists."); return; }
 students.push({ id: Date.now(), name, roll, records: {} });
 nameInput.value = "";
 rollInput.value = "";
 save();
 render();
}
function mark(id, status) {
 const s = students.find(st => st.id === id);
 s.records[dateInput.value] = status;
 save();
 render();
}
function removeStudent(id) {
 if (!confirm("Delete this student?")) return;
 students = students.filter(s => s.id !== id);
 save();
 render();
}
function percentage(student) {
 const days = Object.values(student.records);
 if (days.length === 0) return null;
 const present = days.filter(d => d === "P").length;
 return Math.round((present / days.length) * 100);
}
function render() {
 const term = searchInput.value.toLowerCase();
 const list = students.filter(s =>
 s.name.toLowerCase().includes(term) || s.roll.toLowerCase().includes(term));
 tableBody.innerHTML = "";
 list.forEach(s => {
 const status = s.records[dateInput.value];
 const pct = percentage(s);
 const tr = document.createElement("tr");
 if (pct !== null && pct < 75) tr.classList.add("low");
 tr.innerHTML = `
 <td></td><td></td>
 <td>
 <button class="btn-p ${status === "P" ? "active" : ""}">Present</button>
 <button class="btn-a ${status === "A" ? "active" : ""}">Absent</button>
 </td>
 <td class="percent">${pct === null ? "-" : pct + "%"}</td>
 <td><button class="btn-del">Delete</button></td>`;
 tr.children[0].textContent = s.roll; // textContent prevents HTML injection
 tr.children[1].textContent = s.name;
 tr.querySelector(".btn-p").onclick = () => mark(s.id, "P");
 tr.querySelector(".btn-a").onclick = () => mark(s.id, "A");
 tr.querySelector(".btn-del").onclick = () => removeStudent(s.id);
 tableBody.appendChild(tr);
 });
 emptyMsg.style.display = list.length ? "none" : "block";
 updateSummary();
}
function updateSummary() {
 const d = dateInput.value;
 document.getElementById("total").textContent = students.length;
 document.getElementById("present").textContent =
 students.filter(s => s.records[d] === "P").length;
 document.getElementById("absent").textContent =
 students.filter(s => s.records[d] === "A").length;
}
document.getElementById("addBtn").addEventListener("click", addStudent);
dateInput.addEventListener("change", render);
searchInput.addEventListener("input", render);
render();
