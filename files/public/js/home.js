window.onload = function() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });



}

var currentShown = "none"
function showFunction(id, element) {
  var rsBlocks = document.getElementsByClassName("resourceBox");
  var elementTab = document.getElementsByClassName("elementBlock")
  for (var i  = 0; i < rsBlocks.length; i++) {
    rsBlocks[i].style.display = "none";
  }
  for (var i = 0; i < elementTab.length; i++) {
    elementTab[i].className = "elementBlock";
  }
  if (currentShown != id) {
    console.log(id);
    document.getElementById(id).style.display = "block";
    element.className = "elementBlock liHover";
    currentShown = id;

  } else {
    document.getElementById("baseBox").style.display = "block";
    element.className = "elementBlock";
    currentShown = "none";
  }
}
function modalDisplay(course) {
  console.log(course);
  var modal = document.getElementById("allHomework");
  // document.getElementById(course).className = "modalBox display";
  modal.style.display = "block";
}
function removeModal() {
  document.getElementById("allHomework").style.display = "none";
}
function displayHomework(course) {
  var boxes = document.getElementsByClassName("modalBox");
  console.log(boxes);
  for (var i = 0; i < boxes.length; i++) {
    boxes[i].className = "modalBox";
  }
  document.getElementById(course).className = "modalBox display";
}

function minutesToTime(min) {
  let hour = min/60;
  let minute = min%60;
  return [hour, minute];
}
