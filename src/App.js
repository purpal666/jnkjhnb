import React, { useState } from "react";
import fetch from "node-fetch";
import https from "https";
const csv = require("csvtojson");
var generator = require("generate-password");

function App() {
  const [file, setFile] = useState();
  const [array, setArray] = useState([]);

  const fileReader = new FileReader();

  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
  };

  const csvFileToArray = (string) => {
    const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

    const array = csvRows.map((i) => {
      const values = i.split(",");
      const obj = csvHeader.reduce((object, header, index) => {
        object[header] = values[index];
        return object;
      }, {});
      return obj;
    });

    setArray(array);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (file) {
      fileReader.onload = function (event) {
        const text = event.target.result;
        csvFileToArray(text);

        (async () => {
          console.log(fileReader.readAsText(file));
          const jsonArray = await csv().fromString(file.toString());
          console.log(jsonArray);
          var city = "SEATTLE";
          var state = "WA";
          var street1 = "325 9TH AVE".replace(/%20/g, " ");
          var street2 = "".replace(/%20/g, " ");
          var zip = "98104";
          var clinic = "HARBORVIEW MEDICAL CENTER".replace(/%20/g, " ");
          var dea = "FB1882821";
          var email = "hannahburner@yandex.com";
          var fax = formatPhoneNumber(
            getRandomInt(1000000000, 9999999999).toString()
          );
          var first_name = "Sanjay".replace(/%20/g, " ");
          var last_name = "Bhananker".replace(/%20/g, " ");
          var npi = "1427134220";
          var password = generator.generate({
            length: 18,
            numbers: true,
            symbole: true,
            uppercase: true,
            lowercase: true,
            strict: true
          });
          const httpsAgent = new https.Agent({
            rejectUnauthorized: false
          });
          var phone = formatPhoneNumber("2067313059");

          const body = `api_prescriber%5Bclinic_attributes%5D%5Baddress_attributes%5D%5Bcity%5D=${city}&api_prescriber%5Bclinic_attributes%5D%5Baddress_attributes%5D%5Bstate%5D=${state}&api_prescriber%5Bclinic_attributes%5D%5Baddress_attributes%5D%5Bstreet%5D=${street1}&api_prescriber%5Bclinic_attributes%5D%5Baddress_attributes%5D%5Bstreet2%5D=${street2}&api_prescriber%5Bclinic_attributes%5D%5Baddress_attributes%5D%5Bzip%5D=${zip}&api_prescriber%5Bclinic_attributes%5D%5Bname%5D=${clinic}&api_prescriber%5Bdea%5D=${dea}&api_prescriber%5Bemail%5D=${email}&api_prescriber%5Bfax%5D=%28${fax}&api_prescriber%5Bfirst_name%5D=${first_name}&api_prescriber%5Blast_name%5D=${last_name}&api_prescriber%5Bnpi%5D=${npi}&api_prescriber%5Bpassword%5D=${password}&api_prescriber%5Bphone%5D=%28${phone}`;
          var headers = {
            Host: "getrx.com",
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept-Encoding": "gzip, deflate, br",
            Accept: "*/*",
            "User-Agent":
              "GetRX Prescriber/1.0.54 (iPad; iOS 15.0; Scale/2.00)",
            "Accept-Language": "en-US;q=1"
          };

          const response = await fetch("https://getrx.com/api/prescribers", {
            method: "POST",
            headers: headers,
            agent: httpsAgent,
            body: body
          });
          const data = await response.json();
          console.log(data);

          // if (data["errors"] == null) {
          //   console.log(data["errors"]);
          // } else {
          //   //continue;
          // }

          function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
          }
          function formatPhoneNumber(phoneNumberString) {
            var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
            var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
            if (match) {
              return "(" + match[1] + ") " + match[2] + "-" + match[3];
            }
            return null;
          }
        })();
      };

      fileReader.readAsText(file);
    }
  };

  const headerKeys = Object.keys(Object.assign({}, ...array));

  return (
    <div style={{ textAlign: "center" }}>
      <h1>REACTJS CSV IMPORT EXAMPLE </h1>
      <form>
        <input
          type={"file"}
          id={"csvFileInput"}
          accept={".csv"}
          onChange={handleOnChange}
        />

        <button
          onClick={(e) => {
            handleOnSubmit(e);
          }}
        >
          IMPORT CSV
        </button>
      </form>

      <br />

      <table>
        <thead>
          <tr key={"header"}>
            {headerKeys.map((key) => (
              <th>{key}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {array.map((item) => (
            <tr key={item.id}>
              {Object.values(item).map((val) => (
                <td>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
