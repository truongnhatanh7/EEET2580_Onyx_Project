// import: destination file
// create "header" div => put script outside body, at the end of html file
// <script type="module" src="./assets/js/import.js"></script>
import {exportElement, script} from  "./export.js";
document.querySelector(".header").innerHTML = exportElement;
document.querySelector(".header").appendChild(script);