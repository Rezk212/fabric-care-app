import assert from 'node:assert/strict';
import { test } from 'node:test';
import { recommendProducts } from './shopping';

const muscat = { lat: 23.588, lng: 58.3829 };

test('silk gets the delicate wash, from the nearest Muscat store that stocks it', () => {
  const picks = recommendProducts('silk', 'muscat', muscat);
  const p = picks.find((x) => x.product.id === 'p-delicate-wash');
  assert.ok(p);
  assert.equal(p!.store?.id, 's-muscat-2');
  assert.ok((p!.km ?? 0) > 0);
});

test('products with no store in the city still appear, without a store', () => {
  const picks = recommendProducts('wool', 'salalah');
  const p = picks.find((x) => x.product.id === 'p-wool-wash');
  assert.ok(p);
  assert.equal(p!.store, undefined);
});

test('unknown fabric recommends nothing rather than guessing', () => {
  assert.deepEqual(recommendProducts('unknown', 'muscat', muscat), []);
});
