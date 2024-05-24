Please refer to the installation and configuration instructions in the README for details on setting up and running this project.
## How to Use

1. Clone the repository to your local machine.
2. Install the necessary dependencies using the provided installation script.
3. Run the application on your preferred environment.
4. Access the application through the provided URL.
5. Explore the various features and functionalities to gain valuable insights into elevator operations.



# Setup project in local enviornment
1. Git Clone Repo in local from url using below command
   ```bash
   git clone [https://github.com/VarunProg/spaceX.git]
   ```
### Setup in local development enviornment with enviornment config
## open 2 terminal one for web and one for server 

#### For Client 
1. In new terminal go to web folder 
2. run npm i - this will install dev dependencies in local inside node_modules folder
3. run pnpm dev - this will launch application on http://localhost:5173/ (check browser)

#### For Sever 
1. In new terminal go to sevrer folder 
2. run -> npm i - this will install dev dependencies in local inside node_modules folder
3. run -> npm start - this will launch server on port 3000 (keep it running for server api calls)


## How application works
With this setup, the frontend calls the backend, the backend fetches data from the SpaceX GraphQL API, and the frontend displays the results.

## Features
 1. Filters implemented - launch status (all, upcoming and previous launches), sort by launch date, search filteration on all fields retreived
 2. Listing of data with rocket information, reference links,launch year, images and expanded views for details which can be further extended
 3. On search filert its implemented with debouncing logic for performance improvement


## Technologies Used

#### on frontend
1. ### vite -
   Is a build tool that aims to provide a faster and leaner development experience for modern web projects, it uses esbuild which way more faster than any other build tools [https://vitejs.dev/guide/]
2. ### react with typescript -
   Using Typescript to build our React applications will make our react applications more predictable as we will be able to catch a lot of errors at runtime (during compilation). [https://create-react-app.dev/docs/adding-typescript/]


3. ### Styling - 

In this project, we use SCSS for custom styling and leverage React Bootstrap for UI components. Here's a brief overview of our styling setup:

- **SCSS (Sass)**: We use SCSS to create custom styles. SCSS provides a powerful way to manage styles, including variables, mixins, and nesting, ensuring maintainable and modular CSS.

- **React Bootstrap**: We rely on React Bootstrap for UI components. It offers a library of pre-styled and responsive components, making it easier to build a consistent and visually appealing user interface.

#### Technologies used on backend

- **Express.js:** A fast, unopinionated, and minimal web application framework for Node.js, used to create the API's endpoints and handle HTTP requests.

- **TypeScript:** A strongly typed superset of JavaScript that enhances code quality and provides improved development experiences.

- **GraphQL:**  This project utilizes the SpaceX GraphQL API to fetch data about past and upcoming launches, rockets, and other related information. The application interacts with the SpaceX GraphQL API endpoint located at https://main--spacex-l4uc6p.apollographql.net/graphql. By sending GraphQL queries to this endpoint, we retrieve specific data about SpaceX missions, rockets, and more.


#### Challenges faced 
 1. used graphQL to implement api calls where search filter and sorting did not work which i have implemented on state data as well.
 2. the existing api graphql url had some issues to get the data which i have fixed using another url : https://main--spacex-l4uc6p.apollographql.net/graphql

 #### Improvements
 1. Bootstrap layout could have been improved in the application with more time.
 2. proper Error handling can be improved
