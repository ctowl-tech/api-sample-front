const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');

const port = process.env.PORT || 9000;
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var users = [];

app.get('/users', (req, res) => {
    res.send({users});
});

app.post('/user', async (req, res) => {
    try {
    
    
        if("timeout" in req.query) return users_timeout(req, res);
        if("internalError" in req.query) return users_internalError(req, res);
        if("delay" in req.query) await users_delay(req, res);
        
        
        const { name, password, wallet} = req.body;

        if( !name ) throw "Name not sent"; 
        if( !password ) throw "Password not sent"; 
        if( !wallet ) throw "Wallet not sent"; 
        
        users.push({ name, password, wallet });
        
        res.send({success: true});
    } catch(e) {
        res.status(400).send(e.toString);
    }
});

function users_timeout(req, res) {
    setTimeout( _ => {
        res.send({success: true});
    }, 1000 * 60 * 3); // 3minutos
}

function users_internalError(req, res) {
    
    try {
        throw "Erro interno";
    } catch(e) {
        res.status(500).end(e.toString());
    }
    
}

function users_delay(req, res) {

    return new Promise( resolve => { 
        let delayInMs = parseInt(req.query.delay);
        setTimeout( _ => {
            // res.send("Esperei " + (delayInMs / 1000) + "s!");
            resolve();
        }, delayInMs); 
    })
}

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});