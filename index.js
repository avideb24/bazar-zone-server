const express = require('express');
const port = process.env.PORT || 3000;


const app = express();
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Bazar-Zone server is running...')
})

app.listen(port, () => {
    console.log("Server is running succcesfully...");
})