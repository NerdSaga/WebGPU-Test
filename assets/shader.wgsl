
struct Uniforms {
    viewMatrix: mat4x4<f32>,
    modelMatrix: mat4x4<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

struct VertexIn {
    @location(0) position: vec3<f32>,
    @location(1) normal: vec3<f32>,
    @location(2) uv: vec2<f32>,
}

struct VertexOut {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
}

@group(0) @binding(1) var mySampler: sampler;
@group(0) @binding(2) var myTexture: texture_2d<f32>;


@vertex
fn vs_main(in: VertexIn) -> VertexOut {
    var out: VertexOut;
    out.position = vec4(in.position, 1.0) * uniforms.modelMatrix * uniforms.viewMatrix;
    out.uv = in.uv;
    return out;
}



@fragment
fn fs_main(in: VertexOut) -> @location(0) vec4f {


    var textureColor = textureSample(myTexture, mySampler, in.uv).xyz;
    return vec4f(
        textureColor,
        1.0
    );
}