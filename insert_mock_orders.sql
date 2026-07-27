-- ==========================================
-- SCRIPT: GERAR PEDIDOS MOCKADOS (TESTES)
-- Execute-o no SQL Editor do Supabase.
-- Ele pegará o primeiro workspace (sua conta) e a primeira loja 
-- e injetará 15 pedidos simulados.
-- ==========================================

DO $$
DECLARE
  v_workspace_id uuid;
  v_store_id uuid;
  v_order_id uuid;
  i int;
  rand_status text;
  rand_method text;
  rand_amount numeric;
BEGIN
  -- 1. Obter o primeiro workspace disponível
  SELECT id INTO v_workspace_id FROM public.workspaces LIMIT 1;
  
  -- Se não existir workspace, aborta
  IF v_workspace_id IS NULL THEN
    RAISE EXCEPTION 'Nenhum workspace encontrado. Crie uma conta/loja primeiro.';
  END IF;

  -- 2. Obter ou criar uma loja padrão para este workspace
  SELECT id INTO v_store_id FROM public.stores WHERE workspace_id = v_workspace_id LIMIT 1;
  
  IF v_store_id IS NULL THEN
    INSERT INTO public.stores (workspace_id, name, source_id_1, active)
    VALUES (v_workspace_id, 'Loja Mockada', 'mock-store-1', true)
    RETURNING id INTO v_store_id;
  END IF;

  -- 3. Inserir 15 pedidos aleatórios
  FOR i IN 1..15 LOOP
    
    -- Valores aleatórios
    rand_status := (ARRAY['pending', 'paid', 'paid', 'paid', 'failed', 'processing'])[floor(random() * 6) + 1];
    rand_method := (ARRAY['pix', 'credit_card', 'pix'])[floor(random() * 3) + 1];
    rand_amount := floor(random() * (500 - 50 + 1) + 50) + (floor(random() * 99) / 100.0);

    -- Inserir Pedido
    INSERT INTO public.orders (workspace_id, store_id, customer_email, customer_phone, amount, status, payment_method)
    VALUES (
      v_workspace_id,
      v_store_id,
      'cliente.mockado' || i || '@gmail.com',
      '11999' || lpad((floor(random() * 99999))::text, 5, '0'),
      rand_amount,
      rand_status,
      rand_method
    ) RETURNING id INTO v_order_id;

    -- Inserir Itens do Pedido (1 ou 2 itens genéricos)
    INSERT INTO public.order_items (order_id, quantity, unit_price, total_price, product_name)
    VALUES (
      v_order_id,
      1,
      rand_amount,
      rand_amount,
      'Produto Teste ' || (floor(random() * 100))::text
    );

    -- Se pago via pix, chance de ter comprovante mockado
    IF rand_status = 'paid' AND rand_method = 'pix' AND random() > 0.5 THEN
      INSERT INTO public.pix_proofs (order_id, file_url)
      VALUES (v_order_id, 'https://mock.url/comprovante.png');
    END IF;

  END LOOP;
  
  RAISE NOTICE '15 pedidos mockados inseridos com sucesso!';
END $$;
