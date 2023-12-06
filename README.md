# art98 🎨
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%236FDFFF)
![Mantine](https://img.shields.io/badge/Mantine-16B7FB?style=for-the-badge&logo=mantine&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

A real-time collaborative pixel art creation website built with MERN stack. This project was inspired by [`r/place`](https://en.wikipedia.org/wiki/R/place).

![Screenshot of website](image.png)

[Live Preview ▶]()

> 🟡 **Note**: Website will take some time to load initially because the backend is hosted on the free tier of Render which causes the server shut down after 15 minutes of inactivity. Website may also not work properly on mobile.

> 🔴 **Disclaimer**: The artwork displayed on this website is user-generated and collaborative. Some content might be inappropriate or offensive. Please be aware that the images presented do not necessarily reflect my views.

## Features
- Canvas user interaction: zoom, pan, pinch
- Web sockets for real-time drawing
- Jamstack architecture
- Session-based authentication
- Password hashing with bcrypt
- Server-side validation and sanitization using express-validator upon registration 
- Supports 3 types of users (basic, premium, admin):
    | Privilege                                                | Basic        | Premium        | Admin     |
    | -------------------------------------------------------- | ------------ | -------------- | --------- |
    | Number of pixels that can be drawn                       | 5 per minute | 20  per minute | Unlimited |
    | Inspect identity of online users                         | ❌            | ✅              | ✅         |
    | Inspect individual tiles to see who placed them and when | ❌            | ✅              | ✅         |
    | Reset board                                              | ❌            | ❌              | ✅         |

## Installation
> 🔴 **Prerequisites**: Git, Node.js, a cluster on MongoDB Atlas.

Install the project:
```bash
git clone git@github.com:creme332/art98.git
```

Navigate to the `client` directory and install dependencies:
```bash
npm install
```

Navigate to the `server` directory and install dependencies:
```bash
npm install
```

### Database setup
Create a database `art98` on MongoDB Atlas. Make your cluster available from any IP address.

In the `server` folder, create a `.env` file with the following contents:
```python
# Replace with mongo connection string
MONGO_STRING="mongodb+srv://cooluser:coolpassword@cluster.mongodb.net/art98?retryWrites=true&w=majority"
```

With your present working directory set to `server`, populate your database:
```bash
node populatedb
```

## Usage
To run the project locally, follow these instructions:

On one terminal, start frontend:

```bash
cd art98/client
npm run dev
```

On another terminal, start backend:

```bash
cd art98/server
npm run dev
```

Frontend is hosted on port 3000 and backend is hosted on port 4000. Open [http://localhost:3000](http://localhost:3000) in your browser to see running website.

### How to play
- You must first create an account and then login to your account.
To simply try out the app without any registration, you can click on the `Demo` button on the homepage. However, you will be limited to `Basic` privileges.
> 🟢 **Tip**: To become a `Premium` user, you must enter the secret key `1234` during registration.
- To draw a pixel on the canvas, you must **right-click** on a cell. 
- To move across the canvas, you must **drag** the canvas with left-click.
- To zoom in/out the canvas, you can either use the buttons with the magnifier icons or use the scroll wheel on your mouse.
- Hover on `x player online` to see names of currently online players.


## To-do
- [ ] reset canvas not working
- [ ] test routes with Postman
- [ ] Deployment
  - [ ] Deploy frontend on vercel
  - [ ] Deploy backend on render
  - [ ] Update backend URL value on server and client before deploying
  - [ ] Add secrets to service
  - [ ] Run lighthouse report
- [ ] Add more privileges
  - [ ] admin can use custom colors on top of color palette
- [ ] Download canvas option
- [ ] Remove any unused libraries
- [ ] Rewrite backend in typescript

## References
- https://josephg.com/blog/rplace-in-a-weekend/
- https://www.redditinc.com/blog/how-we-built-rplace/
- https://dev.to/novu/building-a-chat-app-with-socketio-and-react-2edj
- https://github.com/rknoll/draw
