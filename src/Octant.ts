import { Vector3 } from "../node_modules/babylonjs/dist/preview release/babylon.module"
import { OctreeOptions } from "./OctreeOptions";
import { Box } from "./Geometry/Box";
import { IQueryable } from "./Interfaces";

export class Octant extends Box implements IQueryable {
  private static splitsInto = 8
  public children : Octant[]
  public points : Vector3[]
  public level : number
  private options : OctreeOptions

  constructor(min : Vector3, size : Vector3, level : number, options : OctreeOptions) {
    super(min, size)
    this.level = level
    this.children = []
    this.points = []
    this.options = options
  }

  findIntersecting(x : any) : Octant[] {
    const ret : Octant[] = []

    if (this.intersects(x)) {
      if (this.children.length === 0) {
        ret.push(this)
      } else {
        this.children.forEach(child => ret.push(...child.findIntersecting(x)))
      }
    }
    return ret
  }

  trySubdivide() {
    if (this.level === this.options.maxDepth || this.points.length <= this.options.bucketSize) {
      return
    }

    const power = Math.log(Octant.splitsInto)/Math.log(2) - 1
    const half = this.size.scale(.5)
    for (let x = 0; x < power; x++) {
      for (let y = 0; y < power; y++) {
        for (let z = 0; z < power; z++) {
          const offset = new Vector3(x * half.x, y * half.y, z * half.z)
          const min = this.min.add(offset)

          const octant = new Octant(min, half, this.level + 1, this.options)
          this.children.push(octant)
          this.points = this.points.filter(p => {
            if (octant.contains(p)) {
              octant.points.push(p)
              return false
            }
            return true
          })
          octant.trySubdivide()
        }
      }
    }
  }
}
