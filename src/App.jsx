import Navbar from "./components/Navbar";
import Header from "./components/Header";
import TableMenu from "./components/TableMenu";
import Table from "./components/Table";

function App() {
  return (
    <main className="min-h-screen text-base-content">
      <Navbar />
      <Header />
      <div className="px-4 max-w-5xl mx-auto">
        <TableMenu />
        <Table />
      </div>
    </main>
  );
}

export default App;
