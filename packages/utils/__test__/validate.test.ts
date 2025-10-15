import { describe, expect, it } from 'vitest';

import * as utils from '../src/index';

describe('validate', () => {
  it('should validate phone number correctly', () => {
    expect(utils.isPhone('1239990')).toBe(false);
    expect(utils.isPhone('15019132261')).toBe(true);
    expect(utils.formatDate(15019132261)).toBe('1970-06-24');
    expect(utils.capitalize('rose')).toBe('Rose');
  });
});
