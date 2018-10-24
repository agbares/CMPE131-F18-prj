# CMPE131-F18-prj
CMPE 131 Fall 2018 Group Project

## CONTENTS
1. Project Structure
2. Application Stack
3. Making Changes to the Repository
4. Development Environment Requirements
5. Starting Node Server
6. Deploying Application Online (to Heroku)
7. TODO

## 1. Project Structure
The project is organized as such:

```
bin/
middlewares/
models/
node_modules/
public/
routes/
tests/
views/
```
- `bin/` -- Express startup scripts
- `middlewares/` -- Express middlewares which processes incoming requests before handing them down to the routes - BACKEND
- `models/` -- Models represent data, business logic, and handles storage - BACKEND
- `node_modules/` -- Contains Node.js modules
- `public/` -- Contains static files (e.g. CSS, images, javascript)
- `routes/` -- Defines application routes - BACKEND 
- `tests/` -- Tests application
- `views/` -- Contains templates which are rendered and served by your routes - FRONTEND 

## 2. Application Stack

### Frontend
- Standard HTML, CSS, JS
- Bootstrap
- PUG Templating Engine

### Backend
- Node.js     - The server
- Express.js  - Framework aka tool: makes controlling MVC logic easier  
- MySQL 

## 3. Making Changes to the Repository
Work in your designated branch. Designated branches are named after your name. When you want to submit major changes to the master branch, create a `Pull Request` from your branch into the `master` branch.

## 4. Development Environment Requirements
- Node.js
- nodemon
- IDE, Coding Text Editor (Sublime, VS Code, Atom are good)
- GitHub Desktop (Using Git on commandline works too)
- Your favorite browser
- PATIENCE!!!!! :D

### Setting up Node.js
1. Head to: https://nodejs.org/en/
2. Download the current version. As of writing the version is `10.11.0`. Newer versions are fine. Don't download LTS
3. Follow installation prompts. Use default values

### Installing nodemon
Nodemon is a development tool that automatically reloads changes into the Node.js server, so that you do not have to restart the server for every change.
1. Open terminal/commandline.
2. Navigate to project directory
3. Execute `npm install -g nodemon`

## 5. Starting Node Server
1. Open terminal/commandline.
2. Navigate to project directory
3. Execute `nodemon start`

### Where Can I View the Webpage?
Starting up the Node Server allows you to run your own copy of the project. To view the website, head to `http://localhost:3000` in your web browser.

## 6. Deploying Application Online (to Heroku)
The `master` branch is always deployed online on Heroku. Whenever a commit is made onto `master`, Heroku will update and deploy the latest changes.

The online deployment can be found here: https://cmpe131-f18-prj.herokuapp.com

## 7. TODO
- Describe workflow for making changes more clearly

Backend work proceedure: 
1. Open the GitHub webpage and application 
2. Update to current master version: GitHub app --> click on the current branch (your name) change to master --> pull to origin --> change back to your branch --> branch menu (toolbar) --> Merge into current branch --> select master and merge into it 
3. Open terminal: cd GitHub/CMPE131-F18-prj/  --->  npm install   --->  nodemon start 
**/ as long as you have this open it will show changes on your web browser. changes are local /**
4. Open your text editor --> open file --> github --> CMPE131-F18-prj --> model (or whereever you need to go) --> access the sheet you need
**/ any changes you make and save are tracked by GitHub. changes are still local /**
5. To see changes in your local web browser: http://localhost:3000/
6. If you're satisfied with your changes: GH app —> click changes tab —> commit to "your_name" —> push to origin (the online version) now everyone can see it!
7. Terminal (to quit): control + c
