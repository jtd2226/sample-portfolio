import { ShaderMaterial } from 'three'
import { vertexShader, wavyVertexShader, trippyFragmentShader, neonColorFragmentShader } from './shaders'

export function trippyFragmentMaterial(uniforms) {
    return new ShaderMaterial({
        uniforms: uniforms,
        vertexShader: wavyVertexShader,
        fragmentShader: trippyFragmentShader
    });
}

export function neonColorChangeMaterial(uniforms) {
    return new ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader('1, 1, 1'),
        fragmentShader: neonColorFragmentShader
    });
}