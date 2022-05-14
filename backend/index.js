const express = require("express");
const {Register,Login,GetAllusers} = require("./src/controllers/authControllers")
const {accessChat,fetchChat,createGroup,renameGroup,removeGroup,addGroup} = require("./src/controllers/chatControllers")
const {authorizeBefore} = require("./src/middlewares/authmiddleware");
const cors = require("cors")
const app = express();
app.use(express.json());
app.use(cors())
app.post("/register",Register);
app.post("/login",Login);
app.get("/users",authorizeBefore,GetAllusers);
//authorizeBefore,

//chat routers
app.post("/chat",authorizeBefore,accessChat);
app.get("/chat",authorizeBefore,fetchChat);
app.post("/group",authorizeBefore,createGroup);
app.put("/rename",authorizeBefore,renameGroup);
app.put("/groupremove",authorizeBefore,removeGroup);
app.put("/groupadd",authorizeBefore,addGroup);
module.exports = app;