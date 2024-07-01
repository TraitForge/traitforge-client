/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type {
  Airdrop,
  AirdropInterface,
} from "../../../contracts/Airdrop/Airdrop";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "addUserAmount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "airdropStarted",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "allowDaoFund",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "daoFundAllowed",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_traitToken",
        type: "address",
      },
    ],
    name: "setTraitToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "startAirdrop",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "subUserAmount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalTokenAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalValue",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "traitToken",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "userInfo",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b5061001a33610023565b60018055610073565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b610994806100826000396000f3fe608060405234801561001057600080fd5b50600436106100f55760003560e01c80637a14eddb11610097578063b827d00211610066578063b827d002146101db578063beae207f146101ee578063d4c3eea014610201578063f2fde38b1461020a57600080fd5b80637a14eddb1461017a5780638da5cb5b1461018a57806392f5ac81146101af578063939e2575146101c257600080fd5b80631959a002116100d35780631959a002146101375780634e71d92d1461015757806361b512a71461015f578063715018a61461017257600080fd5b80630337b3aa146100fa57806304269d3314610116578063143c2a3114610120575b600080fd5b61010360035481565b6040519081526020015b60405180910390f35b61011e61021d565b005b60025460ff165b604051901515815260200161010d565b610103610145366004610833565b60056020526000908152604090205481565b61011e6102c5565b61011e61016d366004610855565b61041e565b61011e6104ec565b600254610100900460ff16610127565b6000546001600160a01b03165b6040516001600160a01b03909116815260200161010d565b61011e6101bd366004610833565b6104fe565b600254610197906201000090046001600160a01b031681565b61011e6101e9366004610855565b610530565b61011e6101fc36600461087f565b61059c565b61010360045481565b61011e610218366004610833565b61069b565b610225610714565b60025460ff1661026a5760405162461bcd60e51b815260206004820152600b60248201526a139bdd081cdd185c9d195960aa1b60448201526064015b60405180910390fd5b600254610100900460ff16156102b45760405162461bcd60e51b815260206004820152600f60248201526e105b1c9958591e48185b1b1bddd959608a1b6044820152606401610261565b6002805461ff001916610100179055565b6102cd61076e565b60025460ff1661030d5760405162461bcd60e51b815260206004820152600b60248201526a139bdd081cdd185c9d195960aa1b6044820152606401610261565b336000908152600560205260409020546103585760405162461bcd60e51b815260206004820152600c60248201526b4e6f7420656c696769626c6560a01b6044820152606401610261565b6004543360009081526005602052604081205460035491929161037b91906108ae565b61038591906108cb565b60025460405163a9059cbb60e01b8152336004820152602481018390529192506201000090046001600160a01b03169063a9059cbb906044016020604051808303816000875af11580156103dd573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061040191906108ed565b50503360009081526005602052604081205561041c60018055565b565b610426610714565b60025460ff16156104495760405162461bcd60e51b81526004016102619061090f565b6001600160a01b0382166000908152600560205260409020548111156104a25760405162461bcd60e51b815260206004820152600e60248201526d125b9d985b1a5908185b5bdd5b9d60921b6044820152606401610261565b6001600160a01b038216600090815260056020526040812080548392906104ca908490610938565b9250508190555080600460008282546104e39190610938565b90915550505050565b6104f4610714565b61041c60006107c7565b610506610714565b600280546001600160a01b03909216620100000262010000600160b01b0319909216919091179055565b610538610714565b60025460ff161561055b5760405162461bcd60e51b81526004016102619061090f565b6001600160a01b0382166000908152600560205260408120805483929061058390849061094b565b9250508190555080600460008282546104e3919061094b565b6105a4610714565b60025460ff16156105c75760405162461bcd60e51b81526004016102619061090f565b600081116106085760405162461bcd60e51b815260206004820152600e60248201526d125b9d985b1a5908185b5bdd5b9d60921b6044820152606401610261565b6002546040516323b872dd60e01b815232600482015230602482015260448101839052620100009091046001600160a01b0316906323b872dd906064016020604051808303816000875af1158015610664573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061068891906108ed565b506002805460ff19166001179055600355565b6106a3610714565b6001600160a01b0381166107085760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610261565b610711816107c7565b50565b6000546001600160a01b0316331461041c5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610261565b6002600154036107c05760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606401610261565b6002600155565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b80356001600160a01b038116811461082e57600080fd5b919050565b60006020828403121561084557600080fd5b61084e82610817565b9392505050565b6000806040838503121561086857600080fd5b61087183610817565b946020939093013593505050565b60006020828403121561089157600080fd5b5035919050565b634e487b7160e01b600052601160045260246000fd5b80820281158282048414176108c5576108c5610898565b92915050565b6000826108e857634e487b7160e01b600052601260045260246000fd5b500490565b6000602082840312156108ff57600080fd5b8151801515811461084e57600080fd5b6020808252600f908201526e105b1c9958591e481cdd185c9d1959608a1b604082015260600190565b818103818111156108c5576108c5610898565b808201808211156108c5576108c561089856fea2646970667358221220ca54bcf06e1409af10680244107ef5db6144625194f91e02b51c64919a993cd564736f6c63430008140033";

type AirdropConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: AirdropConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Airdrop__factory extends ContractFactory {
  constructor(...args: AirdropConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      Airdrop & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): Airdrop__factory {
    return super.connect(runner) as Airdrop__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): AirdropInterface {
    return new Interface(_abi) as AirdropInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): Airdrop {
    return new Contract(address, _abi, runner) as unknown as Airdrop;
  }
}