import { Item } from "@repo/rp-lib";

type ItemCardProps = {
  item: Item;
};

export function ItemCard({ item }: ItemCardProps) {
  return <>{item.name}</>;
}
