export class OctreeOptions {
  public bucketSize : number
  public maxDepth : number

  constructor(bucketSize : number, maxDepth : number) {
    this.bucketSize = bucketSize
    this.maxDepth = maxDepth
  }
}