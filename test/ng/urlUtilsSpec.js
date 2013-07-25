'use strict';

describe('$$urlUtils', function() {
  describe('parse', function() {
    it('should normalize a relative url', function () {
      expect(urlResolve("foo").href).toMatch(/^https?:\/\/[^/]+\/foo$/);
    });

    it('should parse relative URL into component pieces', function () {
      var parsed = urlResolve("foo");
      expect(parsed.href).toMatch(/https?:\/\//);
      expect(parsed.protocol).toMatch(/^https?/);
      expect(parsed.host).not.toBe("");
    });

    it('should parse valid IPv6 addresses', function() {
      var match = urlResolve('http://[1234:5678:a:b:c:d:e:f]/path');

      expect(match.protocol).toBe('http');
      expect(match.host).toBe('[1234:5678:a:b:c:d:e:f]');
      expect(match.search).toBeFalsy();
      expect(match.pathname).toBe('/path');
      expect(match.hash).toBeFalsy();

      match = urlResolve('http://[::]/path');
      expect(match.host).toBe('[::]');
    });
  });

  describe('isSameOrigin', function() {
    it('should support various combinations of urls', inject(function($document) {
      expect(urlIsSameOrigin('path')).toBe(true);
      var origin = urlResolve($document[0].location.href);
      expect(urlIsSameOrigin('//' + origin.host + '/path')).toBe(true);
      // Different domain.
      expect(urlIsSameOrigin('http://example.com/path')).toBe(false);
      // Auto fill protocol.
      expect(urlIsSameOrigin('//example.com/path')).toBe(false);
      // Should not match when the ports are different.
      // This assumes that the test is *not* running on port 22 (very unlikely).
      expect(urlIsSameOrigin('//' + origin.hostname + ':22/path')).toBe(false);
    }));
  });
});
