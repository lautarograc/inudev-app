Requirements

Node 22+ and NPM.

This app is built upon a Vite React server, using Typescript.

The frontend itself is modeled as a story using [Storybooks](https://storybook.js.org/). This makes it very easy to flow through the views and test the app using various inputs and screen sizes. 

As for the rest, I'm only using [Antd](https://ant.design/) for material and component sourcing. It makes some significant heavy lifting around the tree structure of the data.

Now, to spin up the app: make sure youre under Node 22 or higher, clone the repo, run npm install and then npm run storybook. 

In this view ![image](https://github.com/user-attachments/assets/6e298918-2a6b-4033-8cec-04df68ce142c) you will need to **first go into the "AuthPage" component, register an user and then log in. It will store the JWT into your local storage, which will then be used for the TodoTree component.

In the ToDo tree component, there's a very visible lack of design, I didn't really have the time to even begin with the styles, but it's functional and everything is visible to the user. There's a significant missing feature: there's no sorting or text search (also due to a lack of time), but the filtering options make up for it.

You can first create a Todo with the top-left button. Then you can edit todos, delete them or create children for them (note: I didn't get to implement a way to change/remove the parent of a children). The table has an infinite scroll, the endpoints are paginated and will return records 10-by-10. 

The cards are also exapandable, they will fetch the children of the element recursively as you click them.
