export enum EntityRole {
  FORGER = 'Forger',
  MERGER = 'Merger',
}

export type Entity = {
  tokenId: number;
  paddedEntropy: string | number;
  generation: number;
  role: EntityRole;
  forgePotential: number;
  performanceFactor: number;
  nukeFactor: number;
};

export type EntityForging = Entity & {
  account: `0x${string}`;
  fee: number;
  isListed: boolean;
};

export type EntityTrading = Entity & {
  seller: `0x${string}`;
  price: number;
  isActive: boolean;
};
