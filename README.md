
### *Robust Token Management. Real-Time Events. Anonymous Analytics.*

Welcome to **Soulboard Web** — a detailed breakdown of your implementation-focused web platform for comprehensive ad management, seamless token operations, and privacy-preserving user analytics.

---

## 🔄 Implementation Details

## Architecture
<img width="885" alt="Screenshot 2025-04-06 at 6 14 21 AM" src="https://github.com/user-attachments/assets/5a4352c5-8f63-4fe2-bbf9-97d4ac5d2160" />
<img width="723" alt="Screenshot 2025-04-06 at 7 20 55 AM" src="https://github.com/user-attachments/assets/a6a59657-87e8-4858-adcb-27ead8e4a230" />

## UI Screenshots
![WhatsApp Image 2025-04-06 at 06 03 24](https://github.com/user-attachments/assets/39b0f08a-33ae-48e5-8e15-e59aa6c6fe65)
![WhatsApp Image 2025-04-06 at 06 01 55 (1)](https://github.com/user-attachments/assets/34c00a05-3cb6-4e11-bc64-afcf9f290281)


### 🚩 **1. Ad Service Provider (ASP)**

#### 🔑 **Registration & Verification**
- ASP signs in via **Privy Wallet**, establishing a secure session.

#### 📍 **Adding Ad Locations**
- ASP submits new location data (address, display type, IoT details).
- Backend assigns unique identifiers, registers IoT modules, generates cryptographic keys, and securely stores credentials.

#### 📡 **IoT Module Setup & Activation**
- ASP deploys hardware (**ESP32-CAM** and **ESP32+PN532** modules).
- Devices establish secure MQTT connections, initiating transmission of verified Proof-of-View (PoV) and Proof-of-Tap (PoT) metrics.

#### 💰 **Real-time Earnings Dashboard**
- IoT data verified and recorded on-chain via oracle interactions.

#### 💸 **Withdrawal Process**
- ASP initiates withdrawals securely via dashboard.

---

### 🎯 **2. Advertising Company (AC)**

#### 🔑 **Registration & Secure Verification**
- AC securely logs in via **Privy Wallet**, session validated.

#### 💳 **Funding Wallet (USDC → ADC Conversion)**
- AC deposits USDC.

#### 📝 **Ad Campaign Creation**
- AC defines campaign parameters (duration, budget, URLs, selected ASP locations).
- Backend secures ADC tokens in escrow via smart contract integration.
- Scheduled dynamic URL updates are securely pushed to IoT modules via MQTT.

#### 📊 **Real-Time Campaign Monitoring**
- Oracle-verified IoT data continuously recorded on-chain.

#### 📦 **Campaign Settlement & Token Distribution**
- Backend aggregates final analytics using on-chain data.

---

### 🙋 **3. End-User Interaction & Analytics**

#### 📱 **NFC Ad Interaction**
- User taps NFC module, instantly redirected to campaign-specific engagement URL.

#### 🎁 **Reward Claim & Distribution**
- User securely claims rewards.
- Backend verifies reward eligibility and credit user wallets from escrow funds.

#### 📈 **Ongoing Anonymous Engagement Analytics**
- Backend continuously anonymizes and securely records engagement metrics.
- Future reward strategies dynamically personalized, while strictly preserving user privacy.
---

## 🚀 Next Steps & Enhancements

- Advanced integration of ZKP for granular analytics and demographic analysis while preverving user privacy.
- Fully automated payout processes based on live campaign analytics.
- Expansion of IoT capabilities for clustered deployments in high-traffic locations.

---

## 📅 Why Choose AdModule Web?

- **Robust Integration:** Efficient token operations and secure event-driven infrastructure.
- **Immediate Insights:** Real-time IoT events instantly reflected across dashboards.
- **User Privacy First:** Secure demographic analytics without compromising anonymity.
- **Transparent Operations:** Fully auditable blockchain-backed token management.

> **AdModule Web** — Precision-built, integration-rich, privacy-preserving.
