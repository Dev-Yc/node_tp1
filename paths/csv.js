const router = require('express').Router();
const {parse} = require('csv-parse');
const fs = require('fs');
const http = require('https');

const results = [];

router.get('/tp1', (req, res) => {

  //Downloading Zip Folder
  var file = fs.createWriteStream("data1.csv");

  var request = http.get("https://files.data.gouv.fr/insee-sirene/StockEtablissementLiensSuccession_utf8.zip", function(response) {
   response.pipe(file);

   file.on("finish", () => {
    file.close();
    console.log("Download Completed");
});

fs.createReadStream('path/to/archive.zip').pipe(unzip.Extract({ path: 'output/path' }));



  
  res.send('test');
  }); 
});

module.exports = router;