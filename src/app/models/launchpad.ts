import { Launch } from "./launch";

export interface Launchpad {
  id: string,
  name: string,
  region: string,
  status: string,
  launches: Launch[]
}