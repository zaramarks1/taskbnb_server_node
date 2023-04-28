# Introduction

Name : Zara Marks

Email: zmarks1@hawk.iit.edu

Class: ITMD-542

Git repo backend: 
Git repo frontend: 

# Project Description 

Welcome to Taskbnb 1.0 ! 

This is a project for you that needs to someone to take care of your house while you are away! 

As a visitor in the web site you can browse for listings in the regions and dates you want. 

If you wish do add your own unit, please create an account. By creating an account, you can add units and listings for it.

The project is divided into two parts, the frontend and the backend. Each part is located in a dedicated GIT repository. 

# Development Environment 

Node JS Version : 16.17.0 

Editor: Visual Code Studio 

Backend: JavaScript, Node.js, Express, MongoDB, JWT authentication. 

Frontend: JavaScript, ReactJS.


# Installation/Running Instructions 

## Step 1 - Install Node

If you are a MAC user like, install Node using the command line : 

`brew install node`

If it is intalled, you can test using :

`node -v`

## Step 2 - Clone to project

You will need to clone both the frontend and the backend to get the project to work.

### Clone this project - Backend

Open your terminal in the folder you would like to clone the backend:

`git@github.com:zaramarks1/taskbnb_server_node.git`

`cd taskbnb_server_node`

### Clone this project - Frontend

Open another terminal in the folder you  wish to clone the frontend:

`git@github.com:zaramarks1/taskbnb_client.git`

`cd taskbnb_client`

### For both

Since we are inside the folder with the project:

Lets also download npm-check-updates so we can see if we need to have any updates:

` npm install npm-check-updates@latest `

This will check if theres any thing to update:

`npx npm-check-updates`

If there is, you can run the following command:

`npm install`

And now we can start our project using :

`npm start`

If you go to **http://localhost:3000/** you should be seing the Taskbnb welcome page. 

The backend API'S run on **http://localhost:8080/** if you wish to test the endpoints.

# Insights and Results

## Things I learned

As I mentioned in class, I actually have two backends doing almost the same thing. One is in Java, Spring and Mysql and this one with JS, Node.js, Express and NoSQL. It was very interesting to build the same backend as I was able learn and contrast the differences between both. 

From this project I was able to learn how to use Node.js, Express and NoSQL, all technologies I had never worked on before. I really enjoyed how most of the things are so simple and easy to do. 


## Problems 

*Frontend* : My frontend is adapt to work on both backends. I can stop running one and run another one and it will work for both. In order to do that I faced many problems since I am dealing with two different backends.For example, with my JAVA backend project, all my entities have id as for this one is _id. I had to make sure my frontend was able to handle both inputs accordingly. 

*Backend*: I tried replicating almost to perfection the JAVA backend into this one. But any modification I made to one of them, I had to make sure that they both had the functionality. This was a very detailed oriented part that took me some time to be able to have them both operating the same. 

*Relationship between collections*: Whenever I deleted a Unit, I wanted to delete all Listings as well. But using a pre-hook but it did not work. To solve this I fetched all the listings from the unit using the method .populate() and deleted them before deleting the actual unit. 