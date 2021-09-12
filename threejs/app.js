import * as THREE from "./threejs/three.module.js";
import { FBXLoader } from "./threejs/FBXLoader.js";

class App {
	constructor() {
		const divContainer = document.querySelector("#webgl-container");
		this._divContainer = divContainer;

		const renderer = new THREE.WebGL1Renderer({ antialias: true, alpha: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		divContainer.appendChild(renderer.domElement);
		this._renderer = renderer;

		const scene = new THREE.Scene();
		this._scene = scene;

		this._setupCamera();
		this._setupLight();
		this._setupModel();

		window.onresize = this.resize.bind(this);
		this.resize();

		requestAnimationFrame(this.render.bind(this));
	}

	_setupCamera() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;
		const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
		camera.position.z = 2;
		this._camera = camera;
	}

	_setupLight() {
		const color = 0xffffff;
		const intensity = 1;
		const light = new THREE.DirectionalLight(color, intensity);
		light.position.set(-1, 2, 4);
		this._scene.add(light);
	}

	_setupModel() {
		const loader = new FBXLoader();

		loader.load("./asset/Arrow.fbx", (object) => {
			this._scene.add(object);
			this._arrow = object;
			object.rotation.set(0, 0, 0);
		});
	}

	resize() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;

		this._camera.aspect = width / height;
		this._camera.updateProjectionMatrix();

		this._renderer.setSize(width, height);
	}

	render(time) {
		this._renderer.render(this._scene, this._camera);
		this.update(time);
		requestAnimationFrame(this.render.bind(this));
	}

	update(time) {
		time *= 0.001;
		if (this._arrow) {
			this._arrow.rotation.y = time;
		}

		window.addEventListener("deviceorientation", (event) => {
			this._camera.rotation.x = (event.beta * Math.PI) / 180;
			this._camera.rotation.y = (event.gamma * Math.PI) / 180;
			this._camera.rotation.z = (event.alpha * Math.PI) / 180;
		});
	}
}

window.onload = function () {
	new App();
};
