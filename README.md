<p align="center">
  <img src="https://i.pinimg.com/originals/74/e6/ec/74e6ec9d86017536f2b0367c21f38319.png" width="222">
</p>

## :question: How to install & start?   
    git clone https://github.com/ErwinSaputraSulistio/Telegram-BE
    cd Telegram-BE
    npm install
    nodemon app.js

## :page_with_curl: Backend - List of Endpoints
    http://localhost:2500/v1/Path
#### 1.) Users :
Path | Method | Explanation
:-- | :-: | :-:
/user | POST | Create a new user
/user | GET | See all users list
/user/:id | GET | See an user information
/user/:id | PUT | Update user data
/user/change/password/:id | PATCH | Change an user's password
/user/login | POST | User login
/user/logout | GET | User logout
/user/jwt | POST | Check user's data by login's JWT
/user/change/avatar/:id | PATCH | Change an user's avatar
/user/verify/:id | GET | Verify an user's email

#### 2.) Chats :
Path | Method | Explanation
:-- | :-: | :-:
/chat | POST | Start a new chat
/chat/:id | GET | Get chat information
/chat/backup | POST | Save a chat message's history
/chat/history/:id | GET | Show chat history

## :pushpin: Links :  
Frontend : https://github.com/ErwinSaputraSulistio/Telegram-FE  
Deploy : https://telegram-erwinsaputrasulistio.vercel.app  

## :hammer_and_wrench: Build with :  
![Node Logo](https://user-images.githubusercontent.com/77045083/110448204-8dd6b980-80f3-11eb-89b6-13397ed8a31e.png)
![Express Logo](https://user-images.githubusercontent.com/77045083/111209202-52118780-85fe-11eb-8dc5-9394b3f0a9e3.png)
![PostgreSQL Logo](https://user-images.githubusercontent.com/77045083/110446881-397f0a00-80f2-11eb-8c98-ebfb3d5753c0.png) 
