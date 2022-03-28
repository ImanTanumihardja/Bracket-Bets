// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.11;

contract Brackets{

    /*   Events   */
    event UpdatedResult(
        uint256[] result
    );

    event NewBracket();

    event NewTournament(
        bytes32 tournamentID
    );

    event StartTournamnet();

    event EndTournament();

    struct Tournament {
        string name;
        address tournamentOwner;
        uint8 bracketForm;
        uint8 teamCount;
        uint256[] result;
        address[] bracketOwners;
        uint256 pool;
        uint256 buyInPrice;
        bool hasStarted;
        bool hasEnded;
        mapping(address => Bracket) brackets;
    }

    struct Bracket {
        uint256[] prediction;
        uint256 score;
    }

    mapping(bytes32 => Tournament) public _tournaments;

    constructor() {}

    function createTournament(string calldata name, uint8 teamCount, uint256 buyInPrice) public returns(bytes32) 
    {
        require(!compareStrings(name, ""), "Usage: Cannot not have empty string as name");
        require((teamCount > 0 && (teamCount & (teamCount - 1)) == 0), "Usage: Invalid team count");
        bytes32 tournamentID = generateTournamentID(name, msg.sender, teamCount);
        require(compareStrings(_tournaments[tournamentID].name, ""), "Tournament ID already in use");

        _tournaments[tournamentID].name = name;
        _tournaments[tournamentID].tournamentOwner = msg.sender;
        _tournaments[tournamentID].bracketForm = teamCount - 1;
        _tournaments[tournamentID].teamCount = teamCount;
        _tournaments[tournamentID].hasStarted = false;
        _tournaments[tournamentID].buyInPrice = buyInPrice * (1 wei);

        emit NewTournament(tournamentID);
        return tournamentID;
    }

    function createBracket(bytes32 tournamentID, uint256[] calldata prediction) public payable
    {
        require(!compareStrings(_tournaments[tournamentID].name, ""), "Tournament does not exists");
        require(!_tournaments[tournamentID].hasStarted, "Tournament has already started");
        require(prediction.length == _tournaments[tournamentID].bracketForm, "Usage: Incorrect bracket form");
        require (msg.value == _tournaments[tournamentID].buyInPrice * 1 wei, "Incorrect amount of ether");
        for (uint i = 0; i < prediction.length; i++) {
            require(prediction[i] > 0 && prediction[i] <= _tournaments[tournamentID].teamCount, "Usage: Cannot have values in bracket <= 0 or > teamCount");
        }

        _tournaments[tournamentID].pool +=  _tournaments[tournamentID].buyInPrice;
        _tournaments[tournamentID].bracketOwners.push(msg.sender);
        _tournaments[tournamentID].brackets[msg.sender].prediction = prediction;

        emit NewBracket();
    }

    function generateTournamentID(string memory name, address tournamentOwner, uint8 teamCount) public pure returns(bytes32 hash)
    {
        return keccak256(abi.encodePacked(name, tournamentOwner, teamCount));
    }

    function updateResult(bytes32 tournamentID, uint256[] calldata result) public 
    {
        require(!compareStrings(_tournaments[tournamentID].name, ""), "Tournament does not exists");
        require(_tournaments[tournamentID].hasStarted, "Tournament has not started");
        require(result.length == _tournaments[tournamentID].bracketForm, "Usage: Incorrect solution form");
        require(msg.sender == _tournaments[tournamentID].tournamentOwner, "You are not the owner of the tournament");
        _tournaments[tournamentID].result = result;

        // Update all brackets score
        for (uint i = 0; i < _tournaments[tournamentID].bracketOwners.length; i++) {
            updateScore(tournamentID, _tournaments[tournamentID].bracketOwners[i]);
        }

        emit UpdatedResult(result);
    }

    function startTournamnet(bytes32 tournamentID) public {
        require(!compareStrings(_tournaments[tournamentID].name, ""), "Tournament does not exists");
        require(!_tournaments[tournamentID].hasStarted, "Tournament has already started");
        require(msg.sender == _tournaments[tournamentID].tournamentOwner, "You are not the owner of the tournament");
        _tournaments[tournamentID].hasStarted = true;

        emit StartTournamnet();
    }

    function endTournamnet(bytes32 tournamentID) public payable {
        require(!compareStrings(_tournaments[tournamentID].name, ""), "Tournament does not exists");
        require(!_tournaments[tournamentID].hasEnded, "Tournament has ended already");
        require(_tournaments[tournamentID].hasStarted, "Tournament has not started yet");
        require(msg.sender == _tournaments[tournamentID].tournamentOwner, "You are not the owner of the tournament");

        uint256 maxScore = 0;
        uint256 count = 0;

        // Find max score and number of max score brackets
        for (uint i = 0; i < _tournaments[tournamentID].bracketOwners.length; i++) {
            address addr = _tournaments[tournamentID].bracketOwners[i];
            uint256 score = _tournaments[tournamentID].brackets[addr].score;
            if (maxScore <= score) {
                count++;
                maxScore = score;
            }
        }

        uint div = _tournaments[tournamentID].pool / count;

        // Pay max score bracket owners
        for (uint i = 0; i < _tournaments[tournamentID].bracketOwners.length; i++) {
            address addr = _tournaments[tournamentID].bracketOwners[i];
            uint256 score = _tournaments[tournamentID].brackets[addr].score;
            if (maxScore == score) {
                (bool sent, bytes memory data) = payable(addr).call{ value: div * (1 wei) }("");
                require(sent, "Failed to send Ether");
            }
        }
        
        _tournaments[tournamentID].hasEnded = true;

        emit EndTournament();
    }

    /*   Internal Helper Functions   */

    function updateScore(bytes32 tournamentID, address account) internal 
    {
        Bracket memory bracket = _tournaments[tournamentID].brackets[account];
        uint256[] memory result = _tournaments[tournamentID].result;
        uint256 score = 0;
        for (uint i = 0; i < bracket.prediction.length; i++) {
            if (bracket.prediction[i] == result[i]) {
                score += 1;
            }
        }
        _tournaments[tournamentID].brackets[account].score = score;
    }

    function compareStrings(string memory a, string memory b) internal pure returns(bool) 
    {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

    /*   External Helper Functions   */

    function getBracket(bytes32 tournamentID, address bracketOwner) external view returns(Bracket memory)
    {
        require(!compareStrings(_tournaments[tournamentID].name, ""), "Tournament does not exists");
        return _tournaments[tournamentID].brackets[bracketOwner];
    }

    function getBracketOwners(bytes32 tournamentID) external view returns(address[] memory) 
    {
        require(!compareStrings(_tournaments[tournamentID].name, ""), "Tournament does not exists");
        return _tournaments[tournamentID].bracketOwners;
    }
}