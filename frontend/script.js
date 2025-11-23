const API = "http://localhost:8080/api";

document.addEventListener("DOMContentLoaded", async () => {
    setupTabs();
    loadStudents(

        
    );

    await loadSemesters(); // NEW
    await loadStudentsForDropdown(); // NEW
    await loadCoursesForDropdown(); // NEW

    document
        .getElementById("add-grade-form")
        .addEventListener("submit", saveGrade);
});





//
// -------------- ТАБЫ ----------------
//
function setupTabs() {
    const tabs = document.querySelectorAll(".tab-btn");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            document.querySelectorAll(".table-block")
                .forEach(block => block.classList.add("hidden"));

            document.getElementById(tab.dataset.target)
                .classList.remove("hidden");

            switch (tab.dataset.target) {
                case "students": loadStudents(); break;
                case "lecturers": loadLecturers(); break;
                case "courses": loadCourses(); break;
                case "grades": loadGrades(); break;
            }
        });
    });
}

//
// ---------------- СЕМЕСТРЫ -------------------
//
async function loadSemesters() {
    const res = await fetch(`${API}/semesters`);
    const data = await res.json();

    const select = document.getElementById("grade-semester");
    select.innerHTML = "";

    data.forEach(s => {
        const opt = document.createElement("option");
        opt.value = s.semester;
        opt.textContent = s.semester;
        select.appendChild(opt);
    });
}

//
// --------------- ДРОПДАУНЫ ДЛЯ ОЦЕНОК ----------------
//
async function loadStudentsForDropdown() {
    const res = await fetch(`${API}/students`);
    const data = await res.json();
    const select = document.getElementById("grade-student");
    select.innerHTML = "";

    data.forEach(s => {
        const option = document.createElement("option");
        option.value = s.student_id;
        option.textContent = s.last_name + " " + s.first_name;
        select.appendChild(option);
    });
}

async function loadCoursesForDropdown() {
    const res = await fetch(`${API}/courses`);
    const data = await res.json();

    const select = document.getElementById("grade-course");
    select.innerHTML = "";

    data.forEach(c => {
        const option = document.createElement("option");
        option.value = c.course_id;
        option.textContent = c.title;
        select.appendChild(option);
    });
}

//
// ------------ СОХРАНЕНИЕ ОЦЕНКИ ---------------
//
async function saveGrade(event) {
    event.preventDefault();

    const student = document.getElementById("grade-student").value;
    const course = document.getElementById("grade-course").value;
    const semester = document.getElementById("grade-semester").value;
    const grade = document.getElementById("grade-value").value;

    await fetch(`${API}/grades`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            student_id: student,
            course_id: course,
            semester: semester,
            final_grade: grade
        })
    });

    loadGrades();
}

//
// ----------------- ТАБЛИЦЫ -------------------
//
async function loadStudents() {
    const res = await fetch(`${API}/students`);
    const data = await res.json();
    const tbody = document.querySelector("#students tbody");
    tbody.innerHTML = "";

    data.forEach(s => {
        tbody.innerHTML += `
            <tr>
                <td>${s.first_name}</td>
                <td>${s.last_name}</td>
                <td>${s.pytronimic}</td>
                <td>${s.email}</td>
                <td>${s.phone_number}</td>
                <td>${s.birth_date}</td>
            </tr>`;
    });

    // применить фильтрацию после заполнения таблицы
    filterStudentsTable();
}

async function loadLecturers() {
    const res = await fetch(`${API}/lecturers`);
    const data = await res.json();

    const tbody = document.querySelector("#lecturers tbody");
    tbody.innerHTML = "";

    data.forEach(l => {
        tbody.innerHTML += `
            <tr>
                <td>${l.first_name}</td>
                <td>${l.last_name}</td>
                <td>${l.middle_name || ""}</td>
                <td>${l.email}</td>
                <td>${l.phone_number}</td>
                <td>${l.department}</td>
                <td>${l.hire_date}</td>
            </tr>`;
    });
}

async function loadCourses() {
    const res = await fetch(`${API}/courses`);
    const data = await res.json();

    const tbody = document.querySelector("#courses tbody");
    tbody.innerHTML = "";

    data.forEach(c => {
        tbody.innerHTML += `
            <tr>
                <td>${c.title}</td>
                <td>${c.description}</td>
                <td>${c.credits}</td>
                <td>${c.department}</td>
                <td>${c.lecturer_lastname}</td>
            </tr>`;
    });
}

async function loadGrades() {
    const res = await fetch(`${API}/grades`);
    const data = await res.json();

    const tbody = document.querySelector("#grades tbody");
    tbody.innerHTML = "";

    data.forEach(g => {
        tbody.innerHTML += `
            <tr>
                <td>${g.student_lastname}</td>
                <td>${g.course_title}</td>
                <td>${g.semester}</td>
                <td>${g.final_grade}</td>
                <td>${g.created_at}</td>
            </tr>`;
    });
}

// ---------------- ПОИСК СТУДЕНТОВ -----------------

document.getElementById("studentSearchInput")
        .addEventListener("input", filterStudentsTable);

function filterStudentsTable() {
    const value = document.getElementById("studentSearchInput").value.toLowerCase();
    const rows = document.querySelectorAll("#students tbody tr");

    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(value) ? "" : "none";
    });
}
