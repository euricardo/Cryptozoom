const express = require('express')
const app = express()
const path = require('path')
const morgan = require('morgan')
const hbs = require('hbs')
require('dotenv').config()
const indexRouter = require('./src/routes/index.Router')
const signupRouter = require('./src/routes/signup.Router')
const signinRouter = require('./src/routes/signin.Router')
const session = require('express-session')
const FileStore = require('session-file-store')(session)

const PORT = process.env.PORT || 3001

app.set('view engine', 'hbs')
app.set('views', path.join(process.env.PWD, 'src', 'views'))

hbs.registerPartials(path.join(process.env.PWD, 'src', 'views', 'partials'))

const sessionConfig = {
  store: new FileStore(),
  key: 'sid',
  secret: 'sdwderweeggrp',
  resave: false,
  saveUninitialized: false,
  httpOnly: true,
  cookie: { expires: 24 * 24 * 60e3 },
}
const sessionParser = session(sessionConfig)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(process.env.PWD, 'public')))
app.use(sessionParser)

app.use((req, res, next) => {
  res.locals.user = req.session.user
  next()
})

// hbs.registerHelper("renderEditAndDelete", (postId, userId)=>{
// // console.log(postId,userId);
//   return userId === postId
// })


app.use('/', indexRouter)
app.use('/signup', signupRouter)
app.use('/signin', signinRouter)



app.get('/exit',(req,res)=>{
  req.session.destroy();
  res.clearCookie("sid");
  res.redirect("/");
})

// app.listen(PORT, () => console.log(`Server has been started on PORT:${PORT}`))

module.exports = { app ,sessionParser}
