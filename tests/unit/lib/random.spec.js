import { randomRange } from 'Libs/random';

describe('lib/random.js', () => { 
    it.each([
        [0,10], [2,7], [3, 9]
    ])('can generate a number within a given range.', (min, max) => { 
       const val = randomRange(min, max);
       expect(val).toBeGreaterThanOrEqual(min);
       expect(val).toBeLessThanOrEqual(max); 
    });
});