export const vertexShader = (color) => `
    #include <color_vertex>
    varying vec2 v_uv;
    varying vec3 v_color;

    void main() {
        v_uv = uv;
        v_color = vec3(${color});
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
`

export const bloomFragmentShader = `
    varying vec2 v_uv;
    varying vec3 v_color;

    void main( void ) {
        vec2 uv = v_uv;
        // Zooms out by a factor of 2.0
        uv *= 2.0;
        // Shifts every axis by -1.0
        uv -= 1.0;

        // Base color for the effect
        vec3 color = v_color;

        // specify size of border. 0.0 - no border, 1.0 - border occupies the entire space
        vec2 borderSize = vec2(1.0);

        // size of rectangle in terms of uv 
        vec2 rectangleSize = vec2(1.0) - borderSize; 

        // distance field, 0.0 - point is inside rectangle, 1.0 point is on the far edge of the border.
        float distanceField = length(max(abs(uv)-rectangleSize,0.0) / borderSize);

        // calculate alpha accordingly to the value of the distance field
        float alpha = 1.0 - distanceField;

        gl_FragColor = vec4(color, alpha);    
    }
`

export const trippyFragmentShader = `
    varying vec2 v_uv;

    uniform float time;

    void main()	{

        vec2 p = - 1.0 + 2.0 * v_uv;
        float a = time * 40.0;
        float d, e, f, g = 1.0 / 40.0 ,h ,i ,r ,q;

        e = 400.0 * ( p.x * 0.5 + 0.5 );
        f = 400.0 * ( p.y * 0.5 + 0.5 );
        i = 200.0 + sin( e * g + a / 150.0 ) * 20.0;
        d = 200.0 + cos( f * g / 2.0 ) * 18.0 + cos( e * g ) * 7.0;
        r = sqrt( pow( abs( i - e ), 2.0 ) + pow( abs( d - f ), 2.0 ) );
        q = f / r;
        e = ( r * cos( q ) ) - a / 2.0;
        f = ( r * sin( q ) ) - a / 2.0;
        d = sin( e * g ) * 176.0 + sin( e * g ) * 164.0 + r;
        h = ( ( f + d ) + a / 2.0 ) * g;
        i = cos( h + r * p.x / 1.3 ) * ( e + e + a ) + cos( q * g * 6.0 ) * ( r + h / 3.0 );
        h = sin( f * g ) * 144.0 - sin( e * g ) * 212.0 * p.x;
        h = ( h + ( f - e ) * q + sin( r - ( a + h ) / 7.0 ) * 10.0 + i / 4.0 ) * g;
        i += cos( h * 2.3 * sin( a / 350.0 - q ) ) * 184.0 * sin( q - ( r * 4.3 + a / 12.0 ) * g ) + tan( r * g + h ) * 184.0 * cos( r * g + h );
        i = mod( i / 5.6, 256.0 ) / 64.0;
        if ( i < 0.0 ) i += 4.0;
        if ( i >= 2.0 ) i = 4.0 - i;
        d = r / 350.0;
        d += sin( d * d * 8.0 ) * 0.52;
        f = ( sin( a * g ) + 1.0 ) / 2.0;
        gl_FragColor = vec4( vec3( f * i / 1.6, i / 2.0 + d / 13.0, i ) * d * p.x + vec3( i / 1.3 + d / 8.0, i / 2.0 + d / 18.0, i ) * d * ( 1.0 - p.x ), 1.0 );

    }
`

export const neonColorFragmentShader = `
    uniform float time;

    varying vec2 v_uv;

    void main( void ) {

        vec2 position = - 1.0 + 2.0 * v_uv;

        float red = abs( sin( position.x * position.y + time / 5.0 ) );
        float green = abs( sin( position.x * position.y + time / 4.0 ) );
        float blue = abs( sin( position.x * position.y + time / 3.0 ) );

        vec2 uv = v_uv;
        // Zooms out by a factor of 2.0
        uv *= 2.0;
        // Shifts every axis by -1.0
        uv -= 1.0;

        // specify size of border. 0.0 - no border, 1.0 - border occupies the entire space
        vec2 borderSize = vec2(0.0);

        // size of rectangle in terms of uv 
        vec2 rectangleSize = vec2(1.0) - borderSize; 

        // distance field, 0.0 - point is inside rectangle, 1.0 point is on the far edge of the border.
        float distanceField = length(max(abs(uv)-rectangleSize,0.0) / borderSize);

        // calculate alpha accordingly to the value of the distance field
        float alpha = 1.0 - distanceField;

        gl_FragColor = vec4( red, green, blue, alpha );
    }
`

export const wavyVertexShader = (color) => `
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

    float snoise(vec3 v){ 
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

        // First corner
        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 =   v - i + dot(i, C.xxx) ;

        // Other corners
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );

        //  x0 = x0 - 0. + 0.0 * C 
        vec3 x1 = x0 - i1 + 1.0 * C.xxx;
        vec3 x2 = x0 - i2 + 2.0 * C.xxx;
        vec3 x3 = x0 - 1. + 3.0 * C.xxx;

        // Permutations
        i = mod(i, 289.0 ); 
        vec4 p = permute( permute( permute( 
                    i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

        // Gradients
        // ( N*N points uniformly over a square, mapped onto an octahedron.)
        float n_ = 1.0/7.0; // N=7
        vec3  ns = n_ * D.wyz - D.xzx;

        vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);

        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );

        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));

        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);

        //Normalise gradients
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;

        // Mix final noise value
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                        dot(p2,x2), dot(p3,x3) ) );
    }

    uniform float time;

    varying vec3 v_color;
    varying vec2 v_uv;

    void main() {
        float time = time * 0.05;
        
        float offX = position.x + sin(uv.y + time * 9.);
        float offY = position.y - time * .2 - cos(time * 2.) * 0.1;
        float nh = (snoise(vec3(offX, offY, time * .5 ) * 3.)) * .5;
        
        v_uv = uv;
        v_color = vec3(${color});

        vec4 modelViewPosition = modelViewMatrix * vec4(position.x, position.y, position.z + nh, 1.0);
        gl_Position = projectionMatrix * modelViewPosition; 
    }

`

export const instanceVertexShader = `
    precision highp float;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform float time;

    attribute float frequency;
    attribute vec3 position;
    attribute vec2 uv;
    attribute vec3 translate;
    attribute vec4 color;

    varying float vScale;
    varying vec4 vColor;
    varying float vFrequency;

    void main() {
        vec4 mvPosition = modelViewMatrix * vec4( translate, 1.0 );
        // vec3 trTime = vec3(translate.x,translate.y,translate.z);
        float scale = frequency * 0.1;
        vScale = scale;
        scale = scale + 10.0;
        float frequencyMod = sin(frequency * 10.0) + pow((frequency * 0.0295), 3.0);
        if(mvPosition.x > 0.0) {
            mvPosition.x += frequencyMod;
        } else {
            mvPosition.x -= frequencyMod;
        }
        if(mvPosition.y > 0.0) {
            mvPosition.y += frequencyMod;
        } else {
            mvPosition.y -= frequencyMod;
        }
        mvPosition.xyz += position * scale;
        vColor = color;
        vFrequency = frequency;
        gl_Position = projectionMatrix * mvPosition;
    }
`

export const instanceFragmentShader = `
    precision highp float;

    varying float vScale;
    varying vec4 vColor;
    varying float vFrequency;

    // HSL to RGB Convertion helpers
    vec3 HUEtoRGB(float H){
        H = mod(H,1.0);
        float R = abs(H * 6.0 - 3.0) - 1.0;
        float G = 2.0 - abs(H * 6.0 - 2.0);
        float B = 2.0 - abs(H * 6.0 - 4.0);
        return clamp(vec3(R,G,B),0.0,1.0);
    }

    vec3 HSLtoRGB(vec3 HSL){
        vec3 RGB = HUEtoRGB(HSL.x);
        float C = (1.0 - abs(2.0 * HSL.z - 1.0)) * HSL.y;
        return (RGB - 0.5) * C + HSL.z;
    }

    void main() {
        vec4 diffuseColor = vColor;
        gl_FragColor = vec4( diffuseColor.xyz * HSLtoRGB(vec3(vScale/5.0, 1.0, 0.5)), diffuseColor.w );

        if ( diffuseColor.w < 0.5 ) discard;
        if ( vFrequency <= 100.0 ) discard;
    }
`
export const globeFragmentShader = `
    #ifdef GL_ES
    precision mediump float;
    #endif
    uniform float time;            
    uniform float radius;

    uniform float size;            
    uniform float details;          
    varying vec3 vPosition;
    #define NUM_OCTAVES 8
    float hash(float n) { return fract(sin(n) * 1e4); }
    float hash(in vec2 _st) { return fract(sin(dot(_st.xy, vec2(12.9898,78.233)))* 43758.5453123); }
    float noise(float x) {
        float i = floor(x);
        float f = fract(x);
        float u = f * f * (3.0 - 2.0 * f);
        return mix(hash(i), hash(i + 1.0), u);
    }
    float noise(vec2 x) {
        vec2 i = floor(x);
        vec2 f = fract(x);
        // Four corners in 2D of a tile
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        // Simple 2D lerp using smoothstep envelope between the values.
        // return vec3(mix(mix(a, b, smoothstep(0.0, 1.0, f.x)),
        //			mix(c, d, smoothstep(0.0, 1.0, f.x)),
        //			smoothstep(0.0, 1.0, f.y)));
        // Same code, with the clamps in smoothstep and common subexpressions
        // optimized away.
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }
    // This one has non-ideal tiling properties that I'm still tuning
    float noise(vec3 x) {
        const vec3 step = vec3(110, 241, 171);
        vec3 i = floor(x);
        vec3 f = fract(x);

        // For performance, compute the base input to a 1D hash from the integer part of the argument and the 
        // incremental change to the 1D based on the 3D -> 1D wrapping
        float n = dot(i, step);
        vec3 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(mix( hash(n + dot(step, vec3(0, 0, 0))), hash(n + dot(step, vec3(1, 0, 0))), u.x),
                    mix( hash(n + dot(step, vec3(0, 1, 0))), hash(n + dot(step, vec3(1, 1, 0))), u.x), u.y),
                mix(mix( hash(n + dot(step, vec3(0, 0, 1))), hash(n + dot(step, vec3(1, 0, 1))), u.x),
                    mix( hash(n + dot(step, vec3(0, 1, 1))), hash(n + dot(step, vec3(1, 1, 1))), u.x), u.y), u.z);
    }
    float fbm( in vec3 x) {    
        // float G = exp2(-H);
        float f = 1.0;
        float a = 0.5;
        float t = 0.0;
        for( int i=0; i < NUM_OCTAVES; i++ ) {
            t += a*noise(vec3(f*x));
            f *= 2.0;
            a *= 0.475;
        }
        return t;
    }
    void main(void) {
        vec3 st = (vPosition.xyz / radius) * size;
        
        vec3 color = vec3(0.0);
        // First layer of warping
        vec3 q = vec3(
                fbm( st.xyz + vec3(0.01)*time ),
                fbm( st.xyz + vec3(5.2,1.3, 1.0) ),
                fbm( st.xyz + vec3(1.0, 1.0, 1.0) ) );
        // Second layer of warping
        vec3 r = vec3(
                fbm( st.xyz + details * q + vec3(1.7, 9.2, 1.0) + 0.1 * time ),
                fbm( st.xyz + details * q + vec3(8.3, 2.8, 1.0) + 0.0125 * time ),
                fbm( st.xyz + details * q + vec3(2.8, 8.3, 1.0) + 0.0125 * time ) );
        // float f = fbm(st + vec2(fbm(st + vec2(fbm(st + r)))));
        float f = fbm(st + r);
        vec3 baseColor = vec3(0.00, 0.10, 0.980);
        vec3 colorMixA = vec3(0.00, 0.09, 0.89);
        vec3 colorMixB = vec3(0.14, 0.38, 0.61);
        vec3 finalColor = vec3(1.0, 1.0, 1.0) ;
        
        color = mix(baseColor, colorMixA, clamp((f*f)*1.0,0.0,1.0));
        color = mix(color, colorMixB,clamp(length(q)*1.0,0.0,1.0));
        color = mix(color, finalColor, clamp(length(r.x)*2.0,0.0,1.0));
        gl_FragColor = vec4((f*f*f+0.5*f*f+0.5*f)*color, 1.0);
        
    }
`;