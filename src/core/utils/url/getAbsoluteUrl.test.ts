/**
 * @vitest-environment jsdom
 */
import { getAbsoluteUrl } from './getAbsoluteUrl'

it('rebases a relative URL against the current "baseURI" (default)', () => {
  expect(getAbsoluteUrl('/reviews')).toEqual('http://localhost/reviews')
})

it('rebases a relative URL against a custom base URL', () => {
  expect(getAbsoluteUrl('/user', 'https://api.github.com')).toEqual(
    'https://api.github.com/user',
  )
})

it('returns a given absolute URL as-is', () => {
  expect(getAbsoluteUrl('https://api.mswjs.io/users')).toEqual(
    'https://api.mswjs.io/users',
  )
})

it('returns an absolute URL given a relative path without a leading slash', () => {
  expect(getAbsoluteUrl('users')).toEqual('http://localhost/users')
})

it('returns a path with a pattern as-is', () => {
  expect(getAbsoluteUrl(':api/user')).toEqual('http://localhost/:api/user')
  expect(getAbsoluteUrl('*/resource/*')).toEqual('*/resource/*')
})
