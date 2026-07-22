import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const orderId = formData.get('orderId') as string;

    if (!file || !orderId) {
      return NextResponse.json({ error: 'File and orderId are required' }, { status: 400 });
    }

    // 1. Upload to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${orderId}-${Date.now()}.${fileExt}`;
    const filePath = fileName; // Inside bucket 'proofs'

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('proofs')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error('Storage error:', uploadError);
      return NextResponse.json({ error: `Storage error: ${uploadError.message}` }, { status: 500 });
    }

    // 2. Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('proofs')
      .getPublicUrl(filePath);
      
    const publicUrl = publicUrlData.publicUrl;

    // 3. Save proof record in database
    const { error: dbError } = await supabase
      .from('pix_proofs')
      .insert({
        order_id: orderId,
        file_url: publicUrl,
      });

    if (dbError) {
      console.error('DB Insert error:', dbError);
      return NextResponse.json({ error: 'Failed to save proof record' }, { status: 500 });
    }

    // 4. Update order status to paid (optional, or 'processing')
    await supabase
      .from('orders')
      .update({ status: 'processing' })
      .eq('id', orderId);

    return NextResponse.json({ success: true, fileUrl: publicUrl });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
