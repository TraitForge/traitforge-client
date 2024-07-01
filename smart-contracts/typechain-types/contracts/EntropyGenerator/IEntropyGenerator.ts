/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../common";

export interface IEntropyGeneratorInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "deriveTokenParameters"
      | "getAllowedCaller"
      | "getLastInitializedIndex"
      | "getNextEntropy"
      | "getPublicEntropy"
      | "setAllowedCaller"
      | "writeEntropyBatch1"
      | "writeEntropyBatch2"
      | "writeEntropyBatch3"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic: "AllowedCallerUpdated" | "EntropyRetrieved"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "deriveTokenParameters",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getAllowedCaller",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getLastInitializedIndex",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getNextEntropy",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getPublicEntropy",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setAllowedCaller",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "writeEntropyBatch1",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "writeEntropyBatch2",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "writeEntropyBatch3",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "deriveTokenParameters",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAllowedCaller",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getLastInitializedIndex",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getNextEntropy",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPublicEntropy",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setAllowedCaller",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "writeEntropyBatch1",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "writeEntropyBatch2",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "writeEntropyBatch3",
    data: BytesLike
  ): Result;
}

export namespace AllowedCallerUpdatedEvent {
  export type InputTuple = [allowedCaller: AddressLike];
  export type OutputTuple = [allowedCaller: string];
  export interface OutputObject {
    allowedCaller: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace EntropyRetrievedEvent {
  export type InputTuple = [entropy: BigNumberish];
  export type OutputTuple = [entropy: bigint];
  export interface OutputObject {
    entropy: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface IEntropyGenerator extends BaseContract {
  connect(runner?: ContractRunner | null): IEntropyGenerator;
  waitForDeployment(): Promise<this>;

  interface: IEntropyGeneratorInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  deriveTokenParameters: TypedContractMethod<
    [slotIndex: BigNumberish, numberIndex: BigNumberish],
    [
      [bigint, bigint, bigint, boolean] & {
        nukeFactor: bigint;
        forgePotential: bigint;
        performanceFactor: bigint;
        isForger: boolean;
      }
    ],
    "view"
  >;

  getAllowedCaller: TypedContractMethod<[], [string], "view">;

  getLastInitializedIndex: TypedContractMethod<[], [bigint], "view">;

  getNextEntropy: TypedContractMethod<[], [bigint], "nonpayable">;

  getPublicEntropy: TypedContractMethod<
    [slotIndex: BigNumberish, numberIndex: BigNumberish],
    [bigint],
    "view"
  >;

  setAllowedCaller: TypedContractMethod<
    [_allowedCaller: AddressLike],
    [void],
    "nonpayable"
  >;

  writeEntropyBatch1: TypedContractMethod<[], [void], "nonpayable">;

  writeEntropyBatch2: TypedContractMethod<[], [void], "nonpayable">;

  writeEntropyBatch3: TypedContractMethod<[], [void], "nonpayable">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "deriveTokenParameters"
  ): TypedContractMethod<
    [slotIndex: BigNumberish, numberIndex: BigNumberish],
    [
      [bigint, bigint, bigint, boolean] & {
        nukeFactor: bigint;
        forgePotential: bigint;
        performanceFactor: bigint;
        isForger: boolean;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "getAllowedCaller"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getLastInitializedIndex"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "getNextEntropy"
  ): TypedContractMethod<[], [bigint], "nonpayable">;
  getFunction(
    nameOrSignature: "getPublicEntropy"
  ): TypedContractMethod<
    [slotIndex: BigNumberish, numberIndex: BigNumberish],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "setAllowedCaller"
  ): TypedContractMethod<[_allowedCaller: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "writeEntropyBatch1"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "writeEntropyBatch2"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "writeEntropyBatch3"
  ): TypedContractMethod<[], [void], "nonpayable">;

  getEvent(
    key: "AllowedCallerUpdated"
  ): TypedContractEvent<
    AllowedCallerUpdatedEvent.InputTuple,
    AllowedCallerUpdatedEvent.OutputTuple,
    AllowedCallerUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "EntropyRetrieved"
  ): TypedContractEvent<
    EntropyRetrievedEvent.InputTuple,
    EntropyRetrievedEvent.OutputTuple,
    EntropyRetrievedEvent.OutputObject
  >;

  filters: {
    "AllowedCallerUpdated(address)": TypedContractEvent<
      AllowedCallerUpdatedEvent.InputTuple,
      AllowedCallerUpdatedEvent.OutputTuple,
      AllowedCallerUpdatedEvent.OutputObject
    >;
    AllowedCallerUpdated: TypedContractEvent<
      AllowedCallerUpdatedEvent.InputTuple,
      AllowedCallerUpdatedEvent.OutputTuple,
      AllowedCallerUpdatedEvent.OutputObject
    >;

    "EntropyRetrieved(uint256)": TypedContractEvent<
      EntropyRetrievedEvent.InputTuple,
      EntropyRetrievedEvent.OutputTuple,
      EntropyRetrievedEvent.OutputObject
    >;
    EntropyRetrieved: TypedContractEvent<
      EntropyRetrievedEvent.InputTuple,
      EntropyRetrievedEvent.OutputTuple,
      EntropyRetrievedEvent.OutputObject
    >;
  };
}