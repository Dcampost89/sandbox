# Sandbox
Form generation and responses handler with Google Apps Script. We used clasp in order to develop locally, using Typescript

## Google Apps Script
Google Apps Script is a rapid application development platform that makes it fast and easy to create business applications that integrate with G Suite. You write code in JavaScript and have access to built-in libraries for favorite G Suite applications like Gmail, Calendar, Drive, and more. 
* More information: [https://developers.google.com/apps-script/overview]
* API Reference [https://developers.google.com/apps-script/reference/]

## Clasp
Allows you to develop your Apps Script projects locally. That means you can check-in your code into source control, collaborate with other developers, and use your favorite tools to develop Apps Script.
* More information: [https://github.com/google/clasp]

## Prerequisites
1. Install claps `sudo npm i @google/clasp -g`
2. Enable Apps Script API: [https://script.google.com/home/usersettings]
3. Install TypeScript definitions for Apps Script `npm i -S @types/google-apps-script`
4. clone the repository
5. Substitute the `scriptId` from the .clasp.json file with the script id of your personal project
