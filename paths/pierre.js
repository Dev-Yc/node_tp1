const router = require('express').Router();
const path = require('path');
const {parse} = require('csv-parse');
const fs = require('fs');

router.get('/tp2', (req, res) => {

  const csvData = [];

  fs.createReadStream(path.join(__dirname,'../','/data.csv'))
    .pipe(

      parse({

        delimiter: ',',
        from: 1,
        to: 100000,
        columns: true

      })
    )

    .on('data', function (dataRow) {

      csvData.push(dataRow);

    })

    .on('end', function () {

      // Setup variables for percentage calc
      var count_rows = 0;
      var count_transfert_sieges = 0;

      // Choose the column that we need
      const transfert_sieges = csvData.map(rec => rec["transfertSiege"]);

      // Loop on record for counting both variables
      transfert_sieges.forEach((transfert_siege) => {

        count_rows += 1;

        if (transfert_siege == "true") {
          count_transfert_sieges += 1;
        }
      })

      console.log(count_rows);
      console.log(count_transfert_sieges);
      console.log(count_transfert_sieges * 100 / count_rows)
    })

    res.send(count_transfert_sieges * 100 / count_rows);
});

module.exports = router;