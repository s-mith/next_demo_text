
import React from 'react';



const Item_Simple = ({image,id,title,price,float,color,float_rank, stickers, sticker_price}) => {

    const buildImgUrl = "https://community.cloudflare.steamstatic.com/economy/image/" + image;

    const ref = `/${id}`;

    const background_style = float_rank === true ? "cool-background" : "";

    
    

    return(
    <a className={"simpleItemContainer "+background_style} href={ref} >
        <div className="simpleItemTitle"  style={{color: "#" + color}}>
            {title}
        </div>
        <div className='image_container'>
            {
                stickers ? 
                <div className='stickerInfo'>
                    <div className='stickerCount'>stickers: {stickers}</div> 
                    <div className='stickerPrice'>sticker price: {sticker_price}</div>
                </div>: null
            }
            <img className='simpleItemImage' src={buildImgUrl}/>
        </div>
        <div className="simpleItemInfo">
            <span className="simpleItemPrice">{price}</span>
            <span className="simpleItemFloat">{float}</span>
        </div>
    </a>
    );
}

export default Item_Simple