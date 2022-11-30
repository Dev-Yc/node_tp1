import express from 'express';
import router from 'express'.Router();
import csv from 'csv';
import {parse} from 'csv-parse';
import fs from 'fs';
import https from 'https';
import path from 'path';
import unzip from 'unzip';
import { resolve } from 'path';
import { rejects } from 'assert';

export const app = express();



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/tp1', (req, res) => {

  //Downloading Zip Folder
  console.log("Début du Téléchargement");
  var file: Object = fs.createWriteStream("data1.zip");

  var request: Object = https.get("https://files.data.gouv.fr/insee-sirene/StockEtablissementLiensSuccession_utf8.zip", function(response) {
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
    var fileName: string = entry.path;
    var type: string = entry.type; 
    var size: number = entry.size;
    entry.pipe(fs.createWriteStream(path.join(__dirname,'/data1.csv')));
    console.log("Début de la décompression")})

  .on('end', function () {
      console.log("Décompression Terminé")})


  //Calcul Data
  let total: number = 0; 
  let transfert_true: number = 0 ;


  fs.createReadStream(path.join(__dirname,'/data1.csv')).pipe(csv.parse({
    delimiter:',',
    columns: true,
  }))
  .on('data', (data: Object) => {
    total++;
    console.log('total est de ' + total);
    if( data.transfertSiege === 'true' ){
      transfert_true++;
      console.log('transfert_true incrémenté, maintenant de ' + transfert_true);
    }})
  .on('end', () => {
    console.log('total est de ' + total);
    let pourcentage: number = (transfert_true*100)/to8tal;
    console.log('Le pourcentage est de : ' + pourcentage);
  });


});

app.listen(3000, () => {
  console.log('Lancement du serveur Réussi');
});