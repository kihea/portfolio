function ReaderChrome({ progress }) {
  return (
    <>
      <div className="r-chrome">
        <div className="breadcrumb">
          <a href="#">Divine Ipseity</a>
          <span className="sep">/</span>
          <a href="#">WithDepth</a>
          <span className="sep">/</span>
          <span className="current">№ 14</span>
        </div>
        <div style={{ display:'flex', gap: 22 }}>
          <a href="#">Archive</a>
          <a href="#">Subscribe</a>
        </div>
      </div>
      <div className="r-progress"><div className="bar" style={{ width: `${progress}%` }}/></div>
    </>
  );
}

function EssayHeader({ essay }) {
  return (
    <header className="essay-header">
      <div className="eyebrow">{essay.subbrand} · № {essay.number}</div>
      <h1>{essay.title}</h1>
      <p className="lede">{essay.lede}</p>
      <div className="meta">
        <span>{essay.date}</span>
        <span>·</span>
        <span>{essay.words} words</span>
        <span>·</span>
        <span>{essay.minutes} minute read</span>
        <span>·</span>
        <span>The Editor</span>
      </div>
    </header>
  );
}

function EssayBody({ onFn }) {
  return (
    <article className="essay-body">
      <p className="drop-cap">
        You have probably been told, somewhere along the way, that the difference between
        Marx and Lenin is the difference between an idea and its abuse. The first man wrote
        the books; the second man took the books to a country and ruined what was inside
        them.<sup className="fn" onClick={()=>onFn(1)}>1</sup> This is a story we tell because it is
        emotionally satisfying — it lets us keep what we like about the philosophy and
        wash our hands of what came after.
      </p>
      <p>
        The story is also wrong in several specific ways, and getting it right matters,
        because the wrongness is what allows the philosophy to keep being misread today.
        We are going to walk through what each man actually wrote, in his own words,
        with the dates and the contexts and the disagreements intact.<sup className="fn" onClick={()=>onFn(2)}>2</sup>
      </p>
      <div className="pq">The argument is not whether the system is broken. The argument is what to do about a working class that has been told for sixty years that it is not the working class.</div>
      <h2>I. What Marx actually claimed</h2>
      <p>
        Marx was a man of the nineteenth century, writing in libraries, with a wife and
        children and a permanent argument with a man named Bakunin. He did not write a
        single book called <em>Marxism</em>; the word was a slur applied to him by his
        opponents and later picked up by his admirers. The body of work we now call
        Marxism is in fact three different bodies of work, separated by twenty years and
        a number of changes of mind.<sup className="fn" onClick={()=>onFn(3)}>3</sup>
      </p>
      <div className="fleuron">❦</div>
      <h2>II. Where Lenin parted from him</h2>
      <p>
        Lenin read Marx in translation, in exile, in winter. The Lenin we get in
        <em> What Is to Be Done?</em> is a man who has decided that Marx's confidence in
        the working class arriving at consciousness on its own was a confidence the
        twentieth century could not afford. Whether he was right about that — and what
        the cost of being right about it would be — is the question that follows him
        and his readers for the next eighty years.
      </p>
      <p>
        We will return to that question, more than once, before we are done. For now it
        is enough to notice that the disagreement is not what the popular story tells you
        it was. Lenin did not abandon Marx. He took a wager Marx had refused to take —
        and the wager won and lost, both, in ways neither of them could have predicted.
      </p>
    </article>
  );
}

function Footnotes() {
  return (
    <section className="footnotes">
      <h3>SOURCES & FOOTNOTES</h3>
      <ol>
        <li>The "books vs. abuse" story is canonical in U.S. high‑school civics; see also Kolakowski, <i>Main Currents of Marxism</i>, vol. 3, ch. 2.</li>
        <li>For Marx's own words: <i>Capital, vol. 1</i> (1867), preface to the second German edition. For Lenin: <i>What Is to Be Done?</i> (1902), §§ I–III.</li>
        <li>The three bodies: the early <i>Manuscripts</i> (1844), the political pamphlets (1848–52), and the mature <i>Capital</i> (1867–94, vols. 2 and 3 published posthumously).</li>
      </ol>
    </section>
  );
}

function EssayFoot() {
  return (
    <div className="essay-foot">
      <div className="editor">— THE EDITOR · WITHDEPTH</div>
      <a href="#" className="btn">Read № 13 →</a>
    </div>
  );
}

Object.assign(window, { ReaderChrome, EssayHeader, EssayBody, Footnotes, EssayFoot });
