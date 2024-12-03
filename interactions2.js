
const server_domain = "https://free-sgbd2024.fly.dev/";
const SITE = server_domain;

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
        document.getElementById('result').textContent = 'no data available for your request';
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
    fetchData(SITE+'statistic/classement_chauffeur', "classement des chauffeurs").then(tab => result.appendChild(tab));
    deleteEvent(stat,dataAdminStat);
}

function dataAdminMAJ(){
    //fetchData(SITE+'select/chauffeurs/0',"Tableau de schauffeurs" ).then(tab =>  dataFormMaj(tab));
    let adminId = 0;
    const auth = Authentification();
    const submitB = submitButton("Submit");

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
                dataAdminMAJMission2(`missions/admins/EnAttente/${adminId}`);//,SITE+'update/missions/id=:id');//the function !!  missons/admins/EnAttente/${adminId}
            }
            else{
                alert("Please enter a valid admin ID");
            }
        });


        camionMaj.addEventListener('click',()=>{fetchData(SITE+'select/camions/0' ).then(tab =>  dataFormMaj(tab,SITE+'admin/insert/camion'));deleteButtons()});
        chauffeurMaj.addEventListener('click',()=>{fetchData(SITE+'select/chauffeurs/0' ).then(tab =>  dataFormMaj(tab,SITE+'admin/insert/chauffeur'));deleteButtons()});
        livraisonMaj.addEventListener('click',()=>dataFormLivraisonMaj(SITE+'admin/insert/livraison'));
        missionMaj.addEventListener('click',()=>dataFormMissionMaj(SITE+'admin/insert/mission'));


    });
    deleteEvent(maj,dataAdminMAJ);
}

async function dataAdminMAJMission2(uri) {
    try {
        const tableWrapper = await fetchData(SITE + uri, "Mission en attente"); // Fetch the data

        if (!tableWrapper) {
            //console.error('Error fetching data!');
            return;
        }

        const table = tableWrapper.querySelector('table');
        if (table) {
            const statusOptions = ['EnCours', 'Abandonne', 'EnAttente'];
            const rows = Array.from(table.querySelectorAll('tbody tr'));

            rows.forEach((row, index) => {
                // Extract IDs from the row (modify this based on your data structure)
                const idMission = row.cells[0]?.innerText.trim(); // Assume ID is in the first cell
                const idAdmin = row.cells[1]?.innerText.trim();    // Assume Admin ID is in the second cell
                console.log("mission:",idMission);

                if (!idMission || !idAdmin) {
                    console.error(`Missing data for row: ${index}`);
                    return;
                }

                // Add status dropdown
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

                // Add date input for "date_prevue"
                const dateCell = document.createElement('td');
                const dateInput = document.createElement('input');
                dateInput.type = 'date';
                dateInput.required = true;
                dateCell.appendChild(dateInput);
                row.appendChild(dateCell);

                // Add submit button
                const buttonCell = document.createElement('td');
                const submitButton = document.createElement('button');
                submitButton.textContent = 'Submit';
                submitButton.style.margin = '0 5px';

                // Add event listener to submit button
                submitButton.addEventListener('click', async () => {
                    const payload = {
                        row: {
                            //id_chauffeur: idChauffeur,
                            //id_admin: idAdmin,
                            status: select.value,
                            //date_prevue: dateInput.value
                        }
                    };
                    console.log(payload);

                    try {
                        // Send the data
                        const sentUri = SITE+`update/missions/id=${idMission}`;
                        console.log(sentUri);
                        const response = sendData(sentUri, payload);

                        if (response.ok) {
                            console.log(`Row ${index + 1} data sent successfully:`, payload);
                            alert(`Row ${index + 1} submission successful!`);
                        } else {
                            console.error(`Row ${index + 1} submission failed. Status: ${response.status}`);
                            alert(`Error submitting row ${index + 1}. Status: ${response.status}`);
                        }
                    } catch (error) {
                        console.error(`Network error during row ${index + 1} submission:`, error);
                        //alert(`Network error submitting row ${index + 1}.`);
                    }
                });

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

async function dataAdminMAJMission(uri,toUri) {
    //console.log('Fetching data from:', SITE + uri);
    //console.log('to:', SITE+toUri);
    try {
        const tableWrapper = await fetchData(SITE + uri, "Mission en attente"); // Fetch the data

        if (!tableWrapper) {
            //console.error('Error fetching data!');
            return;
        }

        const table = tableWrapper.querySelector('table');
        if (table) {
            const statusOptions = ['EnCours', 'Abandonne', 'EnAttente'];
            const rows = Array.from(table.querySelectorAll('tbody tr'));

            rows.forEach((row, index) => {
                // Extract IDs from the row (modify this based on your data structure)
                const idChauffeur = row.cells[0]?.innerText.trim(); // Assume ID is in the first cell
                const idAdmin = row.cells[1]?.innerText.trim();    // Assume Admin ID is in the second cell

                if (!idChauffeur || !idAdmin) {
                    console.error(`Missing data for row: ${index}`);
                    return;
                }

                // Add status dropdown
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

                // Add date input for "date_prevue"
                const dateCell = document.createElement('td');
                const dateInput = document.createElement('input');
                dateInput.type = 'date';
                dateInput.required = true;
                dateCell.appendChild(dateInput);
                row.appendChild(dateCell);

                // Add submit button
                const buttonCell = document.createElement('td');
                const submitButton = document.createElement('button');
                submitButton.textContent = 'Submit';
                submitButton.style.margin = '0 5px';

                // Add event listener to submit button
                submitButton.addEventListener('click', async () => {
                    const payload = {
                        row: {
                            //id_chauffeur: idChauffeur,
                            //id_admin: idAdmin,
                            status: select.value,
                            //date_prevue: dateInput.value
                        }
                    };
                    console.log(payload);

                    try {
                        // Send the data
                        const response = sendData(toUri, payload);

                        if (response.ok) {
                            console.log(`Row ${index + 1} data sent successfully:`, payload);
                            alert(`Row ${index + 1} submission successful!`);
                        } else {
                            console.error(`Row ${index + 1} submission failed. Status: ${response.status}`);
                            alert(`Error submitting row ${index + 1}. Status: ${response.status}`);
                        }
                    } catch (error) {
                        console.error(`Network error during row ${index + 1} submission:`, error);
                        //alert(`Network error submitting row ${index + 1}.`);
                    }
                });

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

function deleteRow(table,uri){


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
    // Filter titles to exclude 'id' or similar fields
    let titles = Array.from(HeadRowElem)
        .map(th => th.innerText)
        .filter(title => !title.toLowerCase().includes('id')); // Exclude fields containing 'id'
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

    const payload = { row: res };

    console.log(payload); // Debugging
    sendData(uri, payload);
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
            console.error('Error sending data:', response.status, response.statusText);
            response.json().then(errorDetails => {
                console.error('Response details:', errorDetails);
            }).catch(() => {
                console.error('Unable to parse error details from response.');
            });
        }
    })
    .catch(error => {
        console.error('Network error:', error);
    });
}

function dataFormMissionMaj(toSendUri) {
    result.innerHTML = ''; // Clear previous form elements

    // Predefined row structure for mission
    const rowFields = [
        { label: "ID Chauffeur", key: "id_chauffeur" },
        { label: "ID Admin", key: "id_admin" },
        { label: "Status", key: "status" },
        { label: "Date Prévue", key: "date_prevue", type: "date" }
    ];

    const rowData = {}; // Object to store row data

    const formContainer = document.createElement('fieldset');
    formContainer.style.border = "1px solid #ddd";
    formContainer.style.padding = "20px";
    formContainer.style.margin = "20px";

    // Create fields for the row object
    rowFields.forEach(field => {
        const div = document.createElement('div');
        div.style.display = "flex";
        div.style.alignItems = "center";
        div.style.marginBottom = "10px";

        const label = document.createElement('label');
        label.innerHTML = `${field.label} : `;
        label.style.marginRight = "10px";
        label.style.width = "150px";
        label.style.textAlign = "right";

        const input = document.createElement('input');
        input.type = field.type || "text";
        input.style.flex = "1";
        input.style.padding = "5px";
        input.id = `row-${field.key}`;

        div.appendChild(label);
        div.appendChild(input);
        formContainer.appendChild(div);

        // Store references to inputs in rowData
        rowData[field.key] = input;
    });

    result.appendChild(formContainer);

    // Submit button
    const sendButton = submitButton('Send Data');
    sendButton.addEventListener('click', () => {
        const rowDataValues = {};
        for (let key in rowData) {
            rowDataValues[key] = rowData[key].value.trim();
        }

        const payload = {
            row: rowDataValues
        };

        console.log(payload); // For debugging
        sendData(toSendUri, payload);
    });

    result.appendChild(sendButton);
}



function dataFormLivraisonMaj(toSendUri) {
    result.innerHTML = ''; // Clear previous form elements

    // Predefined row structure
    const rowFields = [
        { label: "ID Camion", key: "id_camion" },
        { label: "ID Mission", key: "id_mission" },
        { label: "ID Dépôt Départ", key: "id_depot_depart" },
        { label: "ID Dépôt Arrivé", key: "id_depot_arrive" },
        { label: "Date Livraison", key: "date_livraison", type: "date" },
    ];

    const rowData = {}; // Object to store row data
    const products = []; // Array to store product data

    const formContainer = document.createElement('fieldset');
    formContainer.style.border = "1px solid #ddd";
    formContainer.style.padding = "20px";
    formContainer.style.margin = "20px";

    // Create fields for the row object
    rowFields.forEach(field => {
        const div = document.createElement('div');
        div.style.display = "flex";
        div.style.alignItems = "center";
        div.style.marginBottom = "10px";

        const label = document.createElement('label');
        label.innerHTML = `${field.label} : `;
        label.style.marginRight = "10px";
        label.style.width = "150px";
        label.style.textAlign = "right";

        const input = document.createElement('input');
        input.type = field.type || "text";
        input.style.flex = "1";
        input.style.padding = "5px";
        input.id = `row-${field.key}`;

        div.appendChild(label);
        div.appendChild(input);
        formContainer.appendChild(div);

        // Store references to inputs in rowData
        rowData[field.key] = input;
    });

    result.appendChild(formContainer);

    // Product form section
    const productContainer = document.createElement('div');
    productContainer.id = "product-container";
    productContainer.style.border = "1px solid #ddd";
    productContainer.style.padding = "20px";
    productContainer.style.margin = "20px";

    const productTitle = document.createElement('h4');
    productTitle.innerText = "Products";
    productContainer.appendChild(productTitle);

    const addProductButton = document.createElement('button');
    addProductButton.innerText = "Add Product";
    addProductButton.style.marginBottom = "10px";
    addProductButton.addEventListener('click', () => {
        // Add a new product entry (ID and quantity)
        const productDiv = document.createElement('div');
        productDiv.style.display = "flex";
        productDiv.style.marginBottom = "10px";

        const productIdInput = document.createElement('input');
        productIdInput.type = "text";
        productIdInput.placeholder = "Product ID";
        productIdInput.style.marginRight = "10px";

        const productQuantityInput = document.createElement('input');
        productQuantityInput.type = "number";
        productQuantityInput.placeholder = "Quantity";

        const removeProductButton = document.createElement('button');
        removeProductButton.innerText = "Remove";
        removeProductButton.style.marginLeft = "10px";
        removeProductButton.addEventListener('click', () => {
            productContainer.removeChild(productDiv);
        });

        productDiv.appendChild(productIdInput);
        productDiv.appendChild(productQuantityInput);
        productDiv.appendChild(removeProductButton);
        productContainer.appendChild(productDiv);

        // Push inputs to products array for tracking
        products.push({ id: productIdInput, quantity: productQuantityInput });
    });

    productContainer.appendChild(addProductButton);
    result.appendChild(productContainer);

    // Submit button
    const sendButton = submitButton('Send Data');
    sendButton.addEventListener('click', () => {
        const rowDataValues = {};
        for (let key in rowData) {
            rowDataValues[key] = rowData[key].value.trim();
        }

        const productValues = products
            .map(({ id, quantity }) => [parseInt(id.value.trim()), parseInt(quantity.value.trim())])
            .filter(([id, quantity]) => !isNaN(id) && !isNaN(quantity)); // Filter out incomplete products

        const payload = {
            row: rowDataValues,
            products: productValues
        };

        console.log(payload); // For debugging
        sendData(toSendUri, payload);
    });

    result.appendChild(sendButton);
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
            fetchData(SITE+`select/chauffeurs/id=${id}`, "info du chaffeur").then(tab => result.appendChild(tab)); // Call fetchData with the input ID
            fetchData(SITE+`select_instances/missions/id_chauffeur/${id}`, "les missons réalisées ou en cours").then(tab => result.appendChild(tab));
        } else {
            alert("Please enter a valid Chauffeur ID");
        }
    });
    deleteEvent(consult,dataChauffeurConsult);
    //result.style.display = 'flex';
    //consult.removeEventListener('click',dataChauffeurConsult);
}




function dataChauffeurMAJ(){
    const input = Authentification(); // Create the input field
    const submitB = submitButton("Submit");
    submitB.addEventListener('click', () => {
        const id = input.value.trim() ; // Get the input value, 
        if (id) {
            input.remove();
            submitB.remove();
            //fetchData(SITE+`/missions/chauffeurs/EnAttente/${id}`, "info du chaffeur").then(tab => result.appendChild(tab)); // Call fetchData with the input ID
            dataAdminMAJMission2(`missions/chauffeurs/EnAttente/${id}`); //(`,SITE+'admin/insert/mission');
            //fetchData(SITE+`select/missions/${id-1}/${id-1}`, "les missons réalisées ou en cours").then(tab => result.appendChild(tab));
        } else {
            alert("Please enter a valid Chauffeur ID");
        }
    });
    deleteEvent(consult,dataChauffeurConsult);
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