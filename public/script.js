document.querySelector("#load-members").addEventListener('click', fetchMembers);

async function fetchMembers() {
    const response = await fetch("/members");
    const members = await response.json();

    let content = `<h2>Tagok:</h2>
    <table class="table table-sm table-striped table-bordered">
    <thead><tr><th>nr</th><th>név</th><th>kor</th><th>város</th><th>faj</th></tr></thead>
    <tbody id="content-tbody">`
    members.forEach((value, index) => {
        content += `
        <tr id="tr${index}"><td>${index + 1}</td><td>${value.name}</td><td>${value.age}</td><td>${value.city}</td>
        <td>${value.species}</td>
        <td><button class="btn btn-sm btn-secondary" onclick="modifyFunction(event)">módosít</td>
        <td><button class="btn btn-sm btn-secondary" onclick="deleteFunction(event)">töröl</td></td></tr>`
    })
    content += `</tbody></table>`
    document.querySelector("#members-list").innerHTML = content;
}

let oldData = Object();

function modifyFunction(event) {
    const place = document.querySelector("#content-tbody");
    let id = event.path[2].id;
    id = id.split("tr")[1];
    id = parseInt(id);
    let name_ = event.path[2].children[1].innerHTML
    let age = event.path[2].children[2].innerHTML
    let city = event.path[2].children[3].innerHTML
    let species = event.path[2].children[4].innerHTML;
    oldData = { id, name_, age, city, species }
    const content = `
    <tr id="tr${id}"><td>${id + 1}</td>
    <td><input type="text" value="${name_}"></td>
    <td><input type="text" value="${age}"></td>
    <td><input type="text" value="${city}"></td>
    <td><select id="species" name="species">
    <option value="human" ${species=='human'?'selected':''}>human</option>
    <option value="kiborg" ${species=='kiborg'?'selected':''}>kiborg</option>
    <option value="alien" ${species=='alien'?'selected':''}>alien</option>
    <option value="intruder" ${species=='intruder'?'selected':''}>intruder</option>
    <option value="xenomorf" ${species=='xenomorf'?'selected':''}>xenomorf</option>
    </select></td>
    <td><button class="btn btn-success btn-sm" onclick="cancelFunction()">mégse</button></td>
    <td><button class="btn btn-success btn-sm" onclick="sendFunction(${id})">küld</button></td>
    `
    place.children[id].innerHTML = content;
}

function cancelFunction() {
    const sector = document.querySelector("#content-tbody").children[oldData.id];
    content = `
    <tr id=${oldData.id}><td>${oldData.id + 1}</td><td>${oldData.name_}</td><td>${oldData.age}</td>
    <td>${oldData.city}</td><td>${oldData.species}</td>
    <td><button class="btn btn-sm btn-secondary" onclick="modifyFunction(event)">módosít</td>
    <td><button class="btn btn-sm btn-secondary" onclick="deleteFunction()">töröl</td></td></tr>
        `
    sector.innerHTML = content;
}

async function sendFunction(id) {
    const place = document.querySelector(`#tr${id}`)
    const name = place.children[1].children[0].value;
    const age = place.children[2].children[0].value;
    const city = place.children[3].children[0].value;
    const species = place.children[4].children[0].value;

    const fetchInit={
        method: 'PUT',
        headers: {'content-type':'application/json'},
        body: JSON.stringify({ id, name, age, city, species })
    }

    let res = await fetch('/members',fetchInit);

    if (res.ok) {
        fetchMembers();
    } else {
        alert("server error")
    }
}

async function deleteFunction(event) {
    const id = event.path[2].id;
    const fetchInit = {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id })
    }

    let res = await fetch('/members', fetchInit)
    if (res.ok) {
        fetchMembers();
    } else {
        alert("server error")
    }
}

document.querySelector("#send-member-data").addEventListener('submit', sendNewData);

async function sendNewData(event) {
    event.preventDefault();
    const name = event.target[0].value;
    const age = event.target[1].value;
    const city = event.target[2].value;
    const species = event.target[3].value;

    const fetchInit = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, age, city, species })
    }

    res = await fetch('/members', fetchInit);

    if (res.ok) {
        fetchMembers();
    } else {
        alert("server error")
    }
}