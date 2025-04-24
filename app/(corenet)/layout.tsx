import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

const CoreNetLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 mt-16">{children}</main>
      <Footer />
    </div>
  );
};

export default CoreNetLayout;
