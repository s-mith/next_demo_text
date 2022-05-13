import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Item_Simple from '../component/Item_Simple'
import { useContext } from 'react'
import InventoryContext from '../contexts/inventoryContext'





export default function Home() {

  const inventory = useContext(InventoryContext)
  
  return (
    <div className={styles.container}>
      <div className='Inventory'>

        {inventory ? Object.entries(inventory).map(([key, value]) => {
          
          var price = value?.rdCsgoBackpack?.price?.["24_hours"]?.average ? value?.rdCsgoBackpack?.price?.["24_hours"]?.average : "";
          // format price as money if it is not ""
          if (price === "") {
            price = value?.rdCsgoBackpack?.price?.["7_days"]?.average ? value?.rdCsgoBackpack?.price?.["7_days"]?.average : "";
          } 
          if (price === "") {
            price = value?.rdCsgoBackpack?.price?.["30_days"]?.average ? value?.rdCsgoBackpack?.price?.["30_days"]?.average : "";
          }
          if (price === "") {
            price = value?.rdCsgoBackpack?.price?.["all_time"]?.highest_price ? value?.rdCsgoBackpack?.price?.["all_time"]?.highest_price : "";
          }
          if (price !="") {
            // make price a float
            price = parseFloat(price);
            // format price as money
            price = price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
          }

          var float = value?.rdCsgoFloat?.iteminfo?.floatvalue ? value?.rdCsgoFloat?.iteminfo?.floatvalue.toFixed(8) : "";
          // make float only 8 decimal places
          
          var float_rank = (value?.rdCsgoFloat?.iteminfo?.low_rank < 11 || value?.rdCsgoFloat?.iteminfo?.high_rank < 11) ? true : false;

          var sticker_count = value?.rdCsgoFloat?.iteminfo?.stickers?.length ? value?.rdCsgoFloat?.iteminfo?.stickers?.length : null;

          // for sticker in value?.rdCsgoFloat?.iteminfo?.stickers check if sticker_price
          var total_sticker_price = 0;
          if (sticker_count) {
            value?.rdCsgoFloat?.iteminfo?.stickers.forEach((sticker) => {
              total_sticker_price += sticker.sticker_price?.["24_hours"]?.average ? sticker.sticker_price?.["24_hours"]?.average : 
              sticker.sticker_price?.["7_days"]?.average ? sticker.sticker_price?.["7_days"]?.average :
              sticker.sticker_price?.["30_days"]?.average ? sticker.sticker_price?.["30_days"]?.average :
              sticker.sticker_price?.["all_time"]?.highest_price ? sticker.sticker_price?.["all_time"]?.highest_price : 0;
            }
            )
          }
          if (total_sticker_price == 0) {
            total_sticker_price = null;
          }

          if (value?.rdCsgoFloat?.iteminfo?.floatvalue == 0) {
            total_sticker_price = null;
            var sticker_count = null;
          }

          console.log(sticker_count);
          
          return(
          <Item_Simple key={key} color={ value.rgDescriptions.name_color } float_rank={float_rank} id={key} price={price} float={float} title={value.rgDescriptions.market_hash_name}  image={value.rgDescriptions.icon_url} sticker_price={total_sticker_price} stickers={sticker_count}/>
          )
        }) : null}
      </div>
    </div>
  )
}

// export async function getServerSideProps() {
//   // const res = await fetch(`https://steamcommunity.com/profiles/76561198134695107/inventory/json/730/2`);
//   const steamid = '76561198134695107'

//   const requests = [fetch(`http://localhost:3000/api/steaminv`).then(res => res.json()),
//   fetch(`http://csgobackpack.net/api/GetItemsList/v2/`).then(res => res.json())]

//   const [inventoryData, allItemPriceData] = await Promise.all(requests);

  

//   // console.log("Data", data)
//   // console.log("Data2", data2) 

//   const rgInventory = inventoryData.rgInventory;
//   const rgDescriptions = inventoryData.rgDescriptions;

//   var inventory = {};

//   for (let key in rgInventory) {
    
//     // turn rgDescriptions[`${rgInventory[key].classid}_${rgInventory[key].instanceid}`].market_hash_name into a html encoded string
//     var market_hash_name = rgDescriptions[`${rgInventory[key].classid}_${rgInventory[key].instanceid}`].market_hash_name;
//     market_hash_name = market_hash_name.replace(/&/g, '&amp');
//     market_hash_name = market_hash_name.replace(/</g, '&lt');
//     market_hash_name = market_hash_name.replace(/>/g, '&gt');
//     market_hash_name = market_hash_name.replace(/"/g, '&quot');
//     market_hash_name = market_hash_name.replace(/'/g, '&#039');
//     market_hash_name = market_hash_name.replace(/\//g, '&#x2F');
//     market_hash_name = market_hash_name.replace(/\\/g, '&#x5C');

//     var newobj = {
//       rgInventory: rgInventory[key],
//       rgDescriptions: rgDescriptions[`${rgInventory[key].classid}_${rgInventory[key].instanceid}`],
      
//     }

//     if (allItemPriceData.items_list[market_hash_name]) {
//       newobj.rdCsgoBackpack = allItemPriceData.items_list[market_hash_name];
//     }

//     inventory[key] = newobj;
//   }


//   var inspectStrings = {

//   };

  
//   Object.entries(inventory).forEach(([key, value]) => {
//     // if value has market_actions do something
//     if (value.rgDescriptions.market_actions) {
//       // steam://rungame/730/{steamid}/+csgo_econ_action_preview%20S{???}A{}D9947022367688543261
//       // replace assetid with the assetid

//       var mangled_link = value.rgDescriptions.market_actions[0].link

//       // split mangled_link into an array

//       var D_var = mangled_link.split('%D')[1]

//       var link = `steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S${steamid}A${key}D${D_var}`
//       inspectStrings[key] = link;
//     }
  
//   });

//   const csgoFloatRequests = Object.entries(inspectStrings).map(([key, value]) => {
//     // console.log("key", key)
//     // console.log("value", value)
//     return fetch(`http://api.csgofloat.com/?url=${value}`).then(async res => 
//       {
//         return ({[key]:await res.json()})
//       }
//     )
//   })


//   const paintData = await Promise.all(csgoFloatRequests);
  
//   paintData.forEach((paintDataObject) => {
//     const [key,value] = Object.entries(paintDataObject)[0];
//     inventory[key].rdCsgoFloat = value;
//     // console.log(await inventory[key].rdCsgoFloat.iteminfo);
//   })
  
  
//   return {
//     props: {
//       data: inventory
//     }
//   }
  
// }





// function getInspectUrls(inventory, steamid){

  

//   return inspectStrings;

// }


