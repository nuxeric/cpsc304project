'use strict';

function lineWorkerToggled() {
  var checkbox = document.getElementById('role_1');
  var responsibilities = document.getElementsByClassName('line-worker-responsibilities-container');
  responsibilities[0].style.display = checkbox.checked ? 'block' : 'none';
}

function personnelManagerToggled() {
  var checkbox = document.getElementById('role_3');
  var responsibilities = document.getElementsByClassName('employees-managed-container');
  responsibilities[0].style.display = checkbox.checked ? 'block' : 'none';
}

document.getElementById('role_1').onclick = lineWorkerToggled;
document.getElementById('role_3').onclick = personnelManagerToggled;

lineWorkerToggled();
personnelManagerToggled();
