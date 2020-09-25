import express from 'express';
import {
    Sfdx
} from './src/sfdx.js';
import {
    PORT
} from './utils/utils.js';

const app = express();

app.use(express.json());

app.route('/')
    .get((req, res) => {

        let clientId = req.query.clientId;
        let userName = req.query.userName;

        let sfdxClient = new Sfdx(clientId, userName);

        sfdxClient.authorize()
            .then((data) => {
                return sfdxClient.getData();
            })
            .then((data) => {
                return sfdxClient.getOrgLimits();
            })
            .then((data) => {
                res.send(data);
            })
            .catch((err) => console.log(err));
    })
    .post((req, res) => {
        res.send(req.query);
    })
    .put((req, res) => {
        let clientId = req.body.clientId;
        let userName = req.body.userName;

        console.log('body : ' + JSON.stringify(req.body));
        console.log('clientId : ' + clientId);
        console.log('userName : ' + userName);

        let scractchSettingsData = req.body;
        console.log('scractchSettingsData : ' + JSON.stringify(scractchSettingsData));
        delete scractchSettingsData.clientId;
        delete scractchSettingsData.userName;

        let sfdxClient = new Sfdx(clientId, userName);

        sfdxClient.createScratchOrg(scractchSettingsData)
            .then((data) => {
                let json = JSON.parse(data);
                console.log('json : ' + JSON.stringify(json));
                console.log('json : ' + json.result.usernameson);
                return sfdxClient.userPasswordGenerate(json.result.username);
            })
            .then((data) => {
                console.log('data : ' + data);
                res.send(data);
            })
            .catch((err) => {
                console.log(err);
            });
    })
    .delete((req, res) => {
        res.send(req.query);
    });



app.listen(PORT, () => {
    console.log(`Listening PORT: ${PORT}`);
});