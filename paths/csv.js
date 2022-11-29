const router = require('express').Router();
const csv = require('csv')
const {parse} = require('csv-parse');
const fs = require('fs');
const https = require('https');
const path = require('path');
const unzip = require('unzip');


router.get('/tp1', (req, res) => {

  //Downloading Zip Folder
  var file = fs.createWriteStream("data1.zip");

  var request = https.get("https://files.data.gouv.fr/insee-sirene/StockEtablissementLiensSuccession_utf8.zip", function(response) {
   response.pipe(file);

   file.on("finish", () => {
    file.close();
    console.log("Téléchargement du zip terminé");
  });
  });


  //Unzip function
  fs.createReadStream('data1.zip')
  .pipe(unzip.Parse())
  .on('entry', function (entry) {
    var fileName = entry.path;
    var type = entry.type; // 'Directory' or 'File'
    var size = entry.size;
    if (fileName === "data1.csv") {
      entry.pipe(fs.createWriteStream(''));
    } else {
      entry.autodrain();
    }
  });


  //Calcul Data

  const results = [];

  fs.createReadStream('StockEtablissementLiensSuccession_utf8.csv')
  .pipe(csv.parse())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    console.log(results[1]);

  });

  
});

module.exports = router;