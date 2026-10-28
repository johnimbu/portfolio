const W = 1920, VH = 920;
const C = { bg: '#17181d', panel: '#202227', tile: '#2c2f37', text: '#eef0f4', muted: '#a3aab9', faint: '#6c7385', accent: '#4f6bff' };
const clamp01 = v => Math.max(0, Math.min(1, v));
const lerp = (a, b, p) => a + (b - a) * p;
const MOTION = {
  enter: (T, a, b) => Easing.easeOutCubic(clamp01((T - a) / (b - a))),
  move: (T, a, b) => Easing.easeInOutCubic(clamp01((T - a) / (b - a))),
  pop: (T, a, b) => Easing.easeOutBack(clamp01((T - a) / (b - a))),
};
const FONT = 'Inter, -apple-system, system-ui, sans-serif';

const F = {
  amber: p => `sepia(${.68 * p}) saturate(${1 + .3 * p}) hue-rotate(${-6 * p}deg) brightness(${1 - .4 * p})`,
  dim: p => `brightness(${1 - .64 * p}) contrast(${1 - .1 * p})`,
  invert: p => `invert(${.9 * p}) hue-rotate(${180 * p}deg) brightness(${1 - .07 * p}) contrast(${1 - .12 * p})`,
};

function pathAt(kf, T) {
  if (T <= kf[0][0]) return { x: kf[0][1], y: kf[0][2] };
  for (let i = 0; i < kf.length - 1; i++) {
    const a = kf[i], b = kf[i + 1];
    if (T <= b[0]) { const p = MOTION.move(T, a[0], b[0]); return { x: lerp(a[1], b[1], p), y: lerp(a[2], b[2], p) }; }
  }
  const l = kf[kf.length - 1]; return { x: l[1], y: l[2] };
}
const camera = (s, cx, cy) => ({ position: 'absolute', left: 0, top: 0, width: W, height: VH, transformOrigin: '0 0', transform: `translate(${W / 2}px, ${VH / 2}px) scale(${s}) translate(${-cx}px, ${-cy}px)` });
const ring = o => `0 0 0 2px rgba(79,107,255,${o}), 0 0 0 8px rgba(79,107,255,${.2 * o}), 0 0 50px rgba(79,107,255,${.3 * o})`;
const PAGE_CLIP = 'inset(126px 140px 30px 140px round 0 0 14px 14px)';

function Cursor({ x, y, down, opacity }) {
  return (
    <div style={{ position: 'absolute', left: x - 4, top: y - 3, opacity, transform: `scale(${down ? .86 : 1})`, transformOrigin: '4px 3px', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,.45))', zIndex: 50 }}>
      <svg width="34" height="40" viewBox="0 0 34 40"><path d="M4 3 L4 33 L12 26 L17.5 37.5 L22.5 35 L17 24 L28 24 Z" fill="#ffffff" stroke="#15161c" strokeWidth="2.2" strokeLinejoin="round"></path></svg>
    </div>
  );
}

function TintBox({ x, y, w, h, filter = 'none', tint, ringO = 1, r = 10, children }) {
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: Math.max(0, w), height: Math.max(0, h), borderRadius: r, overflow: 'hidden', boxShadow: ring(ringO) }}>
      <div style={{ position: 'absolute', left: -x, top: -y, width: W, height: VH, filter }}>{children}</div>
      {tint ? <div style={{ position: 'absolute', inset: 0, background: tint }}></div> : null}
    </div>
  );
}

function SceneBg() {
  return <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(1200px 800px at 70% 30%, rgba(79,107,255,.14), transparent 70%), #17181d' }}></div>;
}

function Browser({ url, tab }) {
  return (
    <React.Fragment>
      <div style={{ position: 'absolute', left: 140, top: 30, width: 1640, height: 860, borderRadius: 14, background: '#ffffff', boxShadow: '0 0 0 1px rgba(255,255,255,.08), 0 40px 100px rgba(0,0,0,.6)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: 46, background: '#1b1c21', display: 'flex', alignItems: 'flex-end', gap: 10, padding: '0 18px' }}>
          <div style={{ display: 'flex', gap: 8, alignSelf: 'center', marginRight: 14 }}>
            <span style={{ width: 13, height: 13, borderRadius: '50%', background: '#ff5f57' }}></span>
            <span style={{ width: 13, height: 13, borderRadius: '50%', background: '#febc2e' }}></span>
            <span style={{ width: 13, height: 13, borderRadius: '50%', background: '#28c840' }}></span>
          </div>
          <div style={{ height: 36, width: 300, borderRadius: '10px 10px 0 0', background: '#2a2c33', color: '#d3d7e0', font: `500 15px ${FONT}`, display: 'flex', alignItems: 'center', padding: '0 16px' }}>{tab}</div>
        </div>
        <div style={{ position: 'absolute', left: 0, top: 46, right: 0, height: 50, background: '#2a2c33', display: 'flex', alignItems: 'center', gap: 14, padding: '0 18px' }}>
          <div style={{ flex: 1, height: 34, borderRadius: 17, background: '#1b1c21', color: '#a3aab9', font: `400 15px ${FONT}`, display: 'flex', alignItems: 'center', padding: '0 18px' }}>{url}</div>
          <img src="brand/tintbox-icon-1024.png" alt="" style={{ width: 28, height: 28, display: 'block', marginRight: 6 }} />
        </div>
      </div>
    </React.Fragment>
  );
}

/* ---------- Scene 1: call ---------- */
const S = { x: 170, y: 96, w: 1190, h: 670 };
function Slide() {
  return (
    <div style={{ position: 'absolute', left: S.x, top: S.y, width: S.w, height: S.h, borderRadius: 12, overflow: 'hidden', containerType: 'size', background: '#ffffff', fontFamily: FONT }}>
      <div style={{ position: 'absolute', left: '6%', top: '8%', fontSize: '4.6cqw', fontWeight: 700, letterSpacing: '-.02em', color: '#15161c', whiteSpace: 'nowrap' }}>Q3 Roadmap Review</div>
      <div style={{ position: 'absolute', left: '6%', top: '20%', fontSize: '2cqw', color: '#6b6d78' }}>Product sync · All teams</div>
      <div style={{ position: 'absolute', left: '6%', top: '32%', width: '52%', height: '56%', display: 'flex', alignItems: 'flex-end', gap: '4%', boxShadow: '0 2px 0 #e3e4ea' }}>
        {[[62, '#2f7bff'], [84, '#00c48c'], [48, '#ffd60a'], [94, '#ff4d8d'], [70, '#ff7a1a']].map(([h, c], i) => <div key={i} style={{ flex: 1, height: h + '%', background: c, borderRadius: '1cqw 1cqw 0 0' }}></div>)}
      </div>
      <div style={{ position: 'absolute', left: '63%', top: '32%', width: '31%', height: '56%', display: 'flex', flexDirection: 'column', gap: '5%' }}>
        {[['Launch', '#ff4d8d', '#fff'], ['Pricing', '#2f7bff', '#fff'], ['Hiring', '#ffd60a', '#2b2300']].map(([t, b, c]) => <div key={t} style={{ flex: 1, borderRadius: '1.4cqw', background: b, color: c, fontSize: '2.2cqw', fontWeight: 700, padding: '0 6%', display: 'flex', alignItems: 'center' }}>{t}</div>)}
      </div>
    </div>
  );
}
function CallScene({ T }) {
  const sh = MOTION.enter(T, .9, 1.3);
  const pop = MOTION.pop(T, 3.4, 3.8), q = MOTION.move(T, 3.6, 4.6);
  const glare = sh * (1 - q) * (.2 + .3 * (1 - MOTION.enter(T, 1.3, 2.6)));
  const cur = pathAt([[5.0, 1600, 880], [5.8, 1262, 168], [8, 1262, 168]], T);
  const glass = MOTION.enter(T, 5.5, 5.8);
  const s = lerp(1, 1.07, MOTION.move(T, 0, 8));
  const people = [['DK', 'Dana', '#4a5060'], ['MR', 'Marco', '#3d4a66'], ['JS', 'Jun', '#5a4a3a'], ['AL', 'Ava', '#3f5a4f']];
  return (
    <div style={camera(s, lerp(960, 860, MOTION.move(T, 0, 8)), 460)}>
      <div style={{ position: 'absolute', left: 140, top: 30, width: 1640, height: 860, borderRadius: 18, background: C.panel, boxShadow: '0 0 0 1px rgba(255,255,255,.07), 0 40px 100px rgba(0,0,0,.6)' }}></div>
      <div style={{ position: 'absolute', left: 172, top: 30, height: 66, display: 'flex', alignItems: 'center', gap: 12, font: `500 20px ${FONT}`, color: '#c9ceda' }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff4f7b' }}></span>Weekly product sync<span style={{ color: C.faint }}>· Dana is presenting</span>
      </div>
      <div style={{ position: 'absolute', left: S.x, top: S.y, width: S.w, height: S.h, borderRadius: 12, background: C.tile, display: 'grid', placeItems: 'center' }}>
        <span style={{ width: 150, height: 150, borderRadius: '50%', background: '#4a5060', display: 'grid', placeItems: 'center', font: `600 48px ${FONT}`, color: C.text }}>DK</span>
      </div>
      <div style={{ opacity: sh }}><Slide /></div>
      <div style={{ position: 'absolute', left: 1380, top: 96, width: 370, display: 'flex', flexDirection: 'column', gap: 17 }}>
        {people.map(([i, n, c]) => (
          <div key={i} style={{ position: 'relative', height: 155, borderRadius: 12, background: C.tile, display: 'grid', placeItems: 'center' }}>
            <span style={{ width: 66, height: 66, borderRadius: '50%', background: c, display: 'grid', placeItems: 'center', font: `600 22px ${FONT}`, color: C.text }}>{i}</span>
            <span style={{ position: 'absolute', left: 14, bottom: 10, font: `500 15px ${FONT}`, color: '#c9ceda' }}>{n}</span>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 170, top: 790, width: 1580, height: 72, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
        {[0, 1, 2].map(i => <span key={i} style={{ width: 56, height: 56, borderRadius: '50%', background: '#353944' }}></span>)}
        <span style={{ width: 92, height: 56, borderRadius: 28, background: '#e5484d' }}></span>
      </div>
      {pop > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: VH, opacity: clamp01(pop * 1.5), transformOrigin: `${S.x + S.w / 2}px ${S.y + S.h / 2}px`, transform: `scale(${lerp(1.04, 1, pop)})` }}>
          <TintBox x={S.x} y={S.y} w={S.w} h={S.h} r={12} filter={F.amber(q)} tint={`rgba(255,140,30,${.12 * q})`} ringO={lerp(1, .65, MOTION.enter(T, 4.6, 5.4))}><Slide /></TintBox>
        </div>
      ) : null}
      <div style={{ position: 'absolute', left: S.x + S.w - 190, top: S.y + 18, display: 'flex', gap: 10, opacity: glass }}>
        {[0, 1, 2].map(i => <span key={i} style={{ width: 50, height: 50, borderRadius: '50%', background: i === 2 ? C.accent : 'rgba(255,255,255,.16)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.28)', display: 'grid', placeItems: 'center' }}>
          <span style={{ width: 18, height: i === 1 ? 18 : 3, borderRadius: 2, background: '#ffffff', boxShadow: i === 0 ? '0 6px 0 #fff, 0 -6px 0 #fff' : 'none' }}></span>
        </span>)}
      </div>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: glare, background: `radial-gradient(900px 600px at ${S.x + S.w / 2}px ${S.y + S.h / 2}px, rgba(255,255,255,.95), rgba(255,255,255,.35) 60%, rgba(255,255,255,.1))` }}></div>
      <Cursor x={cur.x} y={cur.y} opacity={MOTION.enter(T, 4.9, 5.2)} />
    </div>
  );
}

/* ---------- Scene 2: ads ---------- */
const AD = {
  L: { x: 300, y: 200, w: 1320, h: 100 }, K: { x: 180, y: 324, w: 270, h: 540 },
  R1: { x: 1220, y: 324, w: 400, h: 300 }, R2: { x: 1220, y: 644, w: 400, h: 220 },
};
function AdsPage({ t }) {
  const flash = i => (Math.sin(t * 11 + i * 1.7) > .55 ? .3 : 0);
  const box = (a, extra) => ({ position: 'absolute', left: a.x, top: a.y, width: a.w, height: a.h, borderRadius: 6, overflow: 'hidden', fontFamily: FONT, ...extra });
  const fl = i => <div style={{ position: 'absolute', inset: 0, background: '#ffffff', opacity: flash(i) }}></div>;
  const p = { margin: 0, font: '400 22px/1.6 Georgia, "Times New Roman", serif', color: '#2b2d33', textWrap: 'pretty' };
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: VH, clipPath: PAGE_CLIP }}>
      <div style={{ position: 'absolute', left: 140, top: 126, width: 1640, height: 764, background: '#ffffff' }}></div>
      <div style={{ position: 'absolute', left: 180, top: 126, width: 1560, height: 60, borderBottom: '1px solid #e6e7eb', display: 'flex', alignItems: 'center', gap: 36, font: `500 16px ${FONT}`, color: '#5a5d68' }}>
        <span style={{ font: '700 28px Georgia, serif', color: '#15161c', marginRight: 24 }}>The Daily Ledger</span><span>World</span><span>Business</span><span>Technology</span><span>Culture</span>
      </div>
      <div style={box(AD.L, { background: 'linear-gradient(90deg,#ff2d7a,#ffd60a)', filter: `hue-rotate(${(t * 220) % 360}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', boxSizing: 'border-box' })}>
        <span style={{ font: `800 44px ${FONT}`, color: '#ffffff', letterSpacing: '-.01em' }}>MEGA SALE · 70% OFF EVERYTHING</span>
        <span style={{ padding: '14px 28px', borderRadius: 8, background: '#15161c', color: '#ffffff', font: `800 22px ${FONT}` }}>SHOP NOW</span>{fl(0)}
      </div>
      <div style={box(AD.K, { background: 'linear-gradient(180deg,#00c48c,#2f7bff)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, color: '#ffffff', textAlign: 'center' })}>
        <span style={{ font: `900 58px/1 ${FONT}` }}>YOU<br />WON!</span><span style={{ font: `600 22px ${FONT}` }}>Claim your prize today</span>
        <span style={{ padding: '16px 30px', borderRadius: 40, background: '#ffd60a', color: '#2b2300', font: `800 24px ${FONT}` }}>CLAIM →</span>{fl(1)}
      </div>
      <div style={{ position: 'absolute', left: 490, top: 330, width: 690, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <span style={{ font: `600 15px ${FONT}`, letterSpacing: '.12em', color: '#b0324f' }}>TECHNOLOGY</span>
        <span style={{ font: '700 46px/1.15 Georgia, serif', color: '#15161c', letterSpacing: '-.01em' }}>Why paper notebooks are having a moment</span>
        <span style={{ font: `400 16px ${FONT}`, color: '#7a7d88', marginBottom: 6 }}>By Lena Ortiz · 6 min read</span>
        <p style={p}>Sales of paper notebooks rose for the third year running, and the people buying them are not who you might expect. Engineers, designers and students say a page with no notifications helps them think.</p>
        <p style={p}>“I spend all day looking at bright rectangles,” said one product manager in Austin. “A notebook is the only screen that never asks me for anything.”</p>
        <p style={p}>Stationery shops report waiting lists for some dotted-grid editions.</p>
      </div>
      <div style={box(AD.R1, { background: '#ff7a1a', padding: 32, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: `inset 0 0 0 6px ${Math.sin(t * 9) > 0 ? '#ffd60a' : '#ff2d7a'}` })}>
        <span style={{ font: `800 36px/1.12 ${FONT}`, color: '#ffffff' }}>7 gadgets you need before Friday</span>
        <span style={{ font: `700 20px ${FONT}`, color: '#2b1400' }}>Sponsored · See the list ›</span>{fl(2)}
      </div>
      <div style={box(AD.R2, { background: '#ffd60a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 })}>
        <span style={{ font: `800 42px ${FONT}`, color: '#1b1600' }}>▶ Download now</span>
        <span style={{ font: `600 20px ${FONT}`, color: '#5a4a00' }}>Free · Fast · Secure</span>{fl(3)}
      </div>
    </div>
  );
}
function AdsScene({ T, A }) {
  const t = T - A;
  const pad = a => ({ x: a.x - 6, y: a.y - 6, w: a.w + 12, h: a.h + 12 });
  const boxes = [pad(AD.L), pad(AD.K), pad(AD.R1), pad(AD.R2)];
  const st = boxes.map((_, i) => A + 2.0 + 1.15 * i);
  const kf = [[A + 1.3, 1300, 800]];
  boxes.forEach((b, i) => { kf.push([st[i], b.x, b.y]); kf.push([st[i] + .55, b.x + b.w, b.y + b.h]); });
  kf.push([st[3] + 1.3, 1720, 880]);
  const cur = pathAt(kf, T);
  const down = st.some(s => T >= s - .05 && T <= s + .6);
  const z = MOTION.move(T, A + 6.5, A + 7.9);
  const settle = MOTION.enter(T, st[3] + 1, st[3] + 2);
  return (
    <div style={camera(lerp(1, 1.42, z), lerp(960, 835, z), lerp(460, 560, z))}>
      <Browser url="dailyreport.example/technology/paper-notebooks" tab="The Daily Ledger" />
      <AdsPage t={t} />
      {boxes.map((b, i) => {
        const d = MOTION.move(T, st[i], st[i] + .55);
        if (T < st[i]) return null;
        const k = MOTION.enter(T, st[i] + .55, st[i] + .8);
        return <TintBox key={i} x={b.x} y={b.y} w={b.w * d} h={b.h * d} r={8} tint={`rgba(10,11,14,${lerp(.12, .97, k)})`} ringO={lerp(1, .3, settle)}><AdsPage t={t} /></TintBox>;
      })}
      <Cursor x={cur.x} y={cur.y} down={down} opacity={MOTION.enter(T, A + 1.2, A + 1.5) * (1 - MOTION.enter(T, st[3] + .9, st[3] + 1.2))} />
    </div>
  );
}

/* ---------- Scene 3: spotlight ---------- */
function Dashboard() {
  const card = { position: 'absolute', borderRadius: 14, background: '#ffffff', boxShadow: '0 0 0 1px #e6e7ec', fontFamily: FONT };
  const kpis = [['Revenue', '$482k', '#2f7bff'], ['Active users', '38,210', '#00c48c'], ['Conversion', '4.8%', '#ff4d8d'], ['Churn', '1.9%', '#ff7a1a']];
  const bars = [40, 55, 48, 62, 58, 70, 66, 78, 74, 86, 82, 94];
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: VH, clipPath: PAGE_CLIP }}>
      <div style={{ position: 'absolute', left: 140, top: 126, width: 1640, height: 764, background: '#f6f7f9' }}></div>
      <div style={{ position: 'absolute', left: 140, top: 126, width: 240, height: 764, background: '#ffffff', boxShadow: '1px 0 0 #e6e7ec', display: 'flex', flexDirection: 'column', gap: 6, padding: '28px 18px', boxSizing: 'border-box', font: `500 17px ${FONT}`, color: '#5a5d68' }}>
        <span style={{ font: `700 20px ${FONT}`, color: '#15161c', marginBottom: 18, paddingLeft: 12 }}>Northwind</span>
        {['Overview', 'Revenue', 'Customers', 'Campaigns', 'Settings'].map((n, i) => <span key={n} style={{ padding: '10px 12px', borderRadius: 8, background: i === 0 ? '#e8edff' : 'transparent', color: i === 0 ? '#2f4fd8' : '#5a5d68' }}>{n}</span>)}
      </div>
      <div style={{ position: 'absolute', left: 420, top: 148, font: `700 30px ${FONT}`, color: '#15161c' }}>Overview</div>
      {kpis.map(([l, v, c], i) => (
        <div key={l} style={{ ...card, left: 420 + i * 340, top: 210, width: 320, height: 114, padding: '20px 24px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8, borderTop: `5px solid ${c}` }}>
          <span style={{ font: `500 16px ${FONT}`, color: '#6b6d78' }}>{l}</span><span style={{ font: `700 36px ${FONT}`, color: '#15161c' }}>{v}</span>
        </div>
      ))}
      <div style={{ ...card, left: 420, top: 350, width: 840, height: 330, padding: 26, boxSizing: 'border-box' }}>
        <div style={{ font: `600 19px ${FONT}`, color: '#15161c' }}>Revenue by week</div>
        <div style={{ position: 'absolute', left: 26, right: 26, bottom: 26, height: 220, display: 'flex', alignItems: 'flex-end', gap: 14, boxShadow: '0 2px 0 #e3e4ea' }}>
          {bars.map((h, i) => <div key={i} style={{ flex: 1, height: h + '%', borderRadius: '6px 6px 0 0', background: i === 11 ? '#ff4d8d' : '#2f7bff' }}></div>)}
        </div>
      </div>
      <div style={{ ...card, left: 1280, top: 350, width: 480, height: 330, padding: 26, boxSizing: 'border-box' }}>
        <div style={{ font: `600 19px ${FONT}`, color: '#15161c' }}>Traffic sources</div>
        <div style={{ position: 'absolute', left: 30, top: 86, width: 200, height: 200, borderRadius: '50%', background: 'conic-gradient(#2f7bff 0 38%, #ff4d8d 38% 62%, #ffd60a 62% 82%, #00c48c 82%)' }}></div>
        <div style={{ position: 'absolute', left: 120, top: 176, width: 20, height: 20 }}></div>
        <div style={{ position: 'absolute', left: 270, top: 110, display: 'flex', flexDirection: 'column', gap: 16, font: `500 17px ${FONT}`, color: '#3a3c44' }}>
          {[['Search', '#2f7bff'], ['Social', '#ff4d8d'], ['Email', '#ffd60a'], ['Direct', '#00c48c']].map(([n, c]) => <span key={n} style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ width: 14, height: 14, borderRadius: 4, background: c }}></span>{n}</span>)}
        </div>
      </div>
      <div style={{ ...card, left: 420, top: 700, width: 1340, height: 220, padding: '20px 26px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 16, font: `500 17px ${FONT}`, color: '#3a3c44' }}>
        <div style={{ font: `600 19px ${FONT}`, color: '#15161c' }}>Top campaigns</div>
        {['Autumn launch', 'Referral bonus', 'Webinar series'].map(n => <div key={n} style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eeeff2', paddingTop: 14 }}><span>{n}</span><span style={{ color: '#00a676' }}>Active</span></div>)}
      </div>
    </div>
  );
}
function SpotScene({ T, B }) {
  const bx = { x: 408, y: 338, w: 864, h: 354 };
  const d = MOTION.move(T, B + 1.4, B + 2.1);
  const q = MOTION.move(T, B + 2.2, B + 3.0);
  const cur = pathAt([[B + .6, 1300, 840], [B + 1.4, bx.x, bx.y], [B + 2.1, bx.x + bx.w, bx.y + bx.h], [B + 3.0, 1420, 800]], T);
  const z = MOTION.move(T, B + 2.6, B + 5.8);
  return (
    <div style={camera(lerp(1, 1.22, z), lerp(960, 860, z), lerp(460, 515, z))}>
      <Browser url="analytics.example/overview" tab="Northwind · Overview" />
      <div style={{ position: 'absolute', inset: 0, filter: F.dim(q * .95) }}><Dashboard /></div>
      {T >= B + 1.4 ? <TintBox x={bx.x} y={bx.y} w={bx.w * d} h={bx.h * d} r={16} tint={d < 1 ? 'rgba(79,107,255,.06)' : null} ringO={lerp(1, .7, q)}><Dashboard /></TintBox> : null}
      <Cursor x={cur.x} y={cur.y} down={T >= B + 1.35 && T <= B + 2.15} opacity={MOTION.enter(T, B + .5, B + .8) * (1 - MOTION.enter(T, B + 2.9, B + 3.2))} />
    </div>
  );
}

/* ---------- Scene 4: night doc ---------- */
function Doc() {
  const p = { margin: 0, font: '400 23px/1.65 Georgia, "Times New Roman", serif', color: '#2b2d33', textWrap: 'pretty' };
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: VH, clipPath: PAGE_CLIP }}>
      <div style={{ position: 'absolute', left: 140, top: 126, width: 1640, height: 764, background: '#eef0f3' }}></div>
      <div style={{ position: 'absolute', left: 140, top: 126, width: 1640, height: 48, background: '#ffffff', boxShadow: '0 1px 0 #e3e4ea', display: 'flex', alignItems: 'center', gap: 14, padding: '0 28px', boxSizing: 'border-box' }}>
        {[60, 30, 30, 30, 90, 30, 30].map((w, i) => <span key={i} style={{ width: w, height: 14, borderRadius: 4, background: '#dfe1e6' }}></span>)}
      </div>
      <div style={{ position: 'absolute', left: 560, top: 200, width: 800, height: 760, background: '#ffffff', boxShadow: '0 2px 10px rgba(0,0,0,.08)', padding: '70px 84px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <span style={{ font: '700 40px Georgia, serif', color: '#15161c' }}>Chapter three</span>
        <p style={p}>The ferry left at six, which meant the harbor was still blue when Mara found a seat by the window. She had brought the letter, though she had promised herself she would not read it again.</p>
        <p style={p}>Across the aisle a boy was folding a paper boat from the timetable. Each time it collapsed he started over.</p>
        <p style={p}>By the time the island came into view, the boat was finished and the letter was still in her pocket.</p>
      </div>
    </div>
  );
}
const CHIPS = [
  ['Dim', 'brightness(.42)'], ['Amber', 'sepia(.9) saturate(1.4) brightness(.62)'], ['Rose', 'sepia(.7) hue-rotate(-40deg) saturate(1.5) brightness(.6)'],
  ['Gray', 'grayscale(1) brightness(.55)'], ['Invert', 'invert(.9) hue-rotate(180deg)'], ['Blackout', 'brightness(.05)'],
];
function Popup({ o, sel }) {
  return (
    <div style={{ position: 'absolute', left: 1410, top: 128, width: 340, height: 302, opacity: o, transform: `translateY(${lerp(-10, 0, o)}px)`, borderRadius: 14, background: C.bg, boxShadow: '0 0 0 1px rgba(255,255,255,.1), 0 24px 60px rgba(0,0,0,.6)', fontFamily: FONT, color: C.text }}>
      <img src="brand/tintbox-icon-1024.png" alt="" style={{ position: 'absolute', left: 14, top: 14, width: 34, height: 34 }} />
      <span style={{ position: 'absolute', left: 58, top: 14, font: `600 16px ${FONT}` }}>Tintbox</span>
      <span style={{ position: 'absolute', left: 58, top: 34, font: `400 12px ${FONT}`, color: C.muted }}>1 of 1 on</span>
      <span style={{ position: 'absolute', right: 14, top: 21, width: 36, height: 20, borderRadius: 10, background: C.accent }}><span style={{ position: 'absolute', top: 2, left: 18, width: 16, height: 16, borderRadius: '50%', background: '#ffffff' }}></span></span>
      <div style={{ position: 'absolute', left: 14, top: 62, width: 312, height: 54, borderRadius: 12, background: '#212329', display: 'flex', alignItems: 'center', gap: 12, padding: '0 12px', boxSizing: 'border-box' }}>
        <span style={{ width: 30, height: 30, borderRadius: 9, background: sel === 'Invert' ? '#e9edf5' : '#8c94a8' }}></span>
        <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><span style={{ font: `600 14px ${FONT}` }}>Doc page</span><span style={{ font: `400 12px ${FONT}`, color: C.muted }}>{sel} · 60%</span></span>
      </div>
      <span style={{ position: 'absolute', left: 14, top: 130, font: `600 12px ${FONT}`, color: C.faint }}>Filter</span>
      {CHIPS.map(([n, f], i) => {
        const on = n === sel;
        return (
          <div key={n} style={{ position: 'absolute', left: 14 + (i % 3) * 106, top: 152 + Math.floor(i / 3) * 72, width: 100, height: 64, borderRadius: 10, background: on ? '#2a2f4a' : '#2a2d35', boxShadow: on ? `inset 0 0 0 1.5px ${C.accent}` : 'none', padding: 6, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 6, font: `500 12px ${FONT}`, color: on ? C.text : C.muted }}>
            <span style={{ height: 26, borderRadius: 6, background: 'linear-gradient(135deg,#ffffff 0 38%,#ffcf3f 38% 58%,#ff2d7a 58% 78%,#2f7bff 78%)', filter: f }}></span>{n}
          </div>
        );
      })}
    </div>
  );
}
function NightScene({ T, D }) {
  const bx = { x: 548, y: 188, w: 824, h: 702 };
  const d = MOTION.move(T, D + 1.5, D + 2.2);
  const q = MOTION.move(T, D + 4.15, D + 4.65);
  const pop = MOTION.enter(T, D + 3.12, D + 3.4) * (1 - MOTION.enter(T, D + 5.0, D + 5.25));
  const chip = [1410 + 14 + 106 + 50, 128 + 152 + 72 + 32];
  const cur = pathAt([[D + .9, 1200, 760], [D + 1.5, bx.x, bx.y], [D + 2.2, bx.x + bx.w, bx.y + bx.h], [D + 3.0, 1734, 101], [D + 3.5, 1734, 101], [D + 4.0, chip[0], chip[1]], [D + 4.6, chip[0], chip[1]], [D + 5.6, 1260, 640]], T);
  const down = (T >= D + 1.45 && T <= D + 2.25) || (T >= D + 3.0 && T <= D + 3.12) || (T >= D + 4.02 && T <= D + 4.14);
  const glare = (1 - q) * .16;
  return (
    <div style={camera(lerp(1, 1.04, MOTION.move(T, D, D + 7)), 960, 460)}>
      <Browser url="notes.example/d/chapter-three" tab="Chapter three — Draft" />
      <Doc />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: glare * MOTION.enter(T, D, D + .6), background: 'radial-gradient(800px 600px at 960px 520px, rgba(255,255,255,.95), rgba(255,255,255,.2))' }}></div>
      {T >= D + 1.5 ? <TintBox x={bx.x} y={bx.y} w={bx.w * d} h={bx.h * d} r={6} filter={F.invert(q)} ringO={lerp(1, .45, q)}><Doc /></TintBox> : null}
      {pop > 0 ? <Popup o={pop} sel={T >= D + 4.08 ? 'Invert' : 'Dim'} /> : null}
      <Cursor x={cur.x} y={cur.y} down={down} opacity={MOTION.enter(T, D + .8, D + 1.1)} />
    </div>
  );
}

/* ---------- Outro ---------- */
function Outro({ T, E }) {
  const a = MOTION.pop(T, E + .1, E + .7), b = MOTION.enter(T, E + .4, E + 1.0), c = MOTION.enter(T, E + .7, E + 1.3), e = MOTION.enter(T, E + 1.1, E + 1.7);
  const drift = lerp(1, 1.03, MOTION.move(T, E, E + 4));
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(900px 700px at 50% 45%, rgba(79,107,255,.22), transparent 70%), #17181d', fontFamily: FONT, color: C.text }}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, transform: `scale(${drift})` }}>
        <img src="brand/tintbox-icon-1024.png" alt="" style={{ width: 150, height: 150, display: 'block', opacity: clamp01(a), transform: `scale(${lerp(.6, 1, a)})`, marginBottom: 10 }} />
        <span style={{ font: `600 104px ${FONT}`, letterSpacing: '-.035em', opacity: b, transform: `translateY(${lerp(20, 0, b)}px)` }}>Tintbox</span>
        <span style={{ font: `400 40px ${FONT}`, color: C.muted, opacity: c, transform: `translateY(${lerp(16, 0, c)}px)` }}>Dark mode for anything.</span>
        <span style={{ marginTop: 30, padding: '18px 34px', borderRadius: 12, boxShadow: `inset 0 0 0 1.5px ${C.accent}, 0 0 40px rgba(79,107,255,.3)`, font: `500 28px ${FONT}`, color: '#c7cfff', opacity: e, transform: `translateY(${lerp(14, 0, e)}px)` }}>Available on the Chrome Web Store</span>
      </div>
    </div>
  );
}

function Keycaps({ T, items }) {
  const it = items.find(i => T >= i.at && T < i.until);
  if (!it) return null;
  const o = MOTION.enter(T, it.at, it.at + .2) * (1 - MOTION.enter(T, it.until - .2, it.until));
  return (
    <div style={{ position: 'absolute', right: 140, top: 962, display: 'flex', gap: 10, opacity: o }}>
      {it.keys.map((k, i) => {
        const p = MOTION.pop(T, it.at + i * .07, it.at + .3 + i * .07);
        return <span key={i} style={{ minWidth: 72, height: 72, borderRadius: 14, background: C.tile, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.14), 0 4px 0 #0f1013', display: 'grid', placeItems: 'center', font: `500 34px ${FONT}`, color: C.text, transform: `scale(${lerp(.7, 1, p)})` }}>{k}</span>;
      })}
    </div>
  );
}

function Piece({ showCaptions }) {
  const { T, CUES } = useComposition();
  const A = CUES.Ads, B = CUES.Spotlight, D = CUES.Night, E = CUES.Outro, Z = CUES.Call;
  const layer = (s, e) => ({ position: 'absolute', inset: 0, opacity: MOTION.enter(T, s, s + .3) * (1 - MOTION.enter(T, e - .3, e)) });
  const end = E + 4;
  const caps = [
    { at: Z + .4, until: Z + 3.3, text: 'Dana shares a blinding white slide.' },
    { at: Z + 3.5, until: Z + 7.7, text: 'One shortcut shades the share. Clicks still go through.' },
    { at: A + .3, until: A + 1.9, text: 'Ads shouting over the article?' },
    { at: A + 2.0, until: A + 6.4, text: 'Draw a box over each one and set it to Blackout.' },
    { at: A + 6.5, until: A + 8.7, text: 'Now it’s just the article.' },
    { at: B + .3, until: B + 2.2, text: 'Need to focus on one chart?' },
    { at: B + 2.3, until: B + 5.7, text: 'Outside mode dims everything except your box.' },
    { at: D + .3, until: D + 4.0, text: '1 a.m. and the doc is pure white.' },
    { at: D + 4.1, until: D + 6.7, text: 'Invert turns white pages dark.' },
  ];
  const keys = [
    { at: Z + 3.2, until: Z + 5.0, keys: ['⌥', '⇧', 'V'] },
    { at: A + 1.4, until: A + 3.2, keys: ['⌘', '⇧', '1'] },
    { at: B + .9, until: B + 2.4, keys: ['⌘', '⇧', '1'] },
    { at: D + 1.0, until: D + 2.6, keys: ['⌘', '⇧', '1'] },
  ];
  return (
    <div data-screen-label={`t=${Math.floor(T)}s`} style={{ position: 'absolute', inset: 0, background: C.bg, overflow: 'hidden', fontFamily: FONT }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: VH, overflow: 'hidden' }}>
        <SceneBg />
        <Shot from={Z} to={A}><div style={layer(Z, A)}><CallScene T={T - Z} /></div></Shot>
        <Shot from={A} to={B}><div style={layer(A, B)}><AdsScene T={T} A={A} /></div></Shot>
        <Shot from={B} to={D}><div style={layer(B, D)}><SpotScene T={T} B={B} /></div></Shot>
        <Shot from={D} to={E}><div style={layer(D, E)}><NightScene T={T} D={D} /></div></Shot>
      </div>
      {showCaptions ? <Captions items={caps} style={{ left: 140, right: 560, bottom: 'auto', top: 974, textAlign: 'left', font: `500 40px ${FONT}`, color: C.text, textShadow: 'none', letterSpacing: '-.01em' }} /> : null}
      <Keycaps T={T} items={keys} />
      <Shot from={E} to={end + 1}><div style={layer(E, end)}><Outro T={T} E={E} /></div></Shot>
    </div>
  );
}

function TintboxPromo() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS || { motionEditor: true, captions: true });
  return (
    <React.Fragment>
      <CompositionStage width={1920} height={1080} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg="#17181d">
        <Piece showCaptions={t.captions !== false} />
      </CompositionStage>
      <TweaksPanel>
        <TweakSection label="Playback" />
        <TweakToggle label="Motion editor" value={t.motionEditor} onChange={v => setTweak('motionEditor', v)} />
        <TweakToggle label="Captions" value={t.captions} onChange={v => setTweak('captions', v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}
window.TintboxPromo = TintboxPromo;
