import * as ReactDOM from 'react-dom/client';
import { useState, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { ErrorBoundary } from 'react-error-boundary';
import { Matrix4, Euler } from 'three';

import { Loader3DTilesR3FAsset } from './loader-3dtiles-r3f';

function App() {
  const camera = useRef(null);

  return (
    <div id="canvas-container">
      <Canvas style={{ background: '#272730' }}>
        {/* <Canvas style={{ background: '#272730' }}  camera={{ fov: 45, position: [0, 0, 0] }}> */}
        {/* <Canvas style={{ background: '#272730' }}  camera={{ fov: 45, position: [4103371.51391358, 4707583.85766857, -1237856.306154429] }}> */}
        {/* <mesh>
          <boxGeometry />
          <meshBasicMaterial color="red" />
        </mesh> */}
        {/* <mesh position={[4103371.51391358, 4707583.85766857, -1237856.306154429]}>
          <boxGeometry />
          <meshBasicMaterial color="blue" />
        </mesh> */}
        <PerspectiveCamera ref={camera}>
          {/* <PerspectiveCamera ref={camera} position={[1334910.452860931, 4138104, -4653115.0285432]}></PerspectiveCamera> */}
          {/* <OrbitControls  target={[4103371.51391358, 4707583.85766857, -1237856.306154429]} minDistance={20} maxDistance={30} /> */}
          {/* <OrbitControls target={[0, 0, 0]} minDistance={0.1} maxDistance={3000} /> */}
          <ErrorBoundary
            fallbackRender={() => (
              <mesh>
                <boxGeometry />
                <meshBasicMaterial color="pink" />
              </mesh>
            )}
          >
            <Suspense
              fallback={
                <mesh>
                  <sphereGeometry />
                  <meshBasicMaterial color="yellow" />
                </mesh>
              }
            >
              <Loader3DTilesR3FAsset
                dracoDecoderPath={'https://unpkg.com/three@0.160.0/examples/jsm/libs/draco'}
                basisTranscoderPath={'https://unpkg.com/three@0.160.0/examples/jsm/libs/basis'}
                rotation={new Euler(-Math.PI / 2, 0, 0)}
                url="http://192.168.10.123:8080/Interieur/Coupoles/3DTiles/merge_int_ext_S2_S3/tileset.json"
                // url="https://int.nyt.com/data/3dscenes/ONA360/TILESET/0731_FREEMAN_ALLEY_10M_A_36x8K__10K-PN_50P_DB/tileset_tileset.json"
                // url='/tileset_Vatican_basilique_interieur_cupola_N3_5M_4x16k.json'
                maximumScreenSpaceError={48}
                resetTransform={true}
                // orientToGeocoord={{
                //   height: 0,
                //   lat: 40.721513285585736,
                //   long: -73.99266363643088,
                // }}
              />
              <Loader3DTilesR3FAsset
                dracoDecoderPath={'https://unpkg.com/three@0.160.0/examples/jsm/libs/draco'}
                basisTranscoderPath={'https://unpkg.com/three@0.160.0/examples/jsm/libs/basis'}
                rotation={new Euler(-Math.PI / 2, 0, 0)}
                url="http://192.168.10.123:8080/Interieur/Coupoles/3DTiles/merge_int_ext_S2_S3/tileset.json"
                // url="https://int.nyt.com/data/3dscenes/ONA360/TILESET/0731_FREEMAN_ALLEY_10M_A_36x8K__10K-PN_50P_DB/tileset_tileset.json"
                // url='/tileset_Vatican_basilique_interieur_cupola_N3_5M_4x16k.json'
                // url='https://tile.googleapis.com/v1/3dtiles/root.json?key=AIzaSyD2im4uSnZQefEFJIlfSpSD39apMdiiKFE'
                maximumScreenSpaceError={48}
                resetTransform={true}
                // orientToGeocoord={{
                //   height: 0,
                //   lat: 40.721513285585736,
                //   long: -73.99266363643088,
                // }}
              />
            </Suspense>
          </ErrorBoundary>
        </PerspectiveCamera>
        <OrbitControls camera={camera.current} />
      </Canvas>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
