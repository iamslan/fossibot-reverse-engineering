
function getWriteModbus(address, feature, value) {
  const a = intToHighLow(value);
  return aa(address, feature, [a.high, a.low], !1);
}
function getReadModbus(address, count) {
  return ia(address, 0, count, !1);
}
function highLowToInt(e) {
  return ((255 & e.high) << 8) | (255 & e.low);
}
function intToHighLow(e) {
  return { low: 255 & e, high: (e >>> 8) & 255 };
}
function ia(e, t, n, o) {
  const r = zi(t),
    i = 255 & n,
    a = n >>> 8;
  return sa(e, 3, [r.high, r.low, a, i], o);
}
function aa(e, t, n, o) {
  const r = zi(t);
  return sa(e, 6, [r.high, r.low, ...n], o);
}
function sa(e, t, n, o) {
  const r = [e, t, ...n],
    i = zi(ta(r));
  return o ? r.push(i.low, i.high) : r.push(i.high, i.low), r;
}

function ta(e) {
  let t = 65535;
  for (let n = 0; n < e.length; n++) {
    t ^= e[n];
    for (let e = 0; e < 8; e++) 1 & t ? (t = (t >> 1) ^ 40961) : (t >>= 1);
  }
  return 65535 & t;
}

function zi(e) {
  return { low: 255 & e, high: (e >>> 8) & 255 };
}

function sa(e, t, n, o) {
  const r = [e, t, ...n],
    i = zi(ta(r));
  return o ? r.push(i.low, i.high) : r.push(i.high, i.low), r;
}

function oe(e, t, n) {
    return (
      e(
        (n = {
          path: t,
          exports: {},
          require: function (e, t) {
            return (function () {
              throw new Error(
                "Dynamic requires are not currently supported by @rollup/plugin-commonjs"
              );
            })(null == t && n.path);
          },
        }),
        n.exports
      ),
      n.exports
    );
  }
  
var re = oe(function (e, t) {
    var n;
    e.exports =
      ((n =
        n ||
        (function (e, t) {
          var n =
              Object.create ||
              (function () {
                function e() {}
                return function (t) {
                  var n;
                  return (
                    (e.prototype = t),
                    (n = new e()),
                    (e.prototype = null),
                    n
                  );
                };
              })(),
            o = {},
            r = (o.lib = {}),
            i = (r.Base = {
              extend: function (e) {
                var t = n(this);
                return (
                  e && t.mixIn(e),
                  (t.hasOwnProperty("init") && this.init !== t.init) ||
                    (t.init = function () {
                      t.$super.init.apply(this, arguments);
                    }),
                  (t.init.prototype = t),
                  (t.$super = this),
                  t
                );
              },
              create: function () {
                var e = this.extend();
                return e.init.apply(e, arguments), e;
              },
              init: function () {},
              mixIn: function (e) {
                for (var t in e) e.hasOwnProperty(t) && (this[t] = e[t]);
                e.hasOwnProperty("toString") &&
                  (this.toString = e.toString);
              },
              clone: function () {
                return this.init.prototype.extend(this);
              },
            }),
            a = (r.WordArray = i.extend({
              init: function (e, t) {
                (e = this.words = e || []),
                  (this.sigBytes = null != t ? t : 4 * e.length);
              },
              toString: function (e) {
                return (e || c).stringify(this);
              },
              concat: function (e) {
                var t = this.words,
                  n = e.words,
                  o = this.sigBytes,
                  r = e.sigBytes;
                if ((this.clamp(), o % 4))
                  for (var i = 0; i < r; i++) {
                    var a = (n[i >>> 2] >>> (24 - (i % 4) * 8)) & 255;
                    t[(o + i) >>> 2] |= a << (24 - ((o + i) % 4) * 8);
                  }
                else
                  for (i = 0; i < r; i += 4) t[(o + i) >>> 2] = n[i >>> 2];
                return (this.sigBytes += r), this;
              },
              clamp: function () {
                var t = this.words,
                  n = this.sigBytes;
                (t[n >>> 2] &= 4294967295 << (32 - (n % 4) * 8)),
                  (t.length = e.ceil(n / 4));
              },
              clone: function () {
                var e = i.clone.call(this);
                return (e.words = this.words.slice(0)), e;
              },
              random: function (t) {
                for (
                  var n,
                    o = [],
                    r = function (t) {
                      var n = 987654321,
                        o = 4294967295;
                      return function () {
                        var r =
                          (((n = (36969 * (65535 & n) + (n >> 16)) & o) <<
                            16) +
                            (t = (18e3 * (65535 & t) + (t >> 16)) & o)) &
                          o;
                        return (
                          (r /= 4294967296),
                          (r += 0.5) * (e.random() > 0.5 ? 1 : -1)
                        );
                      };
                    },
                    i = 0;
                  i < t;
                  i += 4
                ) {
                  var s = r(4294967296 * (n || e.random()));
                  (n = 987654071 * s()), o.push((4294967296 * s()) | 0);
                }
                return new a.init(o, t);
              },
            })),
            s = (o.enc = {}),
            c = (s.Hex = {
              stringify: function (e) {
                for (
                  var t = e.words, n = e.sigBytes, o = [], r = 0;
                  r < n;
                  r++
                ) {
                  var i = (t[r >>> 2] >>> (24 - (r % 4) * 8)) & 255;
                  o.push((i >>> 4).toString(16)),
                    o.push((15 & i).toString(16));
                }
                return o.join("");
              },
              parse: function (e) {
                for (var t = e.length, n = [], o = 0; o < t; o += 2)
                  n[o >>> 3] |=
                    parseInt(e.substr(o, 2), 16) << (24 - (o % 8) * 4);
                return new a.init(n, t / 2);
              },
            }),
            l = (s.Latin1 = {
              stringify: function (e) {
                for (
                  var t = e.words, n = e.sigBytes, o = [], r = 0;
                  r < n;
                  r++
                ) {
                  var i = (t[r >>> 2] >>> (24 - (r % 4) * 8)) & 255;
                  o.push(String.fromCharCode(i));
                }
                return o.join("");
              },
              parse: function (e) {
                for (var t = e.length, n = [], o = 0; o < t; o++)
                  n[o >>> 2] |=
                    (255 & e.charCodeAt(o)) << (24 - (o % 4) * 8);
                return new a.init(n, t);
              },
            }),
            u = (s.Utf8 = {
              stringify: function (e) {
                try {
                  return decodeURIComponent(escape(l.stringify(e)));
                } catch (t) {
                  throw new Error("Malformed UTF-8 data");
                }
              },
              parse: function (e) {
                return l.parse(unescape(encodeURIComponent(e)));
              },
            }),
            d = (r.BufferedBlockAlgorithm = i.extend({
              reset: function () {
                (this._data = new a.init()), (this._nDataBytes = 0);
              },
              _append: function (e) {
                "string" == typeof e && (e = u.parse(e)),
                  this._data.concat(e),
                  (this._nDataBytes += e.sigBytes);
              },
              _process: function (t) {
                var n = this._data,
                  o = n.words,
                  r = n.sigBytes,
                  i = this.blockSize,
                  s = r / (4 * i),
                  c =
                    (s = t
                      ? e.ceil(s)
                      : e.max((0 | s) - this._minBufferSize, 0)) * i,
                  l = e.min(4 * c, r);
                if (c) {
                  for (var u = 0; u < c; u += i) this._doProcessBlock(o, u);
                  var d = o.splice(0, c);
                  n.sigBytes -= l;
                }
                return new a.init(d, l);
              },
              clone: function () {
                var e = i.clone.call(this);
                return (e._data = this._data.clone()), e;
              },
              _minBufferSize: 0,
            }));
          r.Hasher = d.extend({
            cfg: i.extend(),
            init: function (e) {
              (this.cfg = this.cfg.extend(e)), this.reset();
            },
            reset: function () {
              d.reset.call(this), this._doReset();
            },
            update: function (e) {
              return this._append(e), this._process(), this;
            },
            finalize: function (e) {
              return e && this._append(e), this._doFinalize();
            },
            blockSize: 16,
            _createHelper: function (e) {
              return function (t, n) {
                return new e.init(n).finalize(t);
              };
            },
            _createHmacHelper: function (e) {
              return function (t, n) {
                return new p.HMAC.init(e, n).finalize(t);
              };
            },
          });
          var p = (o.algo = {});
          return o;
        })(Math)),
      n);
  }),
  ie = re,
  ae =
    (oe(function (e, t) {
      var n;
      e.exports =
        ((n = ie),
        (function (e) {
          var t = n,
            o = t.lib,
            r = o.WordArray,
            i = o.Hasher,
            a = t.algo,
            s = [];
          !(function () {
            for (var t = 0; t < 64; t++)
              s[t] = (4294967296 * e.abs(e.sin(t + 1))) | 0;
          })();
          var c = (a.MD5 = i.extend({
            _doReset: function () {
              this._hash = new r.init([
                1732584193, 4023233417, 2562383102, 271733878,
              ]);
            },
            _doProcessBlock: function (e, t) {
              for (var n = 0; n < 16; n++) {
                var o = t + n,
                  r = e[o];
                e[o] =
                  (16711935 & ((r << 8) | (r >>> 24))) |
                  (4278255360 & ((r << 24) | (r >>> 8)));
              }
              var i = this._hash.words,
                a = e[t + 0],
                c = e[t + 1],
                f = e[t + 2],
                h = e[t + 3],
                m = e[t + 4],
                g = e[t + 5],
                v = e[t + 6],
                y = e[t + 7],
                _ = e[t + 8],
                b = e[t + 9],
                w = e[t + 10],
                k = e[t + 11],
                S = e[t + 12],
                E = e[t + 13],
                T = e[t + 14],
                C = e[t + 15],
                x = i[0],
                A = i[1],
                I = i[2],
                B = i[3];
              (x = l(x, A, I, B, a, 7, s[0])),
                (B = l(B, x, A, I, c, 12, s[1])),
                (I = l(I, B, x, A, f, 17, s[2])),
                (A = l(A, I, B, x, h, 22, s[3])),
                (x = l(x, A, I, B, m, 7, s[4])),
                (B = l(B, x, A, I, g, 12, s[5])),
                (I = l(I, B, x, A, v, 17, s[6])),
                (A = l(A, I, B, x, y, 22, s[7])),
                (x = l(x, A, I, B, _, 7, s[8])),
                (B = l(B, x, A, I, b, 12, s[9])),
                (I = l(I, B, x, A, w, 17, s[10])),
                (A = l(A, I, B, x, k, 22, s[11])),
                (x = l(x, A, I, B, S, 7, s[12])),
                (B = l(B, x, A, I, E, 12, s[13])),
                (I = l(I, B, x, A, T, 17, s[14])),
                (x = u(
                  x,
                  (A = l(A, I, B, x, C, 22, s[15])),
                  I,
                  B,
                  c,
                  5,
                  s[16]
                )),
                (B = u(B, x, A, I, v, 9, s[17])),
                (I = u(I, B, x, A, k, 14, s[18])),
                (A = u(A, I, B, x, a, 20, s[19])),
                (x = u(x, A, I, B, g, 5, s[20])),
                (B = u(B, x, A, I, w, 9, s[21])),
                (I = u(I, B, x, A, C, 14, s[22])),
                (A = u(A, I, B, x, m, 20, s[23])),
                (x = u(x, A, I, B, b, 5, s[24])),
                (B = u(B, x, A, I, T, 9, s[25])),
                (I = u(I, B, x, A, h, 14, s[26])),
                (A = u(A, I, B, x, _, 20, s[27])),
                (x = u(x, A, I, B, E, 5, s[28])),
                (B = u(B, x, A, I, f, 9, s[29])),
                (I = u(I, B, x, A, y, 14, s[30])),
                (x = d(
                  x,
                  (A = u(A, I, B, x, S, 20, s[31])),
                  I,
                  B,
                  g,
                  4,
                  s[32]
                )),
                (B = d(B, x, A, I, _, 11, s[33])),
                (I = d(I, B, x, A, k, 16, s[34])),
                (A = d(A, I, B, x, T, 23, s[35])),
                (x = d(x, A, I, B, c, 4, s[36])),
                (B = d(B, x, A, I, m, 11, s[37])),
                (I = d(I, B, x, A, y, 16, s[38])),
                (A = d(A, I, B, x, w, 23, s[39])),
                (x = d(x, A, I, B, E, 4, s[40])),
                (B = d(B, x, A, I, a, 11, s[41])),
                (I = d(I, B, x, A, h, 16, s[42])),
                (A = d(A, I, B, x, v, 23, s[43])),
                (x = d(x, A, I, B, b, 4, s[44])),
                (B = d(B, x, A, I, S, 11, s[45])),
                (I = d(I, B, x, A, C, 16, s[46])),
                (x = p(
                  x,
                  (A = d(A, I, B, x, f, 23, s[47])),
                  I,
                  B,
                  a,
                  6,
                  s[48]
                )),
                (B = p(B, x, A, I, y, 10, s[49])),
                (I = p(I, B, x, A, T, 15, s[50])),
                (A = p(A, I, B, x, g, 21, s[51])),
                (x = p(x, A, I, B, S, 6, s[52])),
                (B = p(B, x, A, I, h, 10, s[53])),
                (I = p(I, B, x, A, w, 15, s[54])),
                (A = p(A, I, B, x, c, 21, s[55])),
                (x = p(x, A, I, B, _, 6, s[56])),
                (B = p(B, x, A, I, C, 10, s[57])),
                (I = p(I, B, x, A, v, 15, s[58])),
                (A = p(A, I, B, x, E, 21, s[59])),
                (x = p(x, A, I, B, m, 6, s[60])),
                (B = p(B, x, A, I, k, 10, s[61])),
                (I = p(I, B, x, A, f, 15, s[62])),
                (A = p(A, I, B, x, b, 21, s[63])),
                (i[0] = (i[0] + x) | 0),
                (i[1] = (i[1] + A) | 0),
                (i[2] = (i[2] + I) | 0),
                (i[3] = (i[3] + B) | 0);
            },
            _doFinalize: function () {
              var t = this._data,
                n = t.words,
                o = 8 * this._nDataBytes,
                r = 8 * t.sigBytes;
              n[r >>> 5] |= 128 << (24 - (r % 32));
              var i = e.floor(o / 4294967296),
                a = o;
              (n[15 + (((r + 64) >>> 9) << 4)] =
                (16711935 & ((i << 8) | (i >>> 24))) |
                (4278255360 & ((i << 24) | (i >>> 8)))),
                (n[14 + (((r + 64) >>> 9) << 4)] =
                  (16711935 & ((a << 8) | (a >>> 24))) |
                  (4278255360 & ((a << 24) | (a >>> 8)))),
                (t.sigBytes = 4 * (n.length + 1)),
                this._process();
              for (var s = this._hash, c = s.words, l = 0; l < 4; l++) {
                var u = c[l];
                c[l] =
                  (16711935 & ((u << 8) | (u >>> 24))) |
                  (4278255360 & ((u << 24) | (u >>> 8)));
              }
              return s;
            },
            clone: function () {
              var e = i.clone.call(this);
              return (e._hash = this._hash.clone()), e;
            },
          }));
          function l(e, t, n, o, r, i, a) {
            var s = e + ((t & n) | (~t & o)) + r + a;
            return ((s << i) | (s >>> (32 - i))) + t;
          }
          function u(e, t, n, o, r, i, a) {
            var s = e + ((t & o) | (n & ~o)) + r + a;
            return ((s << i) | (s >>> (32 - i))) + t;
          }
          function d(e, t, n, o, r, i, a) {
            var s = e + (t ^ n ^ o) + r + a;
            return ((s << i) | (s >>> (32 - i))) + t;
          }
          function p(e, t, n, o, r, i, a) {
            var s = e + (n ^ (t | ~o)) + r + a;
            return ((s << i) | (s >>> (32 - i))) + t;
          }
          (t.MD5 = i._createHelper(c)),
            (t.HmacMD5 = i._createHmacHelper(c));
        })(Math),
        n.MD5);
    }),
    oe(function (e, t) {
      var n, o, r;
      e.exports =
        ((o = (n = ie).lib.Base),
        (r = n.enc.Utf8),
        void (n.algo.HMAC = o.extend({
          init: function (e, t) {
            (e = this._hasher = new e.init()),
              "string" == typeof t && (t = r.parse(t));
            var n = e.blockSize,
              o = 4 * n;
            t.sigBytes > o && (t = e.finalize(t)), t.clamp();
            for (
              var i = (this._oKey = t.clone()),
                a = (this._iKey = t.clone()),
                s = i.words,
                c = a.words,
                l = 0;
              l < n;
              l++
            )
              (s[l] ^= 1549556828), (c[l] ^= 909522486);
            (i.sigBytes = a.sigBytes = o), this.reset();
          },
          reset: function () {
            var e = this._hasher;
            e.reset(), e.update(this._iKey);
          },
          update: function (e) {
            return this._hasher.update(e), this;
          },
          finalize: function (e) {
            var t = this._hasher,
              n = t.finalize(e);
            return t.reset(), t.finalize(this._oKey.clone().concat(n));
          },
        })));
    }),
    oe(function (e, t) {
      e.exports = ie.HmacMD5;
    })),
  se = oe(function (e, t) {
    e.exports = ie.enc.Utf8;
  }),
  ce = oe(function (e, t) {
    var n, o, r;
    e.exports =
      ((r = (o = n = ie).lib.WordArray),
      (o.enc.Base64 = {
        stringify: function (e) {
          var t = e.words,
            n = e.sigBytes,
            o = this._map;
          e.clamp();
          for (var r = [], i = 0; i < n; i += 3)
            for (
              var a =
                  (((t[i >>> 2] >>> (24 - (i % 4) * 8)) & 255) << 16) |
                  (((t[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) &
                    255) <<
                    8) |
                  ((t[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 255),
                s = 0;
              s < 4 && i + 0.75 * s < n;
              s++
            )
              r.push(o.charAt((a >>> (6 * (3 - s))) & 63));
          var c = o.charAt(64);
          if (c) for (; r.length % 4; ) r.push(c);
          return r.join("");
        },
        parse: function (e) {
          var t = e.length,
            n = this._map,
            o = this._reverseMap;
          if (!o) {
            o = this._reverseMap = [];
            for (var i = 0; i < n.length; i++) o[n.charCodeAt(i)] = i;
          }
          var a = n.charAt(64);
          if (a) {
            var s = e.indexOf(a);
            -1 !== s && (t = s);
          }
          return (function (e, t, n) {
            for (var o = [], i = 0, a = 0; a < t; a++)
              if (a % 4) {
                var s = n[e.charCodeAt(a - 1)] << ((a % 4) * 2),
                  c = n[e.charCodeAt(a)] >>> (6 - (a % 4) * 2);
                (o[i >>> 2] |= (s | c) << (24 - (i % 4) * 8)), i++;
              }
            return r.create(o, i);
          })(e, t, o);
        },
        _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
      }),
      n.enc.Base64);
  });
var rt = function (e, t) {
    let n = "";
    return (
      Object.keys(e)
        .sort()
        .forEach(function (t) {
          e[t] && (n = n + "&" + t + "=" + e[t]);
        }),
      (n = n.slice(1)),
      ae(n, t).toString()
    );
  },
  it = function (e, t) {
    return new Promise((n, o) => {
      t(
        Object.assign(e, {
          complete(e) {
            e || (e = {});
            const t =
              (e.data &&
                e.data.header &&
                e.data.header["x-serverless-request-id"]) ||
              (e.header && e.header["request-id"]);
            if (!e.statusCode || e.statusCode >= 400) {
              const n =
                  (e.data && e.data.error && e.data.error.code) ||
                  "SYS_ERR",
                r =
                  (e.data && e.data.error && e.data.error.message) ||
                  e.errMsg ||
                  "request:fail";
              return o(new Ke({ code: n, message: r, requestId: t }));
            }
            const r = e.data;
            if (r.error)
              return o(
                new Ke({
                  code: r.error.code,
                  message: r.error.message,
                  requestId: t,
                })
              );
            (r.result = r.data), (r.requestId = t), delete r.data, n(r);
          },
        })
      );
    });
  },
  at = function (e) {
    return ce.stringify(se.parse(e));
  },
  st = class {
    constructor(e) {
      ["spaceId", "clientSecret"].forEach((t) => {
        if (!Object.prototype.hasOwnProperty.call(e, t))
          throw new Error(`${t} required`);
      }),
        (this.config = Object.assign(
          {},
          {
            endpoint:
              0 === e.spaceId.indexOf("mp-")
                ? "https://api.next.bspapp.com"
                : "https://api.bspapp.com",
          },
          e
        )),
        (this.config.provider = "aliyun"),
        (this.config.requestUrl = this.config.endpoint + "/client"),
        (this.config.envType = this.config.envType || "public"),
        (this.config.accessTokenKey =
          "access_token_" + this.config.spaceId),
        (this.adapter = We),
        (this._getAccessTokenPromiseHub = new ye({
          createPromise: () =>
            this.requestAuth(
              this.setupRequest(
                {
                  method: "serverless.auth.user.anonymousAuthorize",
                  params: "{}",
                },
                "auth"
              )
            ).then((e) => {
              if (!e.result || !e.result.accessToken)
                throw new Ke({
                  code: "AUTH_FAILED",
                  message: "获取accessToken失败",
                });
              this.setAccessToken(e.result.accessToken);
            }),
          retryRule: ve,
        }));
    }
    get hasAccessToken() {
      return !!this.accessToken;
    }
    setAccessToken(e) {
      this.accessToken = e;
    }
    requestWrapped(e) {
      return it(e, this.adapter.request);
    }
    requestAuth(e) {
      return this.requestWrapped(e);
    }
    request(e, t) {
      return Promise.resolve().then(() =>
        this.hasAccessToken
          ? t
            ? this.requestWrapped(e)
            : this.requestWrapped(e).catch((t) =>
                new Promise((e, n) => {
                  !t ||
                  ("GATEWAY_INVALID_TOKEN" !== t.code &&
                    "InvalidParameter.InvalidToken" !== t.code)
                    ? n(t)
                    : e();
                })
                  .then(() => this.getAccessToken())
                  .then(() => {
                    const t = this.rebuildRequest(e);
                    return this.request(t, !0);
                  })
              )
          : this.getAccessToken().then(() => {
              const t = this.rebuildRequest(e);
              return this.request(t, !0);
            })
      );
    }
    rebuildRequest(e) {
      const t = Object.assign({}, e);
      return (
        (t.data.token = this.accessToken),
        (t.header["x-basement-token"] = this.accessToken),
        (t.header["x-serverless-sign"] = rt(
          t.data,
          this.config.clientSecret
        )),
        t
      );
    }
    setupRequest(e, t) {
      const n = Object.assign({}, e, {
          spaceId: this.config.spaceId,
          timestamp: Date.now(),
        }),
        o = { "Content-Type": "application/json" };
      return (
        "auth" !== t &&
          ((n.token = this.accessToken),
          (o["x-basement-token"] = this.accessToken)),
        (o["x-serverless-sign"] = rt(n, this.config.clientSecret)),
        {
          url: this.config.requestUrl,
          method: "POST",
          data: n,
          dataType: "json",
          header: o,
        }
      );
    }
    getAccessToken() {
      return this._getAccessTokenPromiseHub.exec();
    }
    async authorize() {
      await this.getAccessToken();
    }
    callFunction(e) {
      const t = {
        method: "serverless.function.runtime.invoke",
        params: JSON.stringify({
          functionTarget: e.name,
          functionArgs: e.data || {},
        }),
      };
      return this.request(this.setupRequest(t));
    }
    getOSSUploadOptionsFromPath(e) {
      const t = {
        method: "serverless.file.resource.generateProximalSign",
        params: JSON.stringify(e),
      };
      return this.request(this.setupRequest(t));
    }
    uploadFileToOSS({
      url: e,
      formData: t,
      name: n,
      filePath: o,
      fileType: r,
      onUploadProgress: i,
    }) {
      return new Promise((a, s) => {
        const c = this.adapter.uploadFile({
          url: e,
          formData: t,
          name: n,
          filePath: o,
          fileType: r,
          header: { "X-OSS-server-side-encrpytion": "AES256" },
          success(e) {
            e && e.statusCode < 400
              ? a(e)
              : s(
                  new Ke({ code: "UPLOAD_FAILED", message: "文件上传失败" })
                );
          },
          fail(e) {
            s(
              new Ke({
                code: e.code || "UPLOAD_FAILED",
                message: e.message || e.errMsg || "文件上传失败",
              })
            );
          },
        });
        "function" == typeof i &&
          c &&
          "function" == typeof c.onProgressUpdate &&
          c.onProgressUpdate((e) => {
            i({
              loaded: e.totalBytesSent,
              total: e.totalBytesExpectedToSend,
            });
          });
      });
    }
    reportOSSUpload(e) {
      const t = {
        method: "serverless.file.resource.report",
        params: JSON.stringify(e),
      };
      return this.request(this.setupRequest(t));
    }
    async uploadFile({
      filePath: e,
      cloudPath: t,
      fileType: n = "image",
      cloudPathAsRealPath: o = !1,
      onUploadProgress: r,
      config: i,
    }) {
      if ("string" !== pe(t))
        throw new Ke({
          code: "INVALID_PARAM",
          message: "cloudPath必须为字符串类型",
        });
      if (!(t = t.trim()))
        throw new Ke({
          code: "INVALID_PARAM",
          message: "cloudPath不可为空",
        });
      if (/:\/\//.test(t))
        throw new Ke({ code: "INVALID_PARAM", message: "cloudPath不合法" });
      const a = (i && i.envType) || this.config.envType;
      if (o && ("/" !== t[0] && (t = "/" + t), t.indexOf("\\") > -1))
        throw new Ke({
          code: "INVALID_PARAM",
          message: "使用cloudPath作为路径时，cloudPath不可包含“\\”",
        });
      const s = (
          await this.getOSSUploadOptionsFromPath({
            env: a,
            filename: o ? t.split("/").pop() : t,
            fileId: o ? t : void 0,
          })
        ).result,
        c = "https://" + s.cdnDomain + "/" + s.ossPath,
        {
          securityToken: l,
          accessKeyId: u,
          signature: d,
          host: p,
          ossPath: f,
          id: h,
          policy: m,
          ossCallbackUrl: g,
        } = s,
        v = {
          "Cache-Control": "max-age=2592000",
          "Content-Disposition": "attachment",
          OSSAccessKeyId: u,
          Signature: d,
          host: p,
          id: h,
          key: f,
          policy: m,
          success_action_status: 200,
        };
      if ((l && (v["x-oss-security-token"] = l), g)) {
        const e = JSON.stringify({
          callbackUrl: g,
          callbackBody: JSON.stringify({
            fileId: h,
            spaceId: this.config.spaceId,
          }),
          callbackBodyType: "application/json",
        });
        v.callback = at(e);
      }
      const y = {
        url: "https://" + s.host,
        formData: v,
        fileName: "file",
        name: "file",
        filePath: e,
        fileType: n,
      };
      if (
        (await this.uploadFileToOSS(
          Object.assign({}, y, { onUploadProgress: r })
        ),
        g)
      )
        return { success: !0, filePath: e, fileID: c };
      if ((await this.reportOSSUpload({ id: h })).success)
        return { success: !0, filePath: e, fileID: c };
      throw new Ke({ code: "UPLOAD_FAILED", message: "文件上传失败" });
    }
    getTempFileURL({ fileList: e } = {}) {
      return new Promise((t, n) => {
        (Array.isArray(e) && 0 !== e.length) ||
          n(
            new Ke({
              code: "INVALID_PARAM",
              message: "fileList的元素必须是非空的字符串",
            })
          ),
          t({ fileList: e.map((e) => ({ fileID: e, tempFileURL: e })) });
      });
    }
    async getFileInfo({ fileList: e } = {}) {
      if (!Array.isArray(e) || 0 === e.length)
        throw new Ke({
          code: "INVALID_PARAM",
          message: "fileList的元素必须是非空的字符串",
        });
      const t = {
        method: "serverless.file.resource.info",
        params: JSON.stringify({
          id: e.map((e) => e.split("?")[0]).join(","),
        }),
      };
      return {
        fileList: (await this.request(this.setupRequest(t))).result,
      };
    }
  },
  ct = {
    init(e) {
      const t = new st(e),
        n = {
          signInAnonymously: function () {
            return t.authorize();
          },
          getLoginState: function () {
            return Promise.resolve(!1);
          },
        };
      return (
        (t.auth = function () {
          return n;
        }),
        (t.customAuth = t.auth),
        t
      );
    },
  };
  
  const sign = rt;
  module.exports = { sign, getReadModbus, getWriteModbus, highLowToInt };