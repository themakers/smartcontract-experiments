pragma solidity ^0.6.1;

contract owned {

    address public owner;

    address private candidate = address(0);
    bool private candidateConfirmed = false;

    constructor() payable public {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(owner == msg.sender, "only owner can do this");
        _;
    }

    modifier onlyUnconfirmedCandidate {
        require(candidate != address(0), "contract is not in owner transition state");
        require(candidate == msg.sender, "only active candidate");
        require(candidateConfirmed == false, "you already confirmed yourself");
        _;
    }

    function changeOwner(address _owner) public onlyOwner {
        require(_owner != owner, "whattaya fuckin doin?");

        candidate = _owner;
    }

    function cancelOwnershipTransfer() public onlyOwner {
        candidate = address(0);
        candidateConfirmed = false;
    }

    function confirmMeAsCandidate() public onlyUnconfirmedCandidate {
        candidateConfirmed = true;
    }

    function confirmOwner(address _newOwner) public onlyOwner {
        require(candidate != address(0), "contract should be in owner transition state");
        require(candidate == _newOwner, "new owner mismatch");
        require(candidateConfirmed == true, "candidate must confirm itself");

        owner = _newOwner;

        candidate = address(0);
        candidateConfirmed = false;
    }
}

contract goszakupki is owned {

    constructor() payable public {
    }


    function getOwner() public view returns(address) {
        return owner;
    }
}
