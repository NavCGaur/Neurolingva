import dotenv from 'dotenv';
dotenv.config();
import Stripe from 'stripe';
import  {UserSchema}  from '../../models/userSchema.js';
import mongoose from 'mongoose';

const User = mongoose.model('User', UserSchema);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const DOMAIN = process.env.FRONTEND_DOMAIN ;
console.log(DOMAIN);
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

 // Add this to your stripeService.js
async handlePaymentSucceeded(paymentIntent) {
  try {
    // Find the customer associated with this payment
    const customerId = paymentIntent.customer;
    if (!customerId) {
      console.log('No customer ID found on payment intent');
      return;
    }
    
    const user = await User.findOne({ stripeCustomerId: customerId });
    if (!user) {
      console.error('User not found for customer:', customerId);
      return;
    }
    
    // Check payment metadata or amount to determine if this is a Pro payment
    // You might have different logic based on your setup
    const isPro = paymentIntent.metadata?.planId === 'pro' || 
                 (paymentIntent.amount >= 1000); // Example: $10 or more
    
    if (isPro) {
      user.role = 'Subscriber'; // Update to Pro role
      user.planId = 'pro';
      await user.save();
      console.log(`User ${user._id} upgraded to Subscriber role after payment ${paymentIntent.id}`);
    }
    
    return user;
  } catch (error) {
    console.error('Error handling payment success:', error);
    throw error;
  }
}

async handleCheckoutSessionCompleted(session) {
  try {
  
    
    const customerId = session.customer;
    const user = await User.findOne({ stripeCustomerId: customerId });
    
    if (!user) {
      console.error('User not found for customer:', customerId);
      return;
    }
    
    // Check if this was for a Pro plan
    // You can use metadata or line items to determine this
    const isPro = session.metadata?.planId === 'pro';
    
    if (isPro) {
      user.role = 'Subscriber'; // Update to Pro role specifically
      user.planId = 'pro';
      await user.save();
      console.log(`User ${user._id} upgraded to Pro role after checkout ${session.id}`);
    }
    
    return user;
  } catch (error) {
    console.error('Error handling checkout session completion:', error);
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
