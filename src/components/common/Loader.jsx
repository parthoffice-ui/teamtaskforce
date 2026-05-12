export default function Loader() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      gap: 16,
    }}>
      <div style={{ fontSize: 40 }}>⚡</div>
      <div style={{ color: 'var(--muted)', fontSize: 14, fontWeight: 600 }}>
        Loading...
      </div>
    </div>
  );
}