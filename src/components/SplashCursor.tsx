
import React, { useRef, useEffect } from "react";

interface SplashCursorProps {
  fullScreen?: boolean;
}

const SplashCursor: React.FC<SplashCursorProps> = ({ fullScreen = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initial configuration
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const gl = canvas.getContext("webgl2") as WebGL2RenderingContext;
    if (!gl) return;

    // Fluid simulation configuration
    const config = {
      SIM_RESOLUTION: 128,
      DYE_RESOLUTION: 1024,
      CAPTURE_RESOLUTION: 512,
      DENSITY_DISSIPATION: 1,
      VELOCITY_DISSIPATION: 0.2,
      PRESSURE: 0.8,
      PRESSURE_ITERATIONS: 20,
      CURL: 30,
      SPLAT_RADIUS: 0.25,
      SPLAT_FORCE: 6000,
      SHADING: true,
      COLORFUL: false,
      COLOR_UPDATE_SPEED: 10,
      PAUSED: false,
      BACK_COLOR: { r: 0, g: 0, b: 0 },
      TRANSPARENT: true,
    };

    // WebGL extensions
    gl.getExtension("EXT_color_buffer_float");
    gl.getExtension("OES_texture_float_linear");

    // Mouse interaction tracking
    const pointer = {
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      moved: false,
      down: false,
    };

    // Track mouse position
    function pointerMove(e: MouseEvent) {
      pointer.moved = true;
      pointer.dx = (e.clientX - pointer.x) * 5.0;
      pointer.dy = (e.clientY - pointer.y) * 5.0;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    }

    // Mouse down event
    function pointerDown(e: MouseEvent) {
      pointer.down = true;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    }

    // Mouse up event
    function pointerUp() {
      pointer.down = false;
    }

    // Utility functions
    function normalizeColor(input: { r: number; g: number; b: number }) {
      return {
        r: input.r / 255,
        g: input.g / 255,
        b: input.b / 255,
      };
    }

    // Base shaders
    const baseVertexShader = `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;
      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const blurVertexShader = `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      uniform vec2 texelSize;
      void main () {
        vUv = aPosition * 0.5 + 0.5;
        float offset = 1.33333333;
        vL = vUv - texelSize * offset;
        vR = vUv + texelSize * offset;
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const blurShader = `
      precision mediump float;
      precision mediump sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      uniform sampler2D uTexture;
      void main () {
        vec4 sum = texture2D(uTexture, vUv) * 0.29411764;
        sum += texture2D(uTexture, vL) * 0.35294117;
        sum += texture2D(uTexture, vR) * 0.35294117;
        gl_FragColor = sum;
      }
    `;

    const copyShader = `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      void main () {
        gl_FragColor = texture2D(uTexture, vUv);
      }
    `;

    const clearShader = `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;
      void main () {
        gl_FragColor = value * texture2D(uTexture, vUv);
      }
    `;

    const colorShader = `
      precision mediump float;
      uniform vec4 color;
      void main () {
        gl_FragColor = color;
      }
    `;

    const checkerboardShader = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform float aspectRatio;
      #define SCALE 25.0
      void main () {
        vec2 uv = floor(vUv * SCALE * vec2(aspectRatio, 1.0));
        float v = mod(uv.x + uv.y, 2.0);
        v = v * 0.1 + 0.8;
        gl_FragColor = vec4(vec3(v), 1.0);
      }
    `;

    const displayShaderSource = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;
      uniform sampler2D uBloom;
      uniform sampler2D uSunrays;
      uniform sampler2D uDithering;
      uniform vec2 ditherScale;
      uniform vec2 texelSize;
      vec3 linearToGamma (vec3 color) {
        color = max(color, vec3(0));
        return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));
      }
      void main () {
        vec3 c = texture2D(uTexture, vUv).rgb;
        float a = max(c.r, max(c.g, c.b));
        gl_FragColor = vec4(c, a);
      }
    `;

    const splatShader = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;
      void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
      }
    `;

    const advectionShader = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform vec2 dyeTexelSize;
      uniform float dt;
      uniform float dissipation;
      vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
        vec2 st = uv / tsize - 0.5;
        vec2 iuv = floor(st);
        vec2 fuv = fract(st);
        vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
        vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
        vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
        vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
        return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
      }
      void main () {
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        gl_FragColor = dissipation * bilerp(uSource, coord, dyeTexelSize);
        gl_FragColor.a = 1.0;
      }
    `;

    const divergenceShader = `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;
        vec2 C = texture2D(uVelocity, vUv).xy;
        if (vL.x < 0.0) { L = -C.x; }
        if (vR.x > 1.0) { R = -C.x; }
        if (vT.y > 1.0) { T = -C.y; }
        if (vB.y < 0.0) { B = -C.y; }
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `;

    const curlShader = `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }
    `;

    const vorticityShader = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;
      void main () {
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;
        vec2 vel = texture2D(uVelocity, vUv).xy;
        gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
      }
    `;

    const pressureShader = `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;
      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float C = texture2D(uPressure, vUv).x;
        float divergence = texture2D(uDivergence, vUv).x;
        float pressure = (L + R + B + T - divergence) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `;

    const gradientSubtractShader = `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity.xy -= vec2(R - L, T - B) * 0.5;
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `;

    // WebGL Program creation
    function compileShader(type: number, source: string) {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(shader);
        console.error("Could not compile shader:", info);
      }
      return shader;
    }

    function createProgram(vertexSource: string, fragmentSource: string) {
      const program = gl.createProgram()!;
      const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
      const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const info = gl.getProgramInfoLog(program);
        console.error("Could not link program:", info);
      }
      return program;
    }

    // Program cache
    const programs: Record<string, any> = {};
    const primitiveVerts = new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]);

    function createFBO(
      width: number,
      height: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ) {
      gl.activeTexture(gl.TEXTURE0);
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        internalFormat,
        width,
        height,
        0,
        format,
        type,
        null
      );

      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        0
      );
      gl.viewport(0, 0, width, height);
      gl.clear(gl.COLOR_BUFFER_BIT);

      const texelSizeX = 1.0 / width;
      const texelSizeY = 1.0 / height;

      return {
        texture,
        fbo,
        width,
        height,
        texelSizeX,
        texelSizeY,
        attach(id: number) {
          gl.activeTexture(gl.TEXTURE0 + id);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return id;
        },
      };
    }

    class GLProgram {
      uniforms: Record<string, WebGLUniformLocation | null> = {};
      program: WebGLProgram;
      vao: WebGLVertexArrayObject;
      curlLocation: WebGLUniformLocation | null = null;
      
      constructor(vertexShader: string, fragmentShader: string) {
        this.program = createProgram(vertexShader, fragmentShader);
        gl.useProgram(this.program);
        
        // Create VAO
        this.vao = gl.createVertexArray()!;
        gl.bindVertexArray(this.vao);
        
        // Load vertex data
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, primitiveVerts, gl.STATIC_DRAW);
        
        // Set up attributes
        const aPosition = gl.getAttribLocation(this.program, "aPosition");
        gl.enableVertexAttribArray(aPosition);
        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
        
        // Get uniform locations
        this.uniforms = {};
        
        const uniformCount = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformCount; i++) {
          const uniformInfo = gl.getActiveUniform(this.program, i);
          if (!uniformInfo) continue;
          this.uniforms[uniformInfo.name] = gl.getUniformLocation(this.program, uniformInfo.name);
        }
      }
      
      bind() {
        gl.useProgram(this.program);
        gl.bindVertexArray(this.vao);
      }
      
      draw() {
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
      }
    }

    // Program initialization
    programs.display = new GLProgram(baseVertexShader, displayShaderSource);
    programs.splat = new GLProgram(baseVertexShader, splatShader);
    programs.advection = new GLProgram(baseVertexShader, advectionShader);
    programs.divergence = new GLProgram(baseVertexShader, divergenceShader);
    programs.curl = new GLProgram(baseVertexShader, curlShader);
    programs.vorticity = new GLProgram(baseVertexShader, vorticityShader);
    programs.pressure = new GLProgram(baseVertexShader, pressureShader);
    programs.gradientSubtract = new GLProgram(baseVertexShader, gradientSubtractShader);
    programs.clear = new GLProgram(baseVertexShader, clearShader);
    programs.color = new GLProgram(baseVertexShader, colorShader);

    // FBO setup
    const RGB = gl.RGB;
    const RGBA = gl.RGBA;
    const FLOAT = gl.FLOAT;
    const HALF_FLOAT = gl.HALF_FLOAT;
    const LINEAR = gl.LINEAR;
    const NEAREST = gl.NEAREST;

    let dye: any;
    let velocity: any;
    let divergence: any;
    let curl: any;
    let pressure: any;
    
    function initFramebuffers() {
      const texType = HALF_FLOAT;
      const dyeRes = config.DYE_RESOLUTION;
      const simRes = config.SIM_RESOLUTION;
      
      gl.disable(gl.BLEND);
      
      // Color texture
      dye = createFBO(dyeRes, dyeRes, RGBA, RGBA, texType, LINEAR);
      
      // Velocity texture
      velocity = createFBO(simRes, simRes, RGBA, RGBA, texType, LINEAR);
      
      // Divergence texture
      divergence = createFBO(simRes, simRes, RGBA, RGBA, texType, NEAREST);
      
      // Curl texture
      curl = createFBO(simRes, simRes, RGBA, RGBA, texType, NEAREST);
      
      // Pressure texture
      pressure = createFBO(simRes, simRes, RGBA, RGBA, texType, NEAREST);
    }

    initFramebuffers();

    // Main update and render loop
    let lastUpdateTime = Date.now();
    let colorUpdateTimer = 0;

    // Generate random splat colors
    function generateColor() {
      const hue = Math.random() * 0.2 + 0.5; // Blue to purple hues (0.5 - 0.7)
      const saturation = 1.0;
      const brightness = Math.random() * 0.3 + 0.7; // Keep it fairly bright
      
      let r = 0, g = 0, b = 0;
      
      const h = ((hue % 1) + 1) % 1; 
      const s = Math.max(0, Math.min(1, saturation));
      const v = Math.max(0, Math.min(1, brightness));
      
      const i = Math.floor(h * 6);
      const f = h * 6 - i;
      const p = v * (1 - s);
      const q = v * (1 - f * s);
      const t = v * (1 - (1 - f) * s);
      
      switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
      }
      
      return { r, g, b };
    }

    function splatPointer(pointer: { x: number; y: number; dx: number; dy: number; moved: boolean }) {
      if (!pointer.moved) return;
      pointer.moved = false;
      
      const cursorX = pointer.x / canvas.width;
      const cursorY = 1.0 - pointer.y / canvas.height;
      const cursorDx = pointer.dx / canvas.width;
      const cursorDy = -pointer.dy / canvas.height;
      
      const color = generateColor();
      
      splat(cursorX, cursorY, cursorDx, cursorDy, color);
    }

    function splat(x: number, y: number, dx: number, dy: number, color: { r: number; g: number; b: number }) {
      gl.viewport(0, 0, velocity.width, velocity.height);
      programs.splat.bind();
      gl.uniform1i(programs.splat.uniforms.uTarget, velocity.attach(0));
      gl.uniform1f(programs.splat.uniforms.aspectRatio, canvas.width / canvas.height);
      gl.uniform2f(programs.splat.uniforms.point, x, y);
      gl.uniform3f(programs.splat.uniforms.color, dx, dy, 0.0);
      gl.uniform1f(programs.splat.uniforms.radius, config.SPLAT_RADIUS / 100.0);
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
      velocity.attach(0);
      
      gl.viewport(0, 0, dye.width, dye.height);
      gl.uniform1i(programs.splat.uniforms.uTarget, dye.attach(0));
      gl.uniform3f(programs.splat.uniforms.color, color.r, color.g, color.b);
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
      dye.attach(0);
    }

    function step(dt: number) {
      gl.viewport(0, 0, velocity.width, velocity.height);
      
      // Compute curl
      programs.curl.bind();
      gl.uniform1i(programs.curl.uniforms.uVelocity, velocity.attach(0));
      gl.uniform2f(programs.curl.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
      curl.attach(0);
      
      // Apply vorticity force
      programs.vorticity.bind();
      gl.uniform1i(programs.vorticity.uniforms.uVelocity, velocity.attach(0));
      gl.uniform1i(programs.vorticity.uniforms.uCurl, curl.attach(1));
      gl.uniform2f(programs.vorticity.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1f(programs.vorticity.uniforms.curl, config.CURL);
      gl.uniform1f(programs.vorticity.uniforms.dt, dt);
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
      velocity.attach(0);
      
      // Compute divergence
      programs.divergence.bind();
      gl.uniform1i(programs.divergence.uniforms.uVelocity, velocity.attach(0));
      gl.uniform2f(programs.divergence.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
      divergence.attach(0);
      
      // Clear pressure
      programs.clear.bind();
      gl.uniform1i(programs.clear.uniforms.uTexture, pressure.attach(0));
      gl.uniform1f(programs.clear.uniforms.value, 0.0);
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
      pressure.attach(0);
      
      // Solve pressure
      programs.pressure.bind();
      gl.uniform2f(programs.pressure.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(programs.pressure.uniforms.uDivergence, divergence.attach(0));
      
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(programs.pressure.uniforms.uPressure, pressure.attach(1));
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        pressure.attach(0);
      }
      
      // Subtract pressure gradient
      programs.gradientSubtract.bind();
      gl.uniform2f(programs.gradientSubtract.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(programs.gradientSubtract.uniforms.uPressure, pressure.attach(0));
      gl.uniform1i(programs.gradientSubtract.uniforms.uVelocity, velocity.attach(1));
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
      velocity.attach(0);
      
      // Advect velocity
      programs.advection.bind();
      gl.uniform2f(programs.advection.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform2f(programs.advection.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(programs.advection.uniforms.uVelocity, velocity.attach(0));
      gl.uniform1i(programs.advection.uniforms.uSource, velocity.attach(1));
      gl.uniform1f(programs.advection.uniforms.dt, dt);
      gl.uniform1f(programs.advection.uniforms.dissipation, config.VELOCITY_DISSIPATION);
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
      velocity.attach(0);
      
      // Advect dye
      gl.viewport(0, 0, dye.width, dye.height);
      gl.uniform2f(programs.advection.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform2f(programs.advection.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
      gl.uniform1i(programs.advection.uniforms.uVelocity, velocity.attach(0));
      gl.uniform1i(programs.advection.uniforms.uSource, dye.attach(1));
      gl.uniform1f(programs.advection.uniforms.dissipation, config.DENSITY_DISSIPATION);
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
      dye.attach(0);
    }

    // Main display function
    function render() {
      const width = gl.drawingBufferWidth;
      const height = gl.drawingBufferHeight;
      
      gl.viewport(0, 0, width, height);
      
      if (config.TRANSPARENT) {
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
      } else {
        const color = normalizeColor(config.BACK_COLOR);
        gl.clearColor(color.r, color.g, color.b, 1.0);
      }
      gl.clear(gl.COLOR_BUFFER_BIT);
      
      programs.display.bind();
      gl.uniform1i(programs.display.uniforms.uTexture, dye.attach(0));
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }

    // Animation loop
    function update() {
      const now = Date.now();
      const dt = Math.min((now - lastUpdateTime) / 1000, 0.016);
      lastUpdateTime = now;
      
      colorUpdateTimer += dt * config.COLOR_UPDATE_SPEED;
      
      if (!config.PAUSED) {
        step(dt);
        splatPointer(pointer);
      }
      
      render();
      requestAnimationFrame(update);
    }

    update();

    // Setup event listeners
    canvas.addEventListener("mousemove", pointerMove);
    canvas.addEventListener("mousedown", pointerDown);
    window.addEventListener("mouseup", pointerUp);
    
    // Handle window resize
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      initFramebuffers();
    }
    
    window.addEventListener("resize", resizeCanvas);
    
    // Create random splats periodically if mouse isn't moving
    if (fullScreen) {
      const autoSplatInterval = setInterval(() => {
        if (!pointer.moved && Math.random() < 0.4) { // Lower probability
          const x = Math.random();
          const y = Math.random();
          const dx = (Math.random() - 0.5) * 0.01;
          const dy = (Math.random() - 0.5) * 0.01;
          splat(x, y, dx, dy, generateColor());
        }
      }, 2000);
      
      return () => {
        clearInterval(autoSplatInterval);
        canvas.removeEventListener("mousemove", pointerMove);
        canvas.removeEventListener("mousedown", pointerDown);
        window.removeEventListener("mouseup", pointerUp);
        window.removeEventListener("resize", resizeCanvas);
      };
    }
    
    // Cleanup function
    return () => {
      canvas.removeEventListener("mousemove", pointerMove);
      canvas.removeEventListener("mousedown", pointerDown);
      window.removeEventListener("mouseup", pointerUp);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [fullScreen]);

  return (
    <canvas
      ref={canvasRef}
      className={`${fullScreen ? "fixed inset-0" : ""} w-full h-full`}
      style={{ zIndex: fullScreen ? -1 : 0, pointerEvents: "none" }}
    />
  );
};

export default SplashCursor;
