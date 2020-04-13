pragma solidity ^0.6.1;

import "./owned.sol";

contract Goszakupki is owned {

    Popil[] public popil;

    mapping(address => Popil[]) private popilByUser;

    constructor() public {
    }

    function newPopil(
        string memory _title,
        uint _startPrice,
        string memory _description
    ) public payable returns (address) {

        Popil _newPopil = new Popil(msg.sender, _title, _startPrice, _description);

        popil.push(_newPopil);

        popilByUser[msg.sender].push(_newPopil);

        return address(_newPopil);
    }

    function getMyPopils() public view returns (Popil[] memory) {
        return popilByUser[msg.sender];
    }

    bytes public stor;

    function putBytes(bytes memory b) public {
        stor = b;
    }
}

contract Popil {
    event NewOffer(address participant, uint256 amount);

    address payable public initiator;
    string public title;
    string public description;

    struct Offer {
        address payable participant;
        uint256 amount;
    }

    uint public startPrice;
    uint public lastPrice;
    mapping(address => Offer) public offers;
    address[] public participants;

    constructor(
        address payable _initiator,
        string memory _title,
        uint _startPrice,
        string memory _description
    ) public payable {
        require(msg.value == _startPrice, "you should deposit at least _startPrice value");

        initiator = _initiator;
        title = _title;
        startPrice = _startPrice;
        description = _description;

        lastPrice = _startPrice;
    }

    function offer() public payable {
        require(msg.value < lastPrice, "you can only bid with lowest price");

        Offer memory newOffer = Offer({participant : msg.sender, amount : msg.value});
        offers[newOffer.participant] = newOffer;
        participants.push(newOffer.participant);

        lastPrice = newOffer.amount;

        emit NewOffer(newOffer.participant, newOffer.amount);
    }

    function closePopil() public view {
        for (uint index = 0; index < participants.length; index++) {
            // Offer memory o = offers[participants[index]];
        }
    }
}
