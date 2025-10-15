import { describe, expect, test } from 'vitest';

import { render } from 'vitest-browser-vue';
import HelloWorld from '../src/HelloWorld/HelloWorld.vue';

describe('HelloWorld.vue', () => {
  test('should render correctly', async () => {
    const screen = render(HelloWorld, {
      props: { msg: 'Hello Vitest' },
    });

    screen.container.style.zoom = '2';
    const n1 = screen.getByTestId('n1');
    expect(n1.element().textContent).toBe('Hello Vitest');

    await screen.rerender({ msg: 'Hello World!!!' });
    expect(n1.element().textContent).toBe('Hello World!!!');
  });
});
