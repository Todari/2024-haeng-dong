/** @jsxImportSource @emotion/react */

import type {Preview} from '@storybook/react';
import {HDesignProvider} from '../src/components/Design';
import {css, Global} from '@emotion/react';
import {GlobalStyle} from '../src/GlobalStyle';
import {OverlayProvider} from '../src/components/Design/components/Overlay/OverlayProvider';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      defaultViewport: {
        styles: {
          width: '375px',
          height: '812px',
        },
      },
    },
    backgrounds: {
      default: 'gray',
      values: [
        {
          name: 'gray',
          value: '#f3f3f3',
        },
      ],
    },
  },
  decorators: [
    Story => {
      return (
        <div>
          <Global
            styles={[
              css`
                @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
                body {
                  font-family: 'Pretendard', sans-serif;
                }
              `,
              GlobalStyle,
            ]}
          />
          <HDesignProvider>
            <OverlayProvider>
              <Story />
            </OverlayProvider>
          </HDesignProvider>
        </div>
      );
    },
  ],
};

export default preview;
