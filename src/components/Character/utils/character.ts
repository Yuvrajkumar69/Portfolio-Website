import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () => {
    return new Promise<GLTF | null>(async (resolve, reject) => {
      try {
        let modelUrl: string | null = null;
        let isCustomGojo = false;

        // Helper to check if a valid 3D model exists and is NOT Vite's HTML fallback
        const tryLoadModel = async (url: string): Promise<string | null> => {
          try {
            const res = await fetch(url);
            const contentType = res.headers.get("content-type") || "";
            if (!res.ok || contentType.includes("text/html")) {
              return null;
            }
            const buffer = await res.arrayBuffer();
            if (buffer.byteLength >= 4) {
              const header = new Uint8Array(buffer.slice(0, 4));
              const magic = String.fromCharCode(...header);
              if (magic === "glTF" || magic.startsWith("{")) {
                return URL.createObjectURL(new Blob([buffer]));
              }
            }
            return null;
          } catch {
            return null;
          }
        };

        const customGojoUrl =
          (await tryLoadModel("/models/gojo.glb")) ||
          (await tryLoadModel("/models/gojo.gltf"));

        if (customGojoUrl) {
          modelUrl = customGojoUrl;
          isCustomGojo = true;
        } else {
          const encryptedBlob = await decryptFile(
            "/models/character.enc",
            "Character3D#@"
          );
          modelUrl = URL.createObjectURL(new Blob([encryptedBlob]));
        }

        let character: THREE.Object3D;
        loader.load(
          modelUrl,
          async (gltf) => {
            character = gltf.scene;
            await renderer.compileAsync(character, camera, scene);
            character.traverse((child: any) => {
              if (child.isMesh) {
                const mesh = child as THREE.Mesh;
                child.castShadow = true;
                child.receiveShadow = true;
                mesh.frustumCulled = true;

                // Apply professional software-engineering student / developer appearance:
                if (!isCustomGojo && mesh.material) {
                  // Clone the material to avoid mutating shared materials
                  mesh.material = (mesh.material as THREE.MeshStandardMaterial).clone();
                  const mat = mesh.material as THREE.MeshStandardMaterial;
                  const matName = mat.name || "";
                  const nodeName = child.name.toLowerCase();

                  // ── BLACK HAIR & EYEBROWS ───────────────────────────────────
                  if (
                    matName === "Material.030" ||
                    matName.toLowerCase().includes("hair") ||
                    nodeName.includes("hair") ||
                    nodeName.includes("eyebrow")
                  ) {
                    mat.color.set("#141518"); // Natural soft black hair
                    mat.roughness = 0.65;
                    mat.metalness = 0.05;
                  }

                  // ── PROFESSIONAL CLEAN DARK DEVELOPER JACKET / SHIRT ───────
                  else if (
                    matName === "Material.014" ||
                    nodeName === "body.shirt" ||
                    nodeName.includes("shirt") ||
                    nodeName.includes("jacket") ||
                    nodeName.includes("cloth")
                  ) {
                    mat.color.set("#16181f"); // Professional dark jacket/outfit
                    mat.roughness = 0.75;
                    mat.metalness = 0.05;
                  }

                  // ── PANTS (dark clean trousers) ────────────────────────────
                  else if (nodeName === "pant" || nodeName.includes("pant")) {
                    mat.color.set("#101116"); // Dark clean trousers
                    mat.roughness = 0.8;
                    mat.metalness = 0.0;
                  }

                  // ── SHOES (clean dark developer sneakers) ───────────────────
                  else if (
                    nodeName === "shoe" ||
                    nodeName === "sole" ||
                    nodeName.includes("shoe") ||
                    nodeName.includes("sole") ||
                    nodeName.includes("foot")
                  ) {
                    mat.color.set("#0d0e12");
                    mat.roughness = 0.35;
                    mat.metalness = 0.1;
                  }

                  // ── EYES (Natural medium/dark brown — no cyan/blue emissive) ─
                  else if (
                    matName.toLowerCase().includes("eye") ||
                    nodeName.includes("eye")
                  ) {
                    mat.color.set("#3e2412"); // Natural medium/dark brown
                    mat.emissive.set("#000000"); // Zero cyan glow
                    mat.emissiveIntensity = 0;
                    mat.roughness = 0.2;
                    mat.metalness = 0.05;
                  }

                  // ── SKIN (face/neck/hands/ears) ────────────────────────────
                  else if (
                    nodeName.includes("face") ||
                    nodeName === "neck" ||
                    nodeName.includes("hand") ||
                    nodeName.includes("ear") ||
                    matName === "default"
                  ) {
                    mat.color.set("#ebd2c2"); // Natural skin tone
                    mat.roughness = 0.55;
                    mat.metalness = 0.02;
                  }
                }
              }
            });
            resolve(gltf);
            setCharTimeline(character, camera);
            setAllTimeline();

            const footR = character.getObjectByName("footR");
            if (footR) footR.position.y = 3.36;
            const footL = character.getObjectByName("footL");
            if (footL) footL.position.y = 3.36;

            dracoLoader.dispose();
          },
          undefined,
          (error) => {
            console.error("Error loading GLTF model:", error);
            reject(error);
          }
        );
      } catch (err) {
        reject(err);
        console.error(err);
      }
    });
  };

  return { loadCharacter };
};

export default setCharacter;
