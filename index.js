const express = require('./node_modules/express')
const app = express()
const cors = require('./node_modules/cors/lib')
const bodyParser = require('./node_modules/body-parser')
const axios = require('./node_modules/axios'); 
const path = require('path');

 


// Add this line before the app.use(... line in index.js

app.use(express.static(path.join(__dirname, 'build')));



// Add this before the line with app.listen...

app.get('/', function(req, res) {

  res.sendFile(path.join(__dirname, 'build', 'index.html'));

});



const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
app.use(bodyParser.json())
app.use(cors())
app.use(requestLogger)
app.use(function(req, res, next) { 
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next() 
  })
app.use(express.static('build'))

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/all', (req, res) => {
    let query = "http://open-api.myhelsinki.fi/v1/events/"
    console.log("loading..." + new Date())
    console.log('query: ', query)
    axios
        .get(query)
        .then(response => {
            console.log("done!" + new Date())
            let events = response.data 
            if (events) {
                res.json(events)
            } else {
                res.send("no events there")
            }
        })
        .catch(error => {
            //console.log(error)
        })

})
app.get('/allTags', (req, res) => {
    let query = "http://open-api.myhelsinki.fi/v1/events/"
    console.log("loading..." + new Date())
    console.log('query: ', query)
    axios
        .get(query)
        .then(response => {
            console.log("done!" + new Date())
            let tags = response.data.tags 
            if (tags) {
                res.json(tags)
                console.log(tags)
            } else {
                res.send("no events there")
            }
        })
        .catch(error => {
            console.log(error)
        })

})
 
app.get('/eventsByCoordinates', (req, res) => {

    let lat = req.query.lat
    let long = req.query.long
    let dist = req.query.dist
    console.log("loading..." + new Date())
    console.log(lat, long, dist)
    let query = "http://open-api.myhelsinki.fi/v1/events/"
    query += `?distance_filter=${lat}%2c${long}%2c${dist}`
    console.log('query: ', query)
    axios
        .get(query)
        .then(response => {
            console.log("done!" + new Date())
            let events = response.data 
            
            if (events) {
                res.json(events)
            } else {
                res.send("no events there")
            }
        })
        .catch(error => {
            //console.log(error)
        })
})

 
 
  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

  app.use(unknownEndpoint)
 

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})