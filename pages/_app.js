import "../styles/globals.css";
import React, { useState, useEffect, createContext, useContext } from "react";
import InventoryContext from "../contexts/inventoryContext";

function MyApp({ Component, pageProps }) {
  const [steamID, setSteamID] = useState("");

  const [steamIDInput, setSteamIDInput] = useState();

  const [steamInventory, setSteamInventory] = useState({});

  const handleSetSteamID = (e) => {
    const ID = steamIDInput;
    if (ID === "") return;
    setSteamID(ID);
    setSteamIDInput("");
  };

  useEffect(() => {
    const windowSteamID = window.localStorage.getItem("steamID");
    const windowSteamInventory = JSON.parse(
      window.localStorage.getItem("steamInventory")
    );
    
    if (windowSteamID == steamID || (steamID === "" && windowSteamID)) {
      setSteamInventory(windowSteamInventory);
      setSteamID(windowSteamID);
    } else if (steamID !== "") {
      console.log("fetching new inventory", steamID);
      const inventoryDataFetch = async () => {
        const request = fetch(
          `http://localhost:3000/api/getSteamInventory/${steamID}`
        ).then((res) => res.json());

        const inventory = await request;

        setSteamInventory(inventory);

        window.localStorage.setItem(
          "steamInventory",
          JSON.stringify(inventory)
        );
      };
      inventoryDataFetch();

      window.localStorage.setItem("steamID", steamID);
    } else {
      console.log("no steamID");
    }
  }, [steamID]);

  // get the sum of all the steamInventory[key]
  let total_inventory_price = 0;
  if (steamInventory) {
    Object.keys(steamInventory).forEach((key) => {
        
        var price = steamInventory[key]?.rdCsgoBackpack?.price?.["24_hours"]?.average ? steamInventory[key]?.rdCsgoBackpack?.price?.["24_hours"]?.average : "";
        // format price as money if it is not ""
        if (price === "") {
          price = steamInventory[key]?.rdCsgoBackpack?.price?.["7_days"]?.average ? steamInventory[key]?.rdCsgoBackpack?.price?.["7_days"]?.average : "";
        } 
        if (price === "") {
          price = steamInventory[key]?.rdCsgoBackpack?.price?.["30_days"]?.average ? steamInventory[key]?.rdCsgoBackpack?.price?.["30_days"]?.average : "";
        }
        if (price === "") {
          price = steamInventory[key]?.rdCsgoBackpack?.price?.["all_time"]?.average ? steamInventory[key]?.rdCsgoBackpack?.price?.["all_time"]?.average : "";
        }
        if (price !="") {
          // make price a float
          price = parseFloat(price);
          // add price to total
          total_inventory_price += price;
        }
    });
  }

  // format price as money
  total_inventory_price = total_inventory_price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
 


  return (
    <div>
      <div className="Header"><span className="bigWhite">{steamID}</span><span className="bigGreen">{total_inventory_price}</span></div>
      
      <div className="SteamIDInput">
        <input
          type="text"
          className="inputFeild"
          onChange={(event) => setSteamIDInput(event.target.value)}
          value={steamIDInput}
        />
        <button onClick={handleSetSteamID}>Get Inventory</button>
      </div>
      <InventoryContext.Provider value={steamInventory}>
        <Component {...pageProps} />
      </InventoryContext.Provider>
    </div>
  );
}

export default MyApp;
