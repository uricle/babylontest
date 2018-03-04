class App {
    engine: BABYLON.Nullable<BABYLON.Engine> = null;
    scene: BABYLON.Nullable<BABYLON.Scene> = null;
    assetManager: BABYLON.AssetsManager;
    textureTask: BABYLON.TextureAssetTask;
    loadComplete: boolean = false;
    constructor(canvas: HTMLElement) {
        this.engine = new BABYLON.Engine(<HTMLCanvasElement>canvas);
        this.scene = new BABYLON.Scene(this.engine);
        this.assetManager = new BABYLON.AssetsManager(this.scene);
        this.assetManager.onFinish = (tasks) => {
            this.loadComplete = true;
        };
        this.scene.debugLayer.show();
        this.loadResources();
        this.engine.runRenderLoop( () => {
            this.initScene();
        });
    }
    loadResources() {
        this.textureTask = this.assetManager.addTextureTask('jpg', './DemageFont.png', true, true);
        this.assetManager.load();
    }
    initScene() {
        if ( !this.loadComplete ) {
            return;
        }
        const scene = this.scene;
        // This creates and positions a free camera (non-mesh)
        const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 0, -10), scene);
        camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
        camera.orthoTop = 100;
        camera.orthoBottom = -100;
        camera.orthoLeft = -100;
        camera.orthoRight = 100;
        // This targets the camera to scene origin
        camera.setTarget(BABYLON.Vector3.Zero());

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;

        const spriteManager = new BABYLON.SpriteManager("sp", "", 100, 128, this.scene);
        (<any>spriteManager)._spriteTexture = this.textureTask.texture;
        const sprite = new BABYLON.Sprite("sprite", spriteManager);
        sprite.size = 32;
        sprite.color.set(0.5,0.5,0.5,1);
        const sprite2 = new BABYLON.Sprite("sprite", spriteManager);
        sprite2.size = 32;
        sprite2.position.set(32,0,0);

        this.engine.stopRenderLoop();
        this.engine.runRenderLoop( () => {
            this.render();
        });
    }
    render() {
        this.scene.render();
    }
    updateFunc: Function;
}

document.addEventListener('DOMContentLoaded', (e) => {
    BABYLON.Effect.ShadersStore['spritesPixelShader'] = "\r\n"+
"uniform bool alphaTest;"+
"varying vec4 vColor;"+
// Samplers
"varying vec2 vUV;"+
"uniform sampler2D diffuseSampler;"+
"const vec3 monochromeScale = vec3(0.222015,0.706655,0.071330);\r\n"+
"void main(void) {\r\n"+
"vec4 color = texture2D(diffuseSampler, vUV);\r\n"+
// grayscale
// "float r = pow(color.r,2.2)*0.222015;\r\n"+
// "float g = pow(color.g,2.2)*0.706655;\r\n"+
// "float b = pow(color.b,2.2)*0.071330;\r\n"+
// "float Y = pow(r+g+b, 1./2.2);\r\n"+
// "color = vec4(vec3(Y),color.a);\r\n"+
"   float Y = dot(color.rgb, monochromeScale);\r\n"+
"   color = vec4(vec3(Y),color.a);\r\n"+
"	if (alphaTest) "+
"	{"+
"		if (color.a < 0.95)"+
"			discard;"+
"	}"+
"	color *= vColor;\r\n"+
"	gl_FragColor = color;"+
"}";
    const canvas = document.getElementById('rednerCanvas');
    if (canvas) {
        new App(canvas);
    }
});
