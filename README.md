# LimbleTagging

This project allows users to view assets, tasks and create comments. Within the comments you are able to tag users through typing `@` followed by the user's name.

## Installation

1. Download the project
2. Install `node` and `npm` on your machine.
3. run `npm install` to get the dependencies.
4. run `node scripts/generate-data.js` to create the `db.json` file that is used with `json-server`.
5. run `npm run start:db` to start the server on port 3000. The application uses this data.
6. open a new terminal and run `npm start` within the project directory
7. ENJOY! 🎉

## Live version! 📺

You can interact with a live deployed version here: [https://limble-tagging.onrender.com/](https://limble-tagging.onrender.com/)

_(NOTE: It is deployed of a FREE teir of Render so it might take up to 60 secs before it responds.)_

## Tech Used

- Angular
- TailwindCSS
- JsonServer
- Typescript

## App Screens

### Main view with asset list

![assets view](/images/assets.png)

### List of tasks for an asset

![tasks view](/images/tasks.png)

### Comments on a task with user selection

![comment view](/images/comment.png)
