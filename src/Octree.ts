import { Vector3, Mesh, Material, Scene, MeshBuilder, Ray } from "../node_modules/babylonjs/dist/preview release/babylon.module"
import { Tree, FindingPattern } from "./Tree"
import { Octant } from "./Octant"
import { OctreeOptions } from "./OctreeOptions"
import { getExtents } from "./Utils";
import { Sphere } from "./Geometry/Sphere";

export class Octree extends Octant implements Tree {
  public visualization : Mesh[]

  constructor(vertices : Vector3[], options : OctreeOptions) {
    let { min, max } = getExtents(vertices, true)
    super(min, max.subtract(min), 0, options)

    this.visualization = []
    this.points = vertices
    this.trySubdivide()
  }

  visualize(mat : Material, scene: Scene) : void {
    const viz = (octant : Octant) => {
      const s = octant.size
      // This can be optimized by instancing
      const b = MeshBuilder.CreateBox("octant lv" + octant.level,
        { width: s.x, height: s.y, depth: s.z }, scene)
      b.setAbsolutePosition(octant.center)
      b.material = mat
      this.visualization.push(b)

      // recurse
      octant.children.forEach(child => viz(child))
    }
    viz(this)
  }

  destroy() {
    this.visualization.forEach(m => m.dispose())
    this.visualization = []    
  }

  pick(ray : Ray, pattern : FindingPattern, options : any) : Vector3[] {
    //console.time("  - finding Start")
    const hitOctants = this.findIntersecting(ray)
    if (!hitOctants) return [] // no octant hit

    const startingPointOctants = hitOctants
      .map(octant => ({ r: octant.distanceToCenter(ray.origin), octant }))
      .sort((o1, o2) => o1.r - o2.r)
      .map(o => o.octant)

    const e = .01
    const epsilon = new Vector3(e, e, e)

    let startingPoint : Vector3 = Vector3.Zero()
    const foundStartingPoint = startingPointOctants.some(octant => {
      const foundInOctant = octant.points.find(p => {
        return ray.intersectsBoxMinMax(p.subtract(epsilon), p.add(epsilon))
      })
      if (!foundInOctant) return false
      startingPoint = foundInOctant
      return true
    })

    //console.timeEnd("  - finding Start")
    if (!foundStartingPoint) return [] // no direct box hit
    return this.query(startingPoint, pattern, options)
  }

  query(startingPoint : Vector3, pattern : FindingPattern, options : any) : Vector3[] {
    if (pattern === FindingPattern.KNearest) {
      options.radius = Number.MAX_VALUE // knearest just needs a point
    }

    let intersectedOctants : Octant[] = []
    const volume = new Sphere(startingPoint, options.radius)
    intersectedOctants = this.findIntersecting(volume)

    //console.time("  - finding Query")
    let candidates : Vector3[] = []
    switch (pattern) {
      case FindingPattern.KNearest:
        intersectedOctants.forEach(octant => {
          candidates.push(...octant.points)            
        })
        candidates = candidates
          .sort((a, b) => volume.distanceToCenter(a) - volume.distanceToCenter(b))
          .slice(0, options.k)
        break
      case FindingPattern.Radius:
        intersectedOctants.forEach(octant => {
          octant.points.forEach(p => {
            if (volume.contains(p)) candidates.push(p)
          })
        })
        candidates = candidates
          .sort((a, b) => volume.distanceToCenter(a) - volume.distanceToCenter(b))          
        break
    }
    //console.timeEnd("  - finding Query")
    return candidates
  }
}