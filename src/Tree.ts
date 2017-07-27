import { Vector3, Ray } from "../node_modules/babylonjs/dist/preview release/babylon.module"

export enum FindingPattern { KNearest, Radius }

export interface Tree {
  children : any[]
  points : Vector3[]

  pick(ray : Ray, pattern : FindingPattern, options : any) : Vector3[]
  query(startingPoint : Vector3, pattern : FindingPattern, options : any) : Vector3[]
}