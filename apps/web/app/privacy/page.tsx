import AppLayout from "../../components/layout/AppLayout";

export default function PrivacyPage() {
    return (
        <AppLayout>
            <div className="max-w-3xl mx-auto py-24 px-6">
                <h1 className="text-4xl font-bold mb-12 tracking-tight">Privacy Policy</h1>
                
                <div className="space-y-12 text-gray-400 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">1. Introduction</h2>
                        <p>We respect your privacy. This policy explains how we handle your data.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">2. Data We Collect</h2>
                        <p>We collect basic contact information (email, name) when you join the beta or waitlist. We also track metadata related to network performance.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">3. How We Use Data</h2>
                        <p>To provide and improve the service, and to communicate with you about your account.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">4. Legal Basis</h2>
                        <p>We process data based on your consent and for the performance of our contract with you.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">5. Data Retention</h2>
                        <p>We keep your data for as long as your account is active or as needed to provide services.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">6. Your Rights</h2>
                        <p>You have the right to access, correct, or delete your personal data at any time.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">7. Third-Party Services</h2>
                        <p>We use trusted third-party providers (like Stripe) for payments and infrastructure.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">8. Contact</h2>
                        <p>For privacy concerns, contact stephen@wnode.one</p>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
