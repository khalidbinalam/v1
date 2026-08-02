import React from 'react'
import prisma from '../../../lib/prisma'
import AdminPaymentsClient from './AdminPaymentsClient'

export const metadata = {
  title: 'Admin — Payment Verification Queue | Underground BD',
  description: 'Manual bKash & Nagad payment verification, fraud detection, and transaction history.',
}

export default async function AdminPaymentsPage() {
  const dbPayments = await prisma.payment.findMany({
    include: { order: true, buyer: true },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  // Format DB items
  const formattedFromDb = dbPayments.map((p) => ({
    id: p.id,
    orderNumber: p.order ? `ORD-${p.order.orderNumber}` : 'ORD-LOCAL',
    amount: (p.amountCents / 100).toLocaleString('en-BD'),
    method: p.paymentMethod || 'bKash',
    trxId: p.transactionId || 'UNKNOWN',
    senderNumber: p.buyerSenderNumber || '01700000000',
    submittedAt: p.createdAt.toISOString().replace('T', ' ').substring(0, 16),
    status: p.status as string,
    screenshotUrl: p.screenshotMediaId ? `/uploads/${p.screenshotMediaId}` : undefined,
  }))

  // Demo queue entries if DB is empty to showcase the verification & fraud detection workflow
  const demoPayments = [
    {
      id: 'PAY-BD-101',
      orderNumber: 'ORD-8821-BD',
      amount: '32,500',
      method: 'bKash',
      trxId: 'BK928371X',
      senderNumber: '01711223344',
      submittedAt: '2026-08-02 11:20',
      status: 'SUBMITTED',
      riskLevel: 'LOW' as const,
    },
    {
      id: 'PAY-BD-102',
      orderNumber: 'ORD-9932-BD',
      amount: '6,200',
      method: 'Nagad',
      trxId: 'NG847291Z',
      senderNumber: '01899887766',
      submittedAt: '2026-08-02 11:15',
      status: 'SUBMITTED',
      riskLevel: 'LOW' as const,
    },
    {
      id: 'PAY-BD-103',
      orderNumber: 'ORD-1204-BD',
      amount: '18,900',
      method: 'bKash',
      trxId: 'BK928371X', // Duplicate TrxID for fraud demo
      senderNumber: '01911002233',
      submittedAt: '2026-08-02 10:45',
      status: 'SUBMITTED',
      riskLevel: 'HIGH' as const,
    },
  ]

  const initialPayments = formattedFromDb.length > 0 ? formattedFromDb : demoPayments

  return <AdminPaymentsClient initialPayments={initialPayments} />
}
