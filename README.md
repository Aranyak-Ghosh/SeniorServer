# SeniorServer
A nodeJS server built as part of my capstone project which uses a mongoDB database and a matlab runtime to provide methods to authenticate a user along with track key vitals relevant to diagnosis of Asthma and Chronic Obstructive Pulmonary Disease (COPD) and provides a preliminary diagnosis of the severity of the patient condition. Additionally, the server uses OAUTH to connect to fitbit and provides an interface to view various vitals recorded by any fitbit fitness tracker owned by the user. Presently the application is set up for personal use only and cannot have any other user due to restrictions from fitbit APIs. 

## Installation

The system is built using nodeJS and requires the device to have nodeJS and npm installed. To know more follow this [link]( https://nodejs.org/en/download/) 

Additionally, the application requires a Matlab runtime. More information available [here](https://www.mathworks.com/products/compiler/matlab-runtime.html)

The project uses a json file which stores credentials to connect to the database and credentials for fitbit credentials (Client ID and Client Secret) called credentials.json. Alternatively, the application can also read these variables from environment variables. 

Once all the prerequistes are met, go to the project directory and install all dependencies using the following command on a terminal
```
npm i
```
Finally to run the server type the following on a terminal
```node index.js```
