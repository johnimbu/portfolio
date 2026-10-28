const W = 1920, VH = 920;
const DX = 60, DY = 44, DW = 1320, DH = 836, CHROME = 44;
const VX = DX, VY = DY + CHROME, VW = DW, VHT = DH - CHROME;
const PX = 1462, PY = 44, PW = 400, PH = 836, BZ = 14, SBAR = 40;
const MVX = PX + BZ, MVY = PY + BZ + SBAR, MVW = PW - BZ * 2, MVH = PH - BZ * 2 - SBAR;
const RED = '#D7263D', INK = '#1A1A1A', MUTED = '#6E6E6E', LINE = '#E3E3E3', PURPLE = '#3A2B8C';
const UI = "'Archivo', system-ui, sans-serif", DISP = "'Brush Script MT', 'Brush Script Std', 'Segoe Script', cursive";
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

/* ---------- shared data ---------- */
const DAYS_A = [['Friday, 09/21', 'Fri 09/21', 23], ['Saturday, 09/22', 'Sat 09/22', 36], ['Sunday, 09/23', 'Sun 09/23', 12]];
const DAYS_B = [['Friday, 11/16', 'Fri 11/16', 14], ['Saturday, 11/17', 'Sat 11/17', 18], ['Sunday, 11/18', 'Sun 11/18', 9]];
const MONTHS = [['September 2018', 6, 30, 21], ['October 2018', 1, 31, -1], ['November 2018', 4, 30, 16]];
const POSTERS = {
  dream: { bg: 'linear-gradient(160deg, #1B2A6B 0%, #6A2C8F 55%, #E05BA0 100%)', fg: '#FFFFFF', title: 'Dream Freaks Fall from Space' },
  tales: { bg: 'radial-gradient(circle at 75% 20%, #3E5A4A 0%, #0F1A14 70%)', fg: '#F2D03B', title: 'Tales from the Six' },
  wild: { bg: 'linear-gradient(150deg, #0E3A5C 0%, #1F6E8C 100%)', fg: '#F7D046', title: "It's a Wild, Rowdy, Wonderful Life" },
  best: { bg: 'linear-gradient(160deg, #F6F1E8 0%, #E9E2F5 100%)', fg: '#D63C8E', dark: true, title: 'The Best Is Yet to Come Undone' },
};
const PRICES = [['Premium Rail', '31', 16], ['General Admission', '18', 9], ['Front Row', '55', 4]];

/* ---------- desktop geometry ---------- */
const NAV = 88, HERO_F = 300, RES_TOP = NAV + HERO_F + 80, CARD0 = RES_TOP + 120, CARD_H = 290;
const ROW1 = 28, ROW2 = 150, BTN_X = 900, BTN_STEP = 112, BTN_W = 100;
const DSEL = { x: 330, y: NAV + 130, w: 300, h: 46 };
const DCAL = { x: 330, y: NAV + 182, w: 300, cw: 38, ch: 30 };
const SEARCH_D = { x: 812 + 85, y: NAV + 130 + 23 };
const QV_D = { x: 104 + 60, y: CARD0 + 238 + 17 };
const SCROLL_F = 360;
const MX = 430, MY = 50, MWID = 460;
const FULL_D = { x: MX + MWID / 2, y: MY + 526 + 22 };
const HERO_D = 380, FIND_D = { x: 960 + 110, y: NAV + HERO_D - 110 + 23 };
const INFO_TOP = NAV + HERO_D + 290, DATES_TOP = INFO_TOP + 220, DROW0 = DATES_TOP + 130;
const P18X = BTN_X + BTN_STEP + BTN_W / 2;
const FRI_D = { x: P18X, y: DROW0 + ROW1 + 51 }, SAT_D = { x: P18X, y: DROW0 + 278 + ROW1 + 51 };
const SCROLL_DD = 1020;

/* ---------- mobile geometry ---------- */
const MNAV = 56, MHERO = 330, MCARD0 = MNAV + MHERO + 60 + 94, MCARD_H = 400;
const MSEL = { x: 16, y: MNAV + 110, w: MVW - 32, h: 44 };
const MCAL = { x: 16, y: MNAV + 160, w: MVW - 32, cw: (MVW - 64) / 7, ch: 32 };
const SEARCH_M = { x: MVW / 2, y: MNAV + 222 + 22 };
const QV_M = { x: 313, y: MCARD0 + 36 + 15 };
const SCROLL_M1 = 470, SCROLL_M2 = SCROLL_M1 + MCARD_H;
const SHEET_P18 = { x: 24 + 114 + 52, y: 12 + 438 + 29 }, SHEET_BACK = { x: MVW / 2, y: 12 + 602 + 8 };

const calCell = (cal, first, day) => { const i = first + day - 1; return { x: cal.x + 16 + (i % 7) * cal.cw + cal.cw / 2, y: cal.y + 74 + Math.floor(i / 7) * cal.ch + cal.ch / 2 }; };
const calNext = (cal) => ({ x: cal.x + cal.w - 26, y: cal.y + 26 });

function Poster({ k, w, h, style }) {
  const p = POSTERS[k];
  return (
    <div style={{ width: w, height: h, background: p.bg, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', padding: Math.round(h * .09), boxSizing: 'border-box', ...style }}>
      <img src={p.dark ? 'logo-black.png' : 'logo-white.png'} alt="" style={{ position: 'absolute', left: Math.round(h * .09), top: Math.round(h * .09), height: Math.round(h * .1), opacity: .9 }} />
      <span style={{ fontFamily: DISP, fontSize: Math.round(h * .16), lineHeight: 1.05, color: p.fg, maxWidth: '88%' }}>{p.title}</span>
    </div>
  );
}

function Price({ label, amt, left, w = BTN_W, h = 62, hot = 0, pressed, small }) {
  return (
    <div style={{ width: w, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <span style={{ fontSize: small ? 10 : 11, color: MUTED, whiteSpace: 'nowrap' }}>{label}</span>
      <div style={{ width: w, height: h, borderRadius: 6, background: pressed ? '#A8182B' : RED, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: `0 ${4 + hot * 8}px ${10 + hot * 14}px -4px rgba(215,38,61,${.45 + hot * .4})`, transform: `translateY(${-hot * 4}px) scale(${pressed ? .95 : 1})` }}>
        <span style={{ fontWeight: 800, fontSize: small ? 22 : 28, lineHeight: 1 }}><span style={{ fontSize: small ? 12 : 14, verticalAlign: 'top' }}>$</span>{amt}</span>
        <span style={{ fontSize: small ? 10 : 11, fontWeight: 600, marginTop: 3 }}>Buy Tickets</span>
      </div>
      <span style={{ fontSize: small ? 10 : 11, color: RED, fontWeight: 800, whiteSpace: 'nowrap', visibility: left ? 'visible' : 'hidden' }}>{left ? 'Only ' + left + ' left' : '.'}</span>
    </div>
  );
}
function TimeRow({ top, time, hot = 0, pressed, urgent = -1, urgentN = 0 }) {
  return (
    <div style={{ position: 'absolute', left: 760, top, display: 'flex', alignItems: 'center' }}>
      <span style={{ width: 140, fontSize: 22, fontWeight: 800, color: INK }}>{time}</span>
      <div style={{ display: 'flex', gap: BTN_STEP - BTN_W }}>{PRICES.map((p, i) => <Price key={i} label={p[0]} amt={p[1]} left={i === urgent ? urgentN : 0} hot={i === 1 ? hot : 0} pressed={i === 1 && pressed} />)}</div>
    </div>
  );
}

function Calendar({ cal, o, month, sel, small }) {
  if (o <= 0) return null;
  const [name, first, days, pick] = MONTHS[month];
  const day = sel || pick;
  const wk = month === 2 && sel ? [16, 17, 18] : [];
  return (
    <div style={{ position: 'absolute', left: cal.x, top: cal.y, width: cal.w, boxSizing: 'border-box', padding: '14px 16px 16px', background: '#fff', borderRadius: 6, boxShadow: '0 20px 50px rgba(0,0,0,.45)', opacity: o, transform: `translateY(${lerp(-8, 0, o)}px)`, zIndex: 30 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 26 }}>
        <span style={{ color: MUTED, fontSize: 18 }}>‹</span>
        <span style={{ fontSize: small ? 14 : 15, fontWeight: 800, color: INK }}>{name}</span>
        <span style={{ color: INK, fontSize: 18, fontWeight: 700 }}>›</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(7, ${cal.cw}px)`, marginTop: 10, fontSize: 11, fontWeight: 700, color: MUTED, textAlign: 'center' }}>{'SMTWTFS'.split('').map((d, i) => <span key={i} style={{ height: 22 }}>{d}</span>)}</div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(7, ${cal.cw}px)`, gridAutoRows: cal.ch + 'px', fontSize: 13, color: INK, textAlign: 'center' }}>
        {Array.from({ length: first }).map((_, i) => <span key={'e' + i}></span>)}
        {Array.from({ length: days }).map((_, i) => {
          const d = i + 1, on = d === day, inWk = wk.includes(d);
          return <span key={d} style={{ display: 'grid', placeItems: 'center' }}><span style={{ width: cal.ch - 4, height: cal.ch - 4, borderRadius: '50%', display: 'grid', placeItems: 'center', background: on ? RED : inWk ? '#FBE3E6' : 'transparent', color: on ? '#fff' : INK, fontWeight: on || inWk ? 800 : 500 }}>{d}</span></span>;
        })}
      </div>
    </div>
  );
}

function DayTabs({ p, tabW, gap, h, mobile }) {
  const group = (days, o, dx) => (
    <div style={{ position: 'absolute', left: '50%', bottom: 0, display: 'flex', alignItems: 'flex-end', gap, opacity: o, transform: `translateX(calc(-50% + ${dx}px))` }}>
      {days.map(([long, short, n], i) => (
        <div key={long} style={{ width: tabW, height: i === 0 ? h - 14 : h - 24, flexShrink: 0, background: i === 0 ? '#fff' : '#D9D9D9', borderRadius: '4px 4px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <span style={{ fontSize: mobile ? 12 : 14, fontWeight: 800, color: INK, whiteSpace: 'nowrap' }}>{mobile ? short : long}</span>
          <span style={{ fontSize: mobile ? 10 : 12, color: MUTED }}>{n} shows</span>
        </div>
      ))}
    </div>
  );
  const side = mobile ? 4 : `calc(50% - ${tabW * 1.5 + gap + 130}px)`;
  const arrow = { position: 'absolute', bottom: mobile ? 14 : 22, fontSize: mobile ? 16 : 11, fontWeight: 700, color: '#fff', letterSpacing: '.06em', whiteSpace: 'nowrap' };
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: h, overflow: 'hidden' }}>
      {group(DAYS_A, 1 - p, -60 * p)}
      {group(DAYS_B, p, 60 * (1 - p))}
      <span style={{ ...arrow, left: side }}>{mobile ? '‹' : '‹  LAST 3 DAYS'}</span>
      <span style={{ ...arrow, right: side }}>{mobile ? '›' : 'NEXT 3 DAYS  ›'}</span>
    </div>
  );
}

function DNav() {
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: VW, height: NAV }}>
      <div style={{ height: 56, background: '#0E0E0E', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 70px' }}>
        <img src="logo-white.png" alt="The Second City" style={{ height: 30, display: 'block' }} />
        <span style={{ fontSize: 13, color: '#fff', border: '1px solid rgba(255,255,255,.6)', borderRadius: 4, padding: '6px 12px' }}>Chicago ⌄</span>
      </div>
      <div style={{ height: 32, background: '#2B2B2B', display: 'flex', alignItems: 'center', gap: 34, padding: '0 70px', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', color: '#fff' }}>
        <span>SEE A SHOW</span><span>TAKE A CLASS</span><span>PLAN AN EVENT</span><span>IMPROVE YOUR BUSINESS</span>
      </div>
    </div>
  );
}
const field = { borderRadius: 4, background: 'rgba(0,0,0,.55)', border: '1px solid rgba(255,255,255,.4)', color: '#fff', boxSizing: 'border-box', fontWeight: 700 };
const btnLight = (p) => ({ borderRadius: 4, background: p ? '#CFCFCF' : '#EDEDED', display: 'grid', placeItems: 'center', fontWeight: 800, letterSpacing: '.08em', color: INK, transform: `scale(${p ? .96 : 1})` });

function ShowCard({ top, poster, qvPressed, urgent }) {
  return (
    <div style={{ position: 'absolute', left: 80, top, width: 1160, height: CARD_H, background: '#fff', border: '1px solid ' + LINE, borderRadius: 4 }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 26, borderBottom: '1px solid ' + LINE, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', fontSize: 11, color: MUTED }}><span>Fri, Nov 16 · Sat, Nov 17 · Sun, Nov 18</span><span>Staff Recommended</span></div>
      <Poster k={poster} w={300} h={167} style={{ position: 'absolute', left: 24, top: 40 }} />
      <span style={{ position: 'absolute', left: 24, top: 220, fontSize: 15, fontWeight: 800, color: INK, letterSpacing: '.02em', textTransform: 'uppercase' }}>{POSTERS[poster].title}</span>
      <span style={{ position: 'absolute', left: 24, top: 248, width: 120, height: 32, boxSizing: 'border-box', border: '2px solid ' + INK, borderRadius: 4, display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 800, letterSpacing: '.06em', background: qvPressed ? INK : '#fff', color: qvPressed ? '#fff' : INK }}>QUICK VIEW</span>
      <div style={{ position: 'absolute', left: -80, top: 0 }}>
        <TimeRow top={ROW1} time="Fri 8:00PM" urgent={urgent ? 2 : -1} urgentN={4} />
        <TimeRow top={ROW2} time="Sat 8:00PM" />
      </div>
    </div>
  );
}

function DesktopFinder({ scroll, picked, wk, searchPressed, qvPressed }) {
  return (
    <div style={{ position: 'absolute', left: 0, top: -scroll, width: VW, height: 1800, background: '#fff' }}>
      <DNav />
      <div style={{ position: 'absolute', left: 0, top: NAV, width: VW, height: HERO_F + 80, overflow: 'hidden', background: '#3A0A14' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url("hero-audience.png")', backgroundSize: 'cover', backgroundPosition: '50% 45%' }}></div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(20,4,8,.85) 0%, rgba(20,4,8,.55) 55%, rgba(20,4,8,.25) 100%), linear-gradient(0deg, rgba(20,4,8,.6), transparent 40%)' }}></div>
        <div style={{ position: 'absolute', left: 330, top: 34, fontFamily: DISP, fontSize: 42, color: '#fff' }}>Chicago Show Finder</div>
        <div style={{ position: 'absolute', left: 330, top: 108, fontSize: 10, fontWeight: 800, color: '#fff', letterSpacing: '.08em' }}>SELECT DATE</div>
        <div style={{ ...field, position: 'absolute', left: DSEL.x, top: 130, width: DSEL.w, height: DSEL.h, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', fontSize: 15 }}><span>{picked ? 'Friday, 11/16' : 'Friday, 09/21'}</span><span>⌄</span></div>
        <div style={{ position: 'absolute', left: 646, top: 108, fontSize: 10, fontWeight: 800, color: '#fff', letterSpacing: '.08em' }}>TICKET QUANTITY</div>
        <div style={{ ...field, position: 'absolute', left: 646, top: 130, width: 150, height: 46, display: 'grid', placeItems: 'center', fontSize: 17 }}>02</div>
        <div style={{ ...btnLight(searchPressed), position: 'absolute', left: 812, top: 130, width: 170, height: 46, fontSize: 13 }}>SEARCH</div>
        <DayTabs p={wk} tabW={200} gap={10} h={80} />
      </div>
      <div style={{ position: 'absolute', left: 80, top: RES_TOP + 24, fontSize: 14, color: INK, whiteSpace: 'nowrap' }}>Showing <b style={{ color: RED }}>{picked ? 41 : 71}</b> shows, <b>Friday to Sunday, {picked ? 'November 16 to 18' : 'September 21 to 23'}</b></div>
      <div style={{ position: 'absolute', left: 80, top: RES_TOP + 58, right: 80, display: 'flex', alignItems: 'center', gap: 16 }}><span style={{ fontFamily: DISP, fontSize: 30, color: INK }}>Headline Shows</span><span style={{ flex: 1, height: 1, background: LINE }}></span></div>
      <ShowCard top={CARD0} poster="dream" qvPressed={qvPressed} urgent />
      <ShowCard top={CARD0 + CARD_H + 18} poster="tales" />
      <ShowCard top={CARD0 + (CARD_H + 18) * 2} poster="wild" />
      <ShowCard top={CARD0 + (CARD_H + 18) * 3} poster="best" />
    </div>
  );
}

function QuickBody({ k, posterH }) {
  return (
    <React.Fragment>
      <Poster k={k} w="100%" h={posterH} style={{ borderRadius: 2, flexShrink: 0 }} />
      <span style={{ fontSize: 12, fontWeight: 800, color: INK, letterSpacing: '.03em' }}>2 HOURS  |  SEATING 45 MIN PRIOR  |  10 MIN INTERMISSION</span>
      <span style={{ fontSize: 14, lineHeight: 1.5, color: '#333' }}>{k === 'dream' ? "Holds a funhouse mirror up to the already bizarre times we're living in. Surreal, musical, and maniacal." : 'A spooky, very local revue about the city after dark. New sketches and a fully improvised third act.'}</span>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: PURPLE, border: '1.5px solid ' + PURPLE, borderRadius: 999, padding: '4px 12px' }}>Sketch Comedy</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: RED, border: '1.5px solid ' + RED, borderRadius: 999, padding: '4px 12px' }}>PG-13</span>
      </div>
    </React.Fragment>
  );
}

function DesktopModal({ o, s, fullPressed }) {
  if (o <= 0) return null;
  return (
    <React.Fragment>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,.55)', backdropFilter: 'blur(5px)', opacity: o }}></div>
      <div style={{ position: 'absolute', left: MX, top: MY, width: MWID, height: 640, boxSizing: 'border-box', background: '#fff', borderRadius: 6, boxShadow: '0 30px 70px rgba(0,0,0,.35)', padding: 16, display: 'flex', flexDirection: 'column', gap: 12, opacity: o, transform: `scale(${s})`, transformOrigin: '50% 40%' }}>
        <QuickBody k="dream" posterH={238} />
        <div style={{ position: 'absolute', left: 16, right: 16, top: 470, height: 44, borderRadius: 4, background: RED, color: '#fff', display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 800, letterSpacing: '.08em' }}>VIEW ALL DATES</div>
        <div style={{ position: 'absolute', left: 16, right: 16, top: 526, height: 44, boxSizing: 'border-box', borderRadius: 4, border: '2px solid ' + INK, background: fullPressed ? INK : '#fff', color: fullPressed ? '#fff' : INK, display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 800, letterSpacing: '.08em', transform: `scale(${fullPressed ? .97 : 1})` }}>FULL SHOW DETAILS</div>
        <span style={{ position: 'absolute', left: 0, right: 0, top: 592, textAlign: 'center', fontSize: 13, color: INK, textDecoration: 'underline' }}>Back to Search</span>
        <span style={{ position: 'absolute', right: -14, top: -14, width: 34, height: 34, borderRadius: '50%', background: RED, color: '#fff', display: 'grid', placeItems: 'center', fontSize: 16, fontWeight: 800 }}>✕</span>
      </div>
    </React.Fragment>
  );
}

function DateBlock({ top, label, hot = 0, pressed, urgent }) {
  return (
    <div style={{ position: 'absolute', left: 120, top, width: 1080, height: 260, border: '1px solid ' + (hot > .1 ? '#F2B8C0' : LINE), borderRadius: 4, background: '#fff' }}>
      <span style={{ position: 'absolute', left: 28, top: 48, fontSize: 17, fontWeight: 800, color: INK }}>{label}</span>
      <span style={{ position: 'absolute', left: 28, top: 74, fontSize: 12, color: INK, textDecoration: 'underline' }}>View all shows on this date</span>
      <div style={{ position: 'absolute', left: -120, top: 0 }}>
        <TimeRow top={ROW1} time="8:00PM" hot={hot} pressed={pressed} urgent={urgent ? 1 : -1} urgentN={3} />
        <TimeRow top={ROW2 - 10} time="11:00PM" />
      </div>
    </div>
  );
}

function DesktopDetail({ scroll, findPressed, hotFri, hotSat, buyPressed }) {
  return (
    <div style={{ position: 'absolute', left: 0, top: -scroll, width: VW, height: 2600, background: '#fff' }}>
      <DNav />
      <div style={{ position: 'absolute', left: 0, top: NAV, width: VW, height: HERO_D, overflow: 'hidden', background: '#140814' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(260px 220px at 62% 38%, rgba(255,90,170,.55), transparent 70%), radial-gradient(200px 180px at 84% 48%, rgba(120,150,255,.55), transparent 70%), radial-gradient(160px 140px at 40% 60%, rgba(255,200,120,.35), transparent 70%), linear-gradient(180deg, #1A0B22 0%, #0C0610 100%)' }}></div>
        <span style={{ position: 'absolute', left: 70, bottom: 40, fontFamily: DISP, fontSize: 56, color: '#fff' }}>Dream Freaks Fall from Space</span>
        <div style={{ ...btnLight(findPressed), position: 'absolute', left: 960, top: HERO_D - 110, width: 220, height: 46, fontSize: 13 }}>FIND TICKETS</div>
        <span style={{ position: 'absolute', left: 960, width: 220, top: HERO_D - 52, textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,.8)' }}>✓ Staff Recommended</span>
      </div>
      <Poster k="dream" w={320} h={178} style={{ position: 'absolute', left: 104, top: NAV + HERO_D + 50 }} />
      <div style={{ position: 'absolute', left: 470, top: NAV + HERO_D + 50, width: 730, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: INK, letterSpacing: '.04em' }}>ABOUT THE SHOW</span>
        <span style={{ fontSize: 14, lineHeight: 1.55, color: '#333' }}>Dream Freaks Fall from Space holds a funhouse mirror up to the already bizarre times we're living in. The powerhouse cast delivers a show that's surreal, musical, maniacal, and utterly entertaining all at the same time.</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: MUTED }}>2 HOURS  |  SEATING 45 MIN PRIOR TO SHOW  |  10 MIN INTERMISSION</span>
      </div>
      <div style={{ position: 'absolute', left: 104, top: NAV + HERO_D + 244, display: 'flex', alignItems: 'center', gap: 14 }}><span style={{ fontSize: 12, fontWeight: 800, color: INK }}>HAVE A PARTY OF 16 OR MORE?</span><span style={{ fontSize: 11, fontWeight: 800, border: '2px solid ' + INK, borderRadius: 3, padding: '7px 14px', color: INK }}>PLAN AN EVENT</span></div>
      <div style={{ position: 'absolute', left: 104, top: INFO_TOP + 20, right: 104, display: 'grid', gridTemplateColumns: '260px 1fr 1fr', gap: 40, fontSize: 13, color: '#333', lineHeight: 1.55 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: INK }}>THEATER</span>
          <span>Mainstage | Wells<br />1616 N Wells Street<br />Chicago, IL 60614</span>
          <span style={{ color: RED, fontWeight: 700 }}>Get Directions</span>
          <span>Need parking? <span style={{ color: RED, fontWeight: 700 }}>Find Parking</span></span>
          <span>Box Office <span style={{ color: RED, fontWeight: 700 }}>312-337-3992</span></span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: INK }}>PERFORMANCE TIMES</span>
          <span>Tuesdays, Wednesdays and Thursdays at 8pm<br />Fridays and Saturdays at 8pm and 11pm<br />Sundays at 7pm</span>
          <span style={{ fontWeight: 700, color: INK }}>Free improvised third act after the main show</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: INK }}>FOOD AND BEVERAGE</span>
          <span>Full bar and table service during the show.</span>
          <span style={{ color: RED, fontWeight: 700 }}>1959 Kitchen and Bar</span>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 104, top: DATES_TOP + 24, fontSize: 15, fontWeight: 800, color: INK, letterSpacing: '.04em' }}>SHOW DATES</div>
      <div style={{ position: 'absolute', left: 120, top: DATES_TOP + 58, width: 260, height: 40, background: '#8F8F8F', borderRadius: 2, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', boxSizing: 'border-box', fontSize: 13, fontWeight: 700 }}><span>Weekend of 11/16</span><span>⌄</span></div>
      <DateBlock top={DROW0} label="FRIDAY, NOVEMBER 16" hot={hotFri} />
      <DateBlock top={DROW0 + 278} label="SATURDAY, NOVEMBER 17" hot={hotSat} pressed={buyPressed} urgent />
      <DateBlock top={DROW0 + 278 * 2} label="SUNDAY, NOVEMBER 18" />
      <div style={{ position: 'absolute', left: 104, right: 104, top: DROW0 + 278 * 3 + 10, display: 'flex', flexDirection: 'column' }}>
        {['Media', "Critics' Reviews", 'Guest Reviews', 'The Cast'].map(t => <div key={t} style={{ height: 48, borderTop: '1px solid ' + LINE, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', fontSize: 14, fontWeight: 700, color: INK }}><span>{t}</span><span style={{ fontSize: 18 }}>+</span></div>)}
      </div>
    </div>
  );
}

function Handoff({ o, mobile, line }) {
  if (o <= 0) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#F1F1F1', opacity: o, display: 'grid', placeItems: 'center', zIndex: 35 }}>
      <div style={{ width: mobile ? MVW - 48 : 560, padding: mobile ? '28px 18px' : '40px 36px', boxSizing: 'border-box', border: '2px dashed #A8A8A8', borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center', transform: `scale(${lerp(.96, 1, o)})` }}>
        <span style={{ fontSize: mobile ? 18 : 24, fontWeight: 800, color: '#555' }}>[Handoff to ticket purchase]</span>
        <span style={{ fontSize: mobile ? 13 : 15, color: MUTED, lineHeight: 1.5 }}>{line}</span>
      </div>
    </div>
  );
}

/* ---------- mobile ---------- */
function MNavBar() {
  return <div style={{ position: 'absolute', left: 0, top: 0, width: MVW, height: MNAV, background: '#0E0E0E', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', boxSizing: 'border-box' }}><img src="logo-white.png" alt="The Second City" style={{ height: 24, display: 'block' }} /><span style={{ color: '#fff', fontSize: 20 }}>≡</span></div>;
}
function MShowCard({ top, poster, qvPressed, urgent }) {
  return (
    <div style={{ position: 'absolute', left: 0, top, width: MVW, height: MCARD_H, padding: '12px 16px', boxSizing: 'border-box', borderTop: '1px solid ' + LINE, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <span style={{ fontSize: 11, color: MUTED }}>Fri, Sat and Sun this weekend</span>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 30 }}>
        <span style={{ fontSize: 12, fontWeight: 800, color: INK, maxWidth: 220, textTransform: 'uppercase' }}>{POSTERS[poster].title}</span>
        <span style={{ width: 86, height: 30, boxSizing: 'border-box', border: '2px solid ' + INK, borderRadius: 4, display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 800, background: qvPressed ? INK : '#fff', color: qvPressed ? '#fff' : INK }}>QUICK VIEW</span>
      </div>
      <Poster k={poster} w={MVW - 32} h={189} />
      <span style={{ fontSize: 17, fontWeight: 800, color: INK }}>Fri 8:00PM</span>
      <div style={{ display: 'flex', gap: 10 }}>{PRICES.map((p, i) => <Price key={i} small w={104} h={58} label={p[0]} amt={p[1]} left={urgent && i === 2 ? 4 : 0} />)}</div>
    </div>
  );
}
function MobileFinder({ scroll, picked, wk, searchPressed, qv1, qv2 }) {
  return (
    <div style={{ position: 'absolute', left: 0, top: -scroll, width: MVW, height: 2400, background: '#fff' }}>
      <MNavBar />
      <div style={{ position: 'absolute', left: 0, top: MNAV, width: MVW, height: MHERO + 60, overflow: 'hidden', background: '#3A0A14' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url("hero-audience.png")', backgroundSize: 'cover', backgroundPosition: '62% 40%' }}></div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,4,8,.55) 0%, rgba(20,4,8,.8) 60%, rgba(20,4,8,.9) 100%)' }}></div>
        <div style={{ position: 'absolute', left: 16, top: 18, fontFamily: DISP, fontSize: 36, lineHeight: 1.05, color: '#fff' }}>Chicago<br />Show Finder</div>
        <div style={{ ...field, position: 'absolute', left: MSEL.x, top: 110, width: MSEL.w, height: MSEL.h, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', fontSize: 14 }}><span>{picked ? 'Friday, 11/16' : 'Friday, 09/21'}</span><span>⌄</span></div>
        <div style={{ ...field, position: 'absolute', left: 16, right: 16, top: 166, height: 44, display: 'grid', placeItems: 'center', fontSize: 15 }}>02 tickets</div>
        <div style={{ ...btnLight(searchPressed), position: 'absolute', left: 16, right: 16, top: 222, height: 44, fontSize: 13 }}>SEARCH</div>
        <DayTabs p={wk} tabW={98} gap={6} h={60} mobile />
      </div>
      <div style={{ position: 'absolute', left: 16, top: MNAV + MHERO + 74, fontSize: 13, color: INK, whiteSpace: 'nowrap' }}><b style={{ color: RED }}>{picked ? 41 : 71}</b> shows, weekend of <b>{picked ? 'Nov 16 to 18' : 'Sep 21 to 23'}</b></div>
      <div style={{ position: 'absolute', left: 16, top: MNAV + MHERO + 104, fontFamily: DISP, fontSize: 26, color: INK }}>Headline Shows</div>
      <MShowCard top={MCARD0} poster="dream" qvPressed={qv1} urgent />
      <MShowCard top={MCARD0 + MCARD_H} poster="tales" qvPressed={qv2} />
      <MShowCard top={MCARD0 + MCARD_H * 2} poster="wild" />
    </div>
  );
}
function MobileSheet({ k, o, backPressed, buyPressed }) {
  if (o <= 0) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, background: `rgba(255,255,255,${.6 * o})`, backdropFilter: 'blur(5px)', zIndex: 20 }}>
      <div style={{ position: 'absolute', left: 12, right: 12, top: 12, height: 650, boxSizing: 'border-box', background: '#fff', borderRadius: 6, boxShadow: '0 20px 50px rgba(0,0,0,.3)', padding: 12, display: 'flex', flexDirection: 'column', gap: 10, opacity: o, transform: `translateY(${lerp(40, 0, o)}px)` }}>
        <QuickBody k={k} posterH={170} />
        <div style={{ position: 'absolute', left: 12, right: 12, top: 400, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: INK }}>Next show: Fri, Nov 16 at 8:00PM</span>
        </div>
        <div style={{ position: 'absolute', left: 12, top: 420, display: 'flex', gap: 10 }}>{PRICES.map((p, i) => <Price key={i} small w={104} h={58} label={p[0]} amt={p[1]} left={k === 'tales' && i === 1 ? 3 : 0} pressed={i === 1 && buyPressed} />)}</div>
        <div style={{ position: 'absolute', left: 12, right: 12, top: 540, height: 46, boxSizing: 'border-box', borderRadius: 4, border: '2px solid ' + INK, color: INK, display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 800, letterSpacing: '.08em' }}>VIEW ALL DATES</div>
        <span style={{ position: 'absolute', left: 0, right: 0, top: 602, textAlign: 'center', fontSize: 13, fontWeight: backPressed ? 800 : 500, color: INK, textDecoration: 'underline' }}>‹ Back to Search</span>
      </div>
    </div>
  );
}

function Cursor({ x, y, down, opacity }) {
  return (
    <div style={{ position: 'absolute', left: x - 4, top: y - 3, opacity, transform: `scale(${down ? .86 : 1})`, transformOrigin: '4px 3px', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,.35))', zIndex: 50 }}>
      <svg width="34" height="40" viewBox="0 0 34 40"><path d="M4 3 L4 33 L12 26 L17.5 37.5 L22.5 35 L17 24 L28 24 Z" fill="#ffffff" stroke="#1A1A1A" strokeWidth="2.2" strokeLinejoin="round"></path></svg>
    </div>
  );
}
function Tap({ T, at, x, y }) {
  const p = clamp01((T - at) / .5);
  if (p <= 0 || p >= 1) return null;
  return <div style={{ position: 'absolute', left: x - 30, top: y - 30, width: 60, height: 60, borderRadius: '50%', background: 'rgba(30,30,30,.22)', border: '2px solid rgba(30,30,30,.45)', transform: `scale(${lerp(.4, 1.3, p)})`, opacity: 1 - p, pointerEvents: 'none', zIndex: 40 }}></div>;
}
function DeviceLabel({ x, w, text, o }) {
  return <div style={{ position: 'absolute', left: x, width: w, top: 8, textAlign: 'center', fontSize: 15, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(242,242,242,.7)', opacity: o }}>{text}</div>;
}

function Dim({ o, r }) {
  if (o <= 0) return null;
  return <div style={{ position: 'absolute', inset: 0, borderRadius: r, background: 'rgba(16,16,16,.62)', opacity: o, pointerEvents: 'none', zIndex: 45 }}></div>;
}

function Piece({ showCaptions }) {
  const { T, CUES } = useComposition();
  const DS = CUES.DSearch, DR = CUES.DResults, DQ = CUES.DQuick, DD = CUES.DDetail, MS = CUES.MSearch, MB = CUES.MBrowse, MBY = CUES.MBuy, END = MBY + 4.2;
  const pressed = (at) => T >= at - .08 && T < at + .14;
  const searchFlow = (S) => {
    const selAt = S + .9, nx1 = S + 1.45, nx2 = S + 1.8, dayAt = S + 2.35, searchAt = S + 3.1;
    return {
      selAt, nx1, nx2, dayAt, searchAt,
      calO: MOTION.enter(T, selAt + .05, selAt + .3) * (1 - MOTION.enter(T, dayAt + .2, dayAt + .45)),
      month: T < nx1 + .05 ? 0 : T < nx2 + .05 ? 1 : 2,
      picked: T >= dayAt + .05,
      wk: MOTION.move(T, searchAt + .15, searchAt + .65),
    };
  };
  const d = searchFlow(DS), m = searchFlow(MS);

  const scrollF = MOTION.move(T, DR + .1, DR + 1.0);
  const qvD = DR + 1.7, fullD = DQ + 1.6, findD = DD + .4, satD = DD + 3.4;
  const modalO = MOTION.enter(T, qvD + .1, qvD + .4) * (1 - MOTION.enter(T, fullD + .2, fullD + .5));
  const modalS = lerp(.94, 1, MOTION.pop(T, qvD + .1, qvD + .5));
  const pageP = MOTION.move(T, fullD + .15, fullD + .55);
  const scrollD = MOTION.move(T, findD + .2, findD + 1.7);
  const hotFri = MOTION.enter(T, DD + 2.2, DD + 2.45) * (1 - MOTION.enter(T, DD + 2.75, DD + 2.9));
  const hotSat = MOTION.enter(T, DD + 3.0, DD + 3.25);
  const handD = MOTION.enter(T, satD + .3, satD + .7);

  const scrollM1 = MOTION.move(T, MS + 3.8, MS + 4.6);
  const qv1 = MB + .3, back1 = MB + 1.8, qv2 = MB + 3.1, buyM = MBY + .6;
  const sheet1 = MOTION.enter(T, qv1 + .1, qv1 + .4) * (1 - MOTION.enter(T, back1 + .1, back1 + .4));
  const sheet2 = MOTION.enter(T, qv2 + .1, qv2 + .4);
  const scrollM = SCROLL_M1 * scrollM1 + (SCROLL_M2 - SCROLL_M1) * MOTION.move(T, back1 + .4, back1 + 1.1);
  const handM = MOTION.enter(T, buyM + .3, buyM + .7);

  const dimD = MOTION.enter(T, MS - .4, MS + .1);
  const dimM = 1 - MOTION.enter(T, MS - .4, MS + .1);

  const dSel = { x: VX + DSEL.x + DSEL.w / 2, y: VY + DSEL.y + DSEL.h / 2 };
  const dNext = calNext(DCAL), d16 = calCell(DCAL, 4, 16);
  const cur = track([
    [0, 640, 520], [d.selAt - .2, dSel.x, dSel.y], [d.nx1 - .15, VX + dNext.x, VY + dNext.y], [d.nx2, VX + dNext.x, VY + dNext.y],
    [d.dayAt - .15, VX + d16.x, VY + d16.y], [d.dayAt + .3, VX + d16.x, VY + d16.y], [d.searchAt - .2, VX + SEARCH_D.x, VY + SEARCH_D.y], [DR + .2, VX + SEARCH_D.x, VY + SEARCH_D.y],
    [qvD - .2, VX + QV_D.x, VY + QV_D.y - SCROLL_F], [DQ + .5, VX + QV_D.x + 80, VY + QV_D.y - SCROLL_F + 30], [fullD - .2, VX + FULL_D.x, VY + FULL_D.y],
    [DD + .05, VX + FULL_D.x, VY + FULL_D.y], [findD - .2, VX + FIND_D.x, VY + FIND_D.y], [findD + .4, VX + FIND_D.x, VY + FIND_D.y],
    [DD + 2.2, VX + FRI_D.x, VY + FRI_D.y - SCROLL_DD], [DD + 2.7, VX + FRI_D.x, VY + FRI_D.y - SCROLL_DD], [satD - .2, VX + SAT_D.x, VY + SAT_D.y - SCROLL_DD], [MS, VX + SAT_D.x + 40, VY + SAT_D.y - SCROLL_DD - 40],
  ], T);
  const down = [d.selAt, d.nx1, d.nx2, d.dayAt, d.searchAt, qvD, fullD, findD, satD].some(pressed);
  const curO = MOTION.enter(T, .2, .6) * (1 - MOTION.enter(T, satD + .4, satD + .8));
  const fade = 1 - MOTION.enter(T, 0, .5) + MOTION.enter(T, END - .5, END);
  const labD = .35 + .65 * (1 - dimD), labM = .35 + .65 * (1 - dimM);

  const mNext = calNext(MCAL), m16 = calCell(MCAL, 4, 16);
  const caps = [
    { at: .3, until: DR - .05, text: 'Pick a date weeks out and the results jump to that weekend.' },
    { at: DR + .1, until: DQ - .05, text: 'Results show three days at a time. Most buyers want something to do that weekend, not a set night.' },
    { at: DQ + .1, until: DD - .05, text: 'Desktop buyers tend to plan ahead, so they open the full show page.' },
    { at: DD + .1, until: MS - .5, text: 'They compare nights, pick one, and hand off to ticket purchase.' },
    { at: MS + .1, until: MB - .05, text: 'Mobile buyers search the same way.' },
    { at: MB + .1, until: MBY - .05, text: 'Then they flip through shows in Quick View.' },
    { at: MBY + .1, until: END - .4, text: 'Quick View has the prices, so they buy without opening the show page.' },
  ];

  return (
    <div data-screen-label={`t=${Math.floor(T)}s`} style={{ position: 'absolute', inset: 0, background: '#141414', overflow: 'hidden', fontFamily: UI }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: showCaptions ? VH : 1080, overflow: 'hidden', background: 'radial-gradient(1100px 700px at 30% 20%, rgba(215,38,61,.18), transparent 70%), #141414' }}>
        <div style={{ position: 'absolute', left: 0, top: showCaptions ? 0 : 80, width: W, height: VH }}>
          <DeviceLabel x={DX} w={DW} text="Desktop · planning ahead" o={labD} />
          <DeviceLabel x={PX} w={PW} text="Mobile · browsing" o={labM} />
          <div style={{ position: 'absolute', left: DX, top: DY, width: DW, height: DH, borderRadius: 14, overflow: 'hidden', background: '#fff', boxShadow: '0 40px 100px rgba(0,0,0,.55)' }}>
            <div style={{ height: CHROME, background: '#E9E9EB', display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px' }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57' }}></span><span style={{ width: 12, height: 12, borderRadius: '50%', background: '#FEBC2E' }}></span><span style={{ width: 12, height: 12, borderRadius: '50%', background: '#28C840' }}></span>
              <span style={{ marginLeft: 20, flex: 1, maxWidth: 520, height: 26, borderRadius: 13, background: '#fff', fontSize: 13, color: MUTED, display: 'flex', alignItems: 'center', padding: '0 14px' }}>secondcity.com/shows/chicago</span>
            </div>
            <div style={{ position: 'absolute', left: 0, top: CHROME, width: VW, height: VHT, overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, opacity: 1 - pageP }}>
                <DesktopFinder scroll={SCROLL_F * scrollF} picked={d.picked} wk={d.wk} searchPressed={pressed(d.searchAt)} qvPressed={pressed(qvD)} />
                <Calendar cal={DCAL} o={d.calO} month={d.month} sel={d.picked ? 16 : 0} />
              </div>
              <div style={{ position: 'absolute', inset: 0, opacity: pageP }}><DesktopDetail scroll={SCROLL_DD * scrollD} findPressed={pressed(findD)} hotFri={hotFri} hotSat={hotSat} buyPressed={pressed(satD)} /></div>
              <DesktopModal o={modalO} s={modalS} fullPressed={pressed(fullD)} />
              <Handoff o={handD} line="2 tickets, General Admission, Saturday, November 17 at 8:00PM" />
            </div>
            <Dim o={dimD} r={14} />
          </div>
          <div style={{ position: 'absolute', left: PX, top: PY, width: PW, height: PH, borderRadius: 54, background: '#0B0B0B', boxShadow: '0 40px 100px rgba(0,0,0,.55), inset 0 0 0 2px #2A2A2A' }}>
            <div style={{ position: 'absolute', left: BZ, top: BZ, width: MVW, height: PH - BZ * 2, borderRadius: 42, overflow: 'hidden', background: '#fff' }}>
              <div style={{ height: SBAR, background: '#0E0E0E', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 26px', color: '#fff', fontSize: 14, fontWeight: 700 }}><span>8:41</span><span style={{ width: 100, height: 26, borderRadius: 14, background: '#000' }}></span><span>●●●</span></div>
              <div style={{ position: 'absolute', left: 0, top: SBAR, width: MVW, height: MVH, overflow: 'hidden' }}>
                <MobileFinder scroll={scrollM} picked={m.picked} wk={m.wk} searchPressed={pressed(m.searchAt)} qv1={pressed(qv1)} qv2={pressed(qv2)} />
                <Calendar cal={MCAL} o={m.calO} month={m.month} sel={m.picked ? 16 : 0} small />
                <MobileSheet k="dream" o={sheet1} backPressed={pressed(back1)} />
                <MobileSheet k="tales" o={sheet2} buyPressed={pressed(buyM)} />
                <Handoff o={handM} mobile line="2 tickets, General Admission, Fri, Nov 16 at 8:00PM" />
                <Tap T={T} at={m.selAt} x={MSEL.x + MSEL.w / 2} y={MSEL.y + MSEL.h / 2} />
                <Tap T={T} at={m.nx1} x={mNext.x} y={mNext.y} />
                <Tap T={T} at={m.nx2} x={mNext.x} y={mNext.y} />
                <Tap T={T} at={m.dayAt} x={m16.x} y={m16.y} />
                <Tap T={T} at={m.searchAt} x={SEARCH_M.x} y={SEARCH_M.y} />
                <Tap T={T} at={qv1} x={QV_M.x} y={QV_M.y - SCROLL_M1} />
                <Tap T={T} at={back1} x={SHEET_BACK.x} y={SHEET_BACK.y} />
                <Tap T={T} at={qv2} x={QV_M.x} y={QV_M.y + MCARD_H - SCROLL_M2} />
                <Tap T={T} at={buyM} x={SHEET_P18.x} y={SHEET_P18.y} />
              </div>
            </div>
            <Dim o={dimM} r={54} />
          </div>
          <Cursor x={cur[0]} y={cur[1]} down={down} opacity={curO} />
        </div>
      </div>
      {showCaptions ? <Captions items={caps} style={{ left: 120, right: 120, bottom: 'auto', top: 968, textAlign: 'left', font: `500 38px ${UI}`, color: '#F2F2F2', textShadow: 'none', letterSpacing: '-.01em' }} /> : null}
      <div style={{ position: 'absolute', inset: 0, background: '#141414', opacity: clamp01(fade), pointerEvents: 'none' }}></div>
    </div>
  );
}

function ScFlow() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS || { motionEditor: true, captions: true });
  return (
    <React.Fragment>
      <CompositionStage width={1920} height={1080} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg="#141414">
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
window.ScFlow = ScFlow;
