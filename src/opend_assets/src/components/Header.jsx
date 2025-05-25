import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import {BrowserRouter,Link, Switch,Route} from "react-router-dom";
import homeImage from "../../assets/home-img.png";
import Minter from "./Minter";
import Gallery from "./Gallery";
import {opend} from "../../../declarations/opend";
import CURRENT_USER_ID from "../index";

function Header() {

  const [userOwnedGalary,setOwnedGalary] = useState();
  const [listedGalary,setListedGalary] = useState();


  async function getNFTs() {
    const userNFTIDs = await opend.getOwnedNFT(CURRENT_USER_ID);

    setOwnedGalary(<Gallery title = "My NFT Page" ids={userNFTIDs} role="collection"/>);

    const listedNFTIDs = await opend.getListedNFT();
    setListedGalary(<Gallery title = "Market" ids = {listedNFTIDs} role="discover"/>);
  } 

  useEffect(() => { getNFTs(); }, []);

  return (
    <BrowserRouter forceRefresh = {true}>
    <div className="app-root-1">
      <header className="Paper-root AppBar-root AppBar-positionStatic AppBar-colorPrimary Paper-elevation4">
        <div className="Toolbar-root Toolbar-regular header-appBar-13 Toolbar-gutters">
          <div className="header-left-4"></div>
          <img className="header-logo-11" src={logo} />
          <div className="header-vertical-9"></div>
            <Link to="/">
          <h5 className="Typography-root header-logo-text">
          PixelMint</h5>
          </Link>
          <div className="header-empty-6"></div>
          <div className="header-space-8"></div>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
            <Link to="/discover">
            
            Discover
            </Link>
          </button>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
            <Link to="/minter">
            Minter
            </Link>
          </button>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
            <Link to="/collection">
            My NFTs
            </Link>
          </button>
        </div>
      </header>

    </div>
    <Switch>
      <Route exact path = "/">
        <img className="bottom-space" src={homeImage} />
      </Route>
      <Route path = "/discover">
        {listedGalary}
      </Route>
      <Route path = "/minter">
        <Minter/>
      </Route>
      <Route path = "/collection">

        {userOwnedGalary}
      </Route>
    </Switch>
    </BrowserRouter>
  );
}

export default Header;
