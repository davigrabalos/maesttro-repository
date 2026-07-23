'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createStore(formData: FormData) {
  const supabase = await createClient();

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('Não autenticado');
  }

  // Get user's workspace_id
  const { data: workspaceUser, error: wuError } = await supabase
    .from('workspace_users')
    .select('workspace_id')
    .eq('user_id', user.id)
    .single();

  if (wuError || !workspaceUser) {
    throw new Error('Workspace não encontrado');
  }

  const name = formData.get('name') as string;
  const source_id_1 = formData.get('source_id_1') as string;
  const source_id_2 = formData.get('source_id_2') as string;

  if (!name || !source_id_1) {
    throw new Error('Nome e Source ID 1 são obrigatórios');
  }

  const { error } = await supabase.from('stores').insert({
    workspace_id: workspaceUser.workspace_id,
    name,
    source_id_1,
    source_id_2: source_id_2 || null,
  });

  if (error) {
    throw new Error(`Erro ao criar loja: ${error.message}`);
  }

  revalidatePath('/admin');
  return { success: true };
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Não autenticado');

  const fullName = formData.get('full_name') as string;
  const avatarUrl = formData.get('avatar_url') as string;

  if (!fullName) throw new Error('O nome é obrigatório');

  // Update profile
  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      avatar_url: avatarUrl || null,
    })
    .eq('id', user.id);

  if (error) throw new Error('Erro ao atualizar perfil');

  revalidatePath('/admin', 'layout');
  return { success: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
