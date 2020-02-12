const fs = require('fs');
    convertFactory = require('electron-html-to');
const util = require('util');
const inquirer = require('inquirer');
const axios = require('axios');
const writeFileAsync = util.promisify(fs.writeFile);
const conversion = convertFactory({
    converterPath: convertFactory.converters.PDF,
  });

function userInput() {
    return inquirer.prompt(
        [{
            type: 'input',
            message: 'what is your favorite color you want to be used as the background?',
            name: 'backgroundcolor'
        },
        {
            type: 'input',
            message: 'What is your Github Name?',
            name: 'Gitname'
        }]
    );
}
function githubinput(Gitname) {
    const url = `https://api.github.com/users/${Gitname}`;
    return axios.get(url);
}

function generateHTML(input,gitinput) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js"
            integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n"
            crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js"
            integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo"
            crossorigin="anonymous"></script>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
            integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"
            integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6"
            crossorigin="anonymous"></script>
    
        <title>Developer Profile Generator</title>
    </head>
    
    <body style=" background-image: radial-gradient(${input.backgroundcolor}, white);">
        <div class="container" style="height: 100rem">
        
        <h1 style="font-family: Georgia, 'Times New Roman', Times, serif; margin-top:10px; padding: 10px">${gitinput.name}</h1>
        <div class="row">
            <div class="col-md-6">
                        <img src="${gitinput.avatar_url}">
              </div>
              <div class="col-md-6">
                    <ul>
                        <li class="list-group-item list-group-item-action" style=" background-color: ${input.backgroundcolor}; padding: 30px"><a href="https://maps.google.com/?q=${gitinput.location}">Location</a></li>
                        <li class="list-group-item list-group-item-action" style=" background-color: ${input.backgroundcolor}; padding: 30px"><a href="${gitinput.html_url}">Github profile</a></li>
                        <li class="list-group-item list-group-item-action" style=" background-color: ${input.backgroundcolor}; padding: 30px"><a href="${gitinput.blog}">Blog</a></li>
                        <li class="list-group-item list-group-item-action" style=" background-color: ${input.backgroundcolor}; padding: 30px"><a href="${gitinput.email}">Email</a></li>
                        <li class="list-group-item list-group-item-action" style=" background-color: ${input.backgroundcolor}; padding: 30px"><a href="${gitinput.repos_url}">Repos</a></li>
                    </ul>
                </div>
          
                <div class="col-12">
            <p style ="margin-top:30px">${gitinput.bio}</p>
            <ul>
                <li>Total public repos: ${gitinput.public_repos}</li>
                <li>Total followers: ${gitinput.followers}</li>
                <li>Total followings: ${gitinput.following}</li>
                <li>Total github stars: ${gitinput.public_gists}</li>
            </ul>
            </div>
        </div>
    </div>
    
    </body>
    
    </html>`
}

async function init() {
    try {
        const input = await userInput();
        const gitdata = await githubinput(input.Gitname);
        const gitinput = gitdata.data;
        const html = generateHTML(input,gitinput);
        writeFileAsync('./index.html', html);
        conversion({
            html,
            pdf: { printBackground: true }
        }, function(err, result) {
            if (err) {
              return console.error(err);
            }
            result.stream.pipe(fs.createWriteStream('./index.pdf'));
            conversion.kill(); 
        });
    } catch (err) {
        console.log(err);
    }

}

init();
