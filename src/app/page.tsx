import Link from 'next/link';
import './home.css';

export default function HomePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '24px' }}>
      <h1>Maesttro</h1>
      <p style={{ color: 'var(--md-text-secondary)' }}>A página inicial será construída em breve.</p>
      <Link href="/admin" className="md-btn md-btn-primary">
        Acessar Painel Admin
      </Link>
    </div>
  );
}
