import Principal "mo:base/Principal";
// import Cycles "mo:base/ExperimentalCycles";
import NFTActorClass "../nft/nft";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import List "mo:base/List";
import Iter "mo:base/Iter";
import Prelude "mo:base/Prelude";


actor OpenD {

    private type Listing = {
        itemOwner:Principal;
        itemPrice:Nat;

    };

    var mapofNFT = HashMap.HashMap<Principal,NFTActorClass.NFT>(1,Principal.equal,Principal.hash);
    var mapofOwners = HashMap.HashMap<Principal,List.List<Principal>>(1,Principal.equal,Principal.hash);
    var mapofListing = HashMap.HashMap<Principal,Listing>(1,Principal.equal,Principal.hash);

    public shared(msg) func mint (imgDate:[Nat8],name:Text) : async Principal {
        let owner :Principal = msg.caller;

        // Cycles.add(20_500_000_000);
        // Debug.print(debug_show(Cycles.balance()));

        let newNFT = await NFTActorClass.NFT(name, owner, imgDate);

        // Debug.print(debug_show(Cycles.balance()));

        let newNFTprincipal = await newNFT.getCanisterID();

        mapofNFT.put(newNFTprincipal,newNFT);

        addtoOwnerMap(owner,newNFTprincipal);

    

        return newNFTprincipal;
    };

    private func addtoOwnerMap(owner:Principal,nftId:Principal){   
        var ownedNFT:List.List<Principal> = switch(mapofOwners.get(owner)){
            case null List.nil<Principal>();
            case (?result) result; 
        };

        ownedNFT:=List.push(nftId,ownedNFT);
        mapofOwners.put(owner,ownedNFT);

    };

    public query func getOwnedNFT (user:Principal):async [Principal]{
        var userNfts:List.List<Principal> = switch(mapofOwners.get(user)) {
            case(null) List.nil<Principal>();
            case(?result) result;
        };

        return List.toArray(userNfts);

    };

    public query func getListedNFT ():async [Principal]{
        let ids = Iter.toArray(mapofListing.keys());
        return ids;
    };


    public shared (msg) func listItem (id:Principal,price:Nat):async Text{
        var item:NFTActorClass.NFT = switch(mapofNFT.get(id)){
            case null return "NFT does not exist";
            case (?result) result; 
        };

        let owner = await item.getOwner();
        if(Principal.equal(owner,msg.caller)){
            let newListing: Listing = {
                itemOwner= owner;
                itemPrice = price;
            };
            mapofListing.put(id, newListing);
            return "Success";
        }else{
            return "not owned";
        }

    };

    public query func getOpendID():async Principal{
        return Principal.fromActor(OpenD);
    };

    public query func isListed (id:Principal):async Bool{
        if(mapofListing.get(id)==null){
            return false;

        }
        else{
            return true;
        }
    };

    public query func getOriginalOwner(id: Principal): async Principal {
        var listing: Listing = switch(mapofListing.get(id)) {
            case null return Principal.fromText("");
            case (?result)  result;
        };

        return listing.itemOwner;
    };


    public query func getListedNFTPrice(id:Principal):async Nat{
        var listing:Listing = switch(mapofListing.get(id)){
            case null return 0;
            case (?result) result;

        };
        return listing.itemPrice;
    };


    public shared(msg) func completePurchase(id:Principal,ownerid:Principal,newownerId:Principal):async Text{
        var purchasedNFT:NFTActorClass.NFT = switch(mapofNFT.get(id)){
            case null return "NFT does not exist";
            case (?result) result;
        } ;   
        let transferResult = await  purchasedNFT.transferOwnership(newownerId);
        if(transferResult == "Success"){
            mapofListing.delete(id);
            var ownedNFTs:List.List<Principal> = switch(mapofOwners.get(ownerid)){
                case null List.nil<Principal>();
                case (?result) result;
            };
            ownedNFTs:=List.filter(ownedNFTs,func (listitemID:Principal):Bool{
                return listitemID != id;
            });

            addtoOwnerMap(newownerId,id);
            return "Success";
        }
        else{
            return "error";
        }

    };
    
};
