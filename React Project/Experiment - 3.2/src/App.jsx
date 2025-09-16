import { useState } from "react";
import SearchBar from "./components/SearchBar";
import AddBookForm from "./components/AddBookForm";
import BookList from "./components/BookList";
import "./App.css";

export default function App() {
  const [books, setBooks] = useState([
    { title: "1984", author: "George Orwell" },
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
    { title: "To Kill a Mockingbird", author: "Harper Lee" },
  ]);

  const [search, setSearch] = useState("");

  const addBook = (title, author) => {
    if (title && author) {
      setBooks([...books, { title, author }]);
    }
  };

  const removeBook = (index) => {
    setBooks(books.filter((_, i) => i !== index));
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h2>Library Management</h2>
      <SearchBar search={search} setSearch={setSearch} />
      <AddBookForm addBook={addBook} />
      <BookList books={filteredBooks} removeBook={removeBook} />
    </div>
  );
}
