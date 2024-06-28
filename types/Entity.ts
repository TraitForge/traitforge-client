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
  price?: number;
};

export type EntityForging = Entity & {
  account: `0x${string}`;
  fee: number;
  isListed: boolean;
};
