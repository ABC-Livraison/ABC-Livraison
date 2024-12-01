
const SITE = "https://free-sgbd2024.fly.dev/"; // http://localhost:8080/

const admin = document.getElementById('admin');
const chauffeur = document.getElementById('chauffeur');
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

/*
  ___      _           _     
 / _ \    | |         (_)      
/ /_\ \ __| |_ __ ___  _ _ __  
|  _  |/ _` | '_ ` _ \| | '_ \ 
| | | | (_| | | | | | | | | | |
\_| |_/\__,_|_| |_| |_|_|_| |_|             
                                                            
*/

function fetchDataAdmin(){
    consult.addEventListener('click',dataAdminConsult);   
    stat.addEventListener('click',dataAdminStat);
    maj.addEventListener('click',dataAdminMAJ);
    chauffeur.style.display = 'none';
    stat.style.display = 'flex';
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

function dataAdminStat(){
    fetchData(SITE+'statistic/avg_weight',"Moyenne des poids transportés par camion par livraison").then(tab => result.appendChild(tab));
    fetchData(SITE+'statistic/avg_distance',"Distance parcourue par chauffeur").then(tab => result.appendChild(tab));
    deleteEvent(stat,dataAdminStat);
}

function dataAdminMAJ(){
    //fetchData(SITE+'select/chauffeurs/0',"Tableau de schauffeurs" ).then(tab =>  dataFormMaj(tab));
    let adminId = 0;
    const auth = Authentification();
    const submitB = submitButton("Submit");

    function deleteButtons(){
        missionMajStat.remove();
        livraisonMaj.remove();
        camionMaj.remove();
        chauffeurMaj.remove();
        missionMaj.remove();
    }

    submitB.addEventListener('click',()=>{
        const missionMajStat = submitButton("Etat de mission ");
        const livraisonMaj = submitButton("Ajout de livraison");
        const camionMaj = submitButton("Ajout de Camion");
        const chauffeurMaj = submitButton("Ajout de Chauffeur");
        const missionMaj = submitButton("Ajout de mission");

        auth.style.display = 'none';
        submitB.style.display = 'none';

        function deleteButtons(){
            missionMajStat.remove();
            livraisonMaj.remove();
            camionMaj.remove();
            chauffeurMaj.remove();
            missionMaj.remove();
        }
    


        missionMajStat.addEventListener('click',()=>{
            deleteButtons();
            adminId = auth.value.trim();
            if(adminId<=4 && adminId>=1){
                console.log(adminId); 
                auth.remove(); 
                submitB.remove();
                dataAdminMAJMission(`missons/admins/EnAttente/${adminId}`);//the function !!  missons/admins/EnAttente/${adminId}
            }
            else{
                alert("Please enter a valid admin ID");
            }
        });


        camionMaj.addEventListener('click',()=>{fetchData(SITE+'select/camions/0' ).then(tab =>  dataFormMaj(tab,SITE+'insert/camions'));deleteButtons()});
        chauffeurMaj.addEventListener('click',()=>{fetchData(SITE+'select/chauffeurs/0' ).then(tab =>  dataFormMaj(tab,SITE+'insert/chauffeurs'));deleteButtons()});
        missionMaj.addEventListener('click',()=>{fetchData(SITE+'select/missions/0').then(tab =>  dataFormMaj(tab,SITE+'insert/missions'));deleteButtons()});


        livraisonMaj.addEventListener('click',()=>{
            fetchData(SITE+'select/livraisons/0').then(tab =>  dataFormMaj(tab,SITE+'insert/livraisons'));
            deleteButtons()
            //const div = document.createElement('div');
            const b = submitButton('+produit');
            //div.appendChild(b);
            result.appendChild(b)
            b.addEventListener('click',()=>(fetchData(SITE+'select/produits/0').then(tab => dataFormMaj(tab,SITE+'insert/produits'))));
        });





    });
    deleteEvent(maj,dataAdminMAJ);
}

async function dataAdminMAJMission(uri) {
    try {
        const tableWrapper = await fetchData(SITE + uri, "Mission en attente");//just testing with the select
        if(!tableWrapper){
            console.log('issue!!!!!!!!');
        }
        // Get the table element from the tableWrapper
        const table = tableWrapper.querySelector('table');

        if (table) {
            // Add a "status" dropdown and submit button in each row
            const statusOptions = ['EnCours', 'Abandonne', 'EnAttente'];
            const rows = Array.from(table.querySelectorAll('tbody tr'));

            rows.forEach((row, index) => {
                // Add dropdown for status
                const statusCell = document.createElement('td');
                const select = document.createElement('select');

                statusOptions.forEach((status) => {
                    const option = document.createElement('option');
                    option.value = status;
                    option.textContent = status;
                    select.appendChild(option);
                });

                statusCell.appendChild(select);
                row.appendChild(statusCell); // Add dropdown to the row

                // Add submit button
                const buttonCell = document.createElement('td');
                const submitButton = document.createElement('button');
                submitButton.textContent = 'Submit';
                submitButton.style.margin = '0 5px'; // Add some spacing

                // Add event listener for the button
                submitButton.addEventListener('click', () => sendDataLine(row, index));

                buttonCell.appendChild(submitButton);
                row.appendChild(buttonCell); // Add button to the row
            });
        }

        // Append the updated tableWrapper to the result
        result.appendChild(tableWrapper);
    } catch (error) {
        console.error('Error in dataAdminMAJMission:', error);
    }
}


function sendDataLine(row, index) {
    const data = {}; // Create a map to store data >>> need to be changed after discussing the way of storage once again with anas hhhhhhhhhh

    const table = row.closest('table');
    const headers = Array.from(table.querySelectorAll('thead th')).map(header => header.textContent.trim());

    const cells = row.querySelectorAll('td');
    cells.forEach((cell, cellIndex) => {
        let value;
        const select = cell.querySelector('select');
        if(select){
            value = select.value;
        } 
        else{
            value = cell.textContent.trim();         
        }

        data[headers[cellIndex]]= value;
    });

    console.log(`Row ${index + 1} data:`, data); // Convert the map to an object for readability the chef's kiss ofc (ihda2 lilghali)
    return data;
}
function dataFormMaj(table,toSendUri) {
    result.innerHTML = ''; // Clear previous form elements
    let HeadRowElem = table.querySelector('thead tr').getElementsByTagName('th');
    let titles = Array.from(HeadRowElem).map(th => th.innerText);
    let dataHolder = [];

    const formContainer = document.createElement('fieldset');
    formContainer.style.border = "1px solid #ddd";
    formContainer.style.padding = "20px";
    formContainer.style.margin = "20px";
    result.style.display = "block";

    titles.forEach((title, index) => {
        const div = document.createElement('div');
        div.style.display = "flex";
        div.style.alignItems = "center";
        div.style.marginBottom = "10px";

        const label = document.createElement('label');
        label.innerHTML = title + ' : ';
        label.style.marginRight = "10px";
        label.style.width = "150px";
        label.style.textAlign = "right";
        label.htmlFor = `input-${index}`;

        const input = document.createElement('input');
        input.type = "text";
        input.id = `input-${index}`;
        input.style.flex = "1";
        input.style.padding = "5px";
        dataHolder.push(input);

        div.appendChild(label);
        div.appendChild(input);
        formContainer.appendChild(div);
    });

    result.appendChild(formContainer);

    const sendButton = submitButton('send data');
    sendButton.addEventListener('click', () => parseDateFromFormMaj(titles, dataHolder, toSendUri));
    result.appendChild(sendButton);
}

function parseDateFromFormMaj(titles, dataHolder, uri) {
    let res = {};
    titles.forEach((title, index) => {
        let value = dataHolder[index].value.trim();
        if (!value) {
            console.warn(`${title} is empty!`);
        }
        res[title] = value;
    });
    console.log(res);
    sendData(uri, res);
}

function sendData(uri, data = {}) {
    fetch(uri, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (response.ok) {
            console.log('Data sent successfully:', data);
        } else {
            console.error('Error sending data:', response.status);
        }
    })
    .catch(error => {
        console.error('Network error:', error);
    });
}







function Authentification(){
    const input = document.createElement('input'); // Create an input element
    input.type = "number";
    input.placeholder = "Enter ID";
    input.style.margin = "10px"; // Optional styling
    result.appendChild(input); // Append it to the result container
    return input; // Return the input for further use
}

function submitButton(text){
    const submitB = document.createElement('button');
    submitB.innerText = text;
    submitB.style.marginLeft = "10px";
    result.appendChild(submitB);
    return submitB;
}



/*
 _____ _                  __  __                
/  __ \ |                / _|/ _|               
| /  \/ |__   __ _ _   _| |_| |_ ___ _   _ _ __ 
| |   | '_ \ / _` | | | |  _|  _/ _ \ | | | '__|
| \__/\ | | | (_| | |_| | | | ||  __/ |_| | |   
 \____/_| |_|\__,_|\__,_|_| |_| \___|\__,_|_|   
                                                
  */                                              

 
function fetchDataChauffeur(){
    consult.addEventListener('click',dataChauffeurConsult);
    maj.addEventListener('click',dataChauffeurMAJ);
    stat.style.display = 'none';
    admin.style.display = 'none';
}


function dataChauffeurConsult(){
    const input = Authentification(); // Create the input field
    const submitB = submitButton("Submit");
    submitB.addEventListener('click', () => {
        const id = input.value.trim() ; // Get the input value, 
        if (id) {
            input.remove();
            submitB.remove();
            fetchData(`SITEselect/chauffeurs/${id-1}/${id-1}`, "info du chaffeur").then(tab => result.appendChild(tab)); // Call fetchData with the input ID
            fetchData(`SITEselect/missions/${id-1}/${id-1}`, "les missons réalisées ou en cours").then(tab => result.appendChild(tab));
        } else {
            alert("Please enter a valid Chauffeur ID");
        }
    });
    deleteEvent(consult,dataChauffeurConsult);
    //result.style.display = 'flex';
    //consult.removeEventListener('click',dataChauffeurConsult);
}




function dataChauffeurMAJ(){

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
                                            admin.style.display = 'flex';
                                            chauffeur.style.display = 'flex';
                                            });
                                    


// we still need to also add a way to post new missions and stuff;
 
// need to delete the append child from fetch data and add into a function so that i can determine where to append the tables, it might help later too