function Manifesto({ setPage }) {
  return (
    <section className="manifesto">
      <div className="eyebrow">A note from the editor</div>
      <h1>Definition is limitation.</h1>
      <p className="lede">
        This project is anonymous on purpose. Anonymity here is not hiding — it is a
        philosophical discipline, consistent with the brand's central claim.
      </p>
      <div className="body">
        <p className="drop-cap">
          You already know something is wrong. The work of this publication is not to
          convince you of it — it is to give you language sophisticated enough to name
          it precisely, and a community of people willing to do that naming with you.
        </p>
        <p>
          We refuse to put a face on this work for the same reason we refuse engagement
          bait, sponsored takes, and the comfort of easy enemies: a brand that reduces
          to a person can be flattered, threatened, hired, or destroyed. A brand that
          reduces to an idea cannot.
        </p>
        <div className="pq">
          Warmth toward individuals. Sharpness toward systems. Never the reverse.
        </div>
        <p>
          We will show our sources. We will publish corrections proudly. We will use
          "we" because the voice is collective even when one of us is writing it —
          and we will not pretend otherwise.
        </p>
        <p>
          If that's the kind of company you want, you are already part of it.
        </p>
        <div className="signoff">— THE EDITOR · DIVINE IPSEITY</div>
      </div>
    </section>
  );
}

function Archive({ essays, onOpen }) {
  const [filter, setFilter] = React.useState('All');
  const filtered = filter === 'All' ? essays : essays.filter(e => e.subbrand === filter);
  return (
    <section className="archive">
      <div className="section-title">
        <h2>The archive</h2>
        <span className="meta">№ {essays.length} pieces, all open</span>
      </div>
      <div className="filter">
        {['All', 'WithDepth', 'Systematic Sins', 'Divine Ipseity', 'Process'].map(f => (
          <button key={f} className={filter===f ? 'on' : ''} onClick={()=>setFilter(f)}>{f}</button>
        ))}
      </div>
      {filtered.map((e,i)=>(
        <a key={i} className="essay-row" href="#" onClick={(ev)=>{ev.preventDefault(); onOpen?.(e);}}>
          <div className="date">{e.date}</div>
          <div>
            <div className="eyebrow">{e.subbrand} {e.number ? `№ ${e.number}` : ''}</div>
            <h3>{e.title}</h3>
            <p>{e.lede}</p>
          </div>
          <div className="meta">{e.words} · {e.minutes} min</div>
        </a>
      ))}
    </section>
  );
}

function Faction() {
  return (
    <section style={{ padding: '96px 0 0', textAlign: 'center' }}>
      <img src="../../assets/logos/faction-of-truth-mark.svg" style={{ width: 160, height: 160 }} />
      <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--oxblood)', marginTop: 24 }}>
        FACTION OF TRUTH
      </div>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: 64, lineHeight: 1.05, letterSpacing: '-0.02em', maxWidth: '14ch', margin: '14px auto 0' }}>
        A community, by invitation.
      </h1>
      <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 20, color: 'var(--ink-soft)', maxWidth: '52ch', margin: '24px auto 32px', lineHeight: 1.5 }}>
        A hundred engaged members, governed by Isonomia — a charter we wrote together. Reading groups, editor's office hours, member essays, and a Discord that is small on purpose.
      </p>
      <a className="btn btn-primary" href="#">Apply to join</a>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-mute)', letterSpacing: '0.06em', marginTop: 18 }}>
        Currently: 87 / 100 seats. Cohort opens quarterly.
      </div>
    </section>
  );
}

function Shop() {
  const items = [
    { id: 'are-you-not', title: 'ARE YOU NOT EXHAUSTED', sub: 'PUNCHUP DROP №01', price: '$38' },
    { id: 'definition', title: 'DEFINITION IS LIMITATION', sub: 'PUNCHUP DROP №01', price: '$38' },
    { id: 'systematic-07', title: 'SYSTEMATIC SIN №07', sub: 'PUNCHUP × WITHDEPTH', price: '$42' },
  ];
  return (
    <section style={{ padding: '80px 0 0' }}>
      <div className="section-title">
        <h2>PunchUp — capsule one</h2>
        <span className="meta">Heavyweight cotton · printed in small batches</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
        {items.map(it => (
          <article key={it.id} style={{ background: '#181412', color: 'var(--ivory)', padding: 0 }}>
            <div style={{ aspectRatio: '4/5', background: '#0F0B09', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 28, letterSpacing: '0.04em', textAlign: 'center', lineHeight: 1.05, padding: 24, color: 'var(--ivory)' }}>
                {it.title}
              </div>
              <div style={{ position: 'absolute', bottom: 16, left: 16, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--oxblood)', letterSpacing: '0.18em' }}>{it.sub}</div>
            </div>
            <div style={{ padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(244,236,218,0.18)' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18 }}>{it.title.toLowerCase()} tee</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--sand-dollar)' }}>{it.price}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

Object.assign(window, { Manifesto, Archive, Faction, Shop });
