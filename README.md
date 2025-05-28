# Web Store (template)
README available in [Español](README-es.md)

![License](https://img.shields.io/github/license/acevedoossiel/webStore)

![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)


## Overview
This repository provides a template for building a web application using Node.js with Express for the backend, MongoDB for the database, and React for the frontend. The application is structured using a Modular Architecture, which separates different concerns into specific modules, making the code more maintainable and scalable.

## Features
- **Modular Architecture:** The project is organized into different modules, including controllers, services, models, and routes, ensuring a clear separation of concerns.
- **MVC (Model-View-Controller) Pattern:** The application follows the MVC pattern, where the Model represents the data and business logic, the View is handled by the React frontend, and the Controller manages the communication between the Model and View, processing requests and returning appropriate responses.


## Prerequisites
- **nvm**
- **Node v20.16.0**
- **pnpm** 
- **MongoDB**

## Installation
```bash
# Clone repository
  git clone https://github.com/acevedoossiel/webStore.git

# Install backend and frontend  dependencies
  pnpm install

# Environment variables
 - Create a `.env` file in the "cliente" directory and add variables:
    * PORT=4200

```
## Usage
```bash
#Install the node version
  nvm use

# Use typescript compiler
  cd server
  pnpm tsc

# Start the backend server using 
  cd server
  pnpm run start:dev

# Start the frontend using 
  cd cliente
  pnpm start
```

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

