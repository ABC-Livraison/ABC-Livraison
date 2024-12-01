import { showLoger, deleteLogs } from "./logs";
import { fetchDataAdmin, fetchDataChauffeur } from "./uiClient";
//import { fetchData } from "./fetchData";
//const result = document.getElementById('result'); 

let admin = showLoger("Admin");
let chauffeurs = showLoger("Chauffeur");


admin.addEventListener('click',fetchDataAdmin);
admin.addEventListener('click',deleteLogs);
chauffeurs.addEventListener('click',()=>fetchDataChauffeur());
chauffeurs.addEventListener('click',deleteLogs);
