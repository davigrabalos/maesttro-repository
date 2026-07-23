import Link from 'next/link';

export default function QAPage() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--main-bg)',
      color: 'var(--text-primary)',
      padding: '40px 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px'
    }}>
      <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--accent-primary)' }}>
        help
      </span>
      <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>Perguntas Frequentes & Ajuda (Q&A)</h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', textAlign: 'center' }}>
        Esta página está pronta para receber a central de ajuda e documentação do sistema.
      </p>
      <Link href="/admin" className="md-btn md-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', borderRadius: 'var(--radius-md)' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
        Voltar para o Painel Admin
      </Link>
    </div>
  );
}
