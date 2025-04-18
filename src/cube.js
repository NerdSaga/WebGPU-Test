export const cubeData = {
    vertexData: new Float32Array([
        +0.5, +0.5, +0.5, +0, +0, +1, +0, +0, // +Z
        -0.5, +0.5, +0.5, +0, +0, +1, +1, +0, //
        +0.5, -0.5, +0.5, +0, +0, +1, +0, +1, //
        -0.5, -0.5, +0.5, +0, +0, +1, +1, +1, //

        -0.5, +0.5, -0.5, +0, +0, -1, +0, +0, // -Z
        +0.5, +0.5, -0.5, +0, +0, -1, +1, +0, //
        -0.5, -0.5, -0.5, +0, +0, -1, +0, +1, //
        +0.5, -0.5, -0.5, +0, +0, -1, +1, +1, //

        +0.5, +0.5, -0.5, +1, +0, +0, +0, +0, // +X
        +0.5, +0.5, +0.5, +1, +0, +0, +1, +0, //
        +0.5, -0.5, -0.5, +1, +0, +0, +0, +1, //
        +0.5, -0.5, +0.5, +1, +0, +0, +1, +1, //

        -0.5, +0.5, +0.5, -1, +0, +0, +0, +0, // -X
        -0.5, +0.5, -0.5, -1, +0, +0, +1, +0, //
        -0.5, -0.5, +0.5, -1, +0, +0, +0, +1, //
        -0.5, -0.5, -0.5, -1, +0, +0, +1, +1, //

        -0.5, +0.5, +0.5, +0, +1, +0, +0, +0, // +Y
        +0.5, +0.5, +0.5, +0, +1, +0, +1, +0, //
        -0.5, +0.5, -0.5, +0, +1, +0, +0, +1, //
        +0.5, +0.5, -0.5, +0, +1, +0, +1, +1, //

        -0.5, -0.5, -0.5, +0, -1, +0, +0, +0, // -Y
        +0.5, -0.5, -0.5, +0, -1, +0, +1, +0, //
        -0.5, -0.5, +0.5, +0, -1, +0, +0, +1, //
        +0.5, -0.5, +0.5, +0, -1, +0, +1, +1, //
    ]),

    indexData: new Uint32Array([
        0, 1, 2, 2, 1, 3,
        4, 5, 6, 6, 5, 7,
        8, 9, 10, 10, 9, 11,
        12, 13, 14, 14, 13, 15,
        16, 17, 18, 18, 17, 19,
        20, 21, 22, 22, 21, 23,
    ]),
}