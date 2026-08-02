import { NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'
import { hash } from '@node-rs/argon2'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, phone, password, accountType } = body
    if (!email || !password || !name) return NextResponse.json({ ok: false, message: 'Missing fields' }, { status: 400 })

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ ok: false, message: 'Email already registered' }, { status: 409 })

    const passwordHash = await hash(password)
    const role = accountType === 'seller' ? 'SELLER_APPLICANT' : 'USER'

    const user = await prisma.user.create({ data: { name, email, phone: phone || null, passwordHash, role } })

    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } })
  } catch (err: any) {
    console.error('signup error', err)
    return NextResponse.json({ ok: false, message: err.message || 'Error' }, { status: 500 })
  }
}
