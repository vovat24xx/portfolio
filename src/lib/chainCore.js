/*
 * chainCore.js — dependency-free renderer for the continuous silver chain.
 *
 * Path:  S-shaped cubic béziers between waypoints (always monotonic in Y).
 * Links: drawn as stroked "stadiums". Neighbouring links are 90° apart in
 *        twist, so as `twist` changes the whole chain appears to rotate
 *        around its own axis, like a real chain.
 * Layers: every segment of the path belongs to "back" or "front" canvas.
 */

const TAU = Math.PI * 2
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const easeOut = (t) => 1 - Math.pow(1 - t, 3)

/* ---------- path ---------- */
export function buildPath(pts) {
  const xs = [], ys = [], cum = [], marks = []
  if (!pts || pts.length < 2) return { xs, ys, cum, marks, total: 0 }
  let acc = 0
  xs.push(pts[0].x); ys.push(pts[0].y); cum.push(0)
  for (let k = 0; k < pts.length - 1; k++) {
    const a = pts[k], b = pts[k + 1]
    const dy = b.y - a.y
    const c1 = { x: a.x, y: a.y + dy * 0.5 }
    const c2 = { x: b.x, y: b.y - dy * 0.5 }
    const n = Math.max(10, Math.ceil(Math.hypot(b.x - a.x, dy) / 5))
    marks.push({ s: acc, layer: a.layer || 'front' })
    for (let i = 1; i <= n; i++) {
      const t = i / n, u = 1 - t
      const x = u * u * u * a.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * b.x
      const y = u * u * u * a.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * b.y
      acc += Math.hypot(x - xs[xs.length - 1], y - ys[ys.length - 1])
      xs.push(x); ys.push(y); cum.push(acc)
    }
  }
  return { xs, ys, cum, marks, total: acc }
}

function indexAt(arr, v) {
  let lo = 0, hi = arr.length - 1
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1
    if (arr[mid] <= v) lo = mid
    else hi = mid - 1
  }
  return lo
}

export function sAtY(path, y) {
  const { ys, cum } = path
  if (!ys.length || y <= ys[0]) return 0
  if (y >= ys[ys.length - 1]) return path.total
  const i = indexAt(ys, y)
  const span = ys[i + 1] - ys[i] || 1
  return cum[i] + ((y - ys[i]) / span) * (cum[i + 1] - cum[i])
}

function pointAt(path, s) {
  const { xs, ys, cum } = path
  const n = xs.length
  const i = Math.min(n - 2, indexAt(cum, s))
  const span = cum[i + 1] - cum[i] || 1
  const f = clamp((s - cum[i]) / span, 0, 1)
  const j0 = Math.max(0, i - 2), j1 = Math.min(n - 1, i + 3)
  return {
    x: xs[i] + (xs[i + 1] - xs[i]) * f,
    y: ys[i] + (ys[i + 1] - ys[i]) * f,
    ang: Math.atan2(ys[j1] - ys[j0], xs[j1] - xs[j0]),
  }
}

function layerAt(path, s) {
  const m = path.marks
  let l = m[0] ? m[0].layer : 'front'
  for (let i = 0; i < m.length; i++) { if (m[i].s <= s) l = m[i].layer; else break }
  return l
}

/* ---------- link drawing ---------- */
function drawLink(ctx, dpr, q, S, o) {
  const { x, y, ang, c, grow, phase } = q
  const Ls = S.L * grow
  const Ts = S.T * grow
  const Wc = Math.max(S.W * grow * c, Ts * 0.25)
  const r = Wc / 2
  const hx = Math.max(0, Ls / 2 - r)
  const p = new Path2D()
  p.moveTo(-hx, -r); p.lineTo(hx, -r)
  p.arc(hx, 0, r, -Math.PI / 2, Math.PI / 2)
  p.lineTo(-hx, r)
  p.arc(-hx, 0, r, Math.PI / 2, Math.PI * 1.5)
  p.closePath()
  const perim = 4 * hx + TAU * r

  const cs = Math.cos(ang) * dpr, sn = Math.sin(ang) * dpr
  const at = (ox, oy) => ctx.setTransform(cs, sn, -sn, cs, (x + ox) * dpr, (y + oy) * dpr)
  const stroke = (w, color, ox = 0, oy = 0) => {
    at(ox, oy)
    ctx.lineWidth = w
    ctx.strokeStyle = color
    ctx.stroke(p)
  }

  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'

  // contact shadow + dark outline
  if (o.shadow) {
    ctx.shadowColor = 'rgba(0,0,0,.55)'
    ctx.shadowBlur = 14 * dpr
    ctx.shadowOffsetX = 5 * dpr
    ctx.shadowOffsetY = 9 * dpr
  }
  stroke(Ts + 2.4, '#050505')
  ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0

  // tube shading: dark body → mid → light, then a moving glint
  stroke(Ts, '#202125')
  stroke(Ts * 0.8, '#6f737b', -Ts * 0.04, -Ts * 0.05)
  stroke(Ts * 0.55, '#c7cad0', -Ts * 0.09, -Ts * 0.1)
  stroke(Ts * 0.15, 'rgba(229,9,32,.55)', Ts * 0.26, Ts * 0.26) // red reflection
  stroke(Ts * 0.2, 'rgba(255,255,255,.92)', -Ts * 0.17, -Ts * 0.2)

  // glint travels around each link as the page scrolls
  at(-Ts * 0.17, -Ts * 0.2)
  ctx.setLineDash([perim * 0.1, perim * 0.9])
  ctx.lineDashOffset = -phase * perim
  ctx.lineWidth = Ts * 0.34
  ctx.strokeStyle = '#ffffff'
  ctx.stroke(p)
  ctx.setLineDash([])
}

function drawEndRing(ctx, dpr, x, y, S) {
  const R = S.L * 0.9
  const Ts = S.T * 1.45
  const p = new Path2D()
  p.arc(0, 0, R, 0, TAU)
  const put = (w, color, ox = 0, oy = 0) => {
    ctx.setTransform(dpr, 0, 0, dpr, (x + ox) * dpr, (y + oy) * dpr)
    ctx.lineWidth = w; ctx.strokeStyle = color; ctx.stroke(p)
  }
  put(Ts + 3, '#050505')
  put(Ts, '#202125')
  put(Ts * 0.8, '#6f737b', -Ts * 0.04, -Ts * 0.05)
  put(Ts * 0.55, '#c7cad0', -Ts * 0.09, -Ts * 0.1)
  put(Ts * 0.15, 'rgba(229,9,32,.6)', Ts * 0.26, Ts * 0.26)
  put(Ts * 0.2, 'rgba(255,255,255,.92)', -Ts * 0.17, -Ts * 0.2)
  ctx.setTransform(dpr, 0, 0, dpr, x * dpr, y * dpr)
  ctx.fillStyle = '#E50920'
  ctx.beginPath(); ctx.arc(0, 0, R * 0.2, 0, TAU); ctx.fill()
}

/* ---------- renderer ---------- */
export function createChainRenderer(frontCanvas, backCanvas) {
  const layers = {
    front: { cv: frontCanvas, ctx: frontCanvas.getContext('2d') },
    back: { cv: backCanvas, ctx: backCanvas.getContext('2d') },
  }
  let path = buildPath([])
  let H = 0, dpr = 1
  let S = { L: 70, T: 13, W: 44, pitch: 57 }
  let shadow = true

  return {
    get total() { return path.total },
    get size() { return S },
    setPath(pts) { path = buildPath(pts) },
    resize(w, h, ratio) {
      H = h; dpr = ratio
      for (const k of Object.keys(layers)) {
        const { cv } = layers[k]
        cv.width = Math.round(w * ratio); cv.height = Math.round(h * ratio)
        cv.style.width = w + 'px'; cv.style.height = h + 'px'
      }
      const L = clamp(w * 0.052, 38, 80)
      const T = L * 0.29
      S = { L, T, W: L * 0.7, pitch: L - T * 1.02 }
      shadow = w >= 760
    },
    sAtY: (y) => sAtY(path, y),
    render({ scrollY, reveal, time, vel = 0, twist = 0, sway = 1 }) {
      for (const k of Object.keys(layers)) {
        const { ctx, cv } = layers[k]
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.clearRect(0, 0, cv.width, cv.height)
      }
      if (!path.total) return
      const { L, pitch } = S
      const endS = path.total - L * 0.9
      const sMin = sAtY(path, scrollY - L * 2)
      const sMax = Math.min(reveal, sAtY(path, scrollY + H + L * 2), endS)
      const off = L * 0.3
      const i0 = Math.max(0, Math.floor((sMin - off) / pitch))
      const i1 = Math.floor((sMax - off) / pitch)
      const buckets = { front: [], back: [] }
      for (let i = i0; i <= i1; i++) {
        const s = off + i * pitch
        const pt = pointAt(path, s)
        const amp = (3 + vel * 16) * Math.min(1, s / 500) * sway
        const d = Math.sin(s * 0.0045 + time * 0.9) * amp
        const phi = twist + i * (Math.PI / 2)
        const k = clamp((reveal - s) / (pitch * 4), 0, 1)
        buckets[layerAt(path, s)].push({
          x: pt.x - Math.sin(pt.ang) * d,
          y: pt.y + Math.cos(pt.ang) * d - scrollY,
          ang: pt.ang,
          c: Math.max(0.2, Math.abs(Math.cos(phi))),
          grow: 0.55 + 0.45 * easeOut(k),
          phase: (scrollY * 0.0009 + i * 0.137) % 1,
        })
      }
      for (const name of ['back', 'front']) {
        const list = buckets[name].sort((a, b) => a.c - b.c)
        for (const q of list) drawLink(layers[name].ctx, dpr, q, S, { shadow })
      }
      if (reveal >= path.total - 2) {
        const e = pointAt(path, path.total)
        drawEndRing(layers.front.ctx, dpr, e.x, e.y - scrollY, S)
      }
    },
  }
}
