import Navbar from "./components/Navbar";
import Header from "./components/Header";
import TableMenu from "./components/TableMenu";
import Table from "./components/Table";
import Footer from "./components/Footer";

function App() {
  return (
    <main className="min-h-screen flex flex-col text-base-content">
      <Navbar />
      <Header />
      <div className="px-4 max-w-5xl mx-auto flex-1">
        <TableMenu />
        <Table />
      </div>
      <Footer />
    </main>
  );
}

export default App;
