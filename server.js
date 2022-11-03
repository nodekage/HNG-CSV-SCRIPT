const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const crypto = require('crypto');
const newCsvWriter = require('csv-writer').createObjectCsvWriter;
const yargs = require('yargs');
const {hideBin} = require('yargs/helpers')


const argv = yargs(hideBin(process.argv))
  .option("f", {
    alias: "file",
    demandOption: true,
    describe: "The Path of the CSV File",
    type: "string"
  })
  .option("o", {
    alias: "output",
    demandOption: false,
    describe: "The Path of the Output files (* The folder will be created if it does not exist.)",
    default: ".",
    type: "string"
  })
  .usage(
    "Usage: $0 --file [CSV File Path] --output [Output Directory]"
  ).argv


let TeamName = "";  
let csvwriter;  
const records = [];
const chips = [];

const filePath = argv.file;
const FileName = path.basename(filepath, ',csv');
const outPut = argv.output;

if (!fs.existsSync(outPut)) {
    fs.mkdirSync(outPut, {recursive: true})
}

fs.createReadStream(filePath)
  .pipe(csv.parse({ headers: true }))
  .on('headers', (headers) => {
     headers.push("Hash")
        
     csvwriter= newCsvWriter({
     path: `${FileName}.output.csv`,
     header: headers,
      });

     const headerRow = {};
     headers.forEach((col) => {
     headerRow[col] = col;
      });

     headerRow["Hash"] = "Hash";
      records.push(headerRow);
    })

    .on("data", (row) => {
        const tempName = row["Series Number"] ?? "";
        if (tempName.toLowerCase().startsWith("team")) {
            TeamName = tempName;
        }

        if (row["Filename"]) {
            chip.push({ ...row, Team: TeamName});
            records.push(row);
        }else {
            records.push(row);
        }
    })

    .on("close", () => {
        chips.forEach((chip) => {
            const jsonData = {
                format: "CHIP-0007",
                name: chip["Name"],
                description: chip["Description"],
                minting_tool: chip["Team"],
                sensitive_content: false,
                series_number: parseInt(chip["Series Number"]),
                series_total: chips.length,
                attributes: [
                    {
                        trait_type: "gender",
                        value: nft["Gender"],
                    },
                ],
                collection: {
                    name: "Zuri Free Lunch Tickets",
                    id: "b774f676-c1d5-422e-beed-00ef5510c64d",
                    attributes: [
                        {
                            type: "description",
                            value: "Rewards for accomplishments during HNGi9.",
                        },
                    ],
                },
            };

            // Add more attributes field if available
            if (chip["Attributes"]) {
                chip["Attributes"].split(";").forEach((attribute) => {
                    if (attribute) {
                        try {
                            const values = attribute.split(":");
                            const traitType = values[0].trim();
                            const value = values[1].trim();

                            jsonData["attributes"].push({
                                trait_type: traitType,
                                value: value,
                            });
                        } catch (err) {
                            console.log("Invalid Attribute / Wrong Input", attribute)
                        }
                    }
                });
            }

            const stringedJson = JSON.stringify(jsonData);

            // Hashing the JSON Data
            const hashed = crypto.createHash('sha256').update(stringedJson).digest("hex");

            fs.writeFileSync(`${outPut}/${chip["Filename"]}.json`, stringedJson)

            chip["Hash"] = hashed;

        });

        csvwriter
         .writeRecords(records)
         .then(() => console.log("Completed!"))
         .catch((err) => {
            console.log(err);
         });
    })

    .on("error", (err) => {
        console.log(err)
    });


