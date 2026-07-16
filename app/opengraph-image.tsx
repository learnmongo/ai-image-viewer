import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE } from '@/lib/site';
import { ImageResponse } from 'next/og';

export const alt = SITE_TITLE;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '72px 80px',
          background:
            'linear-gradient(155deg, #04060a 0%, #0a0f18 28%, #0d1524 52%, #080c14 78%, #05070c 100%)',
          color: '#ffffff',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            maxWidth: '920px',
          }}
        >
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#5eead4',
            }}
          >
            {SITE_NAME}
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            SeeMongo
          </div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 400,
              lineHeight: 1.35,
              color: 'rgba(255,255,255,0.82)',
            }}
          >
            {SITE_DESCRIPTION}
          </div>
          <div
            style={{
              marginTop: '12px',
              fontSize: 24,
              fontWeight: 500,
              color: 'rgba(255,255,255,0.55)',
            }}
          >
            LearnMongo
          </div>
        </div>
      </div>
    ),
    size,
  );
}
