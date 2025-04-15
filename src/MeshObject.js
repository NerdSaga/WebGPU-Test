export class MeshObject {
    constructor() {
        this.position = [0, 0, 0]
        this.rotation = [0, 0, 0]
        this.scale = [1, 1, 1]
        this.vertexBuffer = null
        this.indexBuffer = null
        this.renderPipeline = null
        this.uniformBuffer = null
        this.bindGroup = null
        this.indexCount = 0
        this.uniformBuffer = null
        this.sampler = null
    }
}