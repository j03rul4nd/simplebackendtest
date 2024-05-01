import express from 'express';

const app = express();


app.get('/', (req, res) => {

    res.send('Welcome to the wibseite');
})

app.listen(3000, () => {
    console.log('listening on port localhost:3000');
});