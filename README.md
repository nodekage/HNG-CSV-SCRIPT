# HNG-CSV-SCRIPT

This Script takes a CSV file and uses it to generate CHIP-0007 compatible JSONs, hash the JSONs and also store the sha256 hash of the JSON in a new output CSV

## Installation

- Run `npm install` to install the dependencies

## Usage

```shell
node index.js --file [The Path of the CSV File] --output [output directory for the JSON files]
```

#### Options

- **--help** Show help
- **-f, --file** The path to the input CSV file (required)
- **-o, --output** The path to output the JSON files (optional)

### Example

The program requires the input CSV to be passed as a command-line argument using the **-f** or **--file** option. You can also use the **-o** or **--output** option to specify the folder to store the generated JSON files. This makes it easier to organize the output files

```shell
node index.js -f mockdata.csv -o nft
```
