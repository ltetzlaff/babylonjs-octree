import { Vector3, Ray, BoundingBox } from "../../node_modules/babylonjs/dist/preview release/babylon.module"
import { Sphere } from "./Sphere"
import { IVolume } from "../Interfaces";

export class Box implements IVolume {
  public min : Vector3
  public max : Vector3
  public size : Vector3
  public center : Vector3

  constructor(min : Vector3, size : Vector3) {
    this.max = min.add(size)
    this.min = min
    this.size = size
    this.center = min.add(size.scale(.5))
  }

  contains(p : Vector3) : boolean {
    // max - point >= min
    // Point within min and max
    const { min, max } = this
    return (p.x >= min.x && p.y >= min.y && p.z >= min.z
          && p.x <= max.x && p.y <= max.y && p.z <= max.z)
  }

  distanceToCenter(point : Vector3) : number {
    return point.subtract(this.center).lengthSquared()
  }

  intersects(x : Ray | Sphere) {
    let b = false
    if (x instanceof Ray) {
      b = (x as Ray).intersectsBoxMinMax(this.min, this.max)
    } else if (x instanceof Sphere) {
      const s = x as Sphere
      b = BoundingBox.IntersectsSphere(this.min, this.max, s.center, s.radius)
    }
    return b
  }  
}

