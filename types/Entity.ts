export enum EntityRole {
  FORGER = 'Forger',
  MERGER = 'Merger',
}

export type Entity = {
  tokenId: number;
  paddedEntropy: number;
  generation: number;
  role: EntityRole;
  forgePotential: number;
  performanceFactor: number;
  nukeFactor: number;
  price: number;
  fee: number;
  isListed: boolean;
};
