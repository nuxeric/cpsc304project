'use strict';

console.log("it's working!");

function lineWorkerToggled() {
  var checkbox = document.getElementById('role_1');
  var responsibilities = document.getElementsByClassName('line-worker-responsibilities-container');

  responsibilities.style.display = checkbox.checked ? 'block' : 'none';
}
