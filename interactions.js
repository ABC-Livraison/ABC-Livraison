
//here until i figure out where to put it

const result = document.getElementById('result'); 

/*
async function fetchData(uri) {
    
    try {
        // Replace '/select/chauffeurs/5/8' with the appropriate endpoint and parameters, will be automated after that
        const response = await fetch(uri);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        //console.log(data);
        
        const key = Object.keys(data);
        const result = document.getElementById('result');
              
        const table = document.createElement('table');
        
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        // Extract and append headers (keys from the first object)
        const firstRowKeys = Object.keys(data[Object.keys(data)[0]][0]);
        document.getElementById('tableTitle').innerText = "Tableau des "+ firstRowKeys.filter(key=>key.includes('id'))[0].replace('id_',"")+"s";

        console.log(firstRowKeys);
        firstRowKeys.forEach((key) => {
            const th = document.createElement('th');
            th.textContent = key;
            //console.log(key);
            th.style.border = '1px solid #ddd';
            th.style.padding = '8px';
            th.style.backgroundColor = '#f4f4f4';
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);


        
        const tbody = document.createElement('tbody');
        
        data[key[0]].forEach(row => { 
            const tr = document.createElement("tr");
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
        result.appendChild(table);
 
        //redirection button
        showReturnButton();

    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('result').textContent = 'Error fetching data, activate the server!!';
    }
}*/

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
        document.getElementById('result').textContent = 'Error fetching data, activate the server!!';
    }
}


function fetchDataAdmin(){
    console.log('dataAdmin');
    const consult = showLoger("consultation");
    const stat = showLoger("statistique");
    const maj = showLoger("mise à jour");
    consult.addEventListener('click',()=>{
            fetchData('http://localhost:8080/select/chauffeurs/0/8',"Tableau de schauffeurs" ).then(tab => result.appendChild(tab));
            fetchData('http://localhost:8080/select/livraisons/0',"Tableau des livraisons").then(tab => result.appendChild(tab));
            fetchData('http://localhost:8080/select/missions/0',"Tableau des missions").then(tab => result.appendChild(tab));
            fetchData('http://localhost:8080/select/camions/0',"Tableau des camions").then(tab => result.appendChild(tab));
            fetchData('http://localhost:8080/select/depots/0',"Tableau des depots").then(tab => result.appendChild(tab));
            showReturnButton();
            //consult.addEventListener('click',()=>deleteLogs(admin,chauffeurs));
        });
    consult.addEventListener('click',()=>deleteLogs(consult,stat,maj));
    //showReturnButton();
}

function fetchDataChauffeur(){
    const input = chauffeurAuthentification(); // Create the input field
    const submitButton = document.createElement('button');
    submitButton.innerText = "Submit";
    submitButton.style.marginLeft = "10px";
    document.getElementById('result').appendChild(submitButton);

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

// Call the function, this is just a first try
//fetchData();

function showLoger(loger){
    const button = document.createElement('button');
    button.innerText = loger;
    button.className = "logs";
    document.getElementById('result').appendChild(button);
    return button;
}


let admin = showLoger("Admin");
let chauffeurs = showLoger("Chauffeur");

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
    const result = document.getElementById('result');
    result.innerHTML = ''; // Clear existing content
    //const loginMessage = document.createElement('h2');
    admin = showLoger("admin");
    chauffeurs = showLoger("chauffeur");
    admin.addEventListener('click',fetchDataAdmin);
    admin.addEventListener('click',deleteLogs);
    chauffeurs.addEventListener('click',fetchDataChauffeur);
    chauffeurs.addEventListener('click',deleteLogs);
  //  document.getElementById('tableTitle').innerText ="";
}

function showReturnButton() {
    const returnButton = document.createElement('button');
    returnButton.innerText = "↩";
    returnButton.className = "logs return-button";
    returnButton.style.marginTop = '20px';
    returnButton.style.fontSize = '40px'
    //document.body.appendChild(returnButton);
    document.getElementById('result').appendChild(returnButton);

    // Add click event to return to login
    returnButton.addEventListener('click', redirectToLogin);
}

function chauffeurAuthentification(){
    const input = document.createElement('input'); // Create an input element
    input.type = "number";
    input.placeholder = "Enter Chauffeur ID";
    input.style.margin = "10px"; // Optional styling
    document.getElementById('result').appendChild(input); // Append it to the result container
    return input; // Return the input for further use
}

admin.addEventListener('click',fetchDataAdmin);//()=>{fetchData(); this.remove()});
admin.addEventListener('click',()=>deleteLogs(admin,chauffeurs));
chauffeurs.addEventListener('click',()=>fetchDataChauffeur());
chauffeurs.addEventListener('click',()=>deleteLogs(admin,chauffeurs));

// we still need to also add a way to post new missions and stuff;
 
// need to delete the append child from fetch data and add into a function so that i can determine where to append the tables, it might help later too