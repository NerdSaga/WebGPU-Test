export const maths = {
    mat4: {

        create() {
            const mat = [
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0,
            ]

            return mat
        },

        createIdentity() {
            const mat = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1,
            ]

            return mat
        },

        /**
         * 
         * @param {number} x 
         * @param {number} y 
         * @param {number} z 
         * @returns 
         */
        createTransform(x, y, z) {
            const result = this.createIdentity()

            result[3] = x
            result[7] = y
            result[11] = z

            return result
        },

        /**
         * 
         * @param {number} rotation 
         * @returns 
         */
        createRotationX(rotation) {
            const result = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1,
            ]

            result[5] = Math.cos(rotation)
            result[6] = Math.sin(rotation)
            result[9] = -Math.sin(rotation)
            result[10] = Math.cos(rotation)

            return result
        },

        /**
         * 
         * @param {number} rotation 
         * @returns 
         */
        createRotationY(rotation) {
            const result = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1,
            ]

            result[0] = Math.cos(rotation)
            result[2] = -Math.sin(rotation)
            result[8] = Math.sin(rotation)
            result[10] = Math.cos(rotation)

            return result
        },

        createRotationZ(rotation) {
            const result = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1,
            ]

            result[0] = Math.cos(rotation)
            result[1] = -Math.sin(rotation)
            result[4] = Math.sin(rotation)
            result[5] = Math.cos(rotation)

            return result
        },

        /**
         * 
         * @param {number} x 
         * @param {number} y 
         * @param {number} z 
         * @returns 
         */
        createScale(x, y, z) {
            const result = [
                x, 0, 0, 0,
                0, y, 0, 0,
                0, 0, z, 0,
                0, 0, 0, 1,
            ]

            return result
        },

        createOrthographicProjection(t, b, r, l, n, f) {
            const result = [
                2 / (r - l), 0, 0, -(r + l) / 2,
                0, 2 / (t - b), 0, -(t + b) / 2,
                0, 0, 1 / (f - n), 1 / (f + n),
                0, 0, 0, 1,
            ]

            return result
        },

        /**
         * 
         * @param {number[]} mat1 
         * @param {number[]} mat2 
         * @returns 
         */
        mul(mat1, mat2) {
            const result = this.create()

            result[0] += mat1[0] * mat2[0]
            result[0] += mat1[1] * mat2[4]
            result[0] += mat1[2] * mat2[8]
            result[0] += mat1[3] * mat2[12]

            result[4] += mat1[4] * mat2[0]
            result[4] += mat1[5] * mat2[4]
            result[4] += mat1[6] * mat2[8]
            result[4] += mat1[7] * mat2[12]

            result[8] += mat1[8] * mat2[0]
            result[8] += mat1[9] * mat2[4]
            result[8] += mat1[10] * mat2[8]
            result[8] += mat1[11] * mat2[12]

            result[12] += mat1[12] * mat2[0]
            result[12] += mat1[13] * mat2[4]
            result[12] += mat1[14] * mat2[8]
            result[12] += mat1[15] * mat2[12]

            result[1] += mat1[0] * mat2[1]
            result[1] += mat1[1] * mat2[5]
            result[1] += mat1[2] * mat2[9]
            result[1] += mat1[3] * mat2[13]

            result[5] += mat1[4] * mat2[1]
            result[5] += mat1[5] * mat2[5]
            result[5] += mat1[6] * mat2[9]
            result[5] += mat1[7] * mat2[13]

            result[9] += mat1[8] * mat2[1]
            result[9] += mat1[9] * mat2[5]
            result[9] += mat1[10] * mat2[9]
            result[9] += mat1[11] * mat2[13]

            result[13] += mat1[12] * mat2[1]
            result[13] += mat1[13] * mat2[5]
            result[13] += mat1[14] * mat2[9]
            result[13] += mat1[15] * mat2[13]

            result[2] += mat1[0] * mat2[2]
            result[2] += mat1[1] * mat2[6]
            result[2] += mat1[2] * mat2[10]
            result[2] += mat1[3] * mat2[14]

            result[6] += mat1[4] * mat2[2]
            result[6] += mat1[5] * mat2[6]
            result[6] += mat1[6] * mat2[10]
            result[6] += mat1[7] * mat2[14]

            result[10] += mat1[8] * mat2[2]
            result[10] += mat1[9] * mat2[6]
            result[10] += mat1[10] * mat2[10]
            result[10] += mat1[11] * mat2[14]

            result[14] += mat1[12] * mat2[2]
            result[14] += mat1[13] * mat2[6]
            result[14] += mat1[14] * mat2[10]
            result[14] += mat1[15] * mat2[14]

            result[3] += mat1[0] * mat2[3]
            result[3] += mat1[1] * mat2[7]
            result[3] += mat1[2] * mat2[11]
            result[3] += mat1[3] * mat2[15]

            result[7] += mat1[4] * mat2[3]
            result[7] += mat1[5] * mat2[7]
            result[7] += mat1[6] * mat2[11]
            result[7] += mat1[7] * mat2[15]

            result[11] += mat1[8] * mat2[3]
            result[11] += mat1[9] * mat2[7]
            result[11] += mat1[10] * mat2[11]
            result[11] += mat1[11] * mat2[15]

            result[15] += mat1[12] * mat2[3]
            result[15] += mat1[13] * mat2[7]
            result[15] += mat1[14] * mat2[11]
            result[15] += mat1[15] * mat2[15]

            return result
        },

        /**
         * 
         * @param {Array<number[]>} matrixList 
         * @returns 
         */
        mulList(matrixList) {
            let mat = matrixList[0]
            for (let i = 1; i < matrixList.length; i++) {
                mat = this.mul(mat, matrixList[i])
            }

            const result = mat

            return result
        },
    }
}