'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function SimulatorPage() {
  const supabase = createClient();
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [cart, setCart] = useState<{ variant_id: string; quantity: number; name: string; price: number }[]>([]);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      // 1. Get user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      // 2. Get Workspace ID
      const { data: workspacesData } = await supabase
        .from('workspace_users')
        .select('workspace_id')
        .eq('user_id', session.user.id)
        .limit(1)
        .single();

      if (!workspacesData) {
        setLoading(false);
        return;
      }

      setWorkspaceId(workspacesData.workspace_id);

      // 3. Get Products
      const { data, error } = await supabase
        .from('products')
        .select(`
          id, name,
          product_variants (id, name, price, image_url, stock)
        `)
        .eq('workspace_id', workspacesData.workspace_id)
        .eq('status', 'active');
        
      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    }
    loadProducts();
  }, [supabase]);

  const addToCart = (variant: any, productName: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.variant_id === variant.id);
      if (existing) {
        return prev.map(item => item.variant_id === variant.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { variant_id: variant.id, quantity: 1, name: `${productName} ${variant.name ? `- ${variant.name}` : ''}`, price: variant.price }];
    });
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setCheckingOut(true);
    setError(null);

    try {
      if (!workspaceId) throw new Error("Workspace não carregado.");
      
      const res = await fetch('/api/checkout/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspace_id: workspaceId,
          cart: cart.map(c => ({ variant_id: c.variant_id, quantity: c.quantity }))
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro na API');

      // Redireciona para o checkout público
      router.push(data.checkout_url);

    } catch (err: any) {
      console.error(err);
      setError(err.message);
      setCheckingOut(false);
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Carregando loja simulada...</div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F3F4F6', fontFamily: 'sans-serif' }}>
      {/* Header Simulador */}
      <header style={{ backgroundColor: '#111827', color: '#fff', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '20px' }}>🛒 Loja Externa (Simulador Shopify)</h1>
        <div style={{ backgroundColor: '#374151', padding: '8px 16px', borderRadius: '24px', fontWeight: 'bold' }}>
          Carrinho: {cart.length} itens (R$ {cartTotal.toFixed(2)})
        </div>
      </header>

      <main style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
        
        {/* Produtos */}
        <div style={{ flex: 2 }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>Produtos Disponíveis</h2>
          {products.length === 0 ? (
            <p>Nenhum produto ativo encontrado nesta conta.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {products.map(p => (
                <div key={p.id} style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>{p.name}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                    {p.product_variants?.map((v: any) => (
                      <div key={v.id} style={{ border: '1px solid #E5E7EB', padding: '16px', borderRadius: '8px' }}>
                        {v.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={v.image_url} alt="" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px', marginBottom: '12px' }} />
                        ) : (
                          <div style={{ width: '100%', height: '120px', backgroundColor: '#F3F4F6', borderRadius: '6px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            Sem Foto
                          </div>
                        )}
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '14px' }}>{v.name || 'Padrão'}</h4>
                        <p style={{ margin: '0 0 12px 0', color: '#10B981', fontWeight: 'bold' }}>R$ {v.price.toFixed(2)}</p>
                        <button 
                          onClick={() => addToCart(v, p.name)}
                          style={{ width: '100%', padding: '8px', backgroundColor: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                        >
                          + Carrinho
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Carrinho Lateral */}
        <div style={{ flex: 1, backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', position: 'sticky', top: '40px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 16px 0' }}>Seu Carrinho</h2>
          
          {error && <div style={{ color: 'red', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

          {cart.length === 0 ? (
            <p style={{ color: '#6B7280', fontSize: '14px' }}>O carrinho está vazio.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cart.map(item => (
                <div key={item.variant_id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderBottom: '1px solid #F3F4F6', paddingBottom: '12px' }}>
                  <span>{item.quantity}x {item.name}</span>
                  <span style={{ fontWeight: 600 }}>R$ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 700, marginTop: '12px' }}>
                <span>Total</span>
                <span>R$ {cartTotal.toFixed(2)}</span>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={checkingOut}
                style={{ width: '100%', padding: '16px', backgroundColor: '#10B981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '16px', marginTop: '16px', cursor: checkingOut ? 'not-allowed' : 'pointer' }}
              >
                {checkingOut ? 'Gerando Sessão...' : 'Finalizar Compra 🚀'}
              </button>
              <p style={{ fontSize: '12px', color: '#9CA3AF', textAlign: 'center', margin: '8px 0 0 0' }}>
                Ao clicar, você fará um POST na API /init e cairá no Checkout real.
              </p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
