import { Vector3 } from "../../node_modules/babylonjs/dist/preview release/babylon.module"
import { IVolume } from "../Interfaces";

export class Sphere implements IVolume {
  public center : Vector3
  public radius : number

  constructor(center : Vector3, radius : number) {
    this.center = center
    this.radius = radius
  }

  contains(p : Vector3) {
    const r = this.radius
    return p.subtract(this.center).lengthSquared() <= r*r
  }

  distanceToCenter(p : Vector3) : number {
    return p.subtract(this.center).length()
  }
}
