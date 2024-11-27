import { fetchData } from "./fetchData";
import { redirectToLogin } from "./logs";

const result = document.getElementById('result'); 


export function fetchDataAdmin(){
    fetchData('http://localhost:8080/select/chauffeurs/0/8',"Tableau de chauffeurs" ).then(tab => result.appendChild(tab));
    fetchData('http://localhost:8080/select/livraisons/0',"Tableau de livraisons").then(tab => result.appendChild(tab));
    fetchData('http://localhost:8080/select/missions/0',"Tableau de missions").then(tab => result.appendChild(tab));

    showReturnButton();
}

export function fetchDataChauffeur(){
    const input = chauffeurAuthentification(); // Create the input field
    const submitButton = document.createElement('button');
    submitButton.innerText = "Submit";
    submitButton.style.marginLeft = "10px";
    result.appendChild(submitButton);

    submitButton.addEventListener('click', () => {
        const id = input.value.trim() ; // Get the input value, 
        if (id) {
            fetchData(`http://localhost:8080/select/chauffeurs/${id-1}/${id-1}`, "info du chaffeur").then(tab => result.appendChild(tab)); // Call fetchData with the input ID
            fetchData(`http://localhost:8080/select/missions/${id-1}/${id-1}`, "les missons réalisées ou en cours").then(tab => result.appendChild(tab));
            //info.id = 'info';
            //mission.id = 'mission';
            //find a way to separate the the mission and info so that the info always shown 1st!! (u can add a #id then force the ordre in the style sheet)
            showReturnButton();
        } else {
            alert("Please enter a valid Chauffeur ID");
        }
    });
}


export function showReturnButton() {
    const returnButton = document.createElement('button');
    returnButton.innerText = "↩";
    returnButton.className = "logs return-button";
    returnButton.style.marginTop = '20px';
    returnButton.style.fontSize = '40px'
    //document.body.appendChild(returnButton);
    result.appendChild(returnButton);

    // Add click event to return to login
    returnButton.addEventListener('click', redirectToLogin);
}

function chauffeurAuthentification(){
    const input = document.createElement('input'); // Create an input element
    input.type = "number";
    input.placeholder = "Enter Chauffeur ID";
    input.style.margin = "10px"; // Optional styling
    result.appendChild(input); // Append it to the result container
    return input; // Return the input for further use
}
