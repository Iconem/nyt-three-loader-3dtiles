import { useEffect, useRef } from 'react';
import { Loader3DTiles, LoaderProps, Runtime } from 'three-loader-3dtiles';
import { useLoader, useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TilesRenderer, DebugTilesRenderer } from '3d-tiles-renderer';

export function TilesRendererR3F(props) {
  const tilesRendererRef = useRef(null);
  const groupRef = useRef(null);
  const { camera, gl } = useThree();

  useEffect(() => {
    if (!props.url) return;

    let tilesRenderer;
    if (!props.debug) tilesRenderer = new TilesRenderer(props.url);
    else {
      tilesRenderer = new DebugTilesRenderer(props.url);
      Object.entries(props.debug).forEach((entry, idx) => (tilesRenderer[entry[0]] = entry[1]));
    }
    tilesRenderer.setCamera(camera);
    tilesRenderer.setResolutionFromRenderer(camera, gl);
    tilesRenderer.addEventListener('load-tile-set', () => {});
    tilesRenderer.onLoadModel = (scene, tile) => {
      // console.log('onLoadModel', scene, tile);
      scene.traverse((child: THREE.Object3D) => {
        if ((child as THREE.Mesh).isMesh) {
          // (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({
          //   color: 0x0000ff,
          // });
          console.log(child);
        }
      });
    };

    tilesRendererRef.current = tilesRenderer;

    // sceneRef.current = tilesRenderer.group;
    groupRef.current.add(tilesRenderer.group);

    // optionally center the tile set in case it's far off center
    // tilesRenderer.group or groupRef.current
    const sphere = new THREE.Sphere();
    tilesRenderer.getBoundingSphere(sphere);
    console.log('yo sphere', sphere);
    if (props.resetTransform) {
      groupRef.current.position.copy(sphere.center).multiplyScalar(-1);
    } else if (props.matrixTransform) groupRef.current.applyMatrix4(props.matrixTransform);

    return () => {
      tilesRenderer.dispose();
      groupRef.current.remove(tilesRenderer.group);
    };
  }, []);

  useFrame(() => {
    tilesRendererRef.current?.update();
  });

  const { scene } = useThree();

  const sphere = new THREE.Sphere();
  tilesRendererRef.current?.getBoundingSphere(sphere);
  console.log('scene', scene, groupRef.current, sphere);
  return <group ref={groupRef} />;
}

class Loader3DTilesBridge extends THREE.Loader {
  props: LoaderProps;

  load(url, onLoad, onProgress, onError) {
    const loadTileset = async () => {
      try {
        const result = await Loader3DTiles.load({
          url,
          ...this.props,
          onProgress,
        });
        onLoad(result);
        // result.runtime.orientToGeocoord({
        //   height: 10,
        //   lat: 40.721513285585736,
        //   long: -73.99266363643088,
        // });
        // console.log(result);
        // result.runtime.setDebug(true)
        // result.runtime.showTiles(true);
        // result.runtime.setRenderer(this.props.renderer)
        // is not a function although is implemented in Loader3DTiles class (see https://github.com/nytimes/three-loader-3dtiles/blob/48cb4b30ce3558ad04d393bda9a1d78a50294569/src/index.ts#L616C9-L616C20)
        // result.runtime.setViewport(this.props.viewport);
      } catch (e) {
        onError(e);
      }
    };
    loadTileset();
  }
  setProps(props) {
    this.props = props;
  }
}

function Loader3DTilesR3FAsset(props) {
  const threeState = useThree();
  const loaderProps = {
    renderer: threeState.gl,
    viewport: getViewport(threeState.gl),
    options: {
      ...props,
    },
  };

  // TODO: Getting type error
  // @ts-ignore
  const { model, runtime } = useLoader(Loader3DTilesBridge, props.url, (loader: Loader3DTilesBridge) => {
    loader.setProps(loaderProps);
  });

  useFrame(({ size, camera }, dt) => {
    runtime.update(dt, camera);
  });

  return (
    <group {...props} dispose={runtime.dispose}>
      <primitive object={model} />
    </group>
  );
}
function getViewport(renderer) {
  const viewSize = renderer.getSize(new THREE.Vector2());
  return {
    width: viewSize.x,
    height: viewSize.y,
    devicePixelRatio: renderer.getPixelRatio(),
  };
}

export { Loader3DTilesR3FAsset };
