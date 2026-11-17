/* eslint-disable react-refresh/only-export-components */
import type { RenderOptions } from '@testing-library/react-native';

import type { ReactElement } from 'react';
import { render, userEvent } from '@testing-library/react-native';
import '@shopify/flash-list/jestSetup';

function customRender(ui: ReactElement, options?: RenderOptions) {
  return render(ui, options);
}

// use this if you want to test user events
// Since RNTL 14 render is async: await setup(...) like await render(...).
export async function setup(ui: ReactElement, options?: RenderOptions) {
  const user = userEvent.setup();
  return {
    user,
    ...(await render(ui, options)),
  };
}

export * from '@testing-library/react-native';
export { customRender as render };
