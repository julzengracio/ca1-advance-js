let input, button;
let name;

// showName();

// get the value from the input field and pass it to the server when submitted

function checkName() {
    name = document.getElementById('name').value;
    fetch('/checkName', {
        method: 'POST',
        body: JSON.stringify({name}),
        headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(function(response) {
            if(response.ok) {
                console.log('Name taken.');
                return;
            }
                throw new Error('Request failed.');
        })
        .catch(function(error) {
            console.log(error);
        });
}

// get the name recorded in the server (from the database)
function showName() {
    fetch('/showName', {method: 'GET'})
        .then(function(response){
            if(response.ok) return response.json();
            throw new Error('Request failed');
        })
        .then(function(data) {
            console.log(data);
            document.getElementById('welcome').innerHTML = data.name;
        })
        .catch(function(error) {
            console.log(error);
        });
}