# leesbare link

![Website logo](logo.png)

Starters project for the UCLL course *Cloud Native Engineering*
*leesbare link* is a website that allows you to create link mappings, just like bit.ly or other URL shorters. 
However, the purpose is not to shorten links, but to make them readable.

## How to run

The application does not use docker anymore. The backend and database functionality all run in the cloud via Azure Functions and Cosmos DB. All that's needed now is to run the frontend.

In the `.vscode` folder there is a configuration for the *live server* extension to start up the frontend.

## Architecture

This version of the application mirated the backend functionality to Azure Functions, that run in an Azure Function App. You can do the same by following this tutorial: https://learn.microsoft.com/en-us/azure/azure-functions/functions-develop-vs-code?tabs=node-v3%2Cpython-v2%2Cisolated-process&pivots=programming-language-javascript

I decided to use the `v3` model in Typescript instead of the `v4` model because it was giving me unstable results when deploying.