// components/VizCaptureRoute.tsx
import React, { Suspense, lazy, useRef } from 'react';
import { VIZ_PARAMS } from '../lib/viz/params';

const VizCanvasLazy = lazy(
  () => import('./viz/VizCanvas').then(m => ({ default: m.VizCanvas })),
);

export function VizCaptureRoute({ id }: { id: string }) {
  const params = VIZ_PARAMS[id];
  const velocityRef = useRef(0);
  if (!params) return <div style={{ color: '#E85D3A' }}>Unknown viz id: {id}</div>;
  return (
    <div
      data-testid="viz-capture"
      style={{ width: '1200px', height: '800px', position: 'relative', background: '#0a0a0a' }}
    >
      <Suspense fallback={null}>
        <VizCanvasLazy
          params={params}
          loaded={true}
          velocityRef={velocityRef}
          onFallback={() => {}}
        />
      </Suspense>
    </div>
  );
}
