import { parse } from 'node-html-parser';



const handleSteamInventory = async (req, res) => {
    let { steamID } = req.query


    // fetch with headers
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'proxy12.p.rapidapi.com',
            'X-RapidAPI-Key': '45d8aec96cmsh5f3d170aa40cd67p1385a5jsnc0f1f777b855'
        }
    };


    if (isNaN(steamID)) {
        const response = await fetch(`http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=1F5DA66635EB64163975BFB0BA76761C&vanityurl=${steamID}`);
        const data = await response.json();
        steamID = data.response.steamid;
    } 
    
    
    const requests = [fetch(`https://proxy12.p.rapidapi.com/proxy?url=https%3A%2F%2Fsteamcommunity.com%2Fprofiles%2F${steamID}%2Finventory%2Fjson%2F730%2F2%2F`, options).then(res => res.json()),
    fetch(`http://csgobackpack.net/api/GetItemsList/v2/`).then(res => res.json())]

    const [inventoryData, allItemPriceData] = await Promise.all(requests);

    

    
    const inventory_data = JSON.parse(inventoryData.body)

    // console.log("inventory_data", typeof(inventory_data))

    // console.log("Data", data)
    // console.log("Data2", data2) 

    

    const rgInventory = inventory_data.rgInventory;
    const rgDescriptions = inventory_data.rgDescriptions;

    var inventory = {};

    for (let key in rgInventory) {
        
        // turn rgDescriptions[`${rgInventory[key].classid}_${rgInventory[key].instanceid}`].market_hash_name into a url
        var market_hash_name = rgDescriptions[`${rgInventory[key].classid}_${rgInventory[key].instanceid}`].market_hash_name;

        market_hash_name = market_hash_name.replace(/'/g, '&#39');

        var newobj = {
        rgInventory: rgInventory[key],
        rgDescriptions: rgDescriptions[`${rgInventory[key].classid}_${rgInventory[key].instanceid}`],
        
        }

        if (allItemPriceData.items_list[market_hash_name]) {
        newobj.rdCsgoBackpack = allItemPriceData.items_list[market_hash_name];
        }

        inventory[key] = newobj;
    }




    var inspectStrings = {

    };

    
    Object.entries(inventory).forEach(([key, value]) => {
        // if value has market_actions do something
        if (value.rgDescriptions.market_actions) {
        // steam://rungame/730/{steamid}/+csgo_econ_action_preview%20S{???}A{}D9947022367688543261
        // replace assetid with the assetid

        var mangled_link = value.rgDescriptions.market_actions[0].link

        // split mangled_link into an array

        var D_var = mangled_link.split('%D')[1]

        var link = `steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S${steamID}A${key}D${D_var}`
        inspectStrings[key] = link;
        }
    
    });

    const csgoFloatRequests = Object.entries(inspectStrings).map(([key, value]) => {
        // console.log("key", key)
        // console.log("value", value)
        return fetch(`http://api.csgofloat.com/?url=${value}`).then(async res => 
        {
            return ({[key]:await res.json()})
        }
        )
    })




    const paintData = await Promise.all(csgoFloatRequests);
    
    paintData.forEach((paintDataObject) => {
        const [key,value] = Object.entries(paintDataObject)[0];
        inventory[key].rdCsgoFloat = value;
        

        if (inventory[key].rgDescriptions.descriptions[inventory[key].rgDescriptions.descriptions.length-1].value.toLowerCase().includes("sticker")) {
            let dummy = parse(inventory[key].rgDescriptions.descriptions[inventory[key].rgDescriptions.descriptions.length -1].value)
            
            let image_list = dummy.querySelectorAll('img')

            // get the url from each image
            if (value?.iteminfo?.stickers ) {
                for (var i = 0; i < value.iteminfo.stickers.length; i++) {
                    inventory[key].rdCsgoFloat.iteminfo.stickers[i].sticker_url = image_list[i].getAttribute('src')
                    if (allItemPriceData.items_list["Sticker | " + value.iteminfo.stickers[i].name]){
                        inventory[key].rdCsgoFloat.iteminfo.stickers[i].sticker_price = allItemPriceData.items_list["Sticker | " + value.iteminfo.stickers[i].name].price
                    }
                }
            }
        }
    })

    res.status(200).json(inventory);

}



export default handleSteamInventory