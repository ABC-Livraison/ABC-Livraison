import { fetchDataAdmin, fetchDataChauffeur } from "./uiClient";

let admin = showLoger("Admin");
let chauffeurs = showLoger("Chauffeur");


export function showLoger(loger){
    const button = document.createElement('button');
    button.innerText = loger;
    button.className = "logs";
    document.getElementById('result').appendChild(button);
    return button;
}


export function deleteLogs(...elements){
    elements.forEach(element=>element.remove());
}

export function redirectToLogin() {
    const result = document.getElementById('result');
    result.innerHTML = ''; // Clear existing content
    //const loginMessage = document.createElement('h2');
    admin = showLoger("admin");
    chauffeurs = showLoger("chauffeur");
    admin.addEventListener('click',fetchDataAdmin);
    admin.addEventListener('click',()=>deleteLogs(admin, chauffeurs));
    chauffeurs.addEventListener('click',fetchDataChauffeur);
    chauffeurs.addEventListener('click',()=>deleteLogs(admin, chauffeurs));
    document.getElementById('tableTitle').innerText ="";
}
