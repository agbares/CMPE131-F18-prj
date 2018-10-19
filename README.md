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
