'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { PageHeader } from '../../../../components/ui/PageHeader';
import { DataTable } from '../../../../components/ui/DataTable';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useHomeData } from '../../../../components/home/HomeContext';

interface Product {
  id: string;
  name: string;
  status: string;
  total_stock: number;
  base_price: number;
  image_url: string;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export default function ProdutosPage() {
  const { profile } = useHomeData();
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    if (!profile?.workspaces?.[0]?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          status,
          product_variants (
            price,
            stock,
            image_url
          )
        `)
        .eq('workspace_id', profile.workspaces[0].id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formatted = data.map((p: any) => {
          const variants = p.product_variants || [];
          const totalStock = variants.reduce((acc: number, v: any) => acc + (v.stock || 0), 0);
          const basePrice = variants.length > 0 ? variants[0].price : 0;
          const imageUrl = variants.find((v: any) => v.image_url)?.image_url || '';

          return {
            id: p.id,
            name: p.name,
            status: p.status,
            total_stock: totalStock,
            base_price: basePrice,
            image_url: imageUrl
          };
        });
        setProducts(formatted);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [profile, supabase]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div>
      <PageHeader 
        title="Seus Produtos" 
        description="Gerencie o catálogo de produtos disponíveis no seu checkout."
        action={
          <Link href="/home/produtos/registrar" style={{
            padding: '8px 16px', backgroundColor: 'var(--md-primary)', color: '#fff',
            border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '14px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
            Novo Produto
          </Link>
        }
      />

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--md-text-secondary)' }}>Carregando produtos...</div>
      ) : (
        <DataTable 
          data={products}
          keyExtractor={(item) => item.id}
          columns={[
            { header: 'Produto', accessor: (item) => (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--md-surface)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {item.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span className="material-symbols-outlined" style={{ color: 'var(--md-text-secondary)', fontSize: '20px' }}>image</span>
                  )}
                </div>
                <span style={{ fontWeight: 600 }}>{item.name}</span>
              </div>
            ) },
            { header: 'Preço', accessor: (item) => <span style={{ fontWeight: 500 }}>{formatCurrency(item.base_price)}</span> },
            { header: 'Estoque', accessor: (item) => item.total_stock },
            { header: 'Status', accessor: (item) => {
              let bg = 'var(--md-surface)';
              let color = 'var(--md-text-secondary)';
              let displayStatus = 'Desconhecido';
              
              if (item.status === 'active') { bg = 'var(--green-light)'; color = 'var(--green)'; displayStatus = 'Ativo'; }
              if (item.status === 'draft') { bg = 'var(--yellow-light)'; color = 'var(--yellow)'; displayStatus = 'Rascunho'; }
              if (item.status === 'inactive') { bg = 'var(--red-light)'; color = 'var(--red)'; displayStatus = 'Inativo'; }
              
              if (item.total_stock === 0 && item.status === 'active') {
                bg = 'var(--red-light)'; color = 'var(--red)'; displayStatus = 'Esgotado';
              }

              return (
                <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, backgroundColor: bg, color: color }}>
                  {displayStatus}
                </span>
              );
            } }
          ]}
        />
      )}
    </div>
  );
}
