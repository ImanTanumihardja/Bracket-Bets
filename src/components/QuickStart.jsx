import { Card, Button, Typography, Input } from "antd";
import { useMoralis } from "react-moralis";
import { useReducer } from "react";

const { Text } = Typography;
const ABI = [
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "tournamentID",
        "type": "bytes32"
      },
      {
        "internalType": "uint256[]",
        "name": "prediction",
        "type": "uint256[]"
      }
    ],
    "name": "createBracket",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint8",
        "name": "teamCount",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "buyInPrice",
        "type": "uint256"
      }
    ],
    "name": "createTournament",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "tournamentID",
        "type": "bytes32"
      }
    ],
    "name": "endTournamnet",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "EndTournament",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "NewBracket",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "tournamentID",
        "type": "bytes32"
      }
    ],
    "name": "NewTournament",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "tournamentID",
        "type": "bytes32"
      }
    ],
    "name": "startTournamnet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "StartTournamnet",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256[]",
        "name": "result",
        "type": "uint256[]"
      }
    ],
    "name": "UpdatedResult",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "tournamentID",
        "type": "bytes32"
      },
      {
        "internalType": "uint256[]",
        "name": "result",
        "type": "uint256[]"
      }
    ],
    "name": "updateResult",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "_tournaments",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "tournamentOwner",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "bracketForm",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "teamCount",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "pool",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "buyInPrice",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "hasStarted",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "hasEnded",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "tournamentOwner",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "teamCount",
        "type": "uint8"
      }
    ],
    "name": "generateTournamentID",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "hash",
        "type": "bytes32"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "tournamentID",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "bracketOwner",
        "type": "address"
      }
    ],
    "name": "getBracket",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256[]",
            "name": "prediction",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256",
            "name": "score",
            "type": "uint256"
          }
        ],
        "internalType": "struct Brackets.Bracket",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "tournamentID",
        "type": "bytes32"
      }
    ],
    "name": "getBracketOwners",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "isOwner",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

const styles = {
  title: {
    fontSize: "20px",
    fontWeight: "700",
  },
  text: {
    fontSize: "16px",
  },
  card: {
    boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
    border: "1px solid #e7eaf3",
    borderRadius: "0.5rem",
  },
  button: {
    border: "1px solid #000000",
    margin: "5px"
  }
};

export default function QuickStart() {
  const { Moralis } = useMoralis();
  const [createTournamentState, setCreateTournamentState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { name: "", teamCount: 0, buyInPrice: 0 }
  );

  const [getTournamentState, setGetTournamentState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { tournamentID: 0, tournament: null }
  );

  const [bracketState, setBracketState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { tournamentID: 0, prediction: [], buyInPrice: 0 }
  );


  async function createTournament() {
    let options = {
      contractAddress: "0xb7245ab2B8D1E20E132A2c0f4F9a3114C780F9B7",
      functionName: "createTournament",
      abi: ABI,
      params: {
        name: createTournamentState.name,
        teamCount: createTournamentState.teamCount,
        buyInPrice: createTournamentState.buyInPrice,
      },
    };

    const transaction = await Moralis.executeFunction(options);
    const receipt = await transaction.wait();
    const events = receipt.events[0];
    console.log("Tournmanet ID: " + events.data);
  }

  async function getTournament() {
    let options = {
      contractAddress: "0xb7245ab2B8D1E20E132A2c0f4F9a3114C780F9B7",
      functionName: "_tournaments",
      abi: ABI,
      params: {
        "": getTournamentState.tournamentID
      },
    };

    const transaction = await Moralis.executeFunction(options);
    setGetTournamentState({ tournament: transaction });
  }

  async function createBracket() {
    let options1 = {
      contractAddress: "0xb7245ab2B8D1E20E132A2c0f4F9a3114C780F9B7",
      functionName: "_tournaments",
      abi: ABI,
      params: {
        "": bracketState.tournamentID
      },
    };

    const transaction1 = await Moralis.executeFunction(options1);
    const buyInPrice = transaction1.buyInPrice;

    let options2 = {
      contractAddress: "0xb7245ab2B8D1E20E132A2c0f4F9a3114C780F9B7",
      functionName: "createBracket",
      abi: ABI,
      params: {
        tournamentID: bracketState.tournamentID,
        prediction: bracketState.prediction
      },
      msgValue: buyInPrice
    };
    const transaction2 = await Moralis.executeFunction(options2);
    console.log(transaction2);

  }

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <Card
        style={styles.card}
        title={
          <>
            📝 <Text strong>Tournaments</Text>
          </>
        }
      >
        <Input
          placeholder="Iman"
          prefix="Name: "
          onChange={(e) => {
            setCreateTournamentState({ name: e.target.value });
          }} />
        <Input
          placeholder="4"
          prefix="Team Count: "
          onChange={(e) => {
            setCreateTournamentState({ teamCount: e.target.value });
          }} />
        <Input
          placeholder="1000000000"
          prefix="Buy In Price: "
          suffix="Wei"
          onChange={(e) => {
            setCreateTournamentState({ buyInPrice: e.target.value });
          }} />
        <Button style={styles.button} onClick={() => createTournament()}>Create Tournament</Button>
        <br />
        <br />
        <Input
          placeholder="0xXXXXXXXXX"
          prefix="Tournament ID: "
          onChange={(e) => {
            setGetTournamentState({ tournamentID: e.target.value });
          }} />
        <Button style={styles.button} onClick={() => getTournament()}>Get Tournament</Button>
        <br />
        {getTournamentState.tournament &&
          <div>
            <Text strong>Tournament Details:</Text>
            <br /><Text>Name: {getTournamentState.tournament.name}</Text>
            <br /><Text>Team Count: {getTournamentState.tournament.teamCount}</Text>
            <br /><Text>Buy In Price: {getTournamentState.tournament.buyInPrice.toString()} wei</Text>
            <br /><Text>Pool: {getTournamentState.tournament.pool.toString()} wei</Text>
            <br /><Text>Started: {getTournamentState.tournament.hasStarted.toString()}</Text>
            <br /><Text>Ended: {getTournamentState.tournament.hasEnded.toString()}</Text>
          </div>
        }
      </Card>
      <Card
        style={styles.card}
        title={
          <>
            📝 <Text strong>Brackets</Text>
          </>
        }
      >
        <Input
          placeholder="0xXXXXXXXXX"
          prefix="Tournament ID: "
          onChange={(e) => {
            setBracketState({ tournamentID: e.target.value });
          }} />
        <Input
          placeholder="X,X,X"
          prefix="Bracket: "
          onChange={(e) => {
            var arr = (e.target.value.split(","));
            setBracketState({ prediction: arr });
          }} />
        <Button style={styles.button} onClick={() => createBracket()}>Create Bracket</Button>
      </Card>
    </div>
  );
}
