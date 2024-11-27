
export async function fetchData(uri, title = "Table") {
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