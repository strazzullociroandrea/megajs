/**
 * Sull'account di mega è obbligatorio creare una cartella o file altrimenti il find va in errore
 */
//da es6 a commonjs
import { createRequire } from "module";
import { Storage, File } from "megajs";
import * as url from "url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const require = createRequire(import.meta.url);
//moduli per il server
const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
const conf = JSON.parse(fs.readFileSync("conf.json"));
(() => {
    app.use(bodyParser.json());
    app.use(
        bodyParser.urlencoded({
            extended: true,
        }),
    );

    //reindirizzamento a cartella public con la form di login
    app.use("/", express.static(path.join(__dirname, "public")));

    //web service per salvare il file su mega
    app.post("/salvaFile", async (request, response) => {
        try {
            const { name, data } = request.body;
            if (name && name != "" && data && data != "") {
                //creo la connessione
                const storage = await new Storage({
                    email: conf.email,
                    password: conf.password,
                }).ready;
                const file = await storage.find(name); //controllo la presenza di un file con il nome che viene passato come parametro
                if (file) {
                    response.json({ result: "Non puoi inserire il file con questo nome" });
                } else {
                    //invio del file da salvare
                    await storage.upload(name, data).complete;
                    //chiusura della connessione
                    storage.close();
                    response.json({ result: "File inserito correttamente" });
                }

            } else {
                response.json({ result: "Body della fetch malformato" });
            }
        } catch (e) {
            console.log(e);
            response.json({ error: e });
        }
    });

    //web service per recuperare un file
    app.post("/recuperaFile", async (request, response) => {
        try {
            const { name } = request.body;
            const storage = await new Storage({
                email: conf.email,
                password: conf.password
            }).ready;
            if(name && name != ""){
                const file = await storage.find(name); //ricerco il file con il nome specificato
                if(file){
                    const downloadUrl = await file.link(); //recupero l'url del file sapendo il nome
                    const fileGet = File.fromURL(downloadUrl); //creo l'oggetto file attraverso il suo url
                    await fileGet.loadAttributes() //carico le informazioni aggiuntive
                    const data = await fileGet.downloadBuffer(); //recupero il contenuto del file
                    response.json({ result: {data:data, name: name}});
                }else{
                    response.json({ result: "Nessun file trovato con il nome specificato" });
                }
            }else{
                response.json({ result: "Nessun file trovato con il nome specificato" });
            }
        } catch (e) {
            response.json({ error: e });
        }
    });

    const server = http.createServer(app);
    server.listen(conf.port, () => {
        console.log("---> server running on port 80");
    });

}) ();