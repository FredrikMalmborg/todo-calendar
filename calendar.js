async function logData() {

  let
    dateObj = new Date(),
    year = dateObj.getFullYear(),
    monthIndex = dateObj.getMonth(),
    response = await fetch(`https://api.dryg.net/dagar/v2.1/${year}`),
    today;

  const myJson = await response.json();
  mouseEvents(myJson, monthIndex, year);

  defineToday(dateObj, today);
  updateMonth(myJson, monthIndex, year);

}

function defineToday(dateObj, today) {
  let
  day = dateObj.getDate(),
  month = dateObj.getMonth() + 1,
  year = dateObj.getFullYear();
  
  month = (month < 10) ? "0" + month : month;
  day = (day < 10) ? "0" + day : day;
  
  today = year + "-" + month + "-" + day;
  localStorage.setItem('selectedDay', JSON.stringify(today))
}

function buildCalendar(myJson, months, monthIndex) {
  myJson.dagar.forEach(dag => {
    if (
      dag.datum.split("-")[1] ===
      months.number[monthIndex % months.number.length]
    ) {
      createDayCard(dag);
    }
  });
  toggleSelectedGridItem();
}

function updateMonth(myJson, monthIndex, year) {
  const months = {
    number: [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12"
    ],
    name: [
      "JANUARI",
      "FEBRUARI",
      "MARS",
      "APRIL",
      "MAJ",
      "JUNI",
      "JULI",
      "AUGUSTI",
      "SEPTEMBER",
      "OKTOBER",
      "NOVEMBER",
      "DECEMBER"
    ]
  };

  document.querySelector(".month").innerHTML =
    months.name[monthIndex % months.number.length];
  document.querySelector(".year").innerHTML = year;

  buildCalendar(myJson, months, monthIndex);
}

function clearCalendar() {
  let clearArr = document.querySelectorAll(".grid-item");

  clearArr.forEach(day => {
    day.parentNode.removeChild(day);
  });
}

function createDayCard(dag) {
  const div = document.createElement("div"),
    h5 = document.createElement("h5"),
    p = document.createElement("p"),
    ul = document.createElement('ul'),
    activeDay = JSON.parse(localStorage.getItem('selectedDay')) || undefined;
    

  div.classList.add("grid-item");
  ul.classList.add("todos-for-day")
  ul.id = dag.datum
  div.append(p, ul);
  div.append(h5);
  p.append(dag.veckodag);

  if (activeDay === dag.datum) {
    div.classList.add("active-item")
    updateTodolistInDOM(JSON.parse(localStorage.getItem('selectedDay')))
    toggleSidebarDateSelection(activeDay)
  }

  if ('helgdag' in dag) {
    const helgdag = document.createElement('p');
    helgdag.classList.add("helgdag")
    helgdag.append(dag.helgdag)
    div.append(helgdag)
  }
  h5.append(dag.datum.split("-")[2]);

  document.querySelector(".cal-grid").append(div);
}

function mouseEvents(myJson, monthIndex, year) {
  let buttons = document.querySelectorAll(".cal-header button"),
    toggleCalButton = document.querySelector(".cal-toggle");

  (monthIndex = 11), (year = 2019);

  buttons.forEach(button => {
    button.addEventListener("click", function (event) {
      clearCalendar();

      if (event.target.id === "left") {
        monthIndex--;
        if (monthIndex < 0) {
          monthIndex = 11;
          year--;
        }

        updateMonth(myJson, monthIndex, year);
      } else if (event.target.id === "right") {
        monthIndex++;
        if (monthIndex > 11) {
          monthIndex = 0;
          year++;
        }

        updateMonth(myJson, monthIndex, year);
      }
    });
  });
  toggleCalButton.addEventListener("click", function () {
    console.log("SAEF");
    $(".calendar").toggle(0)
  })
}
