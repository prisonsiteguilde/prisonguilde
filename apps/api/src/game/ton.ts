import type { InventoryItem, NftState } from "@corsairs/shared";

export interface TonMintIntent {
  itemUid: string;
  itemId: string;
  collectionAddress: string;
  ownerAddress: string;
  metadataUri: string;
  payload: string;
}

export function createNftReservation(item: InventoryItem, collectionAddress: string): NftState {
  return {
    status: "offchain_reserved",
    collectionAddress,
    metadataUri: `ipfs://corsairs-return/${item.itemId}/${item.uid}`
  };
}

export function createMintIntent(item: InventoryItem, ownerAddress: string, collectionAddress: string): TonMintIntent {
  return {
    itemUid: item.uid,
    itemId: item.itemId,
    collectionAddress,
    ownerAddress,
    metadataUri: item.nft?.metadataUri ?? `ipfs://corsairs-return/${item.itemId}/${item.uid}`,
    payload: Buffer.from(JSON.stringify({ itemUid: item.uid, itemId: item.itemId, ownerAddress })).toString("base64url")
  };
}
