import Header from './components/Header';
import Footer from './components/Footer';
import './globals.css';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <h1>Welocome to VoucherVault</h1>
      </main>
      <Footer />
    </div>
  );
}
