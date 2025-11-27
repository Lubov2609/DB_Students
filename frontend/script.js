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


document.addEventListener('DOMContentLoaded', () => {
  try {
    initPredictionModule();
  } catch (e) {
    console.error('initPredictionModule error', e);
  }
});

function initPredictionModule() {
  const predictBtn = document.getElementById('predictBtn');
  const panel = document.getElementById('prediction-panel');
  const studentSelect = document.getElementById('prediction-student-select');
  const chooseStudentBtn = document.getElementById('chooseStudentBtn');
  const courseSelect = document.getElementById('prediction-course-select');
  const makePredictionBtn = document.getElementById('makePredictionBtn');
  const resultBox = document.getElementById('prediction-result');

  // Быстрые проверки наличия элементов (лог в консоль)
  if (!predictBtn) console.error('predictBtn not found in DOM');
  if (!panel) console.error('prediction-panel not found in DOM');
  if (!studentSelect) console.error('prediction-student-select not found in DOM');
  if (!chooseStudentBtn) console.error('chooseStudentBtn not found in DOM');
  if (!courseSelect) console.error('prediction-course-select not found in DOM');
  if (!makePredictionBtn) console.error('makePredictionBtn not found in DOM');
  if (!resultBox) console.error('prediction-result not found in DOM');

  // Если predictBtn отсутствует, ничего не навешиваем, но запишем ошибку
  if (!predictBtn) return;

  // Показываем панель при клике и загружаем студентов
  predictBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    // Показ панели
    if (panel) panel.style.display = 'block';
    // Очистка результата / step2
    if (resultBox) resultBox.innerHTML = '';
    const step2 = document.getElementById('step2');
    if (step2) step2.style.display = 'none';
    // Загрузить студентов (свежие данные)
    await safePopulateStudents(studentSelect, resultBox);
  });

  // Кнопка "Выбрать" — формируем список курсов без оценок
  if (chooseStudentBtn) {
    chooseStudentBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      await safePrepareCourseList(studentSelect, courseSelect, resultBox);
    });
  }

  // Кнопка "Сделать прогноз"
  if (makePredictionBtn) {
    makePredictionBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      await safeMakePrediction(studentSelect, courseSelect, resultBox);
    });
  }

  console.log('Prediction module initialized');
}

/* ----------------- helper: populate students ----------------- */
async function safePopulateStudents(studentSelect, resultBox) {
  if (!studentSelect) return;
  studentSelect.innerHTML = '<option value="">Загрузка...</option>';
  try {
    const res = await fetch('/api/students');
    if (!res.ok) throw new Error('students fetch failed: ' + res.status);
    const students = await res.json();
    studentSelect.innerHTML = '<option value="">-- Выберите студента --</option>';
    students.forEach(s => {
      const t = `${s.last_name || ''} ${s.first_name || ''}`.trim();
      const opt = document.createElement('option');
      opt.value = s.student_id;
      opt.textContent = `${t} (ID:${s.student_id})`;
      studentSelect.appendChild(opt);
    });
    if (resultBox) resultBox.innerHTML = '<span style="color:green">Студенты загружены. Выберите студента и нажмите "Выбрать".</span>';
  } catch (err) {
    console.error('safePopulateStudents error', err);
    if (studentSelect) studentSelect.innerHTML = '<option value="">Ошибка загрузки</option>';
    if (resultBox) resultBox.innerHTML = `<span style="color:red">Ошибка загрузки списка студентов.</span>`;
  }
}

/* ----------------- helper: prepare course list (без оценок) ----------------- */
async function safePrepareCourseList(studentSelect, courseSelect, resultBox) {
  if (!studentSelect || !courseSelect || !resultBox) return;
  const sid = studentSelect.value;
  if (!sid) {
    resultBox.innerHTML = '<span style="color:red">Сначала выберите студента.</span>';
    return;
  }

  resultBox.innerHTML = 'Загрузка списка курсов...';
  courseSelect.innerHTML = '<option>Загрузка...</option>';

  try {
    // 1. загрузить все курсы
    const cr = await fetch('/api/courses');
    if (!cr.ok) throw new Error('courses fetch ' + cr.status);
    const allCourses = await cr.json();

    // 2. загрузить оценки студента
    const gr = await fetch(`/api/grades/student/${sid}`);
    let studentGrades = [];
    if (gr.ok) {
      studentGrades = await gr.json();
    } else {
      // fallback: /api/grades
      const allGrRes = await fetch('/api/grades');
      if (!allGrRes.ok) throw new Error('grades fetch fallback ' + allGrRes.status);
      const allGrades = await allGrRes.json();
      studentGrades = allGrades.filter(g => Number(g.student_id) === Number(sid));
    }

    const doneCourseIds = new Set((studentGrades || []).map(g => Number(g.course_id)).filter(v => !Number.isNaN(v)));
    const available = allCourses.filter(c => !doneCourseIds.has(Number(c.course_id)));

    courseSelect.innerHTML = '<option value="">-- Выберите предмет --</option>';
    if (available.length === 0) {
      courseSelect.innerHTML = '<option value="">Нет курсов для прогноза</option>';
      resultBox.innerHTML = '<i>У студента нет курсов без оценок — нечего прогнозировать.</i>';
      // не показываем step2
      const s2 = document.getElementById('step2'); if (s2) s2.style.display = 'none';
      return;
    }

    available.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.course_id;
      opt.textContent = `${c.title}${c.department ? ' (' + c.department + ')' : ''}`;
      courseSelect.appendChild(opt);
    });

    // показываем второй шаг
    const s2 = document.getElementById('step2');
    if (s2) s2.style.display = 'block';
    resultBox.innerHTML = '<span style="color:green">Курсы загружены. Выберите предмет и нажмите "Сделать прогноз".</span>';

  } catch (err) {
    console.error('safePrepareCourseList error', err);
    courseSelect.innerHTML = '<option value="">Ошибка загрузки</option>';
    resultBox.innerHTML = `<span style="color:red">Ошибка при загрузке курсов: ${escapeHtml(err.message || err)}</span>`;
  }
}

/* ----------------- helper: make prediction ----------------- */
async function safeMakePrediction(studentSelect, courseSelect, resultBox) {
  if (!studentSelect || !courseSelect || !resultBox) return;
  const sid = studentSelect.value;
  const courseId = courseSelect.value;
  if (!sid) { resultBox.innerHTML = '<span style="color:red">Выберите студента.</span>'; return; }
  if (!courseId) { resultBox.innerHTML = '<span style="color:red">Выберите предмет.</span>'; return; }

  resultBox.innerHTML = 'Считаем прогноз...';

  try {
    // получить оценки студента
    const res = await fetch(`/api/grades/student/${sid}`);
    let grades = [];
    if (res.ok) grades = await res.json();
    else {
      const allRes = await fetch('/api/grades');
      if (!allRes.ok) throw new Error('grades fetch failed');
      const all = await allRes.json();
      grades = all.filter(g => Number(g.student_id) === Number(sid));
    }

    if (!grades || grades.length === 0) {
      resultBox.innerHTML = '<span>Недостаточно данных по предыдущим оценкам студента для прогноза.</span>';
      return;
    }

    // numeric filtering
    const numeric = grades.map(g => ({...g, final: Number(g.final_grade)})).filter(g => !Number.isNaN(g.final));
    if (!numeric.length) {
      resultBox.innerHTML = '<span>У студента нет числовых оценок для анализа.</span>';
      return;
    }

    // average & trend
    numeric.sort((a,b) => {
      if (a.created_at && b.created_at) return new Date(a.created_at) - new Date(b.created_at);
      return 0;
    });
    const vals = numeric.map(x => x.final);
    const avg = average(vals);
    const trend = getTrend(vals);

    // попытка получить департамент курса и среднюю по кафедре
    let deptAvg = null;
    try {
      const crRes = await fetch('/api/courses');
      if (crRes.ok) {
        const courses = await crRes.json();
        const course = courses.find(c => Number(c.course_id) === Number(courseId));
        if (course && course.department) {
          const deptCourseIds = courses.filter(c=>c.department === course.department).map(c=>c.course_id);
          const allGradesRes = await fetch('/api/grades');
          if (allGradesRes.ok) {
            const allGrades = await allGradesRes.json();
            const deptGrades = allGrades.filter(g => deptCourseIds.includes(Number(g.course_id))).map(g => Number(g.final_grade)).filter(v => !Number.isNaN(v));
            if (deptGrades.length) deptAvg = average(deptGrades);
          }
        }
      }
    } catch(e){
      console.warn('dept average calc failed', e);
    }

    // составляем прогноз
    const trendAdjusted = trend * 2.0;
    let predicted = (deptAvg !== null) ? (0.6*avg + 0.3*deptAvg + 0.1*trendAdjusted) : (avg + trendAdjusted*0.6);
    predicted = Math.max(0, Math.min(10, predicted));

    resultBox.innerHTML = `
      <div>
        <p><b>Прогноз для студента (ID=${escapeHtml(sid)})</b></p>
        <p><b>Предполагаемая оценка:</b> <span style="font-size:20px; color:#4caf50">${predicted.toFixed(1)} / 10</span></p>
        <p>Средняя студента: <b>${avg.toFixed(2)}</b>${deptAvg!==null?(', средняя по кафедре '+deptAvg.toFixed(2)):''}, тренд: <b>${trend.toFixed(3)}</b></p>
      </div>
    `;
  } catch (err) {
    console.error('safeMakePrediction error', err);
    resultBox.innerHTML = `<span style="color:red">Ошибка при расчёте прогноза: ${escapeHtml(err.message || err)}</span>`;
  }
}

/* ----------------- utility functions ----------------- */
function average(arr){ if (!arr || arr.length===0) return 0; return arr.reduce((a,b)=>a+b,0)/arr.length; }
function getTrend(values){
  if (!values || values.length<2) return 0;
  const n = values.length;
  const xs = Array.from({length:n}, (_,i)=>i);
  const avgX = average(xs);
  const avgY = average(values);
  let num=0, den=0;
  for (let i=0;i<n;i++){ num += (xs[i]-avgX)*(values[i]-avgY); den += (xs[i]-avgX)*(xs[i]-avgX); }
  if (den===0) return 0;
  return num/den;
}
function escapeHtml(s){ return String(s===null||s===undefined?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }






