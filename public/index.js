import {sendFile,getFile} from "./fetch.js";
const file = document.getElementById("file");
const invia = document.getElementById("invia");
const divResAdd = document.getElementById("divResAdd");
const view = document.getElementById("view");
const nameFile = document.getElementById("nameFile");


/**
 * Gestione button di caricamento file
 */
invia.onclick = () =>{
    const reader = new FileReader(); //oggetto per leggere il contenuto del file
    //al caricamento dell'oggetto reader eseguo la funzione f di callback
    reader.addEventListener(
        "load",
        async()=>{
            const name = file.files[0].name; //nome del file da caricare
            const data = reader.result; //contenuto del file da caricare
            const dizionario = {name, data}; //dizionario da inviare al server
            const rsp = await sendFile(dizionario); //eseguo il metodo per inviare al server il dizionario ed aspetto la risposta
            divResAdd.innerText = "  " + rsp.result; //visualizzazione risposta
            file.value = "";
        }
    );
    //lettura del file
    if (file.files[0]) {
        reader.readAsText(file.files[0]); //leggo il contenuto del file
    }
}

/**
 * Gestione button di view di un file richiesto
 */
view.onclick = async() =>{
    if(nameFile.value != ""){
        const rsp = await getFile(nameFile.value);
        const {data, name} = rsp.result;
        console.log("Il nome del file è: " + name);
        console.log("Il contenuto blob del file è: ");
        console.log(data);
    }
}