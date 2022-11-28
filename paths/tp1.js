const router = require('express').Router();
const {parse} = require('csv-parse');
const fs = require('fs');
const https = require('https');
const unzipper = require('unzipper');
const path = require('path');


router.get('/tp1', (req, res) => {

  //Downloading Zip Folder
  var file = fs.createWriteStream("data1.zip");

  var request = https.get("https://files.data.gouv.fr/insee-sirene/StockEtablissementLiensSuccession_utf8.zip", function(response) {
   response.pipe(file);

   file.on("finish", () => {
    file.close();
    console.log("Download Completed");
  });


  //Unzip function
  fs.createReadStream(path.join(__dirname,'../','/data1.zip')).pipe(unzipper.Parse()).on('entry', function (entry) {
    var fileName = entry.path;
    var type = entry.type; 
    var size = entry.size;
    console.log(fileName)
    if (fileName === "data1.csv") {
      entry.pipe(fs.createWriteStream(path.join(__dirname,'../','/data1.csv')));
    } else {
      entry.autodrain();
    }
  });

  //Calcul Data
  async function getTransfertSiegePercentage() {try{const wait = await unzip();

    const datas = [];
    var total_counts = 0;
    var transfert_counts = 0;

    fs.createReadStream(path.join(__dirname,'../data1.csv'))
      .pipe(parse({
          delimiter: ',',
          from: 1,
          to: 5000,
          columns: true }))
      .on('data', function (data) {

        const transfert_sieges = {
          value: data.transfertSiege,
          date: data.dateDernierTraitementLienSuccession
        }datas.push(transfert_sieges);

      }).on('end', function () {
        
        // Counting Loop
        datas.forEach((data) => {
          if (data.date < Date('2022-11-01')) {
              total_counts += 1;

            if (data.value == "true") {
              transfert_counts += 1;
            }}})
        res.send(`${transfert_counts * 100 / total_counts}`);})
    } }

  getTransfertSiegePercentage();
  
  }
);
  
});

module.exports = router;