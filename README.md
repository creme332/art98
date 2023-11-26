# art98 🎨
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%236FDFFF)
![Mantine](https://img.shields.io/badge/Mantine-16B7FB?style=for-the-badge&logo=mantine&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

A real-time collaborative pixel art creation website inspired by [`r/place`](https://en.wikipedia.org/wiki/R/place).

![Screenshot of website](image.png)

[Live Preview ▶]()

> 🟡 **Note**: Website will take some time to start because it is using some free services with multiple limitations. Website may also not work properly on mobile.

> 🔴 **Disclaimer**: The artwork displayed on this website is user-generated and collaborative. Some content might be inappropriate or offensive. Please be aware that the images presented do not necessarily reflect the views or values of the game creator. The content was created by various users and may not align with my beliefs or identity. If you encounter any offensive material, please report it for review.

## Features
- Canvas user interaction: zoom, pan, pinch
- Web sockets for real-time collaboration
- Jamstack architecture
- JWTs
- User authentication
- 3 types of users with the following privileges:
    | Privilege                                                | Basic             | Premium             | Admin     |
    | -------------------------------------------------------- | ----------------- | ------------------- | --------- |
    | Number of pixels that can be drawn                       | 1 every 5 minutes | 30  every 5 minutes | Unlimited |
    | Inspect identity of online users                         | ❌                 | ✅                   | ✅         |
    | Inspect individual tiles to see who placed them and when | ❌                 | ✅                   | ✅         |
    | Reset board                                              | ❌                 | ❌                   | ✅         |
    | Adjust board size                                        | ❌                 | ❌                   | ✅         |
    | Adjust tile cooldown                                     | ❌                 | ❌                   | ✅         |

## Architecture
Jamstack architecture
Built with MERN stack.

### Frontend
Frontend is hosted on Vercel free tier.
canvas API for drawinng

### Backend
Database is hosted using MongoDB Atlas.
Backend in hosted on Render free tier. Server is shut down after 15 minutes of inactivity
- Only hashed passwords are stored in database

#### API Endpoints

| Endpoint                  | Meaning                                                   |
| ------------------------- | --------------------------------------------------------- |
| `GET /online-users`       | Get the list of online users with their personal details. |
| `GET /online-users-count` | Get the number of online users.                           |
| `GET /canvas`             | Get canvas.                                               |
| `POST /canvas`            | POST request for saving canvas.                           |

## Installation
> 🔴 **Prerequisites**: Git, Node.js, MongoDB

Install the project:
```bash
git clone git@github.com:creme332/art98.git
```

Install client dependencies:
```bash
cd art98/client
npm install
```

Install server dependencies:

```bash
cd art98/server
npm install
```

Update MONGO_URL.

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

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to play
Select a color.
Right click on canvas to place a pixel.
Left click to move pan canvas.
## To-do
- [ ] Find way to store all details about canvas and save it to mongodb
  - [ ] Load initial state of board using socket/API/cache
  - [ ] Allow premium users to inspect identity of tile
- [ ] Displayy error message when server is down
- [ ] Is cors really needed on server? disable it
- [ ] Display live coordinates
- [ ] Run lighthouse report
- [ ] Add PWA support
- [ ] Download image
- [ ] Remove any unused libraries
- [ ] Use POSTMAN to test API

## References
- https://josephg.com/blog/rplace-in-a-weekend/
- https://www.redditinc.com/blog/how-we-built-rplace/
- https://dev.to/novu/building-a-chat-app-with-socketio-and-react-2edj
