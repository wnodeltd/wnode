import Footer from "../landing/Footer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-black">
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}
