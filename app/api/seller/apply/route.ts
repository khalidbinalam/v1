import { NextResponse } from 'next/server';
import { sellerRepository } from '../../../../lib/repositories/seller.repository';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    const name = formData.get('name')?.toString() || '';
    const email = formData.get('email')?.toString() || '';
    const phone = formData.get('phone')?.toString() || '';
    const nid = formData.get('nid')?.toString() || '';
    const facebook = formData.get('facebook')?.toString() || '';
    const steamProfile = formData.get('steamProfile')?.toString() || '';
    const discord = formData.get('discord')?.toString() || '';
    const experience = formData.get('experience')?.toString() || '';
    const bankDetails = formData.get('bankDetails')?.toString() || '';
    const bkash = formData.get('bkash')?.toString() || '';
    const nagad = formData.get('nagad')?.toString() || '';
    const portfolio = formData.get('portfolio')?.toString() || '';
    const previousSales = formData.get('previousSales')?.toString() || '';

    if (!name || !phone || !nid || !steamProfile) {
      return NextResponse.json({ ok: false, message: 'Missing required seller verification fields (Name, Phone, NID, Steam Profile).' }, { status: 400 });
    }

    const file = formData.get('documents') as File | null;
    let documentsUrl = 'https://picsum.photos/seed/nid_uploaded/800/500';
    if (file && file.name) {
      documentsUrl = `https://picsum.photos/seed/${encodeURIComponent(file.name)}/800/500`;
    }

    const application = sellerRepository.createApplication({
      name,
      email,
      phone,
      nid,
      facebook,
      steamProfile,
      discord,
      experience,
      bankDetails,
      bkash,
      nagad,
      portfolio,
      previousSales,
      documentsUrl,
    });

    return NextResponse.json({
      ok: true,
      message: 'Seller application submitted successfully. Admin review pending within 24 hours.',
      data: application,
    });
  } catch (err: any) {
    console.error('Seller Application Error:', err);
    return NextResponse.json({ ok: false, message: 'Failed to process seller application' }, { status: 500 });
  }
}
