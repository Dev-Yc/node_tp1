const express = require('express');
const router = require('express').Router();
const csv = require('csv')
const {parse} = require('csv-parse');
const fs = require('fs');
const https = require('https');
const path = require('path');
const unzip = require('unzip');
const { resolve } = require('path');
const { rejects } = require('assert');

const app = express();


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/tp1', (req, res) => {

  //Downloading Zip Folder
  console.log("Début du Téléchargement");
  var file = fs.createWriteStream("data1.zip");

  var request = https.get("https://files.data.gouv.fr/insee-sirene/StockEtablissementLiensSuccession_utf8.zip", function(response) {
    response.pipe(file);
  
      file.on("finish", () => {
        file.close();
        console.log("Téléchargement du fichier fini");
      });
    });


  //Unzip function
  fs.createReadStream(path.join(__dirname,'/data1.zip'))
  .pipe(unzip.Parse())
  
  .on('entry', function (entry) {
    var fileName = entry.path;
    var type = entry.type; 
    var size = entry.size;
    entry.pipe(fs.createWriteStream(path.join(__dirname,'/data1.csv')));
    console.log("Début de la décompression")})

  .on('end', function () {
      console.log("Décompression Terminé")})


  //Calcul Data
  let total = 0; 
  let transfert_true = 0 ;


  fs.createReadStream(path.join(__dirname,'/data1.csv')).pipe(csv.parse({
    delimiter:',',
    columns: true,
  }))
  .on('data', (data) => {
    total++;
    console.log('total est de ' + total);
    if( data.transfertSiege === 'true' ){
      transfert_true++;
      console.log('transfert_true incrémenté, maintenant de ' + transfert_true);
    }})
  .on('end', () => {
    console.log('total est de ' + total);
    let pourcentage = (transfert_true*100)/to8tal;
    console.log('Le pourcentage est de : ' + pourcentage);
  });


});

app.listen(3000, () => {
  console.log('Lancement du serveur Réussi');
});