function Header({ page, setPage }) {
  const links = [
    { id: 'home', label: 'Home' },
    { id: 'manifesto', label: 'Manifesto' },
    { id: 'archive', label: 'Essays' },
    { id: 'shop', label: 'Shop' },
    { id: 'faction', label: 'Faction' },
  ];
  return (
    <header className="header">
      <a href="#" className="wm" onClick={(e) => { e.preventDefault(); setPage('home'); }}>Divine Ipseity</a>
      <nav>
        {links.map(l => (
          <a key={l.id} href="#" className={page === l.id ? 'active' : ''}
             onClick={(e) => { e.preventDefault(); setPage(l.id); }}>{l.label}</a>
        ))}
        <a href="#" className="active" style={{ color: 'var(--oxblood)' }}
           onClick={(e) => { e.preventDefault(); setPage('home'); document.getElementById('subscribe-anchor')?.scrollTo?.(); }}>Subscribe</a>
      </nav>
    </header>
  );
}

function HeroManifesto({ setPage }) {
  return (
    <section className="hero">
      <div className="eyebrow">A philosophical and political project</div>
      <h1>Preserving the human, <em>not</em> the machine.</h1>
      <p className="lede">
        For young adults inheriting a broken system: a coherent philosophical and political
        understanding that translates into everyday action — and a community of people
        who see it too.
      </p>
      <div className="cta-row">
        <a className="btn btn-primary" href="#" onClick={(e)=>{e.preventDefault(); setPage('archive');}}>Read the essays →</a>
        <a className="btn" href="#" onClick={(e)=>{e.preventDefault(); setPage('manifesto');}}>Why anonymous?</a>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-mute)', letterSpacing: '0.04em' }}>
          № 24 essays · 1,800 readers · weekly
        </span>
      </div>
    </section>
  );
}

function EssayList({ essays, onOpen }) {
  return (
    <section style={{ padding: '64px 0 0' }}>
      <div className="section-title">
        <h2>Recent essays</h2>
        <span className="meta">SYSTEMS · PHILOSOPHY · PROPHETIC · PROCESS</span>
      </div>
      {essays.map((e, i) => (
        <a key={i} className="essay-row" href="#" onClick={(ev) => { ev.preventDefault(); onOpen?.(e); }}>
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

function SubscribeBlock() {
  const [email, setEmail] = React.useState('');
  const [done, setDone] = React.useState(false);
  return (
    <section className="subscribe" id="subscribe-anchor">
      <h2>Are you not<br/>exhausted?</h2>
      <p>One essay a week. Long, sourced, and unhurried. We will be wrong sometimes — and we will say so when we are.</p>
      {!done ? (
        <form className="form" onSubmit={(e)=>{ e.preventDefault(); setDone(true); }}>
          <input type="email" placeholder="you@somewhere.real" value={email}
                 onChange={e=>setEmail(e.target.value)} required />
          <button type="submit">Subscribe</button>
        </form>
      ) : (
        <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 22, color: 'var(--ivory)' }}>
          Welcome. Confirmation sent to <span style={{color:'var(--sand-dollar)'}}>{email || 'you'}</span>.
        </div>
      )}
      <div className="fine">No tracking. No ads. No referrals. Unsubscribe in one click.</div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div>
        <div className="wm-block">Divine Ipseity</div>
        <div className="tag">PRESERVATION OF THE HUMAN</div>
      </div>
      <div className="columns">
        <div className="col">
          <h4>SUB‑BRANDS</h4>
          <a href="#">PunchUp</a>
          <a href="#">WithDepth</a>
          <a href="#">Faction of Truth</a>
          <a href="#">Systematic Sins</a>
        </div>
        <div className="col">
          <h4>READ</h4>
          <a href="#">Essays</a>
          <a href="#">Manifesto</a>
          <a href="#">Reading list</a>
          <a href="#">Corrections</a>
        </div>
        <div className="col">
          <h4>FOLLOW</h4>
          <a href="#">Substack</a>
          <a href="#">RSS</a>
          <a href="#">Bluesky</a>
        </div>
      </div>
    </footer>
  );
}

function FooterLegal() {
  return (
    <div className="shell">
      <div className="legal">
        <span>© MMXXVI — anonymously authored.</span>
        <span>Definition is limitation. Be unlimited.</span>
      </div>
    </div>
  );
}

Object.assign(window, { Header, HeroManifesto, EssayList, SubscribeBlock, Footer, FooterLegal });
