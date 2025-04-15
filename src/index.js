import { cubeData } from "./cube.js"
import { maths } from "./math.js"
import { MeshObject } from "./MeshObject.js"

const canvas = document.createElement("canvas")
document.body.appendChild(canvas)

const adapter = await navigator.gpu.requestAdapter()
const device = await adapter.requestDevice()
const context = canvas.getContext("webgpu")
const canvasFormat = navigator.gpu.getPreferredCanvasFormat()
context.configure({
    device: device,
    format: canvasFormat
})




//
// Create render pipeline.
//
const shaderFile = await fetch("assets/shader.wgsl")
const shaderSource = await shaderFile.text()
const shaderModule = device.createShaderModule({
    code: shaderSource,
})

const renderPipeline = device.createRenderPipeline({
    layout: "auto",
    vertex: {
        module: shaderModule,
        buffers: [
            {
                arrayStride: 4 * 8,
                attributes: [
                    {
                        format: "float32x3",
                        offset: 0,
                        shaderLocation: 0,
                    },
                    {
                        format: "float32x3",
                        offset: 4 * 3,
                        shaderLocation: 1,
                    },
                    {
                        format: "float32x2",
                        offset: 4 * 6,
                        shaderLocation: 2,
                    }
                ]
            }
        ],
        entryPoint: "vs_main",
    },
    fragment: {
        module: shaderModule,
        targets: [
            {
                format: canvasFormat,
            }
        ],
        entryPoint: "fs_main"
    },
    primitive: {
        topology: "triangle-list",
        cullMode: "back",
        frontFace: "cw",
    },
    depthStencil: {
        format: "depth24plus",
        depthCompare: "less",
        depthWriteEnabled: true,
        stencilReadMask: 0xff,
        stencilWriteMask: 0xff,
    }
})


//
// Create uniform buffer.
//
const uniformBuffer = device.createBuffer({
    size: 16*2*4,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
})

//
// Create textures.
//
async function loadTexture(filePath) {
    const image = new Image()
    image.src = filePath
    await image.decode()
    const bitmap = await createImageBitmap(image)

    const textureBuffer = device.createTexture({
        format: "rgba8unorm",
        size: [image.width, image.height],
        usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
    })
    device.queue.copyExternalImageToTexture(
        {source: bitmap},
        {texture: textureBuffer},
        [image.width, image.height]
    )

    return textureBuffer
}

const buddyTexture = await loadTexture("assets/buddy.png")
const mudkipTexture = await loadTexture("assets/mudkip_sit.png")

//
// Create others
//

const sampler = device.createSampler({
    minFilter: "linear",
    magFilter: "linear"
})
const bindGroup0 = device.createBindGroup({
    layout: renderPipeline.getBindGroupLayout(0),
    entries: [
        {
            binding: 0,
            resource: {
                buffer: uniformBuffer
            }
        },
        {
            binding: 1,
            resource: sampler
        },
        {
            binding: 2,
            resource: buddyTexture.createView(),
        }
    ],
})



/**
 * 
 * @param {Float32Array} vertexData 
 * @param {Uint32Array} indexData 
 * @param {GPUBindGroup} bindGroup 
 * @returns 
 */
function createMesh(vertexData, indexData, texture) {
    const mesh = new MeshObject()

    const vertexBuffer = device.createBuffer({
        size: vertexData.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    })
    device.queue.writeBuffer(vertexBuffer, 0, vertexData)

    const indexBuffer = device.createBuffer({
        size: indexData.byteLength,
        usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    })
    device.queue.writeBuffer(indexBuffer, 0, indexData)

    mesh.uniformBuffer = device.createBuffer({
        size: 4*16*2,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    })

    const bindGroup = device.createBindGroup({
        layout: renderPipeline.getBindGroupLayout(0),
        entries: [
            {
                binding: 0,
                resource: {
                    buffer: mesh.uniformBuffer
                }
            },
            {
                binding: 1,
                resource: sampler
            },
            {
                binding: 2,
                resource: texture.createView(),
            }
        ],
    })

    mesh.vertexBuffer = vertexBuffer
    mesh.indexBuffer = indexBuffer
    mesh.renderPipeline = renderPipeline
    // mesh.uniformBuffer = uniformBuffer
    mesh.bindGroup = bindGroup
    mesh.indexCount = indexData.length

    return mesh
}

/**
 * 
 * @param {GPURenderPassEncoder} renderPass 
 * @param {MeshObject} mesh 
 */
function drawMesh(renderPass, mesh) {

    const viewMatrix = maths.mat4.mulList([
        maths.mat4.createIdentity(),
        maths.mat4.createOrthographicProjection(
            1, -1,
            canvas.width / canvas.height, -(canvas.width / canvas.height),
            0.1, 100
        ),
        // maths.mat4.createRotationX(headPivot[1] * 0.01),

        // maths.mat4.createRotationY(headPivot[0] * 0.01),
        
    ])
    // console.log(headPivot)

    const modelMatrix = maths.mat4.mulList([
        maths.mat4.createIdentity(),

        maths.mat4.createTransform(
            mesh.position[0],
            mesh.position[1],
            mesh.position[2],
        ),
        maths.mat4.createRotationZ(rotX),
        maths.mat4.createRotationX(rotZ),
        maths.mat4.createRotationY(rotY),

    ])

    const uniformData = new Float32Array([
        viewMatrix,
        modelMatrix,
    ].flat())

    device.queue.writeBuffer(mesh.uniformBuffer, 0, uniformData)

    renderPass.setPipeline(mesh.renderPipeline)
    renderPass.setBindGroup(0, mesh.bindGroup)
    renderPass.setVertexBuffer(0, mesh.vertexBuffer)
    renderPass.setIndexBuffer(mesh.indexBuffer, "uint32")
    renderPass.drawIndexed(mesh.indexCount, 1, 0, 0, 0)
}


const cube1 = createMesh(cubeData.vertexData, cubeData.indexData, buddyTexture)
const cube2 = createMesh(cubeData.vertexData, cubeData.indexData, mudkipTexture)



let rotX = 0
let rotY = 0
let rotZ = 0
function draw() {

    const commandEncoder = device.createCommandEncoder()

    const renderPass = commandEncoder.beginRenderPass({
        colorAttachments: [
            {
                view: context.getCurrentTexture().createView(),
                loadOp: "clear",
                storeOp: "store",
                clearValue: {r: 0.1, g: 0.2, b: 0.3, a: 1.0}
            }
        ],
        depthStencilAttachment: {
            view: depthTexture.createView(),
            depthClearValue: 1.0,
            depthLoadOp: "clear",
            depthStoreOp: "store",
            depthReadOnly: false
        }
    })

    cube1.position[0] = -0.5
    cube1.position[1] = 0.001
    cube1.position[2] = 10

    cube2.position[0] = 0.5
    cube2.position[2] = 10

    rotX += 0.01
    rotY += 0.01
    rotZ += 0.01
    drawMesh(renderPass, cube1)
    drawMesh(renderPass, cube2)

    renderPass.end()

    const commandBuffer = commandEncoder.finish()

    device.queue.submit([commandBuffer])

    requestAnimationFrame(draw)
}



let depthTexture = device.createTexture({
    format: "depth24plus",
    size: [1, 1],
    usage: GPUTextureUsage.RENDER_ATTACHMENT
})


function onWindowResize() {
    canvas.style.width = "100%"
    canvas.style.height = "100%"
    canvas.width = window.innerWidth * window.devicePixelRatio
    canvas.height = window.innerHeight * window.devicePixelRatio

    depthTexture.destroy()
    depthTexture = device.createTexture({
        format: "depth24plus",
        size: [canvas.width, canvas.height],
        usage: GPUTextureUsage.RENDER_ATTACHMENT
    })
}
onWindowResize()
window.addEventListener("resize", onWindowResize)

let headPivot = [0, 0]
let motionX = 0
let motionY = 0
window.addEventListener("mousemove", (e) => {
    headPivot[0] += e.movementX
    headPivot[1] += e.movementY
})

draw()