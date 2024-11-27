
const SITE = "http://localhost:8080/";

const admin = document.getElementById('admin');
const chaffeur = document.getElementById('chauffeur');
const work = document.getElementById('work');
const consult = document.getElementById('consult');
const stat = document.getElementById('stat'); 
const maj = document.getElementById('maj'); 
const returnButton = document.getElementById('return-button');

//here until i figure out where to put it

const result = document.getElementById('result'); 


async function fetchData(uri, title = "Table") {
    try {
        const response = await fetch(uri);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const key = Object.keys(data);
        

        // Create a wrapper for each table
        const tableWrapper = document.createElement('div');
        tableWrapper.className = 'table-wrapper';
        tableWrapper.style.marginBottom = '20px'; // Add spacing between tables

        // Add a title for the table
        const tableTitle = document.createElement('h3');
        tableTitle.innerText = title;
        tableTitle.style.textAlign = 'center';
        tableTitle.style.color = '#333';
        tableWrapper.appendChild(tableTitle);

        const table = document.createElement('table');
        table.className = 'styled-table';

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        // Extract and append headers (keys from the first object)
        const firstRowKeys = Object.keys(data[Object.keys(data)[0]][0]);
        firstRowKeys.forEach((key) => {
            const th = document.createElement('th');
            th.textContent = key;
            th.style.border = '1px solid #ddd';
            th.style.padding = '8px';
            th.style.backgroundColor = '#f4f4f4';
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        data[key[0]].forEach((row) => {
            const tr = document.createElement('tr');
            Object.values(row).forEach((value) => {
                const td = document.createElement('td');
                td.textContent = value;
                td.style.border = '1px solid #ddd';
                td.style.padding = '8px';
                td.style.textAlign = 'center';
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);

        tableWrapper.appendChild(table);
        //result.appendChild(tableWrapper);

        return tableWrapper;
        
    } catch (error) {
        console.error('Error fetching data:', error);
        //document.getElementById('result').textContent = 'Error fetching data, activate the server!!';
    }
}

function deleteEvent(object,event){
    result.style.display = 'flex';
    object.removeEventListener('click',event);
}

function fetchDataAdmin(){
    consult.addEventListener('click',dataAdminConsult);   
}


function dataAdminConsult(){
    fetchData(SITE+'select/chauffeurs/0',"Tableau de schauffeurs" ).then(tab => result.appendChild(tab));
    fetchData(SITE+'select/livraisons/0',"Tableau des livraisons").then(tab => result.appendChild(tab));
    fetchData(SITE+'select/missions/0',"Tableau des missions").then(tab => result.appendChild(tab));
    fetchData(SITE+'select/camions/0',"Tableau des camions").then(tab => result.appendChild(tab));
    fetchData(SITE+'select/depots/0',"Tableau des depots").then(tab => result.appendChild(tab));
    deleteEvent(consult,dataAdminConsult);
    //result.style.display = 'flex';
    //consult.removeEventListener('click',dataAdminConsult);
}

/*function dataAdminStat(){
    fetchData(SITE+'').then(tab => result.appendChild(tab));
    fetchData(SITE+'').then(tab => result.appendChild(tab));
    fetchData(SITE+'').then(tab => result.appendChild(tab));
    fetchData(SITE+'').then(tab => result.appendChild(tab));
    fetchData(SITE+'').then(tab => result.appendChild(tab));
}*/

function fetchDataChauffeur(){
    consult.addEventListener('click',dataChauffeurConsult);
}

function Authentification(){
    const input = document.createElement('input'); // Create an input element
    input.type = "number";
    input.placeholder = "Enter ID";
    input.style.margin = "10px"; // Optional styling
    result.appendChild(input); // Append it to the result container
    return input; // Return the input for further use
}

function submitButton(){
    const submitB = document.createElement('button');
    submitB.innerText = "Submit";
    submitB.style.marginLeft = "10px";
    result.appendChild(submitB);
    return submitB;
}

function dataChauffeurConsult(){
    const input = Authentification(); // Create the input field
    const submitB = submitButton();
    submitB.addEventListener('click', () => {
        const id = input.value.trim() ; // Get the input value, 
        if (id) {
            input.remove();
            submitB.remove();
            fetchData(`http://localhost:8080/select/chauffeurs/${id-1}/${id-1}`, "info du chaffeur").then(tab => result.appendChild(tab)); // Call fetchData with the input ID
            fetchData(`http://localhost:8080/select/missions/${id-1}/${id-1}`, "les missons réalisées ou en cours").then(tab => result.appendChild(tab));
        } else {
            alert("Please enter a valid Chauffeur ID");
        }
    });
    deleteEvent(consult,dataChauffeurConsult);
    //result.style.display = 'flex';
    //consult.removeEventListener('click',dataChauffeurConsult);
}

// Call the function, this is just a first try
//fetchData();

function showLoger(loger){
    const button = document.createElement('button');
    button.innerText = loger;
    button.className = "logs";
    document.getElementById('result').appendChild(button);
    return button;
}


/*
let admin = showLoger("Admin");
let chauffeurs = showLoger("Chauffeur");
*/
function deleteLogs(...logs) {
    console.log("Arguments passed to deleteLogs:", logs);
    logs.forEach((log) => {
        if (log && typeof log.remove === "function") {
            log.remove();
            
        } else {
            console.warn("Invalid log passed to deleteLogs:", log);
        }
    });
}


function redirectToLogin() {
    Array.from(result.children).forEach(child=>child.remove());
    result.style.display = "none";
}

/*
function showReturnButton() {
    toArray(result).forEach(elem)
}*/


/*
admin.addEventListener('click',fetchDataAdmin);//()=>{fetchData(); this.remove()});
admin.addEventListener('click',()=>deleteLogs(admin,chauffeurs));
chauffeurs.addEventListener('click',()=>fetchDataChauffeur());
chauffeurs.addEventListener('click',()=>deleteLogs(admin,chauffeurs));
*/


admin.addEventListener("click",()=>{work.style.display = 'flex';
                                    fetchDataAdmin();
                                    });
chauffeur.addEventListener("click",()=>{work.style.display = 'flex';
                                        fetchDataChauffeur();    
                                        });


returnButton.addEventListener("click",()=>{redirectToLogin();
                                            work.style.display = 'none';
                                            });
                                    


// we still need to also add a way to post new missions and stuff;
 
// need to delete the append child from fetch data and add into a function so that i can determine where to append the tables, it might help later too