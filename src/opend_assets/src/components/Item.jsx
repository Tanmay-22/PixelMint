import {Principal} from "@dfinity/principal";
import React, { useEffect,useState } from "react";
import {HttpAgent} from "@dfinity/agent";
import { Actor } from "@dfinity/agent";
import { canisterId, idlFactory, nft } from "../../../declarations/nft/index";
import { idlFactory as tokenidlfactory } from "../../../declarations/token/index";
import Button from "./Button";
import { opend } from "../../../declarations/opend";
import CURRENT_USER_ID from "../index";
import PriceLabel from "./PriceLabel";

function Item(props) {

  const [name, setName] = useState();
  const [owner, setOwner] = useState();
  const [image, setImage] = useState();
  const [button, setButton] = useState();
  const [priceInput,setPriceInput] = useState();
  const [loaderHidden,setLoader] = useState(true);
  const [blur,setBlur]  = useState();
  const [sellStatus ,setsellStatus] = useState("");
  const [priceLable, setPriceLable] = useState();
  const [shouldDisplay ,setDisplay] = useState(true);


  const id = props.id;
  const localhost = "http://localhost:8080";
  const agent = new HttpAgent({host:localhost});
  agent.fetchRootKey();
  let NFTActor;
  
  async function loadNFT() {

    NFTActor = await Actor.createActor(idlFactory, { agent,canisterId:id });
    const name =  await NFTActor.getName();
    const owner = await NFTActor.getOwner();
    const imageData = await NFTActor.getAsset();
    
    const imageContent = new Uint8Array(imageData);
    const image = URL.createObjectURL(new Blob([imageContent.buffer], { type: "image/png" }));
    
    
    
    setName(name);
    setImage(image);
    setOwner(owner.toText());
    
    if(props.role == "collection"){
    const nftListed = await opend.isListed(props.id);
    if(nftListed ){
      setBlur({filter:"blur(4px)"});
      setOwner("OpenD");
      setsellStatus("Listed");
    }
    else{
      setButton(<Button handleClick = {handleSell} text = {"Sell"}/>)
      
    }}
    else if(props.role == "discover"){

      const originalOwner = await opend.getOriginalOwner(props.id);
      if(originalOwner.toText()!= CURRENT_USER_ID.toText()){
        setButton(<Button handleClick = {handleBuy} text = {"Buy"}/>)

      }

      const price  = await opend.getListedNFTPrice(props.id);
      
      setPriceLable(<PriceLabel sellPrice = {price.toString()}/>)
    }
    
  }

  useEffect(() => {
    loadNFT();
  }, []);

  let price;

  function handleSell(){


    setPriceInput(<input
        placeholder="Price in DANG"
        type="number"
        className="price-input"
        value={price}
        onChange={(e)=>{price = e.target.value}}
      />);
      setButton(<Button handleClick = {sellItem} text = {"Confirm"}/>)

  } 

  async function handleBuy(){

    setLoader(false);
    
    const tokenActor = await Actor.createActor(tokenidlfactory,{
      agent,
      canisterId: Principal.fromText("xghmb-iaaaa-aaaaa-aaavq-cai")
    });

    const sellerId = await opend.getOriginalOwner(props.id);
    const itemPrice = await opend.getListedNFTPrice(props.id);

    const result = await tokenActor.transfer(sellerId, itemPrice);
    console.log(result);

    if(result == "Success"){
      const result = await opend.completePurchase(props.id,sellerId,CURRENT_USER_ID);
      console.log("Purchase:"+result);
      
    }
    
    setLoader(true);
    setDisplay(false);

  }


  async function sellItem (){
    setBlur({filter:"blur(4px)"})
    setLoader(false);
    const listing  = await opend.listItem(props.id,Number(price));
    console.log(listing);
    if(listing == "Success"){
      const opendID = await opend.getOpendID();
      const transferResult  = await NFTActor.transferOwnership(opendID);
      console.log(transferResult);
      if(transferResult == "Success")  {
        setsellStatus("Listed");
        setLoader(true);
        setPriceInput();
        setButton();
        setOwner("OpenD");

      }
    }

  }

  return (
    <div className="disGrid-item" style = {{display:shouldDisplay?"inline":"none"}}>
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
          style ={blur}
        />
        <div className="lds-ellipsis" hidden = {loaderHidden}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
        <div className="disCardContent-root">
          {priceLable}
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"> {sellStatus}</span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
          {priceInput}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;
