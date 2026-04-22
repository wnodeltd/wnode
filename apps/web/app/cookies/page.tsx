import AppLayout from "../../components/layout/AppLayout";

export default function CookiesPage() {
    return (
        <AppLayout>
            <div className="max-w-3xl mx-auto py-24 px-6">
                <h1 className="text-4xl font-bold mb-12 tracking-tight">Cookie Policy</h1>
                
                <div className="space-y-12 text-gray-400 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">1. What Are Cookies</h2>
                        <p>Cookies are small text files stored on your device to improve your browsing experience.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">2. Types of Cookies We Use</h2>
                        <p>We use strictly necessary cookies for session management and basic site functionality. We may also use analytical cookies to understand how you use the site.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">3. Managing Cookies</h2>
                        <p>You can control and manage cookies through your browser settings. Note that disabling cookies may affect some features.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">4. Changes to This Policy</h2>
                        <p>We update this policy as needed to reflect changes in our technology or legal requirements.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">5. Contact</h2>
                        <p>Questions about cookies? Contact stephen@wnode.one</p>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
