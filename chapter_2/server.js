const express = require('express');
const app = express();
const PORT = 3000

//  Config the Middleware
app.use(express.json());

let data = ['Shivank']

// `` is TLS (Template Literal String.)

app.get('/', (req, res) => {
    res.send(`
        <body style="background: pink; color: blue;">
            <h1>Data: </h1>
            <p>${JSON.stringify(data)}</p>
        </body>
        `)
})

app.get('/api/data', (req, res) => {
    console.log("This is for data.")
    res.send(data)
})
app.post('/api/data', (req, res) => {
    const newEntry = req.body
    console.log(newEntry)
    data.push(newEntry.name)
    res.sendStatus(201)
})
app.delete('/api/data', (req, res) => {
    if (data.length === 0) console.error("No Entry to delete.")
    else {
        data.pop()
        console.log('Deleted an Entry.')
        res.sendStatus(200)
    }
})

app.listen(PORT, () => {
    console.log(`Server has started running on the port: ${PORT}`)
})