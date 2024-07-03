import { Loader3DTiles, LoaderProps, Runtime } from 'three-loader-3dtiles';
import { useLoader, useThree, useFrame } from '@react-three/fiber';
import { Loader, Vector2 } from 'three';

class Loader3DTilesBridge extends Loader {
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
  const viewSize = renderer.getSize(new Vector2());
  return {
    width: viewSize.x,
    height: viewSize.y,
    devicePixelRatio: renderer.getPixelRatio(),
  };
}

export { Loader3DTilesR3FAsset };
