# Naive Bayes Algorithm

A POC for to test how a  Naive Bayes Algorithm works.

## Clone a repository

I recommend that you open this README in another tab as you perform the tasks below.

---

### Clone a repository

Use these steps to clone from GitBash, the Git command line tool for using the repository. Cloning allows you to work on your files locally. If you don't yet have GitBash, [download and install first](https://git-scm.com/downloads).

1. From the repository, click + in the global sidebar and select Clone this repository under Get to work.
2. Copy the clone command (either the SSH format or the HTTPS). If you are using the SSH protocol, ensure your public key is in Bitbucket and loaded on the local system to which you are cloning.
3. From the GitBash terminal window, change to the local directory where you want to clone your repository.
4. Paste the command you copied from Bitbucket, for example:

```
git clone https://bartbastings@bitbucket.org/bartbastings/twelve-dashboard-api.git
```

If the clone was successful, a new sub-directory appears on your local drive. This directory has the same name as the Bitbucket repository that you cloned. The clone contains the files and metadata that Git requires to maintain the changes you make to the source files.

---

### Git checkout develop branche

1. Open the terminal window on the directory of the project.
2. Run the command ```git checkout develop```

This will insert the develop branche with the latest code.

---

## npm modules

---

### Install npm

Use these steps to install the node modules.

1. First [download and install](https://nodejs.org/en/download/) node version 8.11.3
2. Open the GitBash terminal on the directory of the project.
3. And run the command ```npm install```

---

### Run npm

These are the commands for the node modules script.

* Command ```npm run build:dev``` run the develop build, here is the code **not** uglifyed.
* Command ```npm run build:dist``` run the distribution build, here is the code uglifyed.
* Command ```npm run build:all``` run the develop & distribution builds.
* Command ```npm run build``` run the distribution build.
* Command ```server:dev``` run the develop build and run the server node.
* Command ```server:dist``` run the distribution build and run the server node.
* Command ```server``` run the distribution build and run the server node.

---

## DotEnv

Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env. 

Create a .env file in the root directory of your project. Add environment-specific variables on new lines in the form of NAME=VALUE. For example:

```
PORT: mock_port
USER: mock_user_name
PASSWORD: mock_password
```

---

## Postman

1. Create a account on the website of [Postman](https://www.getpostman.com/)
2. Donwload the [Postman app](https://www.getpostman.com/apps)
3. Add a **no oauth** request with the following header parameters
 1. key: content-Type
 	value: application/json
 2. key: content-Type
 	value: application/x-form-urlencoded

---

## Test application

### Inlog call

1. Run the server
2. Open the postman app and create a post call with the header parameters examples in the subject **postman**
3. Add the url in the postman bar ```localhost:3000/inlog```
4. Add the following body parameters
 1. key: user
 	value: mock_user
 2. key: password
 	value: mock_password
5. After you send the call you recieve the API key

### Set date

todo



