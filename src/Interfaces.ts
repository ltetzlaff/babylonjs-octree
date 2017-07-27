import { Vector3, Ray } from "../node_modules/babylonjs/dist/preview release/babylon.module"
import { Sphere } from "./Geometry/Sphere";

export interface IVolume {
  contains(point : Vector3) : boolean
  distanceToCenter(point : Vector3) : number
}

export interface IQueryable{
  findIntersecting(ray : Ray) : any
  findIntersecting(sphere : Sphere) : any
}