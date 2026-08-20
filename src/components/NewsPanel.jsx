function fmtDate(seendate) {
  // GDELT format: 20260820T074500Z
  if (!seendate || seendate.length < 8) return '';
  const y = seendate.slice(0, 4);
  const m = seendate.slice(4, 6);
  const d = seendate.slice(6, 8);
  return `${y}-${m}-${d}`;
}

export default function NewsPanel({ news }) {
  if (!news) return null;

  return (
    <div className="card">
      <h2>Live world news</h2>
      {!news.available && (
        <p className="muted small">
          News feed unavailable{news.note ? ` (${news.note})` : ''}.
        </p>
      )}
      {news.available && news.articles.length === 0 && (
        <p className="muted small">No recent relevant headlines.</p>
      )}
      {news.articles.length > 0 && (
        <ul className="news">
          {news.articles.map((a, i) => (
            <li key={i}>
              <a href={a.url} target="_blank" rel="noreferrer">
                {a.title}
              </a>
              <div className="news-meta">
                {a.domain} · {fmtDate(a.date)}
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="news-src">Source: GDELT · last 14 days</div>
    </div>
  );
}
