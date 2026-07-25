'use client';

import React, { useState } from 'react';
import { PageHeader } from '../../../../components/ui/PageHeader';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useHomeData } from '../../../../components/home/HomeContext';
import { useRouter } from 'next/navigation';

export default function RegistrarProdutoPage() {
  const { profile } = useHomeData();
  const router = useRouter();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Basic Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active');
  const [price, setPrice] = useState('');
  const [comparePrice, setComparePrice] = useState('');
  const [stock, setStock] = useState('0');
  
  // Image Upload
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Variations (Optional: For MVP, keeping it simple as a single standard variant if none provided)
  // In a real app we would map this to multiple rows in product_variants.
  
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setImageUrl(''); // Clear URL if file is selected
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const workspaceId = profile?.workspaces?.[0]?.id;
      if (!workspaceId) throw new Error("Workspace não encontrado");
      if (!name || !price) throw new Error("Nome e preço são obrigatórios");

      let finalImageUrl = imageUrl;

      // 1. Upload Image to Supabase Storage if File exists
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${workspaceId}/${Math.random()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, imageFile);
          
        if (uploadError) throw new Error("Erro no upload da imagem: " + uploadError.message);
        
        const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(uploadData.path);
        finalImageUrl = publicUrl;
      }

      // 2. Insert Product
      const { data: product, error: productError } = await supabase.from('products')
        .insert({
          workspace_id: workspaceId,
          name,
          description,
          status,
        })
        .select('id')
        .single();
        
      if (productError) throw productError;

      // 3. Insert Default Variant
      const { error: variantError } = await supabase.from('product_variants')
        .insert({
          product_id: product.id,
          name: 'Padrão',
          price: parseFloat(price),
          compare_price: comparePrice ? parseFloat(comparePrice) : null,
          stock: parseInt(stock, 10),
          image_url: finalImageUrl
        });

      if (variantError) throw variantError;

      // Success
      alert('Produto cadastrado com sucesso!');
      router.push('/home/produtos/todos');
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao salvar produto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/home/produtos/todos" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--md-text-secondary)', textDecoration: 'none', fontWeight: 500, fontSize: '13px', marginBottom: '8px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px', marginRight: '4px' }}>arrow_back</span>
          Voltar para Produtos
        </Link>
        <PageHeader 
          title="Registrar Novo Produto" 
          description="Preencha os detalhes para cadastrar um produto na sua loja." 
        />
      </div>

      {error && (
        <div style={{ padding: '16px', backgroundColor: 'var(--red-light)', color: 'var(--red)', borderRadius: '8px', marginBottom: '24px', fontWeight: 600 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Detalhes Básicos */}
          <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>Detalhes Básicos</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--md-text-secondary)', marginBottom: '8px' }}>Nome do Produto *</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Tênis Max Air" style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)', backgroundColor: 'var(--md-surface)', color: 'var(--text-primary)' }} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--md-text-secondary)', marginBottom: '8px' }}>Descrição</label>
                <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} placeholder="Descreva os detalhes do produto..." style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)', backgroundColor: 'var(--md-surface)', color: 'var(--text-primary)', resize: 'vertical' }} />
              </div>
            </div>
          </div>

          {/* Precificação e Estoque */}
          <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>Precificação e Estoque (Variante Padrão)</h3>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--md-text-secondary)', marginBottom: '8px' }}>Preço de Venda *</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--md-text-secondary)' }}>R$</span>
                  <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)', backgroundColor: 'var(--md-surface)', color: 'var(--text-primary)' }} required />
                </div>
              </div>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--md-text-secondary)', marginBottom: '8px' }}>Preço Comparativo</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--md-text-secondary)' }}>R$</span>
                  <input type="number" step="0.01" value={comparePrice} onChange={e => setComparePrice(e.target.value)} placeholder="0.00" style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)', backgroundColor: 'var(--md-surface)', color: 'var(--text-primary)' }} />
                </div>
              </div>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--md-text-secondary)', marginBottom: '8px' }}>Estoque Base</label>
                <input type="number" value={stock} onChange={e => setStock(e.target.value)} placeholder="0" style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)', backgroundColor: 'var(--md-surface)', color: 'var(--text-primary)' }} />
              </div>
            </div>
          </div>

        </div>

        {/* Lateral de Imagens */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>Mídia do Produto</h3>
            
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--md-text-secondary)', marginBottom: '8px' }}>Upload de Imagem</label>
            <label style={{ 
              border: '2px dashed var(--md-border)', 
              borderRadius: 'var(--radius-lg)', 
              padding: imagePreview ? '8px' : '40px 20px', 
              textAlign: 'center',
              backgroundColor: 'var(--md-surface)',
              cursor: 'pointer',
              display: 'block',
              marginBottom: '16px'
            }}>
              <input type="file" accept="image/*" onChange={handleImageSelect} style={{ display: 'none' }} />
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px' }} />
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: '40px', color: 'var(--md-text-secondary)', marginBottom: '12px' }}>cloud_upload</span>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>Clique para fazer upload</p>
                  <p style={{ fontSize: '12px', color: 'var(--md-text-secondary)', margin: 0 }}>PNG, JPG ou WEBP (Max 5MB)</p>
                </>
              )}
            </label>

            <div style={{ textAlign: 'center', color: 'var(--md-text-secondary)', fontSize: '12px', marginBottom: '16px' }}>OU</div>
            
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--md-text-secondary)', marginBottom: '8px' }}>URL da Imagem</label>
            <input type="url" value={imageUrl} onChange={e => { setImageUrl(e.target.value); setImagePreview(e.target.value); setImageFile(null); }} placeholder="https://..." style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)', backgroundColor: 'var(--md-surface)', color: 'var(--text-primary)' }} />
          </div>
          
          <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>Status</h3>
            <select value={status} onChange={e => setStatus(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)', backgroundColor: 'var(--md-surface)', color: 'var(--text-primary)' }}>
              <option value="active">Ativo (Publicado)</option>
              <option value="draft">Rascunho</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--card-border)' }}>
        <button onClick={handleSubmit} disabled={loading} style={{
          padding: '12px 24px', backgroundColor: 'var(--md-primary)', color: '#fff',
          border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '14px',
          cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1
        }}>
          {loading ? 'Salvando...' : 'Salvar Produto'}
        </button>
      </div>
    </div>
  );
}
