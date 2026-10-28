const W = 1920, VH = 920;
const X0 = 80, Y0 = 36, AW = 1760, AH = 848, DW = 40, R0 = 320, RS = (AW - DW) / 2, SB = 250;
const FONT = "'Plus Jakarta Sans', system-ui, sans-serif";
const K = { side: '#0E4B57', sideDk: '#0A3A44', teal: '#0E7C8C', tealLt: '#9FD2D9', orange: '#F08A3C', ink: '#12262B', body: '#3A4A4E', muted: '#6B7C80', faint: '#8A9A9E', line: '#E4EAEC', soft: '#F5F8F9', chip: '#F2F6F7' };
const clamp01 = v => Math.max(0, Math.min(1, v));
const lerp = (a, b, p) => a + (b - a) * p;
const MOTION = {
  enter: (T, a, b) => Easing.easeOutCubic(clamp01((T - a) / (b - a))),
  move: (T, a, b) => Easing.easeInOutCubic(clamp01((T - a) / (b - a))),
  pop: (T, a, b) => Easing.easeOutBack(clamp01((T - a) / (b - a))),
};
function track(kf, T) {
  if (T <= kf[0][0]) return kf[0].slice(1);
  for (let i = 0; i < kf.length - 1; i++) {
    const a = kf[i], b = kf[i + 1];
    if (T <= b[0]) { const p = MOTION.move(T, a[0], b[0]); return a.slice(1).map((v, j) => lerp(v, b[j + 1], p)); }
  }
  return kf[kf.length - 1].slice(1);
}
const pill = (bg, fg) => ({ fontSize: 14, fontWeight: 700, color: fg, background: bg, borderRadius: 999, padding: '4px 11px', whiteSpace: 'nowrap' });
const ST = { open: pill('#E3F5EA', '#1F7A45'), prog: pill('#FFF1DB', '#9A5B00'), closed: pill('#EEF0F2', '#5B6570') };

const CLIENTS = {
  ibm: { name: 'IBM Midwest', company: 'IBM', addr: '71 S Wacker Dr, Chicago, IL 60606', phone: '312-555-0148', kv: [['Client ID', 'IBMMW04'], ['Region / Co Code', '0042/KC2'], ['Tax Br Code', '71'], ['ARC CAB', 'N/A']], prod: [['HR / Payroll', 'Workforce Now'], ['Tax', 'SUI Filing'], ['Talent Solution', 'Recruiting'], ['TLM', 'ADP TLM']], note: ['Tim Gunn', '9/02/2019', 'Quarterly tax filing confirmed. Next check-in after Q3 close.'] },
  apple: { name: 'Apple West Coast', company: 'Apple', addr: '1 Apple Park Way, Cupertino, CA 95014', phone: '570-635-0304', kv: [['Client ID', 'CONTMID'], ['Region / Co Code', '0060/MR5'], ['Tax Br Code', '93'], ['ARC CAB', 'N/A']], prod: [['HR / Payroll', 'Autopay II'], ['Tax', 'Unemployment Claims'], ['Talent Solution', 'SASS'], ['TLM', 'ezLaborManager']], note: ['Sarah Gentry', '8/30/2019', 'Payroll contact is out until 9/16. Route anything urgent to Teddy Nugs.'] },
};
const SRS = [
  ['C-385728385', 'Payroll adjustment, missed overtime', 'prog', 'In progress'],
  ['C-385728473', 'Manual setup request, NY SUI 2018 Q3', 'open', 'Open'],
  ['C-385728472', 'W-2 reissue for former employee', 'closed', 'Closed'],
  ['C-385728311', 'Direct deposit change not applied', 'closed', 'Closed'],
  ['C-385728342', 'Garnishment setup, new order', 'closed', 'Closed'],
  ['C-385728300', 'CA EDD tax notice response', 'closed', 'Closed'],
  ['C-385728309', 'New hire batch import failed', 'closed', 'Closed'],
];
const TBL_TOP = 196, TBL_HEAD = 50, ROW = 62;

function Cursor({ x, y, down, opacity }) {
  return (
    <div style={{ position: 'absolute', left: x - 4, top: y - 3, opacity, transform: `scale(${down ? .86 : 1})`, transformOrigin: '4px 3px', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,.35))', zIndex: 50 }}>
      <svg width="34" height="40" viewBox="0 0 34 40"><path d="M4 3 L4 33 L12 26 L17.5 37.5 L22.5 35 L17 24 L28 24 Z" fill="#ffffff" stroke="#12262B" strokeWidth="2.2" strokeLinejoin="round"></path></svg>
    </div>
  );
}

function SearchIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.8)" strokeWidth="2.6" strokeLinecap="round"><circle cx="10.5" cy="10.5" r="6.5"></circle><path d="M15.5 15.5L21 21"></path></svg>;
}
function CollapseIcon() {
  return <svg width="22" height="19" viewBox="0 0 24 20" fill="none" stroke="rgba(255,255,255,.75)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="16" rx="3"></rect><path d="M9 2v16"></path><path d="M16 7.5L13.5 10L16 12.5"></path></svg>;
}
function SplitIcon({ color }) {
  return <svg width="20" height="17" viewBox="0 0 24 20" fill="none" stroke={color} strokeWidth="2.2" strokeLinejoin="round"><rect x="2" y="2" width="20" height="16" rx="3"></rect><path d="M12 2v16"></path></svg>;
}

const LIST_TOP = 142, GH = 40, CH = 56, GROUP = GH + 4 + CH + 10;
const chipCenter = (g) => ({ x: X0 + 12 + 12 + (SB - 36) / 2, y: Y0 + LIST_TOP + g * GROUP + GH + 4 + CH / 2 });

function Sidebar({ ins, appleActive, closedP, hover }) {
  const group = (g, name, time, active, chip, o = 1, h = GROUP) => (
    <div key={name} style={{ position: 'absolute', left: 12, right: 12, top: LIST_TOP + g * GROUP, height: h, opacity: o, overflow: 'hidden' }}>
      <div style={{ height: GH, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', borderRadius: 10, background: active ? '#FFFFFF' : 'transparent', boxShadow: active ? 'inset 4px 0 0 ' + K.orange : 'none', whiteSpace: 'nowrap' }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: active ? K.side : '#FFFFFF' }}>{name}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: active ? K.muted : 'rgba(255,255,255,.55)' }}>{time}</span>
      </div>
      <div style={{ marginTop: 4, marginLeft: 12, height: CH, boxSizing: 'border-box', borderRadius: 10, padding: '0 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, background: chip.hover ? 'rgba(255,255,255,.24)' : 'rgba(255,255,255,.1)', boxShadow: chip.hover ? 'inset 0 0 0 1.5px rgba(255,255,255,.5)' : 'none' }}>
        <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap' }}>SR {chip.num}</span>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,.72)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{chip.label}</span>
        </span>
        {chip.closed > 0 ? <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: '50%', background: '#1F9D55', display: 'grid', placeItems: 'center', opacity: chip.closed, transform: `scale(${lerp(.5, 1, chip.closed)})` }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg></span> : <span style={{ flexShrink: 0, width: 8, height: 8, borderRadius: '50%', background: K.orange }}></span>}
      </div>
    </div>
  );
  return (
    <div style={{ width: SB, flexShrink: 0, background: K.side, position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 20px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fff', fontWeight: 800, fontSize: 22 }}><span style={{ width: 30, height: 30, borderRadius: 8, background: K.orange, display: 'grid', placeItems: 'center', fontSize: 15 }}>C</span>CEH</span>
        <CollapseIcon />
      </div>
      <div style={{ margin: '0 16px', background: 'rgba(255,255,255,.1)', borderRadius: 10, padding: '11px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'rgba(255,255,255,.75)', fontSize: 16 }}><span>Search</span><SearchIcon /></div>
      {group(0, 'Google', '9:12 AM', false, { num: 'C-385728234', label: 'Payroll adjustment', closed: 1, hover: hover === 0 })}
      {group(1, 'IBM Midwest', '10:40 AM', !appleActive, { num: 'C-385728235', label: 'Direct deposit change', closed: closedP, hover: hover === 1 })}
      {group(2, 'Apple West Coast', '11:05 AM', appleActive, { num: 'C-385728473', label: 'Manual setup, NY SUI', closed: 0, hover: false }, ins, GROUP * ins)}
    </div>
  );
}

const CLOSE_BTN = { w: 170, h: 54 };
CLOSE_BTN.x = X0 + AW - 28 - CLOSE_BTN.w / 2; CLOSE_BTN.y = Y0 + AH - 28 - CLOSE_BTN.h / 2;

function SRDetail({ closedP, pressed }) {
  const field = (k, v) => <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}><span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: K.faint, whiteSpace: 'nowrap' }}>{k}</span><span style={{ fontSize: 17, fontWeight: 600, color: K.ink, whiteSpace: 'nowrap' }}>{v}</span></div>;
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px 28px 0', borderBottom: '1px solid ' + K.line, background: '#fff' }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: K.ink, whiteSpace: 'nowrap' }}>IBM Midwest <span style={{ color: K.faint, fontWeight: 500 }}>/ SR C-385728235</span></div>
        <div style={{ display: 'flex', gap: 30, marginTop: 18, fontSize: 17, fontWeight: 600 }}>
          <span style={{ color: K.muted }}>Request Overview</span>
          <span style={{ color: K.side, paddingBottom: 12, borderBottom: '3px solid ' + K.orange }}>Resolution</span>
          <span style={{ color: K.muted }}>History (4)</span>
          <span style={{ color: K.muted }}>Notes (2)</span>
        </div>
      </div>
      <div style={{ flex: 1, background: K.soft, padding: 24, position: 'relative' }}>
        <div style={{ background: '#fff', border: '1px solid ' + K.line, borderRadius: 14, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 1100 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <span style={{ fontSize: 26, fontWeight: 700, color: K.ink }}>Direct deposit change not applied</span>
            <span style={{ position: 'relative', display: 'inline-grid' }}>
              <span style={{ ...ST.open, gridArea: '1/1', opacity: 1 - closedP, fontSize: 16, padding: '6px 14px' }}>Open</span>
              <span style={{ ...ST.closed, gridArea: '1/1', opacity: closedP, fontSize: 16, padding: '6px 14px', textAlign: 'center' }}>Closed</span>
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 20 }}>
            {field('Contact', 'Dana Ruiz')}{field('Opened', '10:40 AM')}{field('Owner', 'Tim Gunn')}{field('Category', 'Payroll')}
          </div>
          <div style={{ background: K.soft, borderRadius: 10, padding: '14px 16px', borderBottom: '2px solid ' + K.tealLt, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 13, color: K.faint, fontWeight: 600 }}>Resolution</span>
            <span style={{ fontSize: 17, lineHeight: 1.55, color: K.ink }}>Updated the routing number on file and reran the deposit for pay date 9/13. Client confirmed the funds posted.</span>
          </div>
        </div>
        <div style={{ position: 'absolute', right: 28, bottom: 28, width: CLOSE_BTN.w, height: CLOSE_BTN.h, borderRadius: 999, display: 'grid', placeItems: 'center', fontSize: 17, fontWeight: 700, color: '#fff', background: closedP > .5 ? '#1F9D55' : K.orange, transform: `scale(${pressed ? .95 : 1})`, boxShadow: '0 8px 18px -8px rgba(240,138,60,.8)' }}>{closedP > .5 ? 'SR Closed ✓' : 'Close SR'}</div>
      </div>
    </div>
  );
}

function Dashboard({ c, oncall }) {
  const card = { background: '#fff', border: '1px solid ' + K.line, borderRadius: 14, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 };
  const h3 = { fontSize: 19, fontWeight: 700, color: K.ink };
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px 28px 0', borderBottom: '1px solid ' + K.line, background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: K.ink, whiteSpace: 'nowrap' }}>{c.name} <span style={{ color: K.faint, fontWeight: 500 }}>/ Home</span></div>
          {oncall}
        </div>
        <div style={{ display: 'flex', gap: 30, marginTop: 18, fontSize: 17, fontWeight: 600 }}>
          <span style={{ color: K.side, paddingBottom: 12, borderBottom: '3px solid ' + K.orange }}>Client Dashboard</span>
          <span style={{ color: K.muted }}>Company</span>
          <span style={{ color: K.muted }}>Payments</span>
        </div>
      </div>
      <div style={{ flex: 1, background: K.soft, padding: 24, display: 'flex', gap: 18, minHeight: 0 }}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={h3}>Company</span><span style={ST.open}>● Active</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}><span style={{ fontSize: 17, fontWeight: 700, color: K.ink }}>{c.company}</span><span style={{ fontSize: 15, color: K.body }}>{c.addr}</span><span style={{ fontSize: 15, fontWeight: 600, color: K.teal }}>{c.phone}</span></div>
            {c.kv.map(([k, v]) => <div key={k} style={{ background: K.chip, borderRadius: 9, padding: '10px 13px', display: 'flex', justifyContent: 'space-between', gap: 10, fontSize: 15, whiteSpace: 'nowrap' }}><span style={{ color: K.muted }}>{k}</span><span style={{ fontWeight: 700, color: K.ink }}>{v}</span></div>)}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={card}>
            <span style={h3}>Product Information</span>
            {c.prod.map(([k, v]) => <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}><span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: K.faint, whiteSpace: 'nowrap' }}>{k}</span><span style={{ fontSize: 16, fontWeight: 600, color: K.ink, whiteSpace: 'nowrap' }}>{v}</span></div>)}
          </div>
          <div style={{ ...card, borderTop: '4px solid ' + K.orange }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: K.faint, fontWeight: 600 }}><span>Quick note</span><span>{c.note[1]}</span></div>
            <span style={{ fontSize: 16, fontWeight: 700, color: K.teal }}>{c.note[0]}</span>
            <span style={{ fontSize: 15, lineHeight: 1.5, color: K.body }}>{c.note[2]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RailList({ o }) {
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: R0, bottom: 0, opacity: o, padding: '26px 22px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 14, background: '#fff' }}>
      <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: K.teal }}>Open SRs</span>
      <span style={{ fontSize: 21, fontWeight: 700, color: K.ink, whiteSpace: 'nowrap' }}>Apple West Coast</span>
      {SRS.slice(0, 2).map(s => (
        <div key={s[0]} style={{ border: '1px solid ' + K.line, borderRadius: 12, padding: '13px 14px', display: 'flex', flexDirection: 'column', gap: 7 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: 15, fontWeight: 700, color: K.teal }}>{s[0]}</span><span style={ST[s[2]]}>{s[3]}</span></div>
          <span style={{ fontSize: 15, color: K.ink, lineHeight: 1.4 }}>{s[1]}</span>
        </div>
      ))}
    </div>
  );
}

function SRTable({ o, T, S, hoverRow }) {
  const cols = '170px 1fr 130px';
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: RS, bottom: 0, opacity: o, display: 'flex', flexDirection: 'column', background: K.soft }}>
      <div style={{ height: 96, boxSizing: 'border-box', padding: '24px 28px 0', background: '#fff', borderBottom: '1px solid ' + K.line, fontSize: 28, fontWeight: 700, color: K.ink, whiteSpace: 'nowrap' }}>Apple West Coast <span style={{ color: K.faint, fontWeight: 500 }}>/ My SRs</span></div>
      <div style={{ position: 'absolute', left: 28, right: 28, top: 118, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 21, fontWeight: 700, color: K.ink, display: 'flex', alignItems: 'center', gap: 10 }}>Service Requests <span style={{ fontSize: 15, color: K.side, background: '#D9EEF1', borderRadius: 999, padding: '3px 10px' }}>8</span></span>
        <span style={{ fontSize: 16, fontWeight: 700, color: '#fff', background: K.orange, borderRadius: 999, padding: '11px 20px', whiteSpace: 'nowrap' }}>+ New SR</span>
      </div>
      <div style={{ position: 'absolute', left: 28, right: 28, top: TBL_TOP, background: '#fff', border: '1px solid ' + K.line, borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ height: TBL_HEAD, display: 'grid', gridTemplateColumns: cols, alignItems: 'center', padding: '0 18px', background: K.chip, fontSize: 13, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: K.muted }}><span>SR #</span><span>Abstract</span><span>Status</span></div>
        {SRS.map((s, k) => {
          const p = MOTION.enter(T, S + .55 + k * .07, S + .95 + k * .07);
          return (
            <div key={s[0]} style={{ height: ROW, display: 'grid', gridTemplateColumns: cols, alignItems: 'center', padding: '0 18px', borderTop: '1px solid #EEF2F3', fontSize: 16, opacity: p, transform: `translateY(${lerp(10, 0, p)}px)`, background: hoverRow === k ? '#FFF4EA' : '#fff', boxShadow: hoverRow === k ? 'inset 4px 0 0 ' + K.orange : 'none' }}>
              <span style={{ fontWeight: 700, color: K.teal }}>{s[0]}</span>
              <span style={{ color: K.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: 12 }}>{s[1]}</span>
              <span><span style={ST[s[2]]}>{s[3]}</span></span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Toast({ T, C }) {
  const pin = MOTION.pop(T, C + .3, C + .85), pout = MOTION.enter(T, C + 2.6, C + 3.0);
  const o = clamp01(pin) * (1 - pout);
  if (o <= 0) return null;
  const ringing = T < C + 2.4;
  const wob = ringing ? Math.sin(T * 34) * 12 * (0.5 + 0.5 * Math.sin(T * 6)) : 0;
  const pressed = T >= C + 2.32 && T < C + 2.55;
  const pulse = ringing ? (T * 1.4) % 1 : 0;
  return (
    <div style={{ position: 'absolute', left: TOAST.x, top: TOAST.y, width: TOAST.w, height: TOAST.h, boxSizing: 'border-box', opacity: o, transform: `translateY(${lerp(-30, 0, clamp01(pin))}px) scale(${lerp(1, .9, pout)})`, background: '#fff', borderRadius: 18, boxShadow: '0 24px 60px -12px rgba(8,40,48,.45), 0 0 0 1px rgba(14,75,87,.08)', padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 18, zIndex: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ position: 'relative', width: 54, height: 54, flexShrink: 0 }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#1F9D55', opacity: .35 * (1 - pulse), transform: `scale(${1 + pulse * .8})` }}></div>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#1F9D55', display: 'grid', placeItems: 'center', transform: `rotate(${wob}deg)` }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff"><path d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"></path></svg>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#1F7A45' }}>Incoming call</span>
          <span style={{ fontSize: 20, fontWeight: 700, color: K.ink, whiteSpace: 'nowrap' }}>Teddy Nugs</span>
          <span style={{ fontSize: 15, color: K.muted, whiteSpace: 'nowrap' }}>Apple West Coast · Client ID CONTMID</span>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <span style={{ width: 120, height: 46, borderRadius: 999, border: '1.5px solid ' + K.line, display: 'grid', placeItems: 'center', fontSize: 16, fontWeight: 700, color: K.body }}>Decline</span>
        <span style={{ width: TOAST.bw, height: 46, borderRadius: 999, background: pressed ? '#177A42' : '#1F9D55', display: 'grid', placeItems: 'center', fontSize: 16, fontWeight: 700, color: '#fff', transform: `scale(${pressed ? .95 : 1})`, boxShadow: '0 8px 18px -8px rgba(31,157,85,.8)' }}>Answer</span>
      </div>
    </div>
  );
}
const TOAST = { w: 480, h: 168, bw: 130 };
TOAST.x = X0 + AW - 28 - TOAST.w; TOAST.y = Y0 + 110;
TOAST.ax = TOAST.x + TOAST.w - 24 - TOAST.bw / 2; TOAST.ay = TOAST.y + TOAST.h - 22 - 23;

function Piece({ showCaptions }) {
  const { T, CUES } = useComposition();
  const CL = CUES.Close, C = CUES.Call, A = CUES.Answer, S = CUES.Split, J = CUES.Jump, Q = CUES.Queue, END = Q + 3.6;

  const closeAt = CL + 1.9;
  const closedP = MOTION.enter(T, closeAt + .1, closeAt + .45);
  const pressedClose = T >= closeAt - .1 && T < closeAt + .1;
  const p1 = MOTION.move(T, A + .9, A + 1.6), p2 = MOTION.move(T, S + .2, S + 1.2);
  const rightW = p2 > 0 ? lerp(R0, RS, p2) : R0 * p1;
  const divW = DW * p1, leftW = AW - rightW - divW;
  const ins = MOTION.enter(T, A + .05, A + .6), appleActive = T >= A + .2;
  const pMain = MOTION.move(T, A + .25, A + .8);
  const splitActive = T >= S + .12;
  const pulse = T >= A + 1.6 && !splitActive ? (T * 1.2) % 1 : 0;
  const callO = MOTION.enter(T, C + 2.8, C + 3.2);
  const secs = Math.max(0, Math.floor(T - (C + 2.5)));
  const oncall = callO > 0 ? <span style={{ opacity: callO, display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 700, color: '#1F7A45', background: '#E3F5EA', borderRadius: 999, padding: '7px 14px', whiteSpace: 'nowrap' }}><span style={{ width: 9, height: 9, borderRadius: '50%', background: '#1F9D55' }}></span>On call · {Math.floor(secs / 60)}:{String(secs % 60).padStart(2, '0')}</span> : null;

  const iconY = Y0 + AH / 2, railIconX = X0 + AW - R0 - DW / 2;
  const g0 = chipCenter(0), g1 = chipCenter(1);
  const cur = track([
    [0, 1250, 620], [CL + 1.6, CLOSE_BTN.x, CLOSE_BTN.y], [C + .3, CLOSE_BTN.x - 20, CLOSE_BTN.y - 30], [C + 2.1, TOAST.ax, TOAST.ay], [A + 1.9, TOAST.ax - 40, TOAST.ay + 160],
    [A + 3.0, railIconX, iconY], [S + .6, railIconX, iconY], [J + .3, g0.x + 30, g0.y], [J + 1.4, g0.x + 30, g0.y], [J + 2.0, g1.x + 30, g1.y], [Q + 3.0, g1.x + 30, g1.y],
  ], T);
  const down = pressedClose || (T >= C + 2.32 && T < C + 2.55) || (T >= S - .05 && T < S + .15);
  const curO = MOTION.enter(T, .2, .6) * (1 - MOTION.enter(T, Q + 2.6, Q + 3.0));
  const hover = T >= J + .3 && T < J + 1.6 ? 0 : T >= J + 1.95 && T < Q + 3.0 ? 1 : -1;
  const hoverRow = T >= S + 1.6 ? 1 : -1;

  const cam = track([
    [0, 1, 960, 460], [CL + 1.4, 1.03, 1000, 480], [C + .4, 1.03, 1000, 480], [C + 1.2, 1.14, 1360, 330], [C + 2.7, 1.14, 1360, 330], [A + 1.0, 1, 960, 460],
    [A + 2.2, 1, 960, 460], [A + 3.0, 1.1, 1350, 460], [S + .3, 1.1, 1350, 460], [S + 1.5, 1, 960, 460],
    [J + .1, 1, 960, 460], [J + 1.0, 1.35, 680, 360], [Q + 3.6, 1.42, 660, 350],
  ], T);
  const fade = 1 - MOTION.enter(T, 0, .5) + MOTION.enter(T, END - .5, END);

  const caps = [
    { at: .3, until: A - .05, text: 'A rep is closing out a service request when a new call comes in.' },
    { at: A + .2, until: S - .05, text: 'Answering the call automatically opens the new client in the left sidebar.' },
    { at: S + .2, until: J - .05, text: 'They are now fully prepared to take this call.' },
    { at: J + .2, until: Q - .05, text: 'They can jump back to previous service requests or client accounts at any time.' },
    { at: Q + .2, until: END - .4, text: 'The queue builds as a reflection of their day.' },
  ];

  return (
    <div data-screen-label={`t=${Math.floor(T)}s`} style={{ position: 'absolute', inset: 0, background: '#0F1C20', overflow: 'hidden', fontFamily: FONT }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: showCaptions ? VH : 1080, overflow: 'hidden', background: 'radial-gradient(1100px 700px at 70% 25%, rgba(14,124,140,.22), transparent 70%), #0F1C20' }}>
        <div style={{ position: 'absolute', left: 0, top: showCaptions ? 0 : 80, width: W, height: VH, transformOrigin: '0 0', transform: `translate(${W / 2}px, ${VH / 2}px) scale(${cam[0]}) translate(${-cam[1]}px, ${-cam[2]}px)` }}>
          <div style={{ position: 'absolute', left: X0, top: Y0, width: AW, height: AH, borderRadius: 18, overflow: 'hidden', background: '#fff', boxShadow: '0 40px 100px rgba(0,0,0,.5)', display: 'flex' }}>
            <div style={{ width: leftW, flexShrink: 0, display: 'flex', minWidth: 0 }}>
              <Sidebar ins={ins} appleActive={appleActive} closedP={closedP} hover={hover} />
              <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 1 - pMain }}><SRDetail closedP={closedP} pressed={pressedClose} /></div>
                <div style={{ position: 'absolute', inset: 0, opacity: pMain }}><Dashboard c={CLIENTS.apple} oncall={oncall} /></div>
              </div>
            </div>
            <div style={{ width: divW, flexShrink: 0, background: K.sideDk, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, color: 'rgba(255,255,255,.8)', fontSize: 12, overflow: 'hidden', position: 'relative', zIndex: 2 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, display: 'grid', placeItems: 'center', fontSize: 12, color: '#fff', background: !splitActive ? K.orange : 'transparent', boxShadow: !splitActive ? '0 6px 16px -4px rgba(240,138,60,.8)' : 'none' }}>▶</div>
              <div style={{ position: 'relative', width: 34, height: 34 }}>
                {pulse ? <div style={{ position: 'absolute', inset: 0, borderRadius: 9, boxShadow: `0 0 0 ${2 + pulse * 10}px rgba(240,138,60,${.6 * (1 - pulse)})` }}></div> : null}
                <div style={{ position: 'absolute', inset: 0, borderRadius: 9, display: 'grid', placeItems: 'center', background: splitActive ? K.orange : 'transparent', boxShadow: splitActive ? '0 6px 16px -4px rgba(240,138,60,.8)' : 'inset 0 0 0 1.5px rgba(255,255,255,.35)' }}><SplitIcon color="#fff" /></div>
              </div>
              <div style={{ width: 34, height: 34, display: 'grid', placeItems: 'center' }}>◀</div>
            </div>
            <div style={{ width: rightW, flexShrink: 0, position: 'relative', overflow: 'hidden', boxShadow: 'inset 1px 0 0 ' + K.line }}>
              <RailList o={1 - p2} />
              <SRTable o={p2} T={T} S={S} hoverRow={hoverRow} />
            </div>
          </div>
          <Toast T={T} C={C} />
          <Cursor x={cur[0]} y={cur[1]} down={down} opacity={curO} />
        </div>
      </div>
      {showCaptions ? <Captions items={caps} style={{ left: 120, right: 120, bottom: 'auto', top: 968, textAlign: 'left', font: `500 40px ${FONT}`, color: '#EEF3F4', textShadow: 'none', letterSpacing: '-.01em' }} /> : null}
      <div style={{ position: 'absolute', inset: 0, background: '#0F1C20', opacity: clamp01(fade), pointerEvents: 'none' }}></div>
    </div>
  );
}

function AdpFlow() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS || { motionEditor: true, captions: true });
  return (
    <React.Fragment>
      <CompositionStage width={1920} height={1080} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg="#0F1C20">
        <Piece showCaptions={t.captions !== false && !/cover=1/.test(location.search)} />
      </CompositionStage>
      <TweaksPanel>
        <TweakSection label="Playback" />
        <TweakToggle label="Motion editor" value={t.motionEditor} onChange={v => setTweak('motionEditor', v)} />
        <TweakToggle label="Captions" value={t.captions} onChange={v => setTweak('captions', v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}
window.AdpFlow = AdpFlow;
