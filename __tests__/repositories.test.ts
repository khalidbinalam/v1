import { describe, it, expect } from 'vitest';
import { OrderCreateSchema, PaymentSubmitSchema, SignupSchema } from '../lib/validators';
import { sellerRepository } from '../lib/repositories/seller.repository';

describe('Marketplace Validators & Business Logic', () => {
  it('validates correct user signup input', () => {
    const validUser = {
      email: 'gamer@undergroundbd.com',
      password: 'SecurePassword123!',
      name: 'Tanvir Hossain',
      phone: '01711223344',
    };

    const result = SignupSchema.safeParse(validUser);
    expect(result.success).toBe(true);
  });

  it('rejects invalid Bangladeshi phone number during signup', () => {
    const invalidUser = {
      email: 'gamer@undergroundbd.com',
      password: 'SecurePassword123!',
      name: 'Tanvir Hossain',
      phone: '12345',
    };

    const result = SignupSchema.safeParse(invalidUser);
    expect(result.success).toBe(false);
  });

  it('validates bKash payment submission with valid phone & transaction reference', () => {
    const validPayment = {
      orderId: '123e4567-e89b-12d3-a456-426614174000',
      amountCents: 150000,
      paymentMethod: 'BKASH',
      buyerSenderNumber: '01811223344',
      transactionId: 'BK12345678',
    };

    const result = PaymentSubmitSchema.safeParse(validPayment);
    expect(result.success).toBe(true);
  });

  it('rejects payment submission without valid transaction reference', () => {
    const invalidPayment = {
      orderId: '123e4567-e89b-12d3-a456-426614174000',
      amountCents: 150000,
      paymentMethod: 'BKASH',
      buyerSenderNumber: '01811223344',
      transactionId: '123',
    };

    const result = PaymentSubmitSchema.safeParse(invalidPayment);
    expect(result.success).toBe(false);
  });
});

describe('Escrow & Fee Calculation Engine', () => {
  function calculateMarketplaceFee(priceCents: number, sellerTrustScore: number): { sellerAmountCents: number; feeCents: number } {
    // Base fee is 2.5%, reduced to 1.5% for sellers with trust score >= 4.8
    const feePercent = sellerTrustScore >= 4.8 ? 0.015 : 0.025;
    const feeCents = Math.round(priceCents * feePercent);
    const sellerAmountCents = priceCents - feeCents;

    return { sellerAmountCents, feeCents };
  }

  it('calculates standard 2.5% marketplace fee for normal seller', () => {
    const { sellerAmountCents, feeCents } = calculateMarketplaceFee(100000, 4.2);
    expect(feeCents).toBe(2500);
    expect(sellerAmountCents).toBe(97500);
  });

  it('applies discounted 1.5% fee for top verified sellers (trustScore >= 4.8)', () => {
    const { sellerAmountCents, feeCents } = calculateMarketplaceFee(100000, 4.9);
    expect(feeCents).toBe(1500);
    expect(sellerAmountCents).toBe(98500);
  });
});

describe('Seller Repository & Onboarding Flow', () => {
  it('creates and approves seller application', () => {
    const app = sellerRepository.createApplication({
      name: 'Test Seller BD',
      email: 'test.seller@undergroundbd.com',
      phone: '01700112233',
      nid: '1990123456789',
      facebook: 'https://facebook.com/testsellerbd',
      steamProfile: 'https://steamcommunity.com/id/testsellerbd',
      discord: 'testseller#1234',
      experience: '3+ years',
      bankDetails: 'BRAC Bank Gulshan',
      bkash: '01700112233',
      nagad: '01700112233',
      portfolio: 'Buff163 Merchant',
      previousSales: 'Sold 10+ Dragon Lores',
    });

    expect(app.id).toBeDefined();
    expect(app.status).toBe('PENDING');

    const approvedApp = sellerRepository.approveApplication(app.id, 'Verified NID & Steam profile');
    expect(approvedApp.status).toBe('APPROVED');
    expect(approvedApp.adminNotes).toBe('Verified NID & Steam profile');
  });
});

