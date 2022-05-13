import { constant, forEach } from "lodash";
import { useRouter } from "next/router";
import Item_Tag from "../component/Item_Tag";
import Item_Simple from "../component/Item_Simple";
import InventoryContext from "../contexts/inventoryContext";
import { useContext } from "react";
// import info.txt

export default function itemPage() {
  const router = useRouter();
  const { id } = router.query;

  const inventory = useContext(InventoryContext)

  const csgoItem = inventory[id]

  console.log(typeof(csgoItem))


  

  

  let bgcolor

  if (csgoItem && "rdCsgoBackpack" in csgoItem) {
    bgcolor = "#" + csgoItem.rdCsgoBackpack.rarity_color
  }
  else {
    bgcolor = "#ccc"
  }



  var total_sticker_price = 0;
  if (csgoItem && "rdCsgoBackpack" in csgoItem) {
    csgoItem?.rdCsgoFloat?.iteminfo?.stickers.forEach((sticker) => {
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

  return (<>
   <a href="/" className="home-button">Home</a>
    <div className="Item-Page">
      
      {csgoItem ? (   <>
    <div className="item-Page-Main">
      <div className="item-Page-Title">
        <h1 className="item-title" style={{ color: "#" + csgoItem.rgDescriptions.name_color }}>
          {csgoItem.rgDescriptions.market_hash_name}
        </h1>
        <div className="image-container-large">
          <img
            style={{ backgroundColor: bgcolor }}
            className="Item-Page-Image"
            src={`https://community.cloudflare.steamstatic.com/economy/image/${csgoItem.rgDescriptions.icon_url}`}
          />
          <div className="stickers">
            <span>
            {csgoItem.rdCsgoFloat?.iteminfo?.stickers.map((sticker) => {
              return (
                <img alt={sticker.name} src={`${sticker.sticker_url}`}/>
              )
            })}
            </span>
          </div>
        </div>
        <div className="Item-Tags">
          {csgoItem.rgDescriptions.tags.map((tag, index) => {
            return (
              <div className="Item-Tag" key={index}>
                <div className="External">
                  <span>{tag.category}</span>: <span>{tag.name}</span>
                </div>
                <div className="Internal">
                  <span>{tag.category_name}</span>:{" "}
                  <span>{tag.internal_name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
    </>) : null}
    <div className="more-Item-Info">
      {csgoItem ? (
        <div className="Item-Info">
          <Item_Tag name="ID" value={id} passedClassName={"bigWhite"}/>

          {
            csgoItem.rgDescriptions?.fraudwarnings ? (
              // for each fraudwarning split at : 
              csgoItem.rgDescriptions.fraudwarnings.map((fraudwarning, index) => {
                return (
                  <Item_Tag key={index} name={fraudwarning.split(":")[0]} value={fraudwarning.split(":")[1]} passedClassName={"bigWhite"}/>
                );
              })
            ) : null
          }
           

          {csgoItem?.rdCsgoBackpack ? (<Item_Tag name="Price" value=
          { (csgoItem?.rdCsgoBackpack ?(csgoItem?.rdCsgoBackpack?.price["24_hours"]?.average
            ? csgoItem?.rdCsgoBackpack?.price["24_hours"]?.average
            : csgoItem?.rdCsgoBackpack?.price["7_days"]?.average
            ? csgoItem?.rdCsgoBackpack?.price["7_days"]?.average
            : csgoItem?.rdCsgoBackpack?.price["30_days"]?.average
            ? csgoItem?.rdCsgoBackpack?.price["30_days"]?.average
            : csgoItem?.rdCsgoBackpack?.price["all_time"]?.highest_price
            ? csgoItem?.rdCsgoBackpack?.price["all_time"]?.highest_price
            : "N/A") : "N/A") != "N/A" ? parseFloat(csgoItem?.rdCsgoBackpack ?(csgoItem?.rdCsgoBackpack?.price["24_hours"]?.average
            ? csgoItem?.rdCsgoBackpack?.price["24_hours"]?.average
            : csgoItem?.rdCsgoBackpack?.price["7_days"]?.average
            ? csgoItem?.rdCsgoBackpack?.price["7_days"]?.average
            : csgoItem?.rdCsgoBackpack?.price["30_days"]?.average
            ? csgoItem?.rdCsgoBackpack?.price["30_days"]?.average
            : csgoItem?.rdCsgoBackpack?.price["all_time"]?.highest_price
            ? csgoItem?.rdCsgoBackpack?.price["all_time"]?.highest_price
            : "N/A") : "N/A").toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : "N/A"
            }

            passedClassName={"bigGreen"}/>) : null}

          {csgoItem?.rdCsgoFloat?.iteminfo?.floatvalue ? (
            <Item_Tag name="Float" value={csgoItem.rdCsgoFloat.iteminfo.floatvalue} passedClassName={"bigWhite"}/>
          ) : null}

          {csgoItem?.rdCsgoFloat?.iteminfo?.low_rank ? (
            <Item_Tag name="Float Rank (Low)" value={csgoItem.rdCsgoFloat.iteminfo.low_rank} passedClassName={"bigWhite"}/>
          ) : null}

          {csgoItem?.rdCsgoFloat?.iteminfo?.high_rank ? (
            <Item_Tag name="Float Rank (High)" value={csgoItem.rdCsgoFloat.iteminfo.high_rank} passedClassName={"bigWhite"}/>
          ) : null}

          {csgoItem?.rdCsgoFloat?.iteminfo?.paintseed ? (
            <Item_Tag name="Paint Seed" value={csgoItem.rdCsgoFloat.iteminfo.paintseed} passedClassName={"bigWhite"}/>
          ) : null}

          {csgoItem?.rdCsgoFloat?.iteminfo?.paintindex ? (
            <Item_Tag name="Paint Index" value={csgoItem.rdCsgoFloat.iteminfo.paintindex} passedClassName={"bigWhite"}/>
          ) : null}

          {csgoItem?.rdCsgoFloat?.iteminfo?.origin ? (
            <Item_Tag name="Origin" value={csgoItem.rdCsgoFloat.iteminfo.origin+" ("+csgoItem.rdCsgoFloat.iteminfo.origin_name+")"} passedClassName={"bigWhite"}/>
          ) : null}

          {total_sticker_price ? (
            <Item_Tag name="Total Sticker Price" value={total_sticker_price} passedClassName={"bigGreen"}/>
          ) : null}

          {csgoItem?.rgDescriptions?.commodity == true ? (
            <Item_Tag name="Commodity" value={"Yes"} passedClassName={"bigWhite"}/>
          ) :
          csgoItem?.rgDescriptions?.commodity == false ? (
            <Item_Tag name="Commodity" value={"No"} passedClassName={"bigWhite"}/>
          ) : null}
          
          {csgoItem?.rgDescriptions?.type ? ( 
            <Item_Tag name="Type" value={csgoItem.rgDescriptions.type} passedClassName={"bigWhite"}/>
          ) : null}


          


            

        </div>
      ) : null}
    </div>

    </div>
    </>
    )
}


