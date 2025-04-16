import Stripe from 'stripe';
import  {UserSchema}  from '../../models/userSchema.js';
import mongoose from 'mongoose';

const User = mongoose.model('User', UserSchema);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const DOMAIN = process.env.FRONTEND_DOMAIN || 'http://localhost:3000';
const PRICE_IDS = {
  PRO_MONTHLY: process.env.STRIPE_PRICE_ID_PRO_MONTHLY,
  PRO_ANNUAL: process.env.STRIPE_PRICE_ID_PRO_ANNUAL
};

class StripeService {
  async createCheckoutSession(userId, priceId, planFrequency = 'monthly') {
    try {
      // Find the user to get their email
      const user = await User.findOne({ uid: userId });
      if (!user) throw new Error('User not found');

      // Determine the correct Stripe price ID based on frequency
      const selectedPriceId = planFrequency === 'annual' ? PRICE_IDS.PRO_ANNUAL : PRICE_IDS.PRO_MONTHLY;

      // Check if user already has a stripeCustomerId
      let customer = user.stripeCustomerId;
      if (!customer) {
        // Create a new customer in Stripe
        const customerData = await stripe.customers.create({
          email: user.email,
          metadata: { userId: user.uid }
        });
        customer = customerData.id;

        // Save the customer ID to the user
        user.stripeCustomerId = customer;
        await user.save();
      }

      // Create the checkout session
      const session = await stripe.checkout.sessions.create({
        customer,
        payment_method_types: ['card'],
        line_items: [{ price: selectedPriceId, quantity: 1 }],
        mode: 'subscription',
        success_url: `${DOMAIN}/subscription-success??session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${DOMAIN}/subscribe`,
        metadata: { userId: user.uid, planId: 'pro' },
      });

      return { sessionId: session.id, url: session.url };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  async createBillingPortalSession(userId) {
    try {
      const user = await User.findOne({ uid: userId });
      if (!user?.stripeCustomerId) throw new Error('User does not have an active subscription');

      const portalSession = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${DOMAIN}/dashboard`,
      });

      return { url: portalSession.url };
    } catch (error) {
      console.error('Error creating billing portal session:', error);
      throw error;
    }
  }

  async handleSubscriptionUpdated(subscription) {
    try {
      const user = await User.findOne({ stripeCustomerId: subscription.customer });
      console.log("subscription status in webhook:",subscription)
      if (!user) {
        console.error('User not found for customer:', subscription.customer);
        return;
      }

      Object.assign(user, {
        stripeSubscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        role: ['active', 'trialing'].includes(subscription.status) ? 'Subscriber' : 'Guest',
        planId: ['active', 'trialing'].includes(subscription.status) ? 'pro' : 'free'
      });

      await user.save();
      return user;
    } catch (error) {
      console.error('Error handling subscription update:', error);
      throw error;
    }
  }

  async handleSubscriptionDeleted(subscription) {
    try {
      const user = await User.findOne({ stripeCustomerId: subscription.customer });
      if (!user) {
        console.error('User not found for customer:', subscription.customer);
        return;
      }

      Object.assign(user, {
        subscriptionStatus: 'canceled',
        role: 'Guest',
        planId: 'free'
      });

      await user.save();
      return user;
    } catch (error) {
      console.error('Error handling subscription deletion:', error);
      throw error;
    }
  }
}

export default new StripeService();
