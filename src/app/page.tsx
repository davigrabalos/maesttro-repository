import React from 'react';
import './home.css';
import { BackgroundShapes } from '../components/ui/BackgroundShapes';

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--md-background)', position: 'relative' }}>
      <BackgroundShapes />
      {/* 1. Header / Navbar */}
      <nav className="home-navbar">
        <div className="home-navbar-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/LOGO+TYPO.png" alt="Maesttro" />
        </div>
        <div className="home-navbar-links">
          <a href="/admin" className="nav-link-login">
            <span className="material-symbols-outlined" style={{ fontSize: '18px', marginRight: '4px', verticalAlign: 'text-bottom' }}>person</span>
            Painel Admin
          </a>
          <a href="/checkout/demo?source=lojaA" className="nav-btn-create">
            VER CHECKOUT
          </a>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="home-section bg-background">
        <div className="section-container hero-layout">
          <div className="hero-content">
            <h1 className="home-title">A PLATAFORMA DE CHECKOUT FEITA PRA VENDER MAIS</h1>
            <p className="home-subtitle">
              Na Maesttro você tem um checkout transparente, rápido e otimizado para conversão. 
              Recursos exclusivos que só nossa plataforma oferece, tudo no seu estilo.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <a href="/checkout/demo?source=lojaA" className="nav-btn-create" style={{ padding: '16px 32px', fontSize: '15px' }}>
                VER DEMONSTRAÇÃO
              </a>
              <a href="/admin" className="nav-btn-create" style={{ padding: '16px 32px', fontSize: '15px', backgroundColor: 'transparent', color: 'var(--md-primary)' }}>
                ACESSAR PAINEL
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '24px', fontSize: '12px', color: 'var(--md-text-secondary)', fontWeight: 600 }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--md-primary)' }}>check_circle</span>
              Sem taxa de adesão
              <span className="material-symbols-outlined" style={{ color: 'var(--md-primary)', marginLeft: '16px' }}>check_circle</span>
              Integração instantânea com Supabase
            </div>
          </div>
          
          <div className="hero-visual">
            {/* Simple CSS illustration of the checkout */}
            <div className="hero-mockup">
              <div className="mockup-header"></div>
              <div className="mockup-field"></div>
              <div className="mockup-field" style={{ height: '80px' }}></div>
              <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                <div style={{ flex: 1, height: '40px', backgroundColor: 'var(--md-primary-light)', border: '1px solid var(--md-primary)' }}></div>
                <div style={{ flex: 1, height: '40px', backgroundColor: 'var(--md-background)', border: '1px solid var(--md-border)' }}></div>
              </div>
              <div className="mockup-btn"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Checkout de Alta Conversão */}
      <section className="home-section bg-accent">
        <div className="section-container conversion-layout reverse">
          <div className="hero-content">
            <h2 className="section-title">Checkout que AUMENTA sua conversão</h2>
            <p className="home-subtitle" style={{ color: 'rgba(255,255,255,0.9)' }}>
              Esqueça os checkouts travados e cheios de etapas. O Maesttro Checkout foi desenhado 
              para ser fluido, rápido e focado em uma única coisa: transformar visitantes em compradores.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                'Design Material 3 focado em usabilidade e redução de atrito.',
                'Pix instantâneo integrado na mesma tela com QR Code e Copia/Cola.',
                'Upload automático de comprovantes vinculado diretamente ao seu banco de dados.',
                'Validação em tempo real sem recarregar a página.'
              ].map((item, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '15px', color: '#fff' }}>
                  <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: '24px' }}>task_alt</span>
                  <span style={{ paddingTop: '2px' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="hero-visual">
             <div style={{ 
               width: '100%', maxWidth: '400px', padding: '32px', backgroundColor: 'var(--md-primary)', 
               border: '1px solid rgba(255,255,255,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' 
             }}>
               <span className="material-symbols-outlined" style={{ fontSize: '80px', color: '#fff' }}>speed</span>
               <h3 style={{ fontSize: '48px', color: '#fff', fontWeight: 400, fontFamily: 'Vina Sans, sans-serif' }}>- 40%</h3>
               <p style={{ textAlign: 'center', fontSize: '14px', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>TEMPO DE CARREGAMENTO NO CHECKOUT</p>
             </div>
          </div>
        </div>
      </section>

      {/* 4. Recursos Poderosos (Grid) */}
      <section className="home-section bg-background">
        <div className="section-container">
          <div className="features-header">
            <h2 className="section-title">RECURSOS PODEROSOS E GRATUITOS</h2>
            <p className="home-subtitle" style={{ margin: '0 auto' }}>
              Tudo o que você precisa para alavancar suas vendas, nativo no Maesttro.
            </p>
          </div>
          
          <div className="features-grid">
            {[
              { icon: 'shopping_cart_checkout', title: 'Recuperação de Carrinhos', desc: 'Recupere suas vendas com nossa solução de acompanhamento via webhook diretamente para seu CRM.' },
              { icon: 'loyalty', title: 'Cupons Personalizados', desc: 'Aumente conversões e fidelize clientes com cupons de desconto dinâmicos aplicados no checkout.' },
              { icon: 'add_shopping_cart', title: 'Order Bump', desc: 'Aumente o seu ticket médio. Crie combinações de ofertas complementares para o cliente comprar mais.' },
              { icon: 'touch_app', title: 'Upsell 1-Click', desc: 'Ofereça ofertas irresistíveis, permitindo compras imediatas sem necessidade de digitar dados novamente.' },
              { icon: 'autorenew', title: 'Retentativa Transparente', desc: 'Recupere até 30% das vendas negadas no cartão acionando gateways secundários automaticamente.' },
              { icon: 'storefront', title: 'Lojas Ilimitadas', desc: 'Crie quantas lojas quiser. O Maesttro detecta a origem e organiza os pedidos automaticamente no seu banco de dados.' }
            ].map((feat) => (
              <div key={feat.title} className="feature-card">
                <div className="feature-icon">
                  <span className="material-symbols-outlined" style={{ fontSize: '40px' }}>{feat.icon}</span>
                </div>
                <h3 className="feature-title">{feat.title}</h3>
                <p className="feature-desc">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Controle na Palma da Mão */}
      <section className="home-section bg-primary">
        <div className="section-container conversion-layout">
          <div className="hero-content">
            <h2 className="section-title" style={{ color: 'var(--md-on-primary)' }}>CONTROLE na palma da mão</h2>
            <p className="home-subtitle" style={{ color: 'var(--md-primary-light)' }}>
              Com o Painel Admin do Maesttro, você tem visão total do seu negócio. 
              Acompanhe pedidos, valide comprovantes Pix e gerencie suas lojas em tempo real, sem delay.
            </p>
            <div className="control-stats">
              <div className="stat-item">
                <div className="stat-value">100%</div>
                <div className="stat-label">Sincronizado via Supabase</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">Zero</div>
                <div className="stat-label">Taxas escondidas</div>
              </div>
            </div>
            <div style={{ marginTop: '40px' }}>
              <a href="/admin" className="nav-btn-create" style={{ backgroundColor: 'var(--md-secondary)', borderColor: 'var(--md-secondary)' }}>
                ACESSAR PAINEL ADMIN
              </a>
            </div>
          </div>
          
          <div className="hero-visual">
             <div style={{ 
               width: '100%', maxWidth: '400px', backgroundColor: 'var(--md-surface)', 
               padding: '24px', boxShadow: '20px 20px 0px rgba(0,0,0,0.3)' 
             }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--md-border)', paddingBottom: '16px', marginBottom: '16px' }}>
                 <div style={{ color: 'var(--md-text-secondary)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Pedidos Recentes</div>
                 <span className="material-symbols-outlined" style={{ color: 'var(--md-primary)' }}>refresh</span>
               </div>
               {[1, 2, 3].map((i) => (
                 <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--md-border)' }}>
                   <div>
                     <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--md-on-surface)' }}>#8A9B2C{i}</div>
                     <div style={{ fontSize: '11px', color: 'var(--md-text-secondary)' }}>loja-origem-{i}</div>
                   </div>
                   <div style={{ padding: '4px 8px', backgroundColor: '#DCFCE7', color: '#15803D', fontSize: '10px', fontWeight: 700 }}>PAGO</div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="home-footer">
        <div className="footer-top">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/LOGO.png" alt="Maesttro" style={{ height: '32px', filter: 'brightness(0) invert(1)', marginBottom: '16px' }} />
            <p style={{ fontSize: '13px', opacity: 0.8, maxWidth: '300px' }}>
              A plataforma de e-commerce e checkout transparente que transforma acessos em vendas.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '48px' }}>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', textTransform: 'uppercase' }}>Produto</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', opacity: 0.8 }}>
                <li><a href="/checkout/demo?source=lojaA">Checkout</a></li>
                <li><a href="/admin">Painel Admin</a></li>
                <li><a href="#">Recursos</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', textTransform: 'uppercase' }}>Suporte</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', opacity: 0.8 }}>
                <li><a href="#">Central de Ajuda</a></li>
                <li><a href="#">Documentação (API)</a></li>
                <li><a href="#">Contato</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Maesttro. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
