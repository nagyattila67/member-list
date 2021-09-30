const http = require('http');
const fs = require('fs');

const server = http.createServer(function (req, res) {

    switch (true) {
        case req.url == '/' && req.method == 'GET':
            fs.readFile('./views/home.html', function (err, file) {
                res.setHeader('content-type', 'text/html;charset=utf-8');
                res.end(file)
            })
            break;
        case req.url == '/script.js' && req.method == 'GET':
            fs.readFile('./public/script.js', function (err, file) {
                res.setHeader('content-type', 'application/javascript');
                res.end(file)
            })
            break;
        case req.url == '/members' && req.method == 'GET':
            fs.readFile('members.json', function (err, file) {
                res.setHeader('content-type', 'application/json');
                res.end(file);
            });
            break;
        case req.url == '/styles' && req.method == 'GET':
            fs.readFile('public/styles.css', function (err, file) {
                res.setHeader('content-type', 'text/css');
                res.end(file);
            });
            break;
        case req.url == '/list' && req.method == 'GET':
            fs.readFile('members.json', function (err, file) {
                res.setHeader('content-type', 'text/html;charset=utf-8');
                const members = JSON.parse(file);
                let membersHTML = '<h2>Tagok:</h2><ul>';
                for (let member of members) {
                    membersHTML += `<li>${member.name} - ${member.age} - ${member.city} - ${member.species}</li>`
                }
                membersHTML += `</ul>`;
                res.end(membersHTML);
            });
            break;
        case req.url == '/members' && req.method == 'POST':
            let body = '';
            req.on('data', function (chunk) {
                body += chunk.toString();
            })
            req.on('end', function () {
                const newMember = JSON.parse(body);
                const newMemberSanitized = {
                    name: sanitizeString(newMember.name),
                    age: sanitizeString(newMember.age),
                    city: sanitizeString(newMember.city),
                    species: sanitizeString(newMember.species)
                }

                fs.readFile('./members.json', (err, data) => {
                    const members = JSON.parse(data);
                    members.push(newMemberSanitized);

                    fs.writeFile('./members.json', JSON.stringify(members), function () {
                        res.end(JSON.stringify(members))
                    })
                })
            })
            break;
            case req.url == '/members' && req.method == 'PUT':
                console.log("PUTPUTPUT")
                let body_ = '';
                req.on('data', function (chunk) {
                    body_ += chunk.toString();
                })
                req.on('end', function () {
                    const newMember = JSON.parse(body_);
                    const newMemberSanitized = {
                        name: sanitizeString(newMember.name),
                        age: sanitizeString(newMember.age),
                        city: sanitizeString(newMember.city),
                        species: sanitizeString(newMember.species)
                    }
    
                    fs.readFile('./members.json', (err, data) => {
                        const members = JSON.parse(data);
                        members.splice(newMember.id, 1,newMemberSanitized);
    
                        fs.writeFile('./members.json', JSON.stringify(members), function () {
                            res.end(JSON.stringify(members))
                        })
                    })
                })
                break;
            case req.url == '/members' && req.method == 'DELETE':
            let body2 = '';
            req.on('data', function (chunk) {
                body2 += chunk.toString();
            })
            req.on('end', function () {
                const member = JSON.parse(body2);
                const id = member.id;
               
                fs.readFile('./members.json', (err, data) => {
                    let members = JSON.parse(data);
                    members.splice(id,1);

                    fs.writeFile('./members.json', JSON.stringify(members), function () {
                        res.end(JSON.stringify(members));
                    })
                })
            })
            break;
        default:
            res.end("404");
    }
})

server.listen(3000)

function sanitizeString(str) {
    str = str.replace(/([^a-z0-9áéíóúñüűöő_-\s\.,]|[\t\n\f\r\v\0])/gim, "");
    return str.trim();
}
