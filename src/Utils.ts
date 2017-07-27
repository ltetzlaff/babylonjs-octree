import { Vector3 } from "../node_modules/babylonjs/dist/preview release/babylon.module"

/** Retrieve minimum and maximum values for x,y,z out of
 * @param {Array<Array<Number>[3]>} points
 */
export function getExtents(vertices : Vector3[], pad? : boolean) {
  const max = new Vector3(-Infinity, -Infinity, -Infinity)
  const min = new Vector3( Infinity,  Infinity,  Infinity)

  for (let i = 0, len = vertices.length; i < len; i++) {
    const v = vertices[i]
    ;["x", "y", "z"].forEach(d => {
      if (v[d] < min[d]) min[d] = v[d]
      if (v[d] > max[d]) max[d] = v[d]
    })
  }
  if (pad) {
    const e = .02
    const padding = new Vector3(e, e, e)
    return { min: min.subtract(padding), max: max.add(padding)}
  } else {
    return { min, max }
  }
}
