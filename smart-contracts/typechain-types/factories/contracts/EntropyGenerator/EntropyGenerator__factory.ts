/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type {
  EntropyGenerator,
  EntropyGeneratorInterface,
} from "../../../contracts/EntropyGenerator/EntropyGenerator";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_traitForgetNft",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "allowedCaller",
        type: "address",
      },
    ],
    name: "AllowedCallerUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "entropy",
        type: "uint256",
      },
    ],
    name: "EntropyRetrieved",
    type: "event",
  },
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
        internalType: "uint256",
        name: "slotIndex",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "numberIndex",
        type: "uint256",
      },
    ],
    name: "deriveTokenParameters",
    outputs: [
      {
        internalType: "uint256",
        name: "nukeFactor",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "forgePotential",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "performanceFactor",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isForger",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllowedCaller",
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
    name: "getLastInitializedIndex",
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
    name: "getNextEntropy",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "slotIndex",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "numberIndex",
        type: "uint256",
      },
    ],
    name: "getPublicEntropy",
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
        name: "_allowedCaller",
        type: "address",
      },
    ],
    name: "setAllowedCaller",
    outputs: [],
    stateMutability: "nonpayable",
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
    inputs: [],
    name: "writeEntropyBatch1",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "writeEntropyBatch2",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "writeEntropyBatch3",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6080604052600061030355600061030455600061030555610100610306556102006103075561030261030855600d6103095561020461030a55600d61030b5534801561004a57600080fd5b50604051610dbf380380610dbf833981016040819052610069916100e8565b61007233610098565b61030c80546001600160a01b0319166001600160a01b0392909216919091179055610118565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000602082840312156100fa57600080fd5b81516001600160a01b038116811461011157600080fd5b9392505050565b610c98806101276000396000f3fe608060405234801561001057600080fd5b50600436106100b35760003560e01c80638da5cb5b116100715780638da5cb5b146101455780638f1ad44114610156578063b16d64361461015e578063bbab784014610171578063c396c72414610184578063f2fde38b1461018c57600080fd5b80626543e6146100b85780630185d9a3146100c25780631a8dd90b146100ca5780633298b74d146100e2578063715018a614610117578063843a95f11461011f575b600080fd5b6100c061019f565b005b6100c061030d565b610303545b6040519081526020015b60405180910390f35b6100f56100f0366004610a60565b61041a565b60408051948552602085019390935291830152151560608201526080016100d9565b6100c0610470565b61030c546001600160a01b03165b6040516001600160a01b0390911681526020016100d9565b6000546001600160a01b031661012d565b6100cf610484565b6100c061016c366004610a82565b6105e9565b6100cf61017f366004610a60565b610646565b6100c061065b565b6100c061019a366004610a82565b610799565b6103065461030354101580156101ba57506103075461030354105b61021d5760405162461bcd60e51b815260206004820152602960248201527f42617463682032206e6f74207265616479206f7220616c726561647920696e696044820152683a34b0b634bd32b21760b91b60648201526084015b60405180910390fd5b600061030654610303546102319190610ac8565b610303549091505b81811015610306576040805143602082015290810182905260009076028b6fc50b7f31eadb8d5a4c9b1e10cdcaa7d3494178e9604e1b906060016040516020818303038152906040528051906020012060001c8161029957610299610adb565b06905080620f423f036102e65760405162461bcd60e51b815260206004820152601560248201527424b73b30b634b2103b30b63ab296103932ba393c9760591b6044820152606401610214565b8060018361030281106102fb576102fb610af1565b015550600101610239565b5061030355565b61030754610303541015801561032857506103085461030354105b6103845760405162461bcd60e51b815260206004820152602760248201527f42617463682033206e6f74207265616479206f7220616c726561647920636f6d604482015266383632ba32b21760c91b6064820152608401610214565b610303545b6103085481101561040f576040805143602082015290810182905260009076028b6fc50b7f31eadb8d5a4c9b1e10cdcaa7d3494178e9604e1b906060016040516020818303038152906040528051906020012060001c816103ec576103ec610adb565b06905080600183610302811061040457610404610af1565b015550600101610389565b506103085461030355565b600080600080600061042c8787610812565b905061043b623d090082610b07565b94506104468161096c565b9350610453600a82610b1b565b92506000610462600383610b1b565b159250505092959194509250565b61047861098d565b61048260006109e7565b565b61030c546000906001600160a01b031633146104da5760405162461bcd60e51b815260206004820152601560248201527410d85b1b195c881a5cc81b9bdd08185b1b1bddd959605a1b6044820152606401610214565b610308546103045411156105305760405162461bcd60e51b815260206004820152601760248201527f4d617820736c6f7420696e64657820726561636865642e0000000000000000006044820152606401610214565b60006105426103045461030554610812565b90506001610309546105549190610b2f565b61030554106105a2576000610305556103085461057390600190610b2f565b6103045410610587576000610304556105b9565b610304805490600061059883610b42565b91905055506105b9565b61030580549060006105b383610b42565b91905055505b60405181907f3b022683e02fa80ef4dbf70572ae68c7d734bb1b7035ccc1f2793e19698d481890600090a2905090565b6105f161098d565b61030c80546001600160a01b0319166001600160a01b0383169081179091556040519081527fe2894a7c87e084235ad42c635e45697e0aff699b3447d133ef21a16c5f39e14a9060200160405180910390a150565b60006106528383610812565b90505b92915050565b6103065461030354106106b05760405162461bcd60e51b815260206004820152601c60248201527f4261746368203120616c726561647920696e697469616c697a65642e000000006044820152606401610214565b600061030654610303546106c49190610ac8565b610303549091505b81811015610306576040805143602082015290810182905260009076028b6fc50b7f31eadb8d5a4c9b1e10cdcaa7d3494178e9604e1b906060016040516020818303038152906040528051906020012060001c8161072c5761072c610adb565b06905080620f423f036107795760405162461bcd60e51b815260206004820152601560248201527424b73b30b634b2103b30b63ab296103932ba393c9760591b6044820152606401610214565b80600183610302811061078e5761078e610af1565b0155506001016106cc565b6107a161098d565b6001600160a01b0381166108065760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610214565b61080f816109e7565b50565b6000610308548311156108675760405162461bcd60e51b815260206004820152601960248201527f536c6f7420696e646578206f7574206f6620626f756e64732e000000000000006044820152606401610214565b61030a548314801561087b575061030b5482145b1561088a5750620f423f610655565b6000610897836006610b5b565b905060488111156108ea5760405162461bcd60e51b815260206004820152601a60248201527f506f736974696f6e2063616c63756c6174696f6e206572726f720000000000006044820152606401610214565b6000600185610302811061090057610900610af1565b015490506000620f4240610915846048610b2f565b61092090600a610c56565b61092a9084610b07565b6109349190610b1b565b9050600061094182610a37565b61094c906006610b2f565b61095790600a610c56565b6109619083610b5b565b979650505050505050565b60005b600a821061098957610982600a83610b07565b915061096f565b5090565b6000546001600160a01b031633146104825760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610214565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000805b821561065557610a4c600a84610b07565b925080610a5881610b42565b915050610a3b565b60008060408385031215610a7357600080fd5b50508035926020909101359150565b600060208284031215610a9457600080fd5b81356001600160a01b0381168114610aab57600080fd5b9392505050565b634e487b7160e01b600052601160045260246000fd5b8082018082111561065557610655610ab2565b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052603260045260246000fd5b600082610b1657610b16610adb565b500490565b600082610b2a57610b2a610adb565b500690565b8181038181111561065557610655610ab2565b600060018201610b5457610b54610ab2565b5060010190565b808202811582820484141761065557610655610ab2565b600181815b80851115610bad578160001904821115610b9357610b93610ab2565b80851615610ba057918102915b93841c9390800290610b77565b509250929050565b600082610bc457506001610655565b81610bd157506000610655565b8160018114610be75760028114610bf157610c0d565b6001915050610655565b60ff841115610c0257610c02610ab2565b50506001821b610655565b5060208310610133831016604e8410600b8410161715610c30575081810a610655565b610c3a8383610b72565b8060001904821115610c4e57610c4e610ab2565b029392505050565b60006106528383610bb556fea26469706673582212202e2849207abddcc7e34a492fa3cf89817d13f8da4f7499ec0e9db3595f3a9e0964736f6c63430008140033";

type EntropyGeneratorConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: EntropyGeneratorConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class EntropyGenerator__factory extends ContractFactory {
  constructor(...args: EntropyGeneratorConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _traitForgetNft: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(_traitForgetNft, overrides || {});
  }
  override deploy(
    _traitForgetNft: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(_traitForgetNft, overrides || {}) as Promise<
      EntropyGenerator & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): EntropyGenerator__factory {
    return super.connect(runner) as EntropyGenerator__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): EntropyGeneratorInterface {
    return new Interface(_abi) as EntropyGeneratorInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): EntropyGenerator {
    return new Contract(address, _abi, runner) as unknown as EntropyGenerator;
  }
}